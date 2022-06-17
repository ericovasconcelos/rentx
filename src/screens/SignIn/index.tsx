import React, { useState, useEffect} from 'react';
import {
    StatusBar,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input/input';
import { PasswordInput } from '../../components/PasswordInput/input';
import * as Yup from 'yup';


import {
    Container,
    Header,
    Title,
    SubTitle,
    Form,
    Footer
} from './styles';
import { useAuth } from '../../hooks/auth';

export function SignIn() {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();
    
    const navigation = useNavigation<any>();

    const handleLogin = async () => {
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail obrigatório')
                    .email('Digite um e-mail válido'),
                password: Yup.string()
                    .required('Senha obrigatória')
                    .min(2, 'Senha deve ter no mínimo 6 caracteres')
            });

            await schema.validate({ email, password });
            signIn({email, password});

        } catch (error) {
            if(error instanceof Yup.ValidationError) {
                Alert.alert(error.message);
            } else {
                Alert.alert('Erro ao realizar login');
            }
        }
    }

    const handleNewAccount = () => {
        navigation.navigate('SignUpFirstStep');
    }


    return (
        <KeyboardAvoidingView behavior='position' enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <StatusBar
                        barStyle="dark-content"
                        backgroundColor="transparent"
                        translucent
                    />
                    <Header>
                        <Title>Estamos {`\n`}quase lá.</Title>
                        <SubTitle>
                            Faça seu login para começar{'\n'} uma experiência incrível.
                        </SubTitle>
                    </Header>

                    <Form>
                        <Input
                            iconName='mail'
                            placeholder='E-mail'
                            autoCapitalize='none'
                            autoCorrect={false}
                            keyboardType='email-address'
                            value={email}
                            onChangeText={setEmail}

                        />
                        <PasswordInput
                            iconName="lock"
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                        />
                    </Form>

                    <Footer>
                        <Button
                            title="Login"
                            onPress={handleLogin}
                            enabled={true}
                            loading={false}
                        />
                        <Button
                            title="Criar conta gratuita"
                            onPress={handleNewAccount}
                            enabled={true}
                            loading={false}
                            color={theme.colors.background_secondary}
                            light
                        />
                    </Footer>
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}