import React, { useRef } from 'react';
import { Box, Icon } from '@mui/material';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';
import OwnCredentialsTab from './OwnCredentialsTab';
import { useTheme } from '@mui/material/styles';

type CredentialPageProps = unknown;

const CredentialPage: React.FC<CredentialPageProps> = () => {
  const isCompMounted = useRef(null);
  const theme = useTheme();

  return (
    <>
      <Box display="flex" justifyContent="space-between" ref={isCompMounted} mb={1}>
        <Box>
          <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
            Certificados blockchain
          </Box>
          <Breadcrumbs
            breadcrumbs={[
              {
                path: routes.dashboard,
                component: <Icon fontSize="small">home</Icon>
              },
              {
                component: 'Certificados blockchain'
              }
            ]}
          />
        </Box>
      </Box>
      {/* <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={handleChangeTab}
      >
        <Tab
          disableRipple
          value="form"
          icon={<Icon>credit_card</Icon>}
          label="Certificados propios"
          iconPosition="start"
          sx={{ textTransform: 'none' }}
        />
        <Tab
          disableRipple
          value="predetermined"
          icon={<Icon>receipt</Icon>}
          label="Certificados estándares"
          iconPosition="start"
        />
        <Tab
          disableRipple
          value="default"
          icon={<Icon>receipt</Icon>}
          label="Certificados predeterminados"
          iconPosition="start"
          sx={{ textTransform: 'none' }}
        />
      </Tabs> */}

      {/* Organization credentials */}
      <OwnCredentialsTab />
    </>
  );
};

export default CredentialPage;
