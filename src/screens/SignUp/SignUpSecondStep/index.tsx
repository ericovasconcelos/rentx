import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { useTheme } from 'styled-components';
import { PasswordInput } from '../../../components/PasswordInput/input';
import {
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import {
    Container,
    Header,
    Steps,
    Title,
    SubTitle,
    Form,
    FormTitle,
} from './styles';
import { api } from '../../../services/api';


interface Params {
    user: {
        name: string;
        email: string;
        driversLicense: string;
    };
}

export function SignUpSecondStep() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation<any>();
    const route = useRoute();
    const theme = useTheme();

    const { user } = route.params as Params;

    function handleBack() {
        navigation.goBack();
    }

    async function handleConfirmation() {
        if (!password || !confirmPassword) {
            Alert.alert('Opa', 'Preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Opa', 'As senhas não conferem');
            return;
        }

        await api.post(
            'users',
            {
                name: user.name,
                email: user.email,
                driver_license: user.driversLicense,
                password
            }
        ).then(() => {
            navigation.navigate('Confirmation', {
                nextScreenRoute: 'SignIn',
                title: 'Conta criada!',
                message: `Agora é só fazer login\ne aproveitar.`,
            });
        }).catch(() => {
            Alert.alert('Opa', 'Algo deu errado, tente novamente');
        });  
    }

    return (
            <KeyboardAvoidingView behavior='position' enabled>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Container>
                        <Header>
                            <BackButton onPress={handleBack} />
                            <Steps>
                                <Bullet active />
                                <Bullet />
                            </Steps>
                        </Header>

                        <Title>
                            Crie sua{'\n'}conta
                        </Title>
                        <SubTitle>
                            Faça seu cadastro{'\n'}de forma rápida e fácil
                        </SubTitle>

                        <Form>
                            <FormTitle>2. Senha</FormTitle>
                            <PasswordInput
                                placeholder="Senha"
                                iconName="lock"
                                onChangeText={setPassword}
                                value={password}
                            />
                            <PasswordInput
                                placeholder="Confirmar senha"
                                iconName='lock'
                                onChangeText={setConfirmPassword}
                                value={confirmPassword}
                            />
                            <Button
                                title="Cadastrar"
                                color={theme.colors.success}
                                onPress={handleConfirmation}
                            />
                        </Form>
                    </Container>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }