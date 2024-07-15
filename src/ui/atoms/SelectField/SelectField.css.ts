import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles: any = makeStyles((theme: Theme) => ({
  item: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white'
    }
  },
  root: {
    '& .MuiInputLabel-root': {
      transform: 'translate(1px, 10px) scale(1)'
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(1px, -6px) scale(0.75) !important'
    }
  },
  label: {
    color: `${theme.palette.primary.main}`
  },
  selected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: 'white'
  },
  error: {
    '& .MuiInputBase-input': {
      color: theme.palette.error.main,
      borderBottom: `2px solid ${theme.palette.error.main}`
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: `2px solid ${theme.palette.error.main}`
    },
    '& .MuiInput-underline:before': {
      borderBottom: `2px solid ${theme.palette.error.main}`
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.palette.error.main
    },
    '& .MuiInput-underline.Mui-error:after': {
      borderBottomColor: theme.palette.error.main
    },
    '& label': {
      color: theme.palette.error.main
    },
    '& label.Mui-focused': {
      color: theme.palette.error.main
    },
    // background: 'white',
    borderRadius: '5px'
  }
}));

export default useStyles;
