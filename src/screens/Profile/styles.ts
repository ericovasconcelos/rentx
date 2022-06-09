import styled from 'styled-components/native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background_primary};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(227)}px;
    background-color: ${({ theme }) => theme.colors.header};
    
    padding: 0 ${RFValue(24)}px;
    align-items: center;
`;

export const HeaderTop = styled.View`
   width: 100%;
   flex-direction: row;
   justify-content: space-between;
   align-items: center;

   margin-top: ${getStatusBarHeight() + RFValue(32)}px;
`;

export const HeaderTitle = styled.Text`
    font-size: ${RFValue(25)}px;
    font-family: ${({ theme }) => theme.fonts.secondary_600};
    color: ${({ theme }) => theme.colors.background_secondary};
    
`;

export const LogoutButton = styled(BorderlessButton)`
  
`;

export const PhotoContainer = styled.View`
    width: ${RFValue(180)}px;
    height: ${RFValue(180)}px;
    border-radius: ${RFValue(90)}px;

    margin-top: ${RFValue(48)}px;
    background-color: ${({ theme }) => theme.colors.shape};
`;

export const Photo = styled.Image`
    width: ${RFValue(180)}px;
    height: ${RFValue(180)}px;
    border-radius: ${RFValue(90)}px;
`;

export const PhotoButton = styled(RectButton)`
    width: ${RFValue(40)}px;
    height: ${RFValue(40)}px;
    background-color: ${({ theme }) => theme.colors.main};

    align-items: center;
    justify-content: center;

    position: absolute;
    bottom: ${RFValue(10)}px;
    right: ${RFValue(10)}px;

`;
