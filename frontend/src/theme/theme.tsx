import { createTheme, ThemeOptions } from '@mui/material/styles';

export const BaseThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
};

export const BaseTheme = createTheme(BaseThemeOptions);