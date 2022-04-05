import React, { useEffect, useState } from 'react';
import { BackHandler, StatusBar, useWindowDimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import Logo from '../../assets/logo.svg';
import { api } from '../../services/api';
import { CarDTO } from '../../dtos/CarDTO';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components';


import {
    Container,
    Header,
    TotalCars,
    HeaderContent,
    CarList,
    MyCarsButton
} from './styles';

import { Car } from '../../components/Car';
import { useNavigation } from '@react-navigation/native';
import { Load } from '../../components/Load';
import { LoadAnimation } from '../../components/LoadAnimation';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

export function Home() {
    const [cars, setCars] = useState<CarDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const finalPositionY = (useWindowDimensions().width - 82);

    const positionX = useSharedValue(0);
    const positionY = useSharedValue(0);

    const animatedViewStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: positionX.value },
                { translateY: positionY.value }
            ]
        };
    });

    const onGestureEvent = useAnimatedGestureHandler({
        onStart(_, ctx: any) {
            ctx.positionX = positionX.value;
            ctx.positionY = positionY.value;
        },
        onActive(event, ctx: any) {
            positionX.value = ctx.positionX + event.translationX;
            positionY.value = ctx.positionY + event.translationY;
        },
        onEnd() {
            positionX.value = withSpring(0);
        }
    });

    useEffect(() => {
        async function loadCars() {
            try {
                const response = await api.get('/cars');
                setCars(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadCars();
    }, []);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });
    }, []);

    function handleCarDetails(car: CarDTO) {
        navigation.navigate('CarDetails', { car });
    }

    function handleOpenMyCars() {
        navigation.navigate('MyCars');
    }

    return (
        <Container>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <Header>
                <HeaderContent>
                    <Logo
                        width={RFValue(108)}
                        height={RFValue(12)}
                    />
                    {!loading && <TotalCars>Total de {cars.length} carros</TotalCars>}
                </HeaderContent>
            </Header>
            {loading ? <LoadAnimation /> :
                <CarList
                    data={cars}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => <Car data={item} onPress={() => handleCarDetails(item)} />}
                />
            }

            <PanGestureHandler onGestureEvent={onGestureEvent}>
                <Animated.View style={[animatedViewStyle, {
                    position: 'absolute',
                    bottom: 13,
                    right: 22,
                }]}>
                    <MyCarsButton onPress={handleOpenMyCars}>
                        <Ionicons
                            name="ios-car-sport"
                            size={RFValue(32)}
                            color={theme.colors.shape} />
                    </MyCarsButton>
                </Animated.View>
            </PanGestureHandler>
        </Container>
    );
}