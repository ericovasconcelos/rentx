import React from 'react';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';

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
    Footer
} from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcons } from '../../utils/getAccessoryIcons';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

interface Params {
    car: CarDTO;
}

export function CarDetails() {
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
    })


    const navigation = useNavigation<any>();
    const route = useRoute();
    const { car } = route.params as Params;

    const handleConfirmation = () => {
        navigation.navigate('Scheduling', { car });
    }

    const handleBack = () => {
        navigation.goBack();
    }

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
                            imagesUrl={car.photos}
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
                        <Price>R$ {car.price}</Price>
                    </Rent>
                </Details>

                <Accessories>
                    {car.accessories.map(accessory =>
                        <Accessory key={accessory.type} name={accessory.name} icon={getAccessoryIcons(accessory.type)} />
                    )}

                </Accessories>

                <About>{car.about}{car.about}{car.about}{car.about}</About>
            </Animated.ScrollView>

            <Footer>
                <Button title="Escolher período do aluguel" onPress={handleConfirmation} />
            </Footer>

        </Container >
    );
}
