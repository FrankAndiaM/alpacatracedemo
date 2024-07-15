import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Grid, Box, Typography, Icon, CircularProgress } from '@mui/material';
import ExcelIcon from '~assets/icons/excel.png';
import DownloadIcon from '~assets/icons/download_icon.png';
import { useSelector } from 'react-redux';
import Dialog from '~ui/molecules/Dialog/Dialog';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomButton from '~ui/atoms/Button/Button';
import { showMessage } from '~utils/Messages';
import * as XLSX from 'xlsx';
// import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import { uploadMassiveLoadTransaction } from '~services/massive_load_clothes';
import UploadFileStatusComponent from './UploadFileStatus';
import { useTheme } from '@mui/material';
import { getOrganizationFormV2 } from '~services/organization/formsv2';
import { AttributesRelation } from '~models/clothes';
// import { OrganizationFormAttributeEdit } from '~models/organizationFormAttribute';
import { downloadExcel } from '~utils/downloadExcel';

const typeAttributeHeader = (type: string, options?: any[]): string => {
  let str = 'Texto';
  switch (type) {
    case 'date':
      str = '2023-11-15';
      break;
    case 'photo':
      str = 'Foto';
      break;
    case 'number':
      str = 'Número';
      break;
    case 'list_options':
      if (options && options?.length > 0) {
        str = options?.join(', ');
        break;
      }
      break;
    case 'multiple_selection':
      if (options && options?.length > 0) {
        str = options?.join(', ');
        break;
      }
      break;
    default:
      break;
  }
  return str;
};

type UploadMassiveLoadPanelsDialogProps = {
  open: boolean;
  closeAction: any;
};

const UploadMassiveLoadPanelsDialog: React.FC<UploadMassiveLoadPanelsDialogProps> = (
  props: UploadMassiveLoadPanelsDialogProps
) => {
  const {
    auth: {
      organizationTheme: { organizationId, attributes_relation, name_product }
    }
  }: any = useSelector((state: any) => state);
  const { open, closeAction } = props;
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(true);
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
  const [uploadFileStatus, setUploadFileStatus] = useState<'PENDING' | 'UPLOADING' | 'SUCCESS' | 'FAILED'>('PENDING');
  const isCompMounted = useRef(null);
  const [additionalSchemaHeaders, setAdditionalSchemaHeaders] = useState<string[]>([]);
  const [additionalTypesHeaders, setAdditionalTypesHeaders] = useState<string[]>([]);

  const ConvertExcelFileToCSV = useCallback((file: any) => {
    return new Promise((resolve: any, _: any): any => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr = e?.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];

        const csvData = XLSX.utils.sheet_to_csv(wb.Sheets[wsname]);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        resolve(blob);
      };
      reader.readAsBinaryString(file);
    });
  }, []);

  const handleLoadFile = useCallback(
    (file: File) => {
      setIsLoading(true);
      setUploadFileStatus('UPLOADING');
      ConvertExcelFileToCSV(file)
        .then((convertedFile: any) => {
          const formData = new FormData();
          formData.append('file', convertedFile);
          formData.append('file_name', file.name);
          formData.append('file_type', convertedFile.type);
          formData.append('organization_id', organizationId);
          formData.append('entity', 'FabricInventories');

          uploadMassiveLoadTransaction(formData)
            .then(() => {
              if (!isCompMounted.current) return;
              closeAction(true);
              showMessage(
                '',
                `Se ha subido el documento ${file.name} con éxito, por favor revisa el archivo pendiente para editar los datos erróneos.`,
                'success',
                false
              );
              setUploadFileStatus('SUCCESS');
            })
            .catch(() => {
              if (!isCompMounted.current) return;
              showMessage('', 'Problemas al cargar el archivo.', 'error', true);
              setIsLoading(false);
              setCurrentFile(undefined);
              setUploadFileStatus('FAILED');
            });
        })
        .catch(() => {
          if (!isCompMounted.current) return;
          showMessage('', 'Problemas al cargar el archivo.', 'error', true);
          setIsLoading(false);
          setCurrentFile(undefined);
          setUploadFileStatus('FAILED');
        });
    },
    [closeAction, organizationId, ConvertExcelFileToCSV]
  );

  // const saveAs = useCallback((url: string) => {
  //   const link = document.createElement('a');
  //   document.body.appendChild(link);
  //   link.target = '_blank';
  //   link.rel = 'noopener noreferrer';
  //   link.download = 'download';
  //   link.href = url;
  //   link.download = 'archivo.xlsx';
  //   link.click();
  //   document.body.removeChild(link);
  // }, []);

  const handleDownloadExcel = useCallback(() => {
    const arrTypesHeader = ['(texto) * obligatorio', '(texto)', '(2023-11-15)', '(Foto)', ...additionalTypesHeaders];
    const headers = [
      'Código de panel - Trazabilidad',
      'Descripción del panel',
      'Fecha de producción',
      'Foto del panel',
      ...additionalSchemaHeaders
    ];
    const colsWch: any[] = headers.map((element: string) => {
      return { wch: element.length + 6 };
    });
    downloadExcel('Plantilla', `plantilla_${name_product}.xlsx`, [arrTypesHeader, headers], colsWch);
    // saveAs(COMMUNITY_BASE_URL_S3 + 'Formulario de Prendas.xlsx');
  }, [additionalSchemaHeaders, additionalTypesHeaders, name_product]);

  const _getAttributesForm = useCallback((relation: AttributesRelation) => {
    const arrRelationValues = Object.values(relation?.attributes_relationship);
    getOrganizationFormV2(relation.gather_form_id)
      .then((res: any) => {
        const data = res.data.data;
        const schemaAttr = data.schema?.data;
        if (schemaAttr) {
          const arrHeadersTypes: string[] = [];
          const newSchema: string[] = schemaAttr
            .filter((element: any) => {
              //   if (element.id && ['Material del hilo',
              // 'Código de Color', 'Título del hilo'].includes(element?.name)) {
              //     return false;
              //   }
              if (element.id && element.attribute_type !== 'title') {
                return !arrRelationValues.includes(element.id);
              }
              return false;
            })
            .map((element: any) => {
              arrHeadersTypes.push(
                `(${typeAttributeHeader(element?.attribute_type ?? '', element?.possible_values ?? [])})`
              );
              return element?.name || '';
            });
          //   console.log(arrRelationValues);
          //   console.log(schemaAttr);
          //   console.log(arrHeadersTypes);
          setAdditionalSchemaHeaders(newSchema);
          setAdditionalTypesHeaders(arrHeadersTypes);
        }
        setIsLoadingForm(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar el formulario.', 'error', true);
        setIsLoadingForm(false);
      });
  }, []);

  const validateHeaders = (staticHeaders: any[], headers: any): boolean => {
    let isValid: boolean = true;
    for (let i = 0; i < staticHeaders.length; i++) {
      const staticHead = staticHeaders[i];
      if (staticHead !== headers[i]) {
        isValid = false;
      }
    }

    return isValid;
  };

  const handleValidateHeaders = useCallback(
    (newFile: File) => {
      if (isLoadingForm) {
        showMessage('', 'Se están cargando los campos espere por favor.', 'info');
        return;
      }
      // const isValid = true;
      const headers = [
        'Código de panel - Trazabilidad',
        'Descripción del panel',
        'Fecha de producción',
        'Foto del panel',
        ...additionalSchemaHeaders
      ];
      const arrTypesHeader = ['(texto) * obligatorio', '(texto)', '(2023-11-15)', '(Foto)', ...additionalTypesHeaders];

      if (newFile) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          if (jsonData && Array.isArray(jsonData) && jsonData.length > 0) {
            const [head, ...rest] = jsonData;
            const isTypesValid = validateHeaders(arrTypesHeader, head ?? []);
            const isHeadersValid = validateHeaders(headers, rest[0] ?? []);
            if (isTypesValid && isHeadersValid) {
              setCurrentFile(newFile);
            } else {
              showMessage(
                'No se subió el archivo',
                'El archivo no cumple con los campos necesarios, por favor usa la plantilla propuesta.',
                'warning'
              );
            }
          }
        };
        reader.readAsBinaryString(newFile);
      }
    },
    [additionalSchemaHeaders, additionalTypesHeaders, isLoadingForm]
  );

  useEffect(() => {
    if (attributes_relation && Array.isArray(attributes_relation)) {
      const relation = attributes_relation.find((element: any) => element?.entity_model_type === 'FabricInventories');
      if (relation && relation.gather_form_id) {
        _getAttributesForm(relation);
      }
    }
  }, [attributes_relation, _getAttributesForm]);

  return (
    <Dialog
      open={open}
      title={`Subir ${name_product}`}
      subtitle=""
      onClose={() => {
        closeAction();
      }}
      actions={
        <Box display="flex" justifyContent="space-between" width="100%">
          <CustomButton onClick={() => closeAction()} variant="outlined" disabled={isLoading} text="Cancelar" />
          <CustomButton
            onClick={() => {
              if (currentFile) handleLoadFile(currentFile);
            }}
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            disabled={isLoading || currentFile === undefined}
            text={`Subir ${name_product}`}
          />
        </Box>
      }
    >
      <Grid container={true} ref={isCompMounted}>
        <Grid container={true}>
          <Grid item={true} xs={2} sm={2} md={2} lg={2} xl={2}>
            <img
              src={ExcelIcon}
              alt="ExcelImage"
              style={{ background: theme.palette.primary.lighter, padding: '15px' }}
            />
          </Grid>
          <Grid item={true} xs={10} sm={10} md={10} lg={10} xl={10}>
            <Typography color="#2F3336" fontWeight={600}>
              REGISTRA LOS DATOS DE {`${name_product}`.toUpperCase()} DE FORMA MASIVA
            </Typography>
            <Typography color="#959595" my={1}>
              Descarga la plantilla para registrar tus {`${name_product}`.toLowerCase()}.
            </Typography>
            {isLoadingForm ? (
              <CircularProgress size={24} />
            ) : (
              <CustomButton
                sx={{ ml: '-8px' }}
                onClick={handleDownloadExcel}
                variant="outlined"
                text="Descargar plantilla"
                startIcon={<Icon>download</Icon>}
              />
            )}
          </Grid>
        </Grid>

        <Grid container={true} mt={3}>
          <Grid item={true} xs={2} sm={2} md={2} lg={2} xl={2}>
            <img
              src={DownloadIcon}
              alt="ExcelImage"
              style={{ background: theme.palette.primary.lighter, padding: '15px' }}
            />
          </Grid>
          <Grid item={true} xs={10} sm={10} md={10} lg={10} xl={10}>
            <Typography color="#2F3336" fontWeight={600} lineHeight="24px">
              SUBE EL ARCHIVO
            </Typography>
            <Typography color="#959595">
              Sigue las instrucciones que encontrarás en el Excel para subir tus {`${name_product}`.toLowerCase()} sin
              problema.
            </Typography>
            <Box mt={1} minHeight="200px">
              <UploadFileStatusComponent
                uploadFileStatus={uploadFileStatus}
                file={currentFile}
                onDropFile={(newFile: File) => {
                  handleValidateHeaders(newFile);
                  // setCurrentFile(newFile);
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default UploadMassiveLoadPanelsDialog;
