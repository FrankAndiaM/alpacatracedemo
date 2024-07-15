import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Chip } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import { CredentialAttributeModel } from '~models/digital_identity/credential_attribute';
import ShowCredentialValue from '~pages/Dashboard/Credentials/components/ShowCredentialValue';

type ShowCredentialProps = {
  credentialSchema: CredentialSchemaModel;
};

const ShowCredential: React.FC<ShowCredentialProps> = (props: ShowCredentialProps) => {
  const { credentialSchema } = props;
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);

  return (
    <>
      <Box p={1}>
        <Box
          sx={{ backgroundColor: '#21764b', borderRadius: '1rem' }}
          height="100%"
          justifyContent="space-between"
          flexDirection="column"
          display="flex"
        >
          <Box px={2} py={1}>
            <Box color="white" display="flex" justifyContent="space-between">
              <Box>
                <Box component="span" fontWeight={700}>
                  Fecha de emisión:{' '}
                </Box>
                <Box component="span">{format(new Date(), 'dd MMMM yyyy', { locale: es })}</Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box fontWeight={700} fontSize="1.5rem" color="white">
                {credentialSchema?.name}
              </Box>
              <Box>
                <Chip label="Emitido" sx={{ color: 'white', background: '#96C262', fontWeight: 700 }} />
              </Box>
            </Box>
            <Box my={1.5}>
              <Divider
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  height: 2,
                  margin: 0
                }}
              />
            </Box>
          </Box>
          <Box px={2} py={1}>
            {credentialSchema?.credential_attributes?.map((attribute: CredentialAttributeModel, index: number) => (
              <Box key={`card_attribute_${index}`}>
                <Box display="flex" width="auto">
                  <Box
                    width="auto"
                    sx={{
                      color: '#21764b',
                      background: 'white',
                      fontWeight: 700,
                      wordBreak: 'break-word',
                      borderRadius: '10px',
                      padding: '0.5px 10px'
                    }}
                  >
                    {`${attribute?.name}:`}
                  </Box>
                </Box>
                <Box py={1} display="flex" width="auto">
                  <ShowCredentialValue credentialValue={attribute.default_value} />
                </Box>
              </Box>
            ))}
          </Box>
          <Box position="relative">
            <Box px={2} py={1}>
              <Box my={1.5}>
                <Divider
                  style={{
                    backgroundColor: 'white',
                    border: 'none',
                    height: 2,
                    margin: 0
                  }}
                />
              </Box>
              <Box color="white" display="flex" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <img
                    src={organizationTheme?.organizationLogo}
                    alt={organizationTheme?.organizationName}
                    style={{
                      height: '60px',
                      width: 'auto'
                    }}
                  />
                </Box>
                <Box maxWidth="200px">
                  <Box color="#edf3f3" fontSize="0.8rem">
                    Emitido por:
                  </Box>
                  <Box fontWeight={600} whiteSpace="break-spaces">
                    {organizationTheme?.organizationName}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ShowCredential;
