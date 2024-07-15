import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles(() => ({
  default: {
    '& .Mui-disabled': {
      '&:hover fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.31) !important'
      },
      color: 'rgba(0, 0, 0, 0.20)'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'primary'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'primary'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary'
      },
      '&:hover fieldset': {
        borderColor: 'primary'
      }
    },
    '& label': {
      color: 'rgba(0, 0, 0, 0.65)'
    },
    '& label.Mui-focused': {
      color: 'primary'
    },
    '&:hover label': {},
    background: 'white',
    borderRadius: '5px',
    marginTop: '8px'
  },
  root: {
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, 10px) scale(1)'
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)'
    },
    '& .MuiOutlinedInput-input': {
      padding: '9px'
    }
  }
}));

export default useStyles;
