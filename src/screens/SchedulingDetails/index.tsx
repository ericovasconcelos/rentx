import React, { useEffect, useState } from 'react';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import {
    Container,
    Header,
    CarImage,
    Content,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    Accessories,
    Footer,
    RentalPeriod,
    CalendarIcon,
    DateInfo,
    DateTitle,
    DateValue,
    RentalPrice,
    RentalPriceLabel,
    RentalPriceDetails,
    RentalPriceQuote,
    RentalPriceTotal,
} from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcons } from '../../utils/getAccessoryIcons';
import { format } from 'date-fns';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { Alert } from 'react-native';
import { api } from '../../services/api';
import { useNetInfo } from '@react-native-community/netinfo';


interface Params {
    car: CarDTO;
    dates: string[];
}

interface RentalPeriod {
    start: string;
    end: string;
}


export function SchedulingDetails() {
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
    const [updatedCar, setUpdatedCar] = useState<CarDTO>({} as CarDTO);
    const [loading, setLoading] = useState(false);

    const netInfo = useNetInfo(null);
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { car, dates } = route.params as Params;



    const rentTotal = Number(dates.length * car.price);

    async function handleConfirmation() {
        setLoading(true);

        await api.post('rentals', {
            user_id: 1,
            car_id: car.id,
            start_date: new Date(dates[0]),
            end_date: new Date(dates[dates.length - 1]),
            total: rentTotal
        }).then(() => {
            navigation.navigate('Confirmation', {
                nextScreenRoute: 'Home',
                title: 'Carro alugado!',
                message: `Agora você só precisa ir\naté a concessionária da RENTX\n pegar o seu automóvel.`
            })
        }).catch((error) => {
            Alert.alert('Não foi possível confirmar o agendamento.');
            setLoading(false);
        });
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        setRentalPeriod({
            start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
            end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
        });
    }, [dates]);

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
            <Header>
                <BackButton onPress={handleBack} />
            </Header>

            <CarImage>
                <ImageSlider
                    imagesUrl={
                        !!updatedCar.photos ?
                            updatedCar.photos :
                            [{ id: car.thumbnail, photo: car.thumbnail }]
                    }
                />
            </CarImage>

            <Content>
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

                {updatedCar.accessories &&
                    <Accessories>
                        {updatedCar.accessories.map(accessory =>
                            <Accessory key={accessory.type} name={accessory.name} icon={getAccessoryIcons(accessory.type)} />
                        )}
                    </Accessories>
                }

                <RentalPeriod>
                    <CalendarIcon>
                        <Feather
                            name="calendar"
                            size={RFValue(24)}
                            color={theme.colors.shape}
                        />
                    </CalendarIcon>

                    <DateInfo>
                        <DateTitle>DE</DateTitle>
                        <DateValue>{rentalPeriod.start}</DateValue>
                    </DateInfo>

                    <Feather
                        name="chevron-right"
                        size={RFValue(10)}
                        color={theme.colors.text}
                    />

                    <DateInfo>
                        <DateTitle>ATÉ</DateTitle>
                        <DateValue>{rentalPeriod.end}</DateValue>
                    </DateInfo>

                </RentalPeriod>

                <RentalPrice>
                    <RentalPriceLabel>TOTAL</RentalPriceLabel>
                    <RentalPriceDetails>
                        <RentalPriceQuote>R$ {car.price} x {dates.length} diárias</RentalPriceQuote>
                        <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
                    </RentalPriceDetails>
                </RentalPrice>
            </Content>

            <Footer>
                <Button
                    title="Alugar agora"
                    color={theme.colors.success}
                    onPress={handleConfirmation}
                    loading={loading}
                    enabled={!loading}
                />
            </Footer>

        </Container>
    );
}