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
    '&:hover label': {
      // color: '#8bf333'
    },
    background: 'white',
    borderRadius: '5px',
    marginTop: '8px'
  },
  root: {}
}));

export default useStyles;
