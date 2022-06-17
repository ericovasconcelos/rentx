import React, {
    useContext,
    createContext,
    useState,
    ReactNode,
    useEffect
} from "react";

import { api } from '../services/api';
import { database } from '../database';
import { User as ModelUser } from '../database/model/User';

interface User {
    id: string;
    user_id: string;
    email: string;
    name: string;
    driver_license: string;
    avatar: string;
    token: string;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextData {
    user: User;
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    loading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const [data, setData] = useState<User>({} as User);
    const [loading, setLoading] = useState(true);

    async function signOut() {
        try {
            const userCollection = database.get<ModelUser>('users');
            await database.write(async () => {
                const userSelected = await userCollection.find(data.id);
                await userSelected.destroyPermanently();
            })

            setData({} as User);
        } catch (err) {
            console.log(err)
            throw new Error(err);
        }
    }

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('/sessions', {
                email,
                password
            });
            const { token, user } = response.data;

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const userCollection = database.get<ModelUser>('users');
            await database.write(async () => {
                const dataUser = await userCollection.create((newUser) => {
                    newUser.user_id = user.id,
                        newUser.name = user.name,
                        newUser.email = user.email,
                        newUser.driver_license = user.driver_license,
                        newUser.avatar = user.avatar,
                        newUser.token = token
                });

                const userData = dataUser._raw as unknown as User;
                setData(userData);
            })

        } catch (error) {
            console.log(error.message);
        }
    }

    async function updateUser(user: User) {
        try {
            const userCollection = database.get<ModelUser>('users');
            await database.write(async () => {
                const userSelected = await userCollection.find(data.id);
                await userSelected.update(() => {
                    userSelected.name = user.name;
                    userSelected.driver_license = user.driver_license;
                    userSelected.avatar = user.avatar;
                });
                
                setData(user);
            });
        } catch (error) {
            throw new Error(error);
        }
    }


    useEffect(() => {
        async function loadUserData() {
            const userCollection = database.get('users');
            const response = await userCollection.query().fetch();

            if (response.length > 0) {
                const userData = response[0]._raw as unknown as User;
                api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
                setData(userData);
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    return (
        <AuthContext.Provider value={{
            user: data,
            signIn,
            signOut,
            updateUser,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export { useAuth, AuthProvider };