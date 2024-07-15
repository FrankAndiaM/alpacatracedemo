export default {
  MuiTextField: {
    root: {
      marginTop: '8px'
    }
  },
  MuiInput: {
    underline: {
      '&:before': {
        borderBottom: '1px solid #507b1d'
      },
      '&:hover:not(.Mui-disabled):before': {
        borderBottom: '2px solid #507b1d'
      }
    }
  },
  MuiOutlinedInput: {
    root: {
      '& fieldset': {
        borderColor: '#87bf44'
      },
      '&:hover fieldset': {
        borderColor: '#446125 !important'
      },
      '&.Mui-focused fieldset': {
        // borderColor: '#f44336'
      },
      '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: '#f44336 !important'
      }
    },
    inputAdornedEnd: {
      color: 'red !important'
    },
    adornedEnd: {
      color: 'red !important'
    },
    input: {
      padding: '15.5px 14px'
    }
  },
  MuiSelect: {
    icon: {
      color: '#507b1d'
    }
  }
};
