import React, { useEffect, useState } from 'react';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAccessoryIcons } from '../../utils/getAccessoryIcons';
import { StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { CarDTO } from '../../dtos/CarDTO';
import { Car as CarModel } from '../../database/model/Car';
import { api } from '../../services/api';
import { useNetInfo } from '@react-native-community/netinfo';

import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';

import {
    Container,
    Header,
    CarImage,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    About,
    Accessories,
    Footer,
    OfflineInfo
} from './styles';


interface Params {
    car: CarModel;
}

export function CarDetails() {
    const [updatedCar, setUpdatedCar] = useState<CarDTO>({} as CarDTO);
    const netInfo = useNetInfo(null);
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { car } = route.params as Params;

    const animationHeight = 250;

    const eixoY = useSharedValue(0);
    const handleScroll = useAnimatedScrollHandler(event => {
        eixoY.value = event.contentOffset.y;
    });

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(eixoY.value, [0, 200], [animationHeight, 75], Extrapolate.CLAMP),
        }
    })

    const carAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(eixoY.value, [0, 100], [1, 0], Extrapolate.CLAMP),
        }
    });

    const handleConfirmation = () => {
        navigation.navigate('Scheduling', { car });
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        async function fetchUpdatedCar() {
            const response = await api.get(`cars/${car.id}`);
            setUpdatedCar(response.data);
        }
        if (netInfo.isConnected === true) {
            fetchUpdatedCar();
        }
    }, [netInfo.isConnected]);


    return (
        <Container>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <Animated.View style={[
                imageAnimatedStyle,
                {
                    height: animationHeight
                }
            ]}>
                <Animated.View style={carAnimatedStyle}>
                    <CarImage>
                        <ImageSlider
                            imagesUrl={
                                !!updatedCar.photos ?
                                    updatedCar.photos :
                                    [{ id: car.thumbnail, photo: car.thumbnail }]
                            }
                        />
                    </CarImage>
                </Animated.View>
                <Header>
                    <BackButton onPress={handleBack} />
                </Header>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: getStatusBarHeight()
                }}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <Details>
                    <Description>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Description>

                    <Rent>
                        <Period>{car.period}</Period>
                        <Price>R$ {netInfo.isConnected ? car.price : '...'}</Price>
                    </Rent>
                </Details>
                {updatedCar.accessories &&
                    <Accessories>
                        {updatedCar.accessories.map(accessory =>
                            <Accessory key={accessory.type} name={accessory.name} icon={getAccessoryIcons(accessory.type)} />
                        )}
                    </Accessories>
                }
                <About>{car.about}{car.about}{car.about}{car.about}</About>
            </Animated.ScrollView>

            <Footer>
                <Button
                    title="Escolher período do aluguel"
                    onPress={handleConfirmation}
                    enabled={netInfo.isConnected === true}
                />
                {
                    netInfo.isConnected === false &&
                    <OfflineInfo>
                        Conecte-se a internet para ver mais detalhes e agendar o aluguel.
                    </OfflineInfo>

                }
            </Footer>

        </Container >
    );
}
