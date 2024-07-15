import React from 'react';
import { Box, Icon, Paper } from '@mui/material';

import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';

import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import { useTheme } from '@mui/material/styles';

type CredentialHeaderProps = {
  credentialSchema?: CredentialSchemaModel;
  isLoading: boolean;
};

const CredentialHeader: React.FC<CredentialHeaderProps> = (props: CredentialHeaderProps) => {
  const { credentialSchema, isLoading }: CredentialHeaderProps = props;
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
        <Box px={2} pt={2} pb={2} minHeight={130} sx={{ backgroundColor: 'rgba(0, 82, 73, 1)', borderRadius: '16px' }}>
          <Box fontWeight={700} color="white" fontSize="1.5rem" sx={{ wordBreak: 'break-word' }}>
            {credentialSchema?.name ?? '-'}
          </Box>
          <Box color="white" sx={{ wordBreak: 'break-word' }}>
            {credentialSchema?.description ?? '-'}
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default CredentialHeader;
