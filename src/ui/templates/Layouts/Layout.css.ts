import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
const useStyles: any = makeStyles((theme: Theme) => ({
  appBarSpacer: {
    ...theme.mixins.toolbar,
    height: '65px'
  },
  colorAgros: {
    color: '#8cc542'
  },
  container: {
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1)
    }
  },
  content: {
    background: '#f2f1f1',
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    padding: theme.spacing(2)
  },
  root: {
    display: 'flex'
  },

  drawer: {
    width: '100%',
    fontSize: '1em !important',
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
      width: 210,
      flexShrink: 0
    }
  },
  sidebarContainer: {
    alignItems: 'stretch',
    position: 'relative',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    width: 210,
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  sidebarContainerMobile: {
    width: 0
  },
  sidebarContainerCollapsed: {
    width: 0
  }
}));

export default useStyles;
