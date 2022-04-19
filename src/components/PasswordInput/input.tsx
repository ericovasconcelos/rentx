import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';
import {
    Container,
    InputText,
    IconContainer
} from './styles';
import { BorderlessButton } from 'react-native-gesture-handler';



interface InputProps extends TextInputProps {
    iconName: React.ComponentProps<typeof Feather>['name'];
    value?: string;
}

export function PasswordInput({ iconName, value, ...rest }: InputProps) {
    const theme = useTheme();
    const [isFocus, setIsFocus] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    function handleFocusInput() {
        setIsFocus(true);
    }

    function handleBlurInput() {
        setIsFocus(false);
        setIsFilled(!!value);
    }
   
    function handleChangePasswordVisibility() {
        setIsPasswordVisible(prevState => !prevState);

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
                secureTextEntry={!isPasswordVisible}
                onFocus={handleFocusInput}
                onBlur={handleBlurInput}
                isFocus={isFocus}
                {...rest}
            />

            <BorderlessButton onPress={handleChangePasswordVisibility}>
                <IconContainer isFocus={isFocus}>
                    <Feather
                        name={isPasswordVisible ? "eye-off": "eye"}
                        size={24}
                        color={theme.colors.text_detail}
                    />
                </IconContainer>
            </BorderlessButton>
        </Container>
    );
}