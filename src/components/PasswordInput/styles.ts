import { TextInput } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

interface Props {
    isFocus: boolean;
}


export const Container = styled.View`
    flex-direction: row;
    height: ${RFValue(34)}px;
    margin-bottom: ${RFValue(10)}px;
`;

export const InputText = styled(TextInput)<Props>`
    flex: 1;

    background-color: ${({ theme }) => theme.colors.background_secondary};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${RFValue(10)}px;
    font-family: ${({ theme }) => theme.fonts.primary_400};
    padding: 0 24px;
    height: 56px;

    ${({ isFocus, theme }) => isFocus && css`
        border-bottom-width: 2px;
        border-bottom-color: ${theme.colors.main};
    `}

`;

export const IconContainer = styled.View<Props>`
    height: 56px;
    width: 55px;
    justify-content: center;
    align-items: center;

    margin-right: 2px;
    background-color: ${({ theme }) => theme.colors.background_secondary};

    ${({ isFocus, theme }) => isFocus && css`
        border-bottom-width: 2px;
        border-bottom-color: ${theme.colors.main};
    `}

`;
