import React from 'react';
import { makeStyles } from '@mui/styles';

import { Theme } from '~ui/themes';
import logoAgrosGray from './../../assets/img/logo_gray.png';

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <div className={classes.content}>
        <div className={classes.title}>
          {' '}
          <img src={logoAgrosGray} alt="agros_gray" className={classes.logo} /> AGROS{' '}
        </div>
      </div>
    </footer>
  );
};

const useStyles: any = makeStyles((theme: Theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    textAlign: 'right',
    // padding: '5px 0 0 ' + theme.sidebar.widthFine,
    zIndex: 999
  },
  content: {
    // background: theme.footer.background,
    // boxShadow: theme.footer.boxShadow
  },
  title: {
    // padding: theme.footer.title.padding,
    // color: theme.footer.title.color,
    // fontSize: theme.footer.title.fontSize,
    [theme.breakpoints.down('xs')]: {
      // fontSize: theme.footer.title.fontSizeXS,
      // padding: theme.footer.title.paddingXS
    }
  },
  logo: {
    // height: theme.footer.logo.height,
    // width: theme.footer.logo.width,
    paddingTop: '5px'
  }
}));

export default React.memo(Footer);
