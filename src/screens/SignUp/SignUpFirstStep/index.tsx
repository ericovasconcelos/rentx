import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Input } from '../../../components/Input/input';
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
import { Button } from '../../../components/Button';
import * as Yup from 'yup';

export function SignUpFirstStep() {
    const navigation = useNavigation<any>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [driversLicense, setDriversLicense] = useState('');

    function handleBack() {
        navigation.goBack();
    }

    async function handleConfirmation() {
        try {
            const schema = Yup.object().shape({
                driversLicense: Yup.string().required('CNH obrigatório'),
                email: Yup.string().email('E-mail inválido').required('E-mail obrigatório'),
                name: Yup.string().required('Nome obrigatório'),
            });
            const data = { name, email, driversLicense };
            await schema.validate(data);

            navigation.navigate('SignUpSecondStep', { user: data});
        } catch (error) {
            if(error instanceof Yup.ValidationError) {
                Alert.alert('Opa', error.message);
            }
        }
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
                        <FormTitle>1. Dados</FormTitle>
                        <Input
                            placeholder="Nome"
                            iconName="user"
                            onChangeText={setName}
                            value={name}
                        />
                        <Input
                            placeholder="E-mail"
                            iconName="mail"
                            keyboardType="email-address"
                            onChangeText={setEmail}
                            value={email}
                        />
                        <Input
                            placeholder="CNH"
                            iconName="credit-card"
                            keyboardType="numeric"
                            onChangeText={setDriversLicense}
                            value={driversLicense}
                        />
                        <Button
                            title="Próximo"
                            onPress={handleConfirmation}
                        />
                    </Form>
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}