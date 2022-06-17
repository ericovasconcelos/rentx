import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StatusBar, Text } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../../database';

import Logo from '../../assets/logo.svg';
import { api } from '../../services/api';
import { Car as CarModel } from '../../database/model/Car';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';


import {
  Container,
  Header,
  TotalCars,
  HeaderContent,
  CarList
} from './styles';
import { Button } from '../../components/Button';

export function Home() {
  const [cars, setCars] = useState<CarModel[]>([]);
  const [title, setTitle] = useState('Carros');
  const [loading, setLoading] = useState(true);
  const { isConnected } = useNetInfo(null);

  const navigation = useNavigation<any>();

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const { data } = await api.get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);
        const { changes, latestVersion } = data;
        return { changes, timestamp: latestVersion };
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        if (user) {
          await api.post('/users/sync', user);
        }
      },
    });
    await fetchCars();
  }

  useEffect(() => {
    const syncChanges = async () => {
      if (isConnected === true) {
        try {
          await offlineSynchronize();
        }
        catch (err) {
          console.log(err);
        }
      }
    }

    if (isConnected) {
      setTitle('Online');
      syncChanges();
    } else {
      setTitle('Offline');
    }

    
  }, [isConnected]);

  async function fetchCars() {
    try {
      const carCollection = database.get<CarModel>('cars');
      const cars = await carCollection.query().fetch();
      setCars(cars);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    let isMounted = true;
    

    if (isMounted) {
      fetchCars();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  function handleCarDetails(car: CarModel) {
    navigation.navigate('CarDetails', { car });
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
          {!loading && <TotalCars>{title} - Total de {cars.length} carros</TotalCars>}
        </HeaderContent>
      </Header>
      <Button title="Sincroniza" onPress={offlineSynchronize} />
      {loading ? <LoadAnimation /> :
        <CarList
          data={cars}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <Car data={item} onPress={() => { handleCarDetails(item) }} />}
        />
      }
    </Container>
  );
}