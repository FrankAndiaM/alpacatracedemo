import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles((theme: Theme) => ({
  appBar: {
    background: '#4CE3A4',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    color: '#969494',
    height: '65px',
    transition: theme.transitions.create(['margin', 'width'], {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    }),
    zIndex: theme.zIndex.drawer + 1
  },
  appBarShift: () => ({
    zIndex: theme.zIndex.drawer + 11,
    background: '#4CE3A4',
    color: '#969494',
    marginLeft: 280,
    padding: '0px 0px',
    transition: theme.transitions.create(['width', 'margin'], {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp
    })
    // width: `calc(100% - ${props.drawerWidth}px)`
    // boxShadow:
    //   "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  }),
  title: {
    flexGrow: 1
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: 24 // keep right padding when drawer closed
  }
}));

export default useStyles;
