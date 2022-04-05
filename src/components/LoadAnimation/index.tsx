import React from 'react';

import LottieView from 'lottie-react-native'
import animationCar from '../../assets/animationCar.json'

import {
    Container
} from './styles';

export function LoadAnimation() {
    return (
        <Container>
            <LottieView 
                source={animationCar}
                autoPlay
                loop
                style={{height: 200}}
                resizeMode="contain"
            />

        </Container>
    );
}