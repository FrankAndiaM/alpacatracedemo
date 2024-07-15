import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles((theme: Theme) => ({
  nested: {
    paddingLeft: theme.spacing(4)
  },
  iconList: {
    '& .MuiListItemIcon-root': {
      minWidth: '35px'
    }
  },
  ItemOfListActive: {
    background: '#96c26299 !important',
    boxShadow: '4px 4px 10px rgb(0 0 0 / 15%)',
    borderRadius: '5px',
    '&:hover': {
      background: '#96c26299 !important'
    }
  },
  ItemOfListHover: {
    background: 'none',
    '&:hover': {
      background: '#f5e27f61'
    }
  }
}));

export default useStyles;
