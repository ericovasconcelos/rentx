import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { BorderlessButtonProps } from 'react-native-gesture-handler';

import {
    Container
} from './styles';
import { RFValue } from 'react-native-responsive-fontsize';

interface Props extends BorderlessButtonProps {
    color?: string;
}

export function BackButton({color, ...rest}: Props) {
    const theme = useTheme();
    return (
        <Container {...rest}>
            <MaterialIcons
                name="chevron-left" 
                size={RFValue(24)}
                color={color? color : theme.colors.text}
            />
        </Container>
    );
}