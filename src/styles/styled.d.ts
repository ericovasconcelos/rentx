import 'styled-components';
import 'styled-components/native';
import theme from './theme';

declare module 'styled-components' {
    type ThemeType = typeof theme;

    export interface DefaultTheme extends ThemeType {};
}

declare module 'styled-components/native' {
    type ThemeType = typeof theme;

    export interface DefaultTheme extends ThemeType {};
}