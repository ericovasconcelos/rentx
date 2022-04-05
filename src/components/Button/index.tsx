import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';

import {
    Container,
    Title
} from './styles';

interface Props {
    title: string;
    color?: string;
    onPress: () => void;
    enabled?: boolean;
    loading?: boolean;
}

export function Button({
    title,
    color,
    onPress,
    enabled = true,
    loading = false,
    ...rest
}: Props) {
    const theme = useTheme();
    return (
        <Container {...rest}
            color={color}
            onPress={onPress}
            enabled={enabled}
            style={{ opacity: enabled && !loading ? 1 : 0.5 }}
        >
            {loading ? <ActivityIndicator color={theme.colors.shape} /> : <Title>{title}</Title>}
        </Container>
    );
}