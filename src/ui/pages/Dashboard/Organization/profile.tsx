import React, { useState } from 'react';
import { Grid, Tab, Box, Tabs, Icon } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InformationTab from './InformationTab';
import FilesTab from './FilesTab';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import routes from '~routes/routes';
import { useTheme } from '@mui/material/styles';
import ConfigurationTab from './ConfigurationTab';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import VisorConfig from './VisorConfig';
import { Tv } from '@mui/icons-material';

// import LocalOffer from '@mui/icons-material/LocalOffer';
// import TagTab from './CategoryTag';

type OrganizationProfileProps = unknown;

const OrganizationProfile: React.FC<OrganizationProfileProps> = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const theme = useTheme();
  return (
    <Box>
      <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
        Configuración de organización
      </Box>
      <Box>
        <Breadcrumbs
          breadcrumbs={[
            {
              path: routes.dashboard,
              component: <Icon fontSize="small">home</Icon>
            },
            {
              component: 'Configuración '
            }
          ]}
        />
      </Box>

      <Box mt={3}>
        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={(_e: any, value: any) => setCurrentTab(value)}
        >
          <Tab disableRipple label="General" icon={<AccountBoxIcon />} value={0} iconPosition="start" />
          <Tab disableRipple label="Personalización" icon={<BrushOutlinedIcon />} value={1} iconPosition="start" />
          <Tab
            disableRipple
            label="Datos de certificación"
            icon={<AssignmentOutlinedIcon />}
            value={2}
            iconPosition="start"
          />
          <Tab disableRipple label="Visor de trazabilidad" icon={<Tv />} value={3} iconPosition="start" />
          {/* <Tab disableRipple label="Etiquetas" icon={<LocalOffer />} value={2} iconPosition="start" /> */}
        </Tabs>
        {currentTab === 0 && <InformationTab />}
        {currentTab === 1 && <ConfigurationTab />}
        {currentTab === 2 && <FilesTab />}
        {currentTab === 3 && <VisorConfig />}
        {/* {currentTab === 2 && <TagTab />} */}
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
      </Grid>
    </Box>
  );
};

export default OrganizationProfile;
