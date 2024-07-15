import { Theme } from '@mui/material/styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Snackbar(theme: Theme) {
  return {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {}
      }
    }
  };
}
