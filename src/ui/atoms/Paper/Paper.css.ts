import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles((theme: Theme) => ({
  blueGradient: {
    background: '-webkit-linear-gradient(50deg, #59af5b, #57e3a4) !important'
    // background: 'linear-gradient(40deg, #45cafc, #303f9f) !important'
  },
  cardTitle: {
    borderRadius: '.125rem',
    boxShadow: '0 5px 12px 0 rgba(0,0,0,.18),0 4px 15px 0 rgba(0,0,0,.15)',
    color: ' #fff',
    margin: '-45px 0rem 25px 3%',
    minHeight: '60px',
    padding: '0.2rem',
    textAlign: 'center',
    width: '94%'
  },
  paper: (props: any): any => ({
    marginTop: props.marginTop ? props.marginTop : '0px',
    padding: theme.spacing(2),
    // display: "flex",
    // flexDirection: "column",
    width: '100%'
  })
}));

export default useStyles;
