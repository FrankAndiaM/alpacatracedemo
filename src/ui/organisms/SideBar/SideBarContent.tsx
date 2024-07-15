import React from 'react';
import { Box, Typography } from '@mui/material';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import NavSection from '~molecules/NavSection/NavSection';
import { MAvatar } from '~ui/components/@material-extend';
import Skeleton from '@mui/lab/Skeleton';
import { experimentalStyled as styled } from '@mui/material/styles';
import { getPaths } from '~routes/paths';
import LogoAlpacaTrace from '~assets/img/alpaca_trace.svg';

type SideBarContentProps = {
  loadingLogo: boolean;
  classes: any;
  logo: any;
  auth: any;
  setTitulo?: any;
};

const AccountStyle = styled('div')(({ theme }: any) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: '12px',
  backgroundColor: theme.palette.grey[500_12]
}));

const SideBarContent: React.FC<SideBarContentProps> = (props: SideBarContentProps) => {
  const { loadingLogo, classes, logo, auth, setTitulo }: SideBarContentProps = props;
  return (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        {loadingLogo ? (
          <div className={classes.toolbarIcon}>
            <Skeleton animation="wave" variant="circular" width={70} height={70} />
            <Skeleton animation="wave" variant="text" width="80%" />
            <Skeleton animation="wave" variant="text" width={120} />
          </div>
        ) : (
          <div className={classes.toolbarLogo}>
            <img
              src={LogoAlpacaTrace}
              alt="alpaca_trace"
              style={{
                height: '86px',
                width: 'auto'
              }}
            />
          </div>
        )}
      </Box>
      <Box>
        <AccountStyle>
          <MAvatar src="user" alt="user" color={'default'}>
            <Box width={'100%'} height={'100%'} display={'flex'}>
              <img
                src={logo}
                alt="agros"
                // style={{
                //   height: '80px',
                //   width: 'auto'
                // }}
              />
            </Box>
          </MAvatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {auth?.user?.payload?.name} {auth?.user?.payload?.family_name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Administrador
            </Typography>
          </Box>
        </AccountStyle>
      </Box>
      <NavSection
        navConfig={getPaths(auth?.organizationTheme?.show_product, auth?.organizationTheme?.name_product)}
        setTitulo={setTitulo}
      />
    </Scrollbar>
  );
};

export default React.memo(SideBarContent);
