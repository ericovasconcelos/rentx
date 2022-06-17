import React, { useState } from 'react';

import {
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import { BackButton } from '../../components/BackButton';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/core';
import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../hooks/auth';

import {
    Container,
    Header,
    HeaderTop,
    HeaderTitle,
    LogoutButton,
    PhotoContainer,
    Photo,
    PhotoButton,
    Content,
    Options,
    Option,
    OptionTitle,
    Section,

} from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { Input } from '../../components/Input/input';
import { PasswordInput } from '../../components/PasswordInput/input';
import { Button } from '../../components/Button';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { useNetInfo } from '@react-native-community/netinfo';


export function Profile() {
    const netInfo = useNetInfo(null);
    const { user, signOut, updateUser } = useAuth();

    const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
    const [avatar, setAvatar] = useState(user.avatar);
    const [name, setName] = useState(user.name);
    const [driversLicense, setDriversLicense] = useState(user.driver_license);

    const theme = useTheme();
    const navigation = useNavigation<any>();

    function handleBack() {
        navigation.goBack();
    }

    async function handleAvatarSelect() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (result.cancelled) {
            return;
        }

        if (!result.cancelled) {
            setAvatar(result.uri);
        }

    }

    async function handleSaveUser() {
        try {

            const schema = Yup.object().shape({
                driversLicense: Yup.string().required('Obrigatório'),
                name: Yup.string().required('Obrigatório'),
            });

            const data = { name, driversLicense };
            await schema.validate(data);
            await updateUser({
                ...user,
                name,
                driver_license: driversLicense,
                avatar,
            });
            Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
        } catch (error) {
            if(error instanceof Yup.ValidationError) {
                Alert.alert('Opa', error.message);
            }
            Alert.alert('Não foi possível atualizar os dados');
        }
    }

    function handleSignOut() {
        Alert.alert('Tem certeza?', 'Você necessitará de acesso a internet para se logar novamente.', 
        [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', onPress: signOut },
        ]);
            
    }

    function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit') {
        if(netInfo.isConnected === false && optionSelected === 'passwordEdit') {
            Alert.alert('Offline', 'Você precisa estar conectado à internet para alterar sua senha.');
        } else {
            setOption(optionSelected);
        }
    }

    return (
        <KeyboardAvoidingView behavior='position' enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header>
                        <HeaderTop>
                            <BackButton color={theme.colors.shape} onPress={handleBack} />
                            <HeaderTitle>Editar Perfil</HeaderTitle>
                            <LogoutButton onPress={handleSignOut}>
                                <Feather name="power" color={theme.colors.shape} size={RFValue(24)} />
                            </LogoutButton>
                        </HeaderTop>

                        <PhotoContainer>
                            {!!avatar && <Photo source={{ uri: avatar }} />}
                            <PhotoButton onPress={handleAvatarSelect}>
                                <Feather name="camera" color={theme.colors.shape} size={RFValue(24)} />
                            </PhotoButton>
                        </PhotoContainer>
                    </Header>
                    <Content style={{ marginBottom: useBottomTabBarHeight() }}>
                        <Options>
                            <Option
                                active={option === 'dataEdit'}
                                onPress={() => {handleOptionChange('dataEdit')}}
                            >
                                <OptionTitle active={option === 'dataEdit'}>Dados</OptionTitle>
                            </Option>
                            <Option
                                active={option === 'passwordEdit'}
                                onPress={() => {handleOptionChange('passwordEdit')}}
                            >
                                <OptionTitle active={option === 'passwordEdit'}>Trocar senha</OptionTitle>
                            </Option>
                        </Options>
                        {option === 'dataEdit' ?
                            <Section >
                                <Input
                                    placeholder="Nome"
                                    iconName='user'
                                    autoCorrect={false}
                                    defaultValue={user.name}
                                    onChangeText={setName}
                                />
                                <Input
                                    editable={false}
                                    iconName='mail'
                                    defaultValue={user.email}
                                />
                                <Input
                                    iconName='credit-card'
                                    placeholder="CNH"
                                    keyboardType="numeric"
                                    defaultValue={user.driver_license}
                                    onChangeText={setDriversLicense}
                                />
                                <Button
                                    title="Salvar alterações"
                                    onPress={handleSaveUser}
                                />
                            </Section>
                            :
                            <Section>
                                <PasswordInput
                                    iconName='lock'
                                    placeholder="Senha atual"
                                />
                                <PasswordInput
                                    iconName='lock'
                                    placeholder="Nova senha"
                                />
                                <PasswordInput
                                    iconName='lock'
                                    placeholder="Repetir senha"
                                />
                            </Section>

                        }
                    </Content>
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}