import React from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';

import LogoSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg';

import {
    Container,
    Content,
    Title,
    Message,
    Footer
} from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { ConfirmButton } from '../../components/ConfirmButton';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Params {
    nextScreenRoute: string;
    title: string;
    message: string;
}

export function Confirmation() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation<any>();
    const route = useRoute();

    const { nextScreenRoute, title, message } = route.params as Params;

    function handleConfirmation() {
        navigation.navigate(nextScreenRoute);
    }

    return (
        <Container>
            <StatusBar
                barStyle="light-content"
                translucent
                backgroundColor="transparent"
            />
            <LogoSvg width={(width)} />

            <Content>
                <DoneSvg width={80} height={80} />

                <Title>{title}</Title>

                <Message>
                   {message}
                </Message>

                <Footer>
                    <ConfirmButton
                        title="OK"
                        onPress={handleConfirmation}
                    />
                </Footer>
            </Content>
        </Container>
    );
}