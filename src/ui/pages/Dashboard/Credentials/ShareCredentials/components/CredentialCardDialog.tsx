import React, { useCallback } from 'react';
import { Box, Divider } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { capitalizeAllWords } from '~utils/Word';

const useStyles: any = makeStyles(() => ({
  title: {
    wordBreak: 'break-all',
    color: 'white'
  },
  subTitle: {
    fontSize: '0.68rem',
    opacity: '0.72',
    color: 'white'
  }
}));

type IssuedCredentialDialogProps = {
  issuedCredential: any;
  credentialValues: any;
  organizationTheme: any;
  onClose: () => void;
};

const IssuedCredentialDialog: React.FC<IssuedCredentialDialogProps> = (props: IssuedCredentialDialogProps) => {
  const { issuedCredential, credentialValues, onClose } = props;
  const classes = useStyles();

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

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
        <Box p={3}>
          <Box
            sx={{ backgroundColor: '#00822B', borderRadius: '1rem' }}
            height="100%"
            justifyContent="space-between"
            flexDirection="column"
            display="flex"
          >
            <Box px={2} py={1}>
              {/* <Box color="white" display="flex" justifyContent="flex-end">
                <Icon sx={{ cursor: 'pointer', mx: 1, fontSize: '30px !important' }} onClick={handleOnClose}>
                  close
                </Icon>
              </Box> */}
              {/* <Box color="white" display="flex" justifyContent="space-between">
                <Box>
                  <Box component="span" fontWeight={700}>
                    Fecha de emisión:{' '}
                  </Box>
                  <Box component="span">
                    {issuedCredential?.issuance_at !== undefined &&
                      format(new Date(issuedCredential?.issuance_at), 'dd MMMM yyyy', { locale: es })}
                  </Box>
                </Box>
              </Box> */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box fontWeight={700} fontSize="1.68rem" color="white">
                  {issuedCredential?.credential?.name}
                </Box>
                {/* <Box>{showStatus(issuedCredential?.credential_status?.name)}</Box> */}
              </Box>
              <Box my={1} display="flex" flexDirection={'column'}>
                <Box className={classes.subTitle}>EMITIDO A:</Box>
                <Box className={classes.title}>{issuedCredential?.producer?.full_name ?? ''}</Box>
              </Box>
              <Box my={1} display="flex" flexDirection={'column'}>
                <Box className={classes.subTitle}>FECHA DE EMISIÓN:</Box>
                <Box className={classes.title}>
                  {issuedCredential?.issuance_at
                    ? capitalizeAllWords(
                        format(new Date(issuedCredential?.issuance_at), 'dd MMMM yyyy', { locale: es })
                      )
                    : ''}
                </Box>
              </Box>
              <Box my={1} display="flex" flexDirection={'column'}>
                <Box className={classes.subTitle}>ID BLOCKCHAIN:</Box>
                <Box className={classes.title}>{issuedCredential?.contract_transaction_hash ?? ''}</Box>
              </Box>

              <Box my={1.5}>
                <Divider />
              </Box>
            </Box>
            <Box px={2} py={1} color="white">
              {Object.keys(credentialValues ?? {})?.map((key: any, index: number) => (
                <Box key={`card_attribute_${index}`}>
                  <Box display="flex" width="auto">
                    <Box
                      width="auto"
                      sx={{
                        fontWeight: 700,
                        wordBreak: 'break-word',
                        fontSize: '12px'
                      }}
                    >
                      {`${key}:`}
                    </Box>
                  </Box>
                  <Box pb={2} display="flex" width="auto">
                    <Box
                      width="auto"
                      sx={{
                        color: 'white',
                        wordBreak: 'break-word',
                        fontSize: '16px'
                      }}
                    >
                      {`${credentialValues[key]}`}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            {/* <Box position="relative">
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
            </Box> */}
          </Box>
          <Box
            sx={{
              backgroundColor: '#00822B',
              borderRadius: '1rem',
              color: 'white',
              padding: '12px 24px',
              '&:hover': { cursor: 'pointer' }
            }}
            height="100%"
            justifyContent="center"
            display="flex"
            onClick={handleOnClose}
            my={2}
          >
            Cerrar
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default IssuedCredentialDialog;
