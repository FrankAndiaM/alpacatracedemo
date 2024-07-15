export default {
  MuiTableHead: {
    root: {
      '& tr th': {}
    }
  },
  MuiTableCell: {
    head: {
      color: '#446125',
      fontWeight: 'bold' as const
    }
  },
  MuiTableSortLabel: {
    root: {
      '&:hover': {
        color: '#7b9a5a'
      }
    },
    active: {
      color: '#203509 !important'
    },
    icon: {
      color: '#203509 !important'
    }
  }
};
