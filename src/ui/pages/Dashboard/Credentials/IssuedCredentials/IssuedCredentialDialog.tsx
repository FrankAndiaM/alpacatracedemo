import React, { useCallback } from 'react';
import { Box, Divider, Chip, Icon } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStatusColorCredentials } from '../colorLabelStatus';
import { Dialog } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type IssuedCredentialDialogProps = {
  issuedCredential: any;
  credentialValues: any;
  organizationTheme: any;
  onClose: () => void;
};

const IssuedCredentialDialog: React.FC<IssuedCredentialDialogProps> = (props: IssuedCredentialDialogProps) => {
  const { issuedCredential, credentialValues, organizationTheme, onClose } = props;
  const theme = useTheme();
  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const showStatus = useCallback(
    (status?: string) => {
      const { colorText, ColorBox, labelText } = getStatusColorCredentials(status ?? '', theme);
      return <Chip label={labelText} sx={{ color: colorText, background: ColorBox, fontWeight: 700 }} />;
    },
    [theme]
  );

  return (
    <>
      <Dialog
        // keepMounted
        scroll="body"
        fullWidth
        open
        onClose={handleOnClose}
        aria-labelledby="alert-dialog-credentials"
        aria-describedby="alert-dialog-credentials"
      >
        <Box p={1}>
          <Box
            sx={{ backgroundColor: '#21764b', borderRadius: '1rem' }}
            height="100%"
            justifyContent="space-between"
            flexDirection="column"
            display="flex"
          >
            <Box px={2} py={1}>
              <Box color="white" display="flex" justifyContent="flex-end">
                <Icon sx={{ cursor: 'pointer', mx: 1, fontSize: '30px !important' }} onClick={handleOnClose}>
                  close
                </Icon>
              </Box>
              <Box color="white" display="flex" justifyContent="space-between">
                <Box>
                  <Box component="span" fontWeight={700}>
                    Fecha de emisión:{' '}
                  </Box>
                  <Box component="span">
                    {issuedCredential?.issuance_at !== undefined &&
                      format(new Date(issuedCredential?.issuance_at), 'dd MMMM yyyy', { locale: es })}
                  </Box>
                </Box>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box fontWeight={700} fontSize="1.5rem" color="white">
                  {issuedCredential?.credential?.name}
                </Box>
                <Box>{showStatus(issuedCredential?.credential_status?.name)}</Box>
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
              {Object.keys(credentialValues ?? {})?.map((key: any, index: number) => (
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
                      {`${key}:`}
                    </Box>
                  </Box>
                  <Box py={1} display="flex" width="auto">
                    <Box
                      width="auto"
                      minHeight="24px"
                      minWidth="30px"
                      sx={{
                        color: 'white',
                        border: '1px solid white',
                        fontWeight: 700,
                        wordBreak: 'break-word',
                        borderRadius: '10px',
                        padding: '0.5px 10px'
                      }}
                    >
                      {`${credentialValues[key]}`}
                    </Box>
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
      </Dialog>
    </>
  );
};

export default IssuedCredentialDialog;
