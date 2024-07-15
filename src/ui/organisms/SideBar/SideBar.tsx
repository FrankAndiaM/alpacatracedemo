import React from 'react';
import { useSelector } from 'react-redux';
import { Drawer, Theme } from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import { MHidden } from '~ui/components/@material-extend';
import SideBarContent from './SideBarContent';

export type SideBarProps = {
  handleActiveDrawer?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  activeDrawer?: boolean;
  drawerWidth?: number;
  routes?: any[];
  isLogoLoading: boolean;
  logo: any;
  setTitulo?: any;
};

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }: any) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const useStyles: any = makeStyles((theme: Theme) => ({
  drawerOpen: (props: SideBarProps) => ({
    [theme.breakpoints.up('xs')]: {
      width: `${props.drawerWidth}px`
    }
  }),
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: 0
  },
  toolbarIcon: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '10px 8px'
  },
  toolbarLogo: {
    display: 'flex',
    padding: '10px 8px',
    flexDirection: 'row',
    justifyContent: 'center'
  }
}));

const CustomSideBar: React.FC<SideBarProps> = (props: SideBarProps) => {
  const { activeDrawer, setTitulo, drawerWidth, isLogoLoading, logo, handleActiveDrawer }: SideBarProps = props;
  const classes = useStyles({ drawerWidth, isLogoLoading, logo });

  const { auth }: any = useSelector((state: any) => state);

  // useEffect(() => {
  //   if (auth.user?.payload?.association_id) {
  //     setLogo(COMMUNITY_BASE_URL_S3 + 'associations/' + auth?.user?.payload.association_id + '/images/logo.svg');
  //   }
  // }, [auth?.association, auth?.user?.payload]);

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={activeDrawer}
          onClose={handleActiveDrawer}
          PaperProps={{
            sx: { width: drawerWidth, bgcolor: 'background.default' }
          }}
        >
          <SideBarContent loadingLogo={isLogoLoading} classes={classes} logo={logo} auth={auth} />
        </Drawer>
      </MHidden>
      <MHidden width="lgDown">
        <Drawer
          variant="persistent"
          open
          PaperProps={{
            sx: { width: drawerWidth, bgcolor: 'background.default' }
          }}
        >
          <SideBarContent loadingLogo={isLogoLoading} classes={classes} logo={logo} auth={auth} setTitulo={setTitulo}/>
        </Drawer>
      </MHidden>
    </RootStyle>
  );
};

CustomSideBar.defaultProps = {
  activeDrawer: false,
  drawerWidth: 280
};

export default React.memo(CustomSideBar);
