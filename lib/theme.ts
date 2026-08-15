import 'styled-components';

export type Theme = {
  colors: {
    bg: string;
    text: string;
    textMuted: string;
    textSecondary: string;
    textBody: string;
    border: string;
    navBg: string;
    buttonOutlineBorder: string;
    buttonFillBg: string;
    buttonFillText: string;
  };
  gradient: string;
  isDark: boolean;
};

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

export const darkTheme: Theme = {
  colors: {
    bg: '#121417',
    text: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.38)',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    textBody: '#ffffff',
    border: 'rgba(255, 255, 255, 0.10)',
    navBg: 'rgba(18, 20, 23, 0.75)',
    buttonOutlineBorder: 'rgba(255, 255, 255, 0.55)',
    buttonFillBg: '#ffffff',
    buttonFillText: '#121417',
  },
  gradient: 'linear-gradient(90deg, #EBE1B0 -86.53%, #AEA8FE 100%)',
  isDark: true,
};

export const lightTheme: Theme = {
  colors: {
    bg: '#f5f4f0',
    text: '#0d0d0d',
    textMuted: 'rgba(0, 0, 0, 0.38)',
    textSecondary: 'rgba(0, 0, 0, 0.65)',
    textBody: 'rgba(0, 0, 0, 0.65)',
    border: 'rgba(0, 0, 0, 0.10)',
    navBg: 'rgba(245, 244, 240, 0.75)',
    buttonOutlineBorder: 'rgba(0, 0, 0, 0.45)',
    buttonFillBg: '#0d0d0d',
    buttonFillText: '#ffffff',
  },
  gradient: 'linear-gradient(90deg, #c9a84c -86.53%, #7b74e0 100%)',
  isDark: false,
};
