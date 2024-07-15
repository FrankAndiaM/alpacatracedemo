import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Chip, Divider } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type PreviewCredentialSchemaProps = {
  credential: any;
  credentialAttributes: any[];
};

const PreviewCredentialSchema: React.FC<PreviewCredentialSchemaProps> = (props: PreviewCredentialSchemaProps) => {
  const { credential, credentialAttributes }: PreviewCredentialSchemaProps = props;
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Box sx={{ backgroundColor: '#21764b', borderRadius: '1rem', p: 2 }} minWidth="35rem" maxWidth="35rem">
          <Box color="white">
            <Box component="span" fontWeight={700}>
              Fecha de emisión:{' '}
            </Box>
            <Box component="span">{format(new Date(), 'dd MMMM yyyy', { locale: es })}</Box>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ wordBreak: 'break-word' }}>
            <Box fontWeight={700} fontSize="1.5rem" color="white">
              {credential?.name}
            </Box>
            <Box>
              <Chip label="Emitido" sx={{ color: 'white', background: '#ffbf1b', fontWeight: 700 }} />
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
          <Box>
            {credentialAttributes.map((attribute: any, index: number) => (
              <Box key={`card_attribute_${index}`} pb={1}>
                <Box>
                  <Chip
                    label={`${attribute?.name}:`}
                    sx={{
                      height: 'auto',
                      minHeight: '36px',
                      color: '#21764b',
                      background: 'white',
                      fontWeight: 700,
                      '& .MuiChip-label': {
                        whiteSpace: 'break-spaces'
                      }
                    }}
                  />
                </Box>

                {attribute?.default_value !== undefined && (
                  <Box pt={1}>
                    <Chip
                      label={`${attribute?.default_value}`}
                      sx={{
                        height: 'auto',
                        minHeight: '36px',
                        color: 'white',
                        fontWeight: 700,
                        borderColor: 'white',
                        '& .MuiChip-label': {
                          whiteSpace: 'break-spaces'
                        }
                      }}
                      variant="outlined"
                    />
                  </Box>
                )}
              </Box>
            ))}
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
    </>
  );
};

export default PreviewCredentialSchema;
