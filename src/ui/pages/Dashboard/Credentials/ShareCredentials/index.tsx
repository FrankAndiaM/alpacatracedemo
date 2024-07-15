import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Grid, Icon, Paper, Tooltip, IconButton } from '@mui/material';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
// import Button from '~atoms/Button/Button';
// import AddIcon from '@mui/icons-material/Add';
import DateCell from '~ui/atoms/DateCell/DateCell';
// import { useNavigate } from 'react-router-dom';
import { paginateShareDids } from '~services/share_credentials';
import ShareOptionsDialog from './components/ShareOptionsDialog';
import { ShareDidResponse } from './CredentialsSelection';
import QRComponent from '~ui/molecules/QRComponent';
import { saveAsBlob } from '~utils/downloadExcel';
import { showMessage } from '~utils/Messages';
import html2canvas from 'html2canvas';
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/material/styles';

type ShareCredentialsPageProps = unknown;

const ShareCredentialsPage: React.FC<ShareCredentialsPageProps> = () => {
  // const history = useNavigate();
  const theme = useTheme();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [refreshTable, setRefreshTable] = useState<boolean>(false);
  const [isOpenShareOptionsDialog, setIsOpenShareOptionsDialog] = useState<boolean>(false);
  const [didResponse, setDidResponse] = useState<ShareDidResponse | undefined>(undefined);
  const exportRef = useRef<HTMLDivElement>(null);

  const _paginateIssuedCredentials = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return paginateShareDids(page, per_page, sort_by, order, search);
    },
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRefreshTable = useCallback(() => {
    setRefreshTable((prev: boolean) => !prev);
  }, []);

  // const handleShareCredentials = useCallback(() => {
  //   history(routes.shareCredentialsSelection);
  // }, [history]);

  const handleIsOpenShareOptionsDialog = useCallback(() => {
    setIsOpenShareOptionsDialog((prev: boolean) => !prev);
  }, []);

  const handleShareOptionsDialog = useCallback(
    (row: any) => {
      const didShare: ShareDidResponse = {
        code: row.code ?? '',
        full_path: row.full_path ?? '',
        path: row.path ?? ''
      };
      setDidResponse(didShare);
      handleIsOpenShareOptionsDialog();
    },
    [handleIsOpenShareOptionsDialog]
  );

  const handleDownloadQR = useCallback(async (row: any) => {
    const didShare: ShareDidResponse = {
      code: row.code ?? '',
      full_path: row.full_path ?? '',
      path: row.path ?? ''
    };
    setDidResponse(didShare);
    if (exportRef.current) {
      try {
        exportRef.current.style.display = 'block';
        const canvas = await html2canvas(exportRef.current);
        const image = canvas.toDataURL('image/png', 1.0);
        saveAsBlob(image, `${row?.path ?? ''}`);
        exportRef.current.style.display = 'none';
      } catch (error) {
        showMessage('', 'Error intentar descargar el código qr, inténtelo nuevamente.', 'error', true);
      }
    }
  }, []);

  const getDaysFromDates = (end_date: Date) => {
    const difference = end_date.getTime() - new Date().getTime();
    const totalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return totalDays;
  };

  useEffect(() => {
    const _setheaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Nombre',
        value: 'name',
        padding: 'none'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Descripción',
        value: 'description',
        padding: 'none'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Fecha de creación',
        value: 'created_at',
        padding: 'none',
        render: (row: any) => <DateCell date={row?.created_at} />
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Vigencia',
        value: 'expiration_at',
        padding: 'none',
        render: (row: any) => {
          const numdays = getDaysFromDates(new Date(row?.expiration_at ?? ''));
          return (
            <>
              <Box
                sx={{
                  backgroundColor: numdays > 0 ? theme.palette.success.lighter : theme.palette.warning.lighter,
                  color: numdays > 0 ? theme.palette.success.dark : theme.palette.warning.dark,
                  maxWidth: '150px',
                  borderRadius: '22px',
                  height: '32px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 700
                }}
              >
                {numdays > 0 ? `${numdays} días` : 'Caducado'}
              </Box>
            </>
          );
        }
      },
      {
        sorteable: false,
        align: 'center',
        text: 'Acción',
        value: '',
        render: (row: any) => {
          const numdays = getDaysFromDates(new Date(row?.expiration_at ?? ''));
          return (
            <Box display="flex" justifyContent={'center'}>
              <Tooltip title="Compartir">
                <IconButton
                  component="span"
                  disabled={numdays <= 0}
                  size="small"
                  onClick={() => handleShareOptionsDialog(row)}
                >
                  <Icon>share</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  <Box style={{ zoom: 0.2 }}>
                    <Box width={'322px'} ref={exportRef} m={2} p={2} borderRadius="16px">
                      <div
                        style={{
                          padding: '16px',
                          border: '1px solid #000000',
                          borderRadius: '16px'
                        }}
                      >
                        <QRComponent value={`${row?.full_path ?? ''}`} />
                      </div>
                    </Box>
                  </Box>
                }
                placement={'right'}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 200 }}
              >
                <IconButton component="span" disabled={numdays <= 0} size="small" onClick={() => handleDownloadQR(row)}>
                  <Icon>download</Icon>
                </IconButton>
              </Tooltip>
            </Box>
          );
        }
      }
    ];
    setHeaders(_setheaders);
  }, [handleShareOptionsDialog, handleDownloadQR, theme.palette]);

  return (
    <>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box mb="20px">
            <Grid container>
              <Grid item={true} xs={12} sm={12} md={12} lg={6} xl={6}>
                <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
                  Certificados
                </Box>
                <Box>
                  <Breadcrumbs
                    breadcrumbs={[
                      {
                        path: routes.dashboard,
                        component: <Icon fontSize="small">home</Icon>
                      },
                      {
                        path: routes.credential,
                        component: 'Certificados'
                      },
                      {
                        component: 'Compartir certificados'
                      }
                    ]}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper data-testid="Paper" elevation={3} style={{ padding: '20px' }}>
            <DataTable
              headers={headers}
              headRightComponent={
                <>
                  {/* <Button
                    text="Compartir certificados"
                    onClick={handleShareCredentials}
                    variant="contained"
                    startIcon={<AddIcon />}
                  /> */}
                </>
              }
              onLoad={_paginateIssuedCredentials}
              refresh={refreshTable}
            />
          </Paper>
        </Grid>
      </Grid>
      {/* {
        // <div style={{ display: 'none' }}>

        <Box width={'290px'} ref={exportRef} m={2} p={2} borderRadius="16px">
          <div
            style={{
              padding: '16px',
              border: '1px solid',
              borderRadius: '16px'
            }}
          >
            <QRComponent value={`${didResponse?.full_path ?? ''}`} />
          </div>
        </Box>
        // </div>
      } */}
      {
        <ShareOptionsDialog
          open={isOpenShareOptionsDialog}
          didOptions={didResponse}
          onClose={handleIsOpenShareOptionsDialog}
        />
      }
    </>
  );
};

export default ShareCredentialsPage;
