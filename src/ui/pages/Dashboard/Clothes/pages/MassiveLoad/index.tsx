import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Box, Chip, Icon, Tooltip, IconButton, Paper, Button, Tab, useMediaQuery } from '@mui/material';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { useSelector } from 'react-redux';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { useNavigate } from 'react-router-dom';
import { capitalizeAllWords } from '~utils/Word';
import routes from '~routes/routes';
import { getMassiveLoadStatus } from './colorLabelStatus';
import { paginateMassiveLoadTransaction } from '~services/massive_load_clothes';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DateCell from '~ui/atoms/DateCell/DateCell';
import { useTheme } from '@mui/material/styles';
import UploadMassiveLoadDialog from './UploadMassiveLoadDialog';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import UploadMassiveLoadYarnsDialog from './UploadMassiveLoadYarnsDialog';
import TabsHash from '~ui/molecules/TabsHash';
import { paginateMassiveLoadYarnsTransaction } from '~services/massive_load_yarns';
import UploadMassiveLoadPanelsDialog from './UploadMassiveLoadPanelsDialog';
import { paginateMassiveLoadPanelsTransaction } from '~services/massive_load_panels';

type MassiveLoadProducersPageProps = any;

const MassiveLoadProducersPage: React.FC<MassiveLoadProducersPageProps> = () => {
  const history = useNavigate();
  const theme = useTheme();
  const isActiveDesktop = useMediaQuery(theme.breakpoints.down('md'));
  const {
    auth: {
      organizationTheme: { organizationId, name_product, show_product }
    }
  }: any = useSelector((state: any) => state);

  const NameProduct: string = name_product;
  const ShowProduct: boolean = show_product;
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isOpenYarnsDialog, setIsOpenYarnsDialog] = useState<boolean>(false);
  const [isOpenPanelsDialog, setIsOpenPanelsDialog] = useState<boolean>(false);
  const [refreshTable, setRefreshTable] = useState<boolean>(true);
  //1 = prendas nuevos
  //2 = hilos personal
  //3 = paneles
  const [currentShow, setCurrentShow] = useState<number>(1);

  const _paginateMassiveLoadTransaction = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return paginateMassiveLoadTransaction('ALL', page, per_page, sort_by, order, search, organizationId, 'Clothes');
    },
    [organizationId]
  );
  const _paginateMassiveLoadTransaction2 = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return paginateMassiveLoadYarnsTransaction(
        'ALL',
        page,
        per_page,
        sort_by,
        order,
        search,
        organizationId,
        'Yarns'
      );
    },
    [organizationId]
  );
  const _paginateMassiveLoadTransaction3 = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return paginateMassiveLoadPanelsTransaction(
        'ALL',
        page,
        per_page,
        sort_by,
        order,
        search,
        organizationId,
        'FabricInventories'
      );
    },
    [organizationId]
  );

  const handleChangeCurrentShow = useCallback((e: any, value: number) => {
    // if (value !== currentShow) {
    setCurrentShow(value);
    // setCurrentShow((prev: number) => {
    //   if (value !== prev) {
    //     return value;
    //     // setRefreshTable((prev: boolean) => !prev);
    //   }
    //   return prev;
    // });
    // }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshTable((prev: boolean) => !prev);
  }, []);

  const handleViewFileLoaded = useCallback(
    (fileLoaded: any) => {
      currentShow === 1 && history(`${routes.massiveLoadClothes}/${fileLoaded.id}`);
      currentShow === 2 && history(`${routes.massiveLoadYarns}/${fileLoaded.id}`);
      currentShow === 3 && history(`${routes.massiveLoadPanels}/${fileLoaded.id}`);
    },
    [currentShow, history]
  );

  useEffect(() => {
    const _setHeaders: any = [
      {
        sorteable: false,
        align: 'left',
        text: 'Subido por',
        value: 'user',
        minWidth: '140px',
        padding: 'none',
        render: (row: any) => {
          const userName = `${row?.user?.first_name ?? ''} ${row?.user?.last_name ?? ''}`;
          return <div>{capitalizeAllWords(userName)}</div>;
        }
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Archivo',
        padding: 'none',
        minWidth: '140px',
        value: 'file_name'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Fecha',
        padding: 'none',
        value: 'created_at',
        minWidth: '120px',
        render: (row: any) => {
          return <DateCell date={row?.created_at} />;
        }
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Exitosos',
        padding: 'none',
        value: 'status',
        render: (row: any) => {
          if (row?.status === 'PROCESSING') {
            const { labelText, colorText, colorBox } = getMassiveLoadStatus(row?.status ?? '');
            return (
              <Chip
                label={labelText}
                sx={{ width: { xs: '94px', md: '112px' }, background: colorBox, color: colorText }}
              />
            );
          }
          return (
            <Chip
              label={row?.successful_registers ?? 0}
              sx={{ width: { xs: '94px', md: '112px' }, background: '#DCFCE7', color: '#15803D' }}
            />
          );
        }
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Errores',
        padding: 'none',
        value: 'status',
        render: (row: any) => {
          if (row?.status === 'PROCESSING') {
            const { labelText, colorText, colorBox } = getMassiveLoadStatus(row?.status ?? '');
            return (
              <Chip
                label={labelText}
                sx={{ width: { xs: '94px', md: '112px' }, background: colorBox, color: colorText }}
              />
            );
          }
          return (
            <Chip
              label={row?.failed_registers ?? 0}
              sx={{ width: { xs: '94px', md: '112px' }, background: '#FEE2E2', color: '#B91C1C' }}
            />
          );
        }
      },
      {
        sorteable: false,
        align: 'center',
        text: 'Acción',
        value: '',
        render: (row: any) => {
          return (
            <Tooltip title="Ver lista" arrow>
              <IconButton aria-label="view" onClick={() => handleViewFileLoaded(row)}>
                <RemoveRedEyeOutlinedIcon sx={{ color: '#212B36' }} fontSize="inherit" />
              </IconButton>
            </Tooltip>
          );
        }
      }
    ];
    setHeaders(_setHeaders ? _setHeaders : []);
  }, [handleViewFileLoaded]);

  return (
    <>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box style={{ marginBottom: '20px' }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box color={theme.palette.primary.main} mb="5px" mr="10px" fontSize="1.7em" fontWeight={400}>
                Subida masiva
              </Box>
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
                    component: 'Subida masiva'
                  }
                ]}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="flex-end"
            mb={2}
          >
            <Button
              variant="outlined"
              onClick={() => handleRefresh()}
              fullWidth={isActiveDesktop}
              startIcon={<CachedRoundedIcon />}
              style={{ textTransform: 'inherit' }}
            >
              Actualizar
            </Button>
            {isActiveDesktop && currentShow === 1 && (
              <Button
                variant="contained"
                style={{
                  background: '#F2994A',
                  boxShadow: 'none',
                  textTransform: 'inherit',
                  marginTop: '8px'
                  // marginLeft: isActiveDesktop ? '8px' : '16px',
                  // marginTop: isActiveDesktop ? '8px' : 0
                }}
                fullWidth
                startIcon={<Icon>arrow_upward</Icon>}
                component="span"
                onClick={async () => {
                  setIsOpenDialog(true);
                }}
              >
                Subir prendas
              </Button>
            )}
            {isActiveDesktop && currentShow === 2 && (
              <Button
                variant="contained"
                style={{
                  background: '#F2994A',
                  boxShadow: 'none',
                  textTransform: 'inherit',
                  marginTop: '8px'
                  // marginLeft: isActiveDesktop ? '8px' : '16px',
                  // marginTop: isActiveDesktop ? '8px' : 0
                }}
                fullWidth
                startIcon={<Icon>arrow_upward</Icon>}
                component="span"
                onClick={async () => {
                  setIsOpenYarnsDialog(true);
                }}
              >
                Subir hilos
              </Button>
            )}
            {isActiveDesktop && currentShow === 3 && (
              <Button
                variant="contained"
                style={{
                  background: '#F2994A',
                  boxShadow: 'none',
                  textTransform: 'inherit',
                  marginTop: '8px'
                  // marginLeft: isActiveDesktop ? '8px' : '16px',
                  // marginTop: isActiveDesktop ? '8px' : 0
                }}
                fullWidth
                startIcon={<Icon>arrow_upward</Icon>}
                component="span"
                onClick={async () => {
                  setIsOpenPanelsDialog(true);
                }}
              >
                Subir {NameProduct}
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TabsHash
            value={currentShow}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeCurrentShow}
          >
            <Tab
              disableRipple
              value={1}
              icon={<DescriptionOutlinedIcon />}
              label="Subida de prendas"
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
            <Tab
              disableRipple
              value={2}
              icon={<DescriptionOutlinedIcon />}
              label="Subida de hilos"
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
            {ShowProduct && (
              <Tab
                disableRipple
                value={3}
                icon={<DescriptionOutlinedIcon />}
                label={`Subida de ${NameProduct}`}
                iconPosition="start"
                sx={{ textTransform: 'none' }}
              />
            )}
          </TabsHash>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper elevation={2} style={{ padding: '20px' }}>
            {currentShow === 1 && (
              <DataTable
                headLeftComponent={
                  <>
                    {!isActiveDesktop && (
                      <Button
                        variant="contained"
                        style={{
                          background: '#F2994A',
                          boxShadow: 'none',
                          textTransform: 'inherit'
                          // marginLeft: isActiveDesktop ? '8px' : '16px',
                          // marginTop: isActiveDesktop ? '8px' : 0
                        }}
                        startIcon={<Icon>arrow_upward</Icon>}
                        component="span"
                        onClick={async () => {
                          setIsOpenDialog(true);
                        }}
                      >
                        Subir prendas
                      </Button>
                    )}
                  </>
                }
                headers={headers}
                refresh={refreshTable}
                onLoad={_paginateMassiveLoadTransaction}
              />
            )}
            {currentShow === 2 && (
              <DataTable
                headLeftComponent={
                  <>
                    {!isActiveDesktop && (
                      <Button
                        variant="contained"
                        style={{
                          background: '#F2994A',
                          boxShadow: 'none',
                          textTransform: 'inherit'
                          // marginLeft: isActiveDesktop ? '8px' : '16px',
                          // marginTop: isActiveDesktop ? '8px' : 0
                        }}
                        startIcon={<Icon>arrow_upward</Icon>}
                        component="span"
                        onClick={async () => {
                          setIsOpenYarnsDialog(true);
                        }}
                      >
                        Subir hilos
                      </Button>
                    )}
                  </>
                }
                headers={headers}
                refresh={refreshTable}
                onLoad={_paginateMassiveLoadTransaction2}
              />
            )}
            {currentShow === 3 && (
              <DataTable
                headLeftComponent={
                  <>
                    {!isActiveDesktop && (
                      <Button
                        variant="contained"
                        style={{
                          background: '#F2994A',
                          boxShadow: 'none',
                          textTransform: 'inherit'
                          // marginLeft: isActiveDesktop ? '8px' : '16px',
                          // marginTop: isActiveDesktop ? '8px' : 0
                        }}
                        startIcon={<Icon>arrow_upward</Icon>}
                        component="span"
                        onClick={async () => {
                          setIsOpenPanelsDialog(true);
                        }}
                      >
                        Subir {NameProduct}
                      </Button>
                    )}
                  </>
                }
                headers={headers}
                refresh={refreshTable}
                onLoad={_paginateMassiveLoadTransaction3}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
      {isOpenDialog && (
        <UploadMassiveLoadDialog
          open={isOpenDialog}
          closeAction={(refresh: boolean) => {
            setIsOpenDialog(false);
            if (refresh) {
              handleRefresh();
            }
          }}
        />
      )}
      {isOpenYarnsDialog && (
        <UploadMassiveLoadYarnsDialog
          open={isOpenYarnsDialog}
          closeAction={(refresh: boolean) => {
            setIsOpenYarnsDialog(false);
            if (refresh) {
              handleRefresh();
            }
          }}
        />
      )}
      {isOpenPanelsDialog && (
        <UploadMassiveLoadPanelsDialog
          open={isOpenPanelsDialog}
          closeAction={(refresh: boolean) => {
            setIsOpenPanelsDialog(false);
            if (refresh) {
              handleRefresh();
            }
          }}
        />
      )}
    </>
  );
};

export default MassiveLoadProducersPage;
