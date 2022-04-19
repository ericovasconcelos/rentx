import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import {
    Container,
    InputText,
    IconContainer
} from './styles';



interface InputProps extends TextInputProps {
    iconName: React.ComponentProps<typeof Feather>['name'];
    value?: string;
}

export function Input({ iconName, value, ...rest }: InputProps) {
    const theme = useTheme();
    const [isFocus, setIsFocus] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    function handleFocusInput() {
        setIsFocus(true);
    }

    function handleBlurInput() {
        setIsFocus(false);
        setIsFilled(!!value);
    }

    return (
        <Container>
            <IconContainer isFocus={isFocus}>
                <Feather
                    name={iconName}
                    size={24}
                    color={(isFocus || isFilled) ? theme.colors.main : theme.colors.text_detail}
                />
            </IconContainer>
            <InputText
                onFocus={handleFocusInput}
                onBlur={handleBlurInput}
                isFocus={isFocus}
                {...rest}
            />
        </Container>
    );
}