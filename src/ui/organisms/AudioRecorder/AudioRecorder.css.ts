import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles((theme: Theme) => ({
  completeButton: {
    [theme.breakpoints.up('sm')]: {
      padding: '0rem 3rem !important'
    }
  },
  contentButton: {
    [theme.breakpoints.up('sm')]: {
      padding: '0rem 9rem !important'
    }
  },
  button: {
    width: '100%',
    borderRadius: '50px'
  },
  buttonDefault: {
    background: '#828282',
    color: 'white',
    '&:hover': {
      backgroundColor: '#828282a8 !important'
    }
  },
  recording: {
    width: '100%',
    background: '#9E2A2A',
    borderRadius: '50px',
    '&:hover': {
      background: '#bb4242'
    }
  },
  microphone: {
    display: 'flex',
    padding: '30px',
    borderRadius: '30px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  microphoneDisabled: {
    color: '#DADADA',
    background: '#828282'
  },
  microphoneEnabled: {
    color: '#DADADA',
    background: '#9E2A2A',
    animation: `$flicker 2000ms ${theme.transitions.easing.easeInOut}`,
    animationIterationCount: 'infinite'
  },
  audio: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: '0.25rem 5rem !important'
    },
    '&:focus': {
      outline: 'none'
    }
  },
  audioComplete: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: '0.25rem 2rem !important'
    },
    '&:focus': {
      outline: 'none'
    }
  },
  audioOutline: {
    width: '100%',
    '&:focus': {
      outline: 'none'
    }
  },
  '@-moz-keyframes flicker': {
    '0%': { opacity: ' 1.0' },
    '50%': { opacity: '0.5' },
    '00%': { opacity: '1.0' }
  },
  '@-webkit-keyframes flicker': {
    '0%': { opacity: ' 1.0' },
    '50%': { opacity: '0.5' },
    '00%': { opacity: '1.0' }
  },
  '@keyframes flicker': {
    '0%': { opacity: ' 1.0' },
    '50%': { opacity: '0.5' },
    '00%': { opacity: '1.0' }
  }
}));

export default useStyles;
