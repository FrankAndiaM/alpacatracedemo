import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Chip, Icon, Dialog } from '@mui/material';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { getIssuedCredential } from '~services/digital_identity/credential/credential';
import { showMessage } from '~utils/Messages';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStatusColorCredentials } from './colorLabelStatus';
import { useTheme } from '@mui/material/styles';

type ShowIssuedCredentialDialogProps = {
  credentialSchema?: any;
  issuedCredentialId: string;
  onClose(): void;
};

const ShowIssuedCredentialDialog: React.FC<ShowIssuedCredentialDialogProps> = (
  props: ShowIssuedCredentialDialogProps
) => {
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);
  const theme = useTheme();
  const { issuedCredentialId, credentialSchema, onClose } = props;
  const isCompMounted = useRef(null);
  const [issuedCredential, setIssuedCredential] = useState<any>({ credentialAttributes: [] });
  const [isCredentialLoading, setIsCredentialLoading] = useState<boolean>(true);
  const [credentialValues, setCredentialValues] = useState<any>({});

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    getIssuedCredential(issuedCredentialId)
      .then((res: any) => {
        const data = res?.data?.data;
        setIssuedCredential(data);
        setIsCredentialLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar el certificado emitido.', 'error');
      });
  }, [issuedCredentialId]);

  useEffect(() => {
    if (issuedCredential?.credential_values?.hasOwnProperty('claims')) {
      setCredentialValues(issuedCredential?.credential_values?.claims);
      return;
    }
    const newCredentialValues = Object.assign({}, issuedCredential?.credential_values);
    delete newCredentialValues?.id;
    delete newCredentialValues?.general_id;
    setCredentialValues(newCredentialValues);
  }, [issuedCredential]);

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
        ref={isCompMounted}
        scroll="body"
        fullWidth
        open
        onClose={handleOnClose}
        aria-labelledby="alert-dialog-credentials"
        aria-describedby="alert-dialog-credentials"
      >
        <Box mb={1}>
          <LinearProgress loading={isCredentialLoading} />
        </Box>
        <Box p={1}>
          <Box sx={{ backgroundColor: '#21764b', borderRadius: '1rem', p: 2 }}>
            <Box color="white" display="flex" justifyContent="flex-end">
              <Icon sx={{ cursor: 'pointer', mx: 1, fontSize: '30px !important' }} onClick={handleOnClose}>
                close
              </Icon>
            </Box>
            <Box color="white">
              <Box component="span" fontWeight={700}>
                Fecha de emisión:{' '}
              </Box>
              <Box component="span">
                {issuedCredential?.issuance_at !== undefined &&
                  format(new Date(issuedCredential?.issuance_at), 'dd MMMM yyyy', { locale: es })}
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box fontWeight={700} fontSize="1.5rem" color="white">
                {credentialSchema?.name}
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
            <Box>
              {Object.keys(credentialValues)?.map((key: any, index: number) => (
                <Box key={`card_attribute_${index}`}>
                  <Box>
                    <Chip label={`${key}:`} sx={{ color: '#21764b', background: 'white', fontWeight: 700 }} />
                  </Box>
                  <Box py={1}>
                    <Chip
                      label={`${credentialValues[key]}`}
                      sx={{ color: 'white', fontWeight: 700, borderColor: 'white' }}
                      variant="outlined"
                    />
                  </Box>
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
      </Dialog>
    </>
  );
};

export default ShowIssuedCredentialDialog;
