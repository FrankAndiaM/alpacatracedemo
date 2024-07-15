import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles((theme: Theme) => ({
  root: {
    flexShrink: 0,
    marginBottom: theme.spacing(0),
    marginLeft: '20px',
    marginTop: theme.spacing(0)
  }
}));

export default useStyles;
