import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles(() => ({
  error: {
    '& .MuiInputBase-input': {
      // color: '#f44336'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: '2px solid #f44336'
    },
    '& .MuiInput-underline:before': {
      borderBottom: '2px solid #f44336'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#f44336'
    },
    '& label': {
      color: '#f44336'
    },
    '& label.Mui-focused': {
      color: '#f44336'
    },
    background: 'white',
    borderRadius: '5px'
  }
}));

export default useStyles;
