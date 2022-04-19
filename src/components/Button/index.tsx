import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
    Container,
    Title
} from './styles';

interface Props extends RectButtonProps {
    title: string;
    color?: string;
    loading?: boolean;
    light?: boolean;
}

export function Button({
    title,
    color,
    onPress,
    light = false,
    enabled = true,
    loading = false,
    ...rest
}: Props): JSX.Element {
    const theme = useTheme();
    return (
        <Container {...rest}
            color={color}
            onPress={onPress}
            enabled={enabled}          
            style={{ opacity: enabled && !loading ? 1 : 0.5 }}
        >
            {loading ? <ActivityIndicator color={theme.colors.shape} /> : <Title  light={light}>{title}</Title>}
        </Container>
    );
}