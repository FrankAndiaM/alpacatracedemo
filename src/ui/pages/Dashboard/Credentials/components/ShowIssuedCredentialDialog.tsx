import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import Button from '~ui/atoms/Button/Button';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { getIssuedCredential } from '~services/digital_identity/credential/credential';
import { showMessage } from '~utils/Messages';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import Credential from '~molecules/Credential';

type ShowIssuedCredentialDialogProps = {
  // Esquema de la credencial
  credentialSchema: any;

  // Credencial emitida
  issuedCredential?: any;

  // id de la credencial emitida a consultar
  issuedCredentialId?: string;

  onClose(): void;
};

const ShowIssuedCredentialDialog: React.FC<ShowIssuedCredentialDialogProps> = (
  props: ShowIssuedCredentialDialogProps
) => {
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);
  const { issuedCredential, issuedCredentialId, onClose } = props;
  const isCompMounted = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [issuedCredentialValues, setIssuedCredentialValues] = useState<any>({});
  const [currentIssuedCredential, setCurrentIssuedCredential] = useState<any>({ credentialAttributes: [] });
  const [isCredentialLoading, setIsCredentialLoading] = useState<boolean>(false);

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (issuedCredentialId !== undefined) {
      setIsCredentialLoading(true);
      getIssuedCredential(issuedCredentialId)
        .then((res: any) => {
          const data = res?.data?.data;
          setCurrentIssuedCredential(data);
          setIsCredentialLoading(false);

          if (data?.credential_values?.hasOwnProperty('claims')) {
            setIssuedCredentialValues(data?.credential_values?.claims);
            return;
          }
          const newCredentialValues = Object.assign({}, data?.credential_values);
          delete newCredentialValues?.id;
          delete newCredentialValues?.general_id;
          setIssuedCredentialValues(newCredentialValues);
        })
        .catch(() => {
          showMessage('', 'Problemas al cargar el certificado emitido.', 'error');
        });
    } else {
      setCurrentIssuedCredential(issuedCredential);
      if (issuedCredential?.credential_values?.hasOwnProperty('claims')) {
        setIssuedCredentialValues(issuedCredential?.credential_values?.claims);
        return;
      }
      const newCredentialValues = Object.assign({}, issuedCredential?.credential_values);
      delete newCredentialValues?.id;
      delete newCredentialValues?.general_id;
      setIssuedCredentialValues(newCredentialValues);
    }
  }, [issuedCredential, issuedCredentialId]);

  // const showStatus = useCallback((status?: string) => {
  //   const { colorText, ColorBox, labelText } = getStatusColorCredentials(status ?? '');
  //   return <Chip label={labelText} sx={{ color: colorText, background: ColorBox, fontWeight: 700 }} />;
  // }, []);

  return (
    <>
      <Box ref={isCompMounted}>
        <Dialog
          open
          onClose={() => handleOnClose()}
          // actions={
          //   <>
          //     <Button text="Cerrar" onClick={() => handleOnClose()} variant="outlined" />
          //   </>
          // }
          hideActions
          scroll="body"
        >
          <Box mb={1}>
            <LinearProgress loading={isCredentialLoading} />
          </Box>

          <Credential
            issuedCredential={currentIssuedCredential}
            credentialValues={currentIssuedCredential?.credential_values?.claims}
            organizationTheme={organizationTheme}
          />
          <Box display="flex" justifyContent={'flex-end'}>
            <Button text="Cerrar" onClick={() => handleOnClose()} variant="outlined" />
          </Box>
        </Dialog>
      </Box>
    </>
  );
};

export default ShowIssuedCredentialDialog;
