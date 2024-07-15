export default {
  MuiDrawer: {
    paper: {
      borderRight: '0px !important',
      // background: '#446125',
      // color: '#ccc89f',

      // flexShrink: 0,
      // overflowY: 'auto' as 'auto',
      // overflowX: 'hidden' as 'hidden',
      // position: 'relative' as 'relative',
      '&::-webkit-scrollbar': {
        background: '#214036',
        width: '8px'
      },
      // '&::-webkit-scrollbar-track': {
      // //   boxShadow: 'inset 0 0 5px grey',
      // //   borderRadius: '5px'
      // },
      '&::-webkit-scrollbar-thumb': {
        background: '#ccc89f',
        borderRadius: '10px'
      }
    }
  }
};
