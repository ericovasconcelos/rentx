import React, { useEffect } from 'react';
import {
    Button,
    StyleSheet,
    Dimensions
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
    interpolate
} from 'react-native-reanimated';

import LogoSvg from '../../assets/logo.svg';
import BrandSvg from '../../assets/brand.svg';

import {
    Container
} from './styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';


export function Splash() {
    const animationValue = useSharedValue(0);

    const navigation = useNavigation<any>();

    const LogoAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(animationValue.value, [0, 50], [0, 1]),
            transform: [
                {
                    translateX: interpolate(animationValue.value, [0, 50], [-50, 0])
                }
            ]
        };
    });

    const BrandAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(animationValue.value, [0, 50], [1, 0]),
            transform: [
                {
                    translateX: interpolate(animationValue.value, [0, 50], [0, -50])
                }
            ]
        };
    });

    function startApp() {
        navigation.navigate('SignIn');
    }


    useEffect(() => {
        animationValue.value = withTiming(
            50,
            { duration: 3000 },
            () => {
                'worklet' 
                runOnJS(startApp)();
            }
        );
    }, []);



    return (
        <Container>
            <Animated.View style={[LogoAnimatedStyle, { position: 'absolute', }]}>
                <LogoSvg width={80} height={50} />
            </Animated.View>

            <Animated.View style={[BrandAnimatedStyle, { position: 'absolute', }]}>
                <BrandSvg width={200} />
            </Animated.View>
        </Container>
    );
}
