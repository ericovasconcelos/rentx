import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { FlatList, FlatListProps } from 'react-native';
import { CarDTO } from '../../dtos/CarDTO';

interface CarProps {
    car: CarDTO;
    user_id: string;
    id: string;
}

export const Container = styled.View`
    flex: 1;
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(325)}px;

    background-color: ${({ theme }) => theme.colors.header};

    justify-content: center;
    padding: ${RFValue(25)}px;
    padding-top: ${getStatusBarHeight() + 30}px;
`;

export const Title = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-family: ${({ theme }) => theme.fonts.secondary_600};
    font-size: ${RFValue(34)}px;

    margin-top: ${RFValue(24)}px;
`;

export const SubTitle = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-family: ${({ theme }) => theme.fonts.secondary_400};
    font-size: ${RFValue(15)}px;

    margin-top: ${RFValue(24)}px;
`;

export const Content = styled.View`
    width: 100%;
    flex: 1;

    padding: 0 ${RFValue(16)}px;
`;

export const Appointments = styled.View`
    width: 100%;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: ${RFValue(24)}px 0;
`;

export const AppointmentTitle = styled.Text`
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.secondary_400};
    font-size: ${RFValue(15)}px;
`;

export const AppointmentQuantity = styled.Text`
    color: ${({ theme }) => theme.colors.title};
    font-family: ${({ theme }) => theme.fonts.secondary_500};
    font-size: ${RFValue(15)}px;
`;

export const CarList = styled.View`
    flex: 1;
`;

export const CarWrapper = styled.View` 
    margin-bottom: ${RFValue(10)}px;
`;

export const CarFooter = styled.View`
    width: 100%;

    background-color: ${({ theme }) => theme.colors.background_secondary};

    padding: ${RFValue(12)}px;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin-top: ${RFValue(-10)}px;
    border-radius: ${RFValue(8)}px;
`;

export const CarFooterTitle = styled.Text`
    color: ${({ theme }) => theme.colors.text_detail};
    font-family: ${({ theme }) => theme.fonts.secondary_500};
    font-size: ${RFValue(10)}px;
`;

export const CarFooterDates = styled.Text`
    flex-direction: row;
    align-items: center;
`;

export const CarFooterDate = styled.Text`
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.primary_400};
    font-size: ${RFValue(13)}px;
`;

