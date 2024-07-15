import React, { useState, useCallback, useRef } from 'react';
import { Box, Icon, Typography } from '@mui/material';
import { Button } from '@mui/material';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { showMessage } from '~utils/Messages';
import CustomButton from '~atoms/Button/Button';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import * as XLSX from 'xlsx';
import { downloadExcel } from '~utils/downloadExcel';
import { massiveIssuanceCredential } from '~services/digital_identity/credential/massive_credential';
import { useSelector } from 'react-redux';
import LoadingResponse from '~ui/pages/Dashboard/Credentials/components/LoadingResponse.tsx';

type MassiveIssuanceCredentialDialogProps = {
  credentialSchema: CredentialSchemaModel;
  onClose: (typeUseCredential: 'individual' | 'massive' | undefined, isUpdateTable?: boolean) => void;
};

const MassiveIssuanceCredentialDialog: React.FC<MassiveIssuanceCredentialDialogProps> = (
  props: MassiveIssuanceCredentialDialogProps
) => {
  const isCompMounted = useRef(null);
  const { auth }: any = useSelector((state: any) => state);
  const [steps, setSteps] = useState<'load_file' | 'file_loaded' | 'loading_file'>('load_file');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataToSend, setDataToSend] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const { credentialSchema, onClose } = props;

  const handleDownloadExcel = useCallback(() => {
    const colsWch: any[] = [];

    const credentialAttributes: string[] =
      credentialSchema?.credential_attributes?.map((attribute: any) => {
        colsWch.push({ wch: attribute?.name?.length });
        return attribute?.name;
      }) ?? [];

    downloadExcel(
      'Certificado',
      `${credentialSchema?.name}.xlsx`,
      [['DNI', ...credentialAttributes]],
      [{ wch: 18 }, ...colsWch]
    );
  }, [credentialSchema]);

  const handleLoadFile = useCallback((e: any) => {
    setIsLoading(true);
    e.preventDefault();
    const files = e.target.files,
      f = files[0];
    if (f !== undefined && f !== null) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        /* Parse data */
        const bstr = e?.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { raw: false });

        if (Array.isArray(data) && data.length > 0) {
          setDataToSend(data);
          setSteps('file_loaded');
          setIsLoading(false);
          setFileName(f.name);
          return;
        }
        setIsLoading(false);
        showMessage('', 'Problemas al cargar el archivo. Verifique se tengan registros.', 'error', true);
      };
      reader.readAsBinaryString(f);
      e.target.value = '';
    }
  }, []);

  const sendFile = useCallback(() => {
    setSteps('loading_file');
    massiveIssuanceCredential({
      credential_schema_id: credentialSchema?.id,
      organization_id: auth?.organizationTheme?.organizationId,
      file_name: fileName,
      credentials: dataToSend
    })
      .then(() => {
        onClose(undefined, true);
        showMessage('El archivo de productores se ha subido correctamente', '', 'success');
      })
      .catch(() => {
        setSteps('file_loaded');
        showMessage('Ha ocurrido un error en la subida de este archivo, intenta subirlo nuevamente', '', 'error', true);
      });
  }, [credentialSchema, fileName, dataToSend, auth, onClose]);

  const renderSubTitle = useCallback((value: string) => {
    switch (value) {
      case 'load_file':
        return 'Selecciona un productor o emite masivamente';
      case 'file_loaded':
        return '';
      default:
        break;
    }
  }, []);

  const renderAttributeType = useCallback((attribute_type: string) => {
    switch (attribute_type) {
      case 'string':
        return 'Texto';
      case 'number':
        return 'Número';
      case 'boolean':
        return 'Si/No';
      case 'enum':
        return 'Opciones';
      case 'date':
        return 'dd-mm-yyyy';
      default:
        return '';
    }
  }, []);

  return (
    <>
      <Box ref={isCompMounted}>
        <Dialog
          open
          title={['load_file', 'file_loaded'].includes(steps) ? 'Emisión de certificado' : undefined}
          subtitle={renderSubTitle(steps)}
          onClose={() => 0}
          actions={
            <>
              {['load_file', 'file_loaded'].includes(steps) && (
                <CustomButton
                  text="Cancelar"
                  onClick={() => {
                    onClose(undefined);
                  }}
                  variant="outlined"
                />
              )}
              {steps === 'load_file' && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    component="label"
                    startIcon={<Icon>backup</Icon>}
                    disabled={isLoading}
                    sx={{ margin: '8px' }}
                  >
                    cargar excel
                    <input type="file" accept=".xlsx,.xls" hidden onChange={handleLoadFile} />
                  </Button>
                </>
              )}
              {steps === 'file_loaded' && (
                <>
                  <CustomButton
                    text="Enviar archivo"
                    variant="contained"
                    startIcon={<Icon>backup</Icon>}
                    onClick={sendFile}
                  />
                </>
              )}
            </>
          }
        >
          {steps === 'load_file' && (
            <>
              <Box display="flex">
                Descargue el siguiente formato de excel:
                <Typography
                  style={{ color: '#00AB55', textDecoration: 'underline', cursor: 'pointer', paddingLeft: 3 }}
                  onClick={handleDownloadExcel}
                >
                  {credentialSchema?.name}.xlsx
                </Typography>
              </Box>
              <Box mt={2}>
                Este formato contiene las siguientes
                <Typography fontWeight={600} component="span">
                  {' '}
                  columnas
                </Typography>
                que corresponden al certificado {'"'}
                <Typography fontWeight={600} component="span">
                  {credentialSchema?.name}
                </Typography>
                {'"'}
                Configuradas en el panel:
              </Box>
              <Box my={2}>
                <Box fontWeight={500}>- DNI</Box>
                {credentialSchema?.credential_attributes?.map((attribute: any, index: number) => (
                  <Box key={`attribute_${index}`} fontWeight={500}>
                    - {attribute?.name} {'('}
                    {renderAttributeType(attribute?.attribute_type)}
                    {')'}
                  </Box>
                ))}
              </Box>
              <Box>
                Complete la información correspondiente, luego suba el archivo dándole click en{' '}
                <Typography component="span" fontWeight={600}>
                  cargar excel
                </Typography>
              </Box>
            </>
          )}

          {steps === 'file_loaded' && (
            <>
              <Box>Usted a subido el siguiente archivo:</Box>
              <Typography style={{ color: '#00AB55', textDecoration: 'underline' }}>{fileName}</Typography>
            </>
          )}
          {steps === 'loading_file' && <LoadingResponse />}
        </Dialog>
      </Box>
    </>
  );
};

export default MassiveIssuanceCredentialDialog;
