import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FlatList, StatusBar } from 'react-native';
import { BackButton } from '../../components/BackButton';
import { useTheme } from 'styled-components';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Car } from '../../components/Car';
import { format, parseISO } from 'date-fns';
import { AntDesign } from '@expo/vector-icons';
import { LoadAnimation } from '../../components/LoadAnimation';
import { Car as ModelCar} from '../../database/model/Car';

import {
    Container,
    Header,
    Title,
    SubTitle,
    Content,
    Appointments,
    AppointmentTitle,
    AppointmentQuantity,
    CarList,
    CarWrapper,
    CarFooter,
    CarFooterTitle,
    CarFooterDate,
    CarFooterDates,
} from './styles';

interface DataProps {
    id: string;
    car: ModelCar;
    start_date: string;
    end_date: string;
}

export function MyCars() {
    const [cars, setCars] = useState<DataProps[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const screenIsFocus = useIsFocused();

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get('rentals');
                const formattedData = response.data.map((car: DataProps) => ({
                    id: car.id,
                    car: car.car,
                    start_date: format(parseISO(car.start_date), 'dd/MM/yyyy'),
                    end_date: format(parseISO(car.end_date), 'dd/MM/yyyy')
                }));
                setCars(formattedData);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [screenIsFocus]);

    const handleBack = () => {
        navigation.goBack();
    }


    return (
        <Container>
            <Header>
                <StatusBar
                    barStyle='light-content'
                    translucent
                    backgroundColor="transparent"
                />
                <BackButton
                    color={theme.colors.shape}
                    onPress={handleBack}
                />

                <Title>
                    Escolha uma {'\n'}
                    data de início e {'\n'}
                    fim do aluguel
                </Title>

                <SubTitle>
                    Conforto, segurança e praticidade.
                </SubTitle>
            </Header>

            <Content>
                {loading ? <LoadAnimation /> : <>
                    <Appointments>
                        <AppointmentTitle>Agendamentos feitos</AppointmentTitle>
                        <AppointmentQuantity>{cars.length}</AppointmentQuantity>
                    </Appointments>

                    <CarList>
                        <FlatList
                            data={cars}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <CarWrapper>
                                    <Car data={item.car} />
                                    <CarFooter>
                                        <CarFooterTitle>Período</CarFooterTitle>
                                        <CarFooterDates>
                                            <CarFooterDate>{item.start_date}</CarFooterDate>
                                            <AntDesign
                                                name="arrowright"
                                                size={20}
                                                color={theme.colors.title}
                                                style={{ marginHorizontal: 30 }}
                                            />
                                            <CarFooterDate>{item.end_date}</CarFooterDate>
                                        </CarFooterDates>
                                    </CarFooter>
                                </CarWrapper>
                            )}
                        />
                    </CarList>
                </>
                }
            </Content>
        </Container>
    );
}