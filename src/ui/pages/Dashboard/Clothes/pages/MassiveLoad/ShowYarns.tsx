import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Box, Paper, Icon, Chip, Button as ButtonMat } from '@mui/material';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { useSelector } from 'react-redux';
import {
  // useNavigate
  useParams
} from 'react-router-dom';
import routes from '~routes/routes';
import { downloadErrorRecords } from '~services/massive_load_clothes';
import { getMassiveLoadStatus } from './colorLabelStatus';
import SelectField from '~ui/atoms/SelectField/SelectField';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import Button from '~atoms/Button/Button';
import { showMessage } from '~utils/Messages';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTheme } from '@mui/material/styles';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import { paginateIndividualRegisterYarnsTransaction } from '~services/massive_load_yarns';
import { format, sub } from 'date-fns';
import { es } from 'date-fns/locale';

type ShowMassiveLoadYarnsProps = any;

const statusItems = [
  {
    id: 'ALL',
    description: 'Todos'
  },
  {
    id: 'PROCESSING',
    description: 'Procesando'
  },
  {
    id: 'SUCCESSFUL',
    description: 'Registro Validado'
  },
  {
    id: 'ERROR',
    description: 'Error en el registro'
  }
];

export type CollapseField = {
  display_name: string;
  value: string;
};

export type TableCollapseFields = {
  defaultValues: CollapseField[];
  additionalValues: CollapseField[];
};

const ShowMassiveLoadYarns: React.FC<ShowMassiveLoadYarnsProps> = () => {
  const {
    auth: {
      organizationTheme: { organizationId }
    }
  }: any = useSelector((state: any) => state);
  const theme = useTheme();
  //   const history = useNavigate();
  const { file_loaded_id } = useParams();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [statusSelected, setStatusSelected] = useState<string>('ALL');
  const [isDownloadFileLoading, setIsDownloadFileLoading] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(true);

  const handleRefresh = useCallback(() => {
    setRefreshTable((prev: boolean) => !prev);
  }, []);

  const _paginateIndividualRegisterTransaction = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return paginateIndividualRegisterYarnsTransaction(
        file_loaded_id ?? '',
        page,
        per_page,
        sort_by,
        order,
        search,
        statusSelected,
        organizationId,
        'Yarns'
      );
    },
    [file_loaded_id, statusSelected, organizationId]
  );

  const saveAs = useCallback((url: string) => {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = 'download';
    link.href = url;
    link.download = 'archivo.xlsx';
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleOnDownloadRequest = useCallback(() => {
    setIsDownloadFileLoading(true);
    downloadErrorRecords({
      action: 'generate',
      organization_id: organizationId,
      massive_load_id: `${file_loaded_id}`,
      entity: 'Yarns'
    })
      .then((res: any) => {
        const data = res?.data;

        switch (data?.file_status) {
          case 'completed':
            setIsDownloadFileLoading(false);
            saveAs(COMMUNITY_BASE_URL_S3 + data?.file_path);
            break;
          case 'processing':
            const interval = setInterval(() => {
              downloadErrorRecords({
                action: 'get_result',
                organization_id: organizationId,
                massive_load_id: `${file_loaded_id}`,
                entity: 'Yarns'
              })
                .then((res: any) => {
                  const data = res?.data;

                  switch (data?.file_status) {
                    case 'processing':
                      break;
                    case 'completed':
                      setIsDownloadFileLoading(false);
                      clearInterval(interval);
                      saveAs(COMMUNITY_BASE_URL_S3 + data?.file_path);
                      break;
                    default:
                      setIsDownloadFileLoading(false);
                      clearInterval(interval);
                      showMessage('', 'Problemas al descargar el archivo.', 'error', true);
                      break;
                  }
                })
                .catch((err: any) => {
                  setIsDownloadFileLoading(false);
                  clearInterval(interval);
                  const data = err?.response?.data;

                  if (data?.hasOwnProperty('message')) {
                    showMessage('', data?.message ?? '', 'error', true);
                    return;
                  }
                  showMessage('', 'Problemas al descargar el archivo.', 'error', true);
                });
            }, 2000);
            return;
          default:
            setIsDownloadFileLoading(false);

            showMessage('', 'Problemas al descargar el archivo.', 'error', true);
            break;
        }
      })
      .catch((err: any) => {
        setIsDownloadFileLoading(false);
        const data = err?.response?.data;
        if (data?.hasOwnProperty('message')) {
          showMessage('', data?.message ?? '', 'error', true);
          return;
        }
        showMessage('', 'Problemas al descargar el archivo.', 'error', true);
      });
  }, [file_loaded_id, organizationId, saveAs]);

  useEffect(() => {
    const _setHeaders: any = [
      {
        sorteable: false,
        align: 'left',
        text: 'Código',
        padding: 'none',
        value: 'code'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Fecha de actualización',
        padding: 'none',
        value: 'updated_at',
        render: (row: any) => {
          if (row?.updated_at !== undefined && row?.updated_at !== null) {
            const updatedAt = sub(new Date(row?.updated_at), { hours: -5 });
            return (
              <Box>
                {format(updatedAt, 'dd MMM yyyy', { locale: es })}
                {/* <Box fontSize="12px" color="#9FA2B4">
                  {formatToTimeZone(row?.updated_at, 'hh:mm aa', {
                    timeZone: 'America/Lima'
                  })}
                </Box> */}
              </Box>
            );
          }
        }
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Estado',
        padding: 'none',
        value: 'status',
        render: (row: any) => {
          const { labelText, colorText, colorBox } = getMassiveLoadStatus(row?.status ?? '');
          return <Chip label={labelText} style={{ background: colorBox, color: colorText }} />;
        }
      }
    ];
    setHeaders(_setHeaders ? _setHeaders : []);
  }, []);

  return (
    <>
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box style={{ marginBottom: '20px' }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '10px',
                  fontSize: '1.7em',
                  fontWeight: 400,
                  color: theme.palette.primary.main,
                  marginBottom: '5px'
                }}
              >
                Archivos subidos
              </div>
            </Box>
            <Box>
              <Breadcrumbs
                breadcrumbs={[
                  {
                    path: routes.dashboard,
                    component: <Icon fontSize="small">home</Icon>
                  },
                  // {
                  //   path: routes.profit,
                  //   component: 'Utilidad'
                  // },
                  {
                    path: `${routes.clothesFileListLoaded}#2`,
                    // onClick: () => {
                    //   history(-1);
                    // },
                    component: 'Archivos subidos'
                  }
                ]}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box
            display="flex"
            justifyContent={'space-between'}
            sx={{ flexDirection: { xs: 'column', md: 'row' } }}
            my={3}
          >
            <Box width={{ sx: '100%', md: '200px' }} m={1}>
              <SelectField
                id="status"
                name="status"
                label="Estados"
                items={statusItems}
                value={statusSelected}
                itemValue="id"
                itemText="description"
                onChange={(_: any, value: any) => {
                  setStatusSelected(value);
                }}
              />
            </Box>
            <Box
              display={'flex'}
              alignItems="center"
              sx={{ flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' } }}
            >
              <Box display="flex" alignItems="center" justifyContent="flex-end" m={1}>
                <ButtonMat
                  variant="outlined"
                  onClick={() => handleRefresh()}
                  startIcon={<CachedRoundedIcon />}
                  style={{ textTransform: 'inherit' }}
                >
                  Actualizar
                </ButtonMat>
              </Box>
              <Button
                text="Excel de registros fallidos"
                sx={{
                  // backgroundColor: '#D84D44',
                  // borderRadius: '24px',
                  boxShadow: 'none'
                  // padding: '12px 24px'
                  // '&: hover': {
                  //   backgroundColor: '#D84D44'
                  // }
                }}
                variant="contained"
                onClick={handleOnDownloadRequest}
                isLoading={isDownloadFileLoading}
                disabled={isDownloadFileLoading}
                startIcon={<FileDownloadIcon />}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper elevation={2} style={{ padding: '20px' }}>
            <Grid container={true}>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <DataTable
                  headers={headers}
                  refresh={refreshTable}
                  hideSearch
                  onLoad={_paginateIndividualRegisterTransaction}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ShowMassiveLoadYarns;
