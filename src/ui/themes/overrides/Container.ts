import { Theme } from '@mui/material/styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Container(theme: Theme) {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {}
      }
    }
  };
}
