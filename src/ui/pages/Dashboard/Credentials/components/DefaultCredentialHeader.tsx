import React from 'react';
import { Box, Icon, Paper, Tabs, Tab } from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';
import CardBank from '~assets/img/Card_bank.png';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';

import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import { useTheme } from '@mui/material/styles';

type DefaultCredentialHeaderProps = {
  credentialSchema?: CredentialSchemaModel;
  isLoading: boolean;
  activeTab: 'issuance' | 'massive_issuance';
  onChangeTab: (value: 'issuance' | 'massive_issuance') => void;
};

const TabsWrapperStyle = styled('div')(() => ({
  zIndex: 9,
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  marginTop: '16px'
}));

const DefaultCredentialHeader: React.FC<DefaultCredentialHeaderProps> = (props: DefaultCredentialHeaderProps) => {
  const { activeTab, onChangeTab, credentialSchema, isLoading }: DefaultCredentialHeaderProps = props;
  const theme = useTheme();
  return (
    <>
      <Box>
        <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
          Emisión de certificados blockchain
        </Box>
        <Breadcrumbs
          breadcrumbs={[
            {
              path: routes.dashboard,
              component: <Icon fontSize="small">home</Icon>
            },
            {
              path: routes.credential,
              component: 'Certificados blockchain'
            },
            {
              component: 'Emisión de certificados blockchain'
            }
          ]}
        />
      </Box>
      <LinearProgress loading={isLoading} />
      <Paper
        elevation={1}
        sx={{
          mt: 2,
          minHeight: 130,
          position: 'relative',
          borderRadius: '20px'
        }}
      >
        <Box
          px={2}
          pt={2}
          pb={2}
          minHeight={130}
          sx={{ backgroundColor: 'rgba(0, 82, 73, 1)', borderRadius: '16px 16px 0px 0px' }}
        >
          <Box display="flex" alignItems={'center'}>
            <Box style={{ padding: '20px', backgroundColor: 'white', borderRadius: '4px', marginRight: '16px' }}>
              <img src={CardBank} alt="card_bank_icon" />
            </Box>
            <Box>
              <Box fontWeight={700} color="white" fontSize="1.5rem" sx={{ wordBreak: 'break-word' }}>
                {credentialSchema?.name ?? '-'}
              </Box>
              <Box color="white" sx={{ wordBreak: 'break-word' }}>
                {credentialSchema?.description ?? '-'}
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
      <TabsWrapperStyle>
        <Tabs value={activeTab} scrollButtons="auto" variant="scrollable" allowScrollButtonsMobile>
          <Tab
            value="issuance"
            icon={<Icon>account_box_rounded</Icon>}
            label="Certificados emitidos"
            iconPosition="start"
            onClick={() => {
              onChangeTab('issuance');
            }}
          />
          {/* <Tab
            value="massive_issuance"
            icon={<Icon>insert_drive_file</Icon>}
            label="Archivos de excel"
            iconPosition="start"
            onClick={() => {
              onChangeTab('massive_issuance');
            }}
          /> */}
        </Tabs>
      </TabsWrapperStyle>
    </>
  );
};

export default DefaultCredentialHeader;
