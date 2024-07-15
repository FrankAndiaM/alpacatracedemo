import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Paper, Box, Button, Icon, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { Farmer } from '~models/farmer';
import { DeleteFarmer } from '~services/farmer';
import { useNavigate } from 'react-router-dom';
import routes from '~routes/routes';
// import AddIcon from '@mui/icons-material/Add';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import ActionsMenu from '~ui/molecules/ActionsMenu/actionsMenu';
// import { createFarmer } from '~services/farmer';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import { format, sub } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import { useTheme } from '@mui/material/styles';
import { es } from 'date-fns/locale';
// import IconButton from '~ui/atoms/IconButton/IconButton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ListIcon from '@mui/icons-material/List';
// import { downloadProducersData } from '~services/massive_download_files';
// import { showMessage } from '~utils/Messages';
// import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import { useSelector } from 'react-redux';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

// import FiltersComponent from '../../FiltersComponent/FiltersComponent';
import useDebounce from '~hooks/use_debounce';
// import UploadMassiveLoadDialog from '../../pages/MassiveLoad/UploadMassiveLoadDialog';
import {
  AttributesRelation,
  AttributesRelationDefault,
  Clothe,
  // FabricInventory,
  FilterClothes
  // Yarn
} from '~models/clothes';
import ClothesDialog from '../../ClothesDialog';
import { createClothe, paginateYarns } from '~services/clothes';
import TextFieldSearch from '~ui/molecules/TextFieldSearch/TextFieldSearch';
import ListViewComponent from '~ui/organisms/ListViewComponent';
import CompositionComponent from '../components/compositionComponent';
import UploadMassiveLoadYarnsDialog from '../MassiveLoad/UploadMassiveLoadYarnsDialog';

const useStyles: any = makeStyles(() => ({
  buttonRootActive: {
    border: '1px solid #161C24',
    padding: '9px 30px',
    borderRadius: '24px',
    color: '#161C24',
    fontSize: '17px',
    fontWeight: 700,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  buttonRootDisabled: {
    border: '1px solid #919EAB',
    padding: '9px 30px',
    borderRadius: '24px',
    color: '#919EAB',
    fontSize: '17px',
    fontWeight: 700,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  customBadge: {
    backgroundColor: '#D84D44',
    color: '#FFFFFF',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '8px'
  },
  buttonValidate: {
    padding: '7px 25px',
    color: '#D84D44',
    fontSize: '14px',
    fontWeight: 600,
    border: '2px solid #D84D44',
    borderRadius: '21px',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  buttonStyle: {
    border: '0.8px solid var(--gray-200, #B9B9B9)',
    backgroundColor: 'white',
    borderRadius: '4px',
    color: '#2F3336',
    '&:hover': {
      border: '0.8px solid var(--gray-200, #B9B9B9)',
      backgroundColor: 'white',
      color: '#2F3336'
    },
    boxShadow: 'none'
  }
}));

const defaultFarmer = {
  first_name: '',
  last_name: '',
  dni: '',
  email: '',
  phone: '',
  certificacion_code: '',
  association_code: '',
  birthday_at: '',
  whatsapp_number: '',
  initial_farming_at: '',
  assigned_advisor_id: undefined,
  association_id: undefined,
  tags: [],
  assigned_advisor: undefined,
  association: undefined
};

const YarnsComponent = () => {
  const themes = useTheme();
  const classes = useStyles();
  const isActiveDesktop = useMediaQuery(themes.breakpoints.down('md'));
  const history = useNavigate();
  const { auth }: any = useSelector((state: any) => state);
  const NameProduct: string = auth?.organizationTheme?.name_product;
  const ShowProduct: boolean = auth?.organizationTheme?.show_product;
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  // eslint-disable-next-line
  const [farmer, setFarmer] = useState<Farmer>(defaultFarmer);
  const [isRefresh, setIsRefresh] = useState<boolean>(true);
  // const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isOpenClothesDialog, setIsOpenClothesDialog] = useState<boolean>(false);
  const [searchTex, setSearchTex] = useState<string>('');
  const debouncedValue = useDebounce<string>(searchTex, 500);
  const [filters] = useState<FilterClothes>({});
  const [view, setView] = useState<boolean>(true); //true = table -  false = card

  const [attributesRelation, setAttributesRelation] = useState<AttributesRelation>(AttributesRelationDefault);

  useEffect(() => {
    if (auth?.organizationTheme?.attributes_relation && Array.isArray(auth?.organizationTheme?.attributes_relation)) {
      const relation = auth?.organizationTheme?.attributes_relation.find(
        (element: any) => element?.entity_model_type === 'Clothes'
      );
      if (relation) {
        setAttributesRelation(relation);
      }
    }
  }, [auth?.organizationTheme?.attributes_relation]);

  const _paginateFarmers = useCallback(
    (page: number, per_page: number, sort_by: string, order: string) => {
      return paginateYarns(
        auth?.organizationTheme?.organizationId,
        '',
        page,
        per_page,
        sort_by,
        order,
        debouncedValue,
        filters
      );
    },
    [auth, debouncedValue, filters]
  );

  const refreshTable = useCallback(() => {
    setIsRefresh((prev: boolean) => !prev);
  }, []);

  const handleClothesDialog = useCallback(
    (update?: boolean) => {
      if (update) {
        refreshTable();
      }
      setIsOpenClothesDialog((prev: boolean) => !prev);
    },
    [refreshTable]
  );

  const handleView = useCallback(() => {
    setView((prev: boolean) => !prev);
  }, []);

  // const handleApplyFilters = useCallback((filters: FilterFarmer) => {
  //   setFilters(filters);
  // }, []);

  // const handleViewFarmer = useCallback(
  //   (clothe: Clothe) => {
  //     history(`${routes.clothes}/${clothe.id}`);
  //   },
  //   [history]
  // );

  const handleOpenTagDialog = useCallback((farmer: Farmer) => {
    setFarmer(farmer);
  }, []);

  const handleDeleteFarmer = useCallback((farmer: Farmer): Promise<any | undefined> => {
    return new Promise(async (resolve: any, reject: any) => {
      if (farmer.id) {
        DeleteFarmer(farmer.id)
          .then((res: any) => {
            const { message } = res.data.data;
            setIsRefresh((prevValue: boolean) => !prevValue);
            resolve(message);
          })
          .catch(() => {
            reject('Problemas al eliminar.');
          });
      } else {
        reject('Problemas al eliminar.');
      }
    });
  }, []);

  // const handleDialog = useCallback((isUpdateDataTable?: boolean) => {
  //   setIsOpenDialog((prevValue: boolean) => !prevValue);
  //   if (typeof isUpdateDataTable !== 'object' && isUpdateDataTable) {
  //     setIsRefresh((prevValue: boolean) => !prevValue);
  //   }
  // }, []);

  const handleSave = useCallback((farmer: Clothe) => {
    return createClothe(farmer);
  }, []);

  const handleSearch = useCallback((value: any) => {
    // console.log(value);
    setSearchTex(value);
  }, []);
  const handleSelect = useCallback(
    (element: any) => {
      history(`/dashboard/composition/${element?.id}/YARN`);
    },
    [history]
  );

  useEffect(() => {
    const _setHeaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Código',
        padding: 'none',
        value: 'code'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Última actualización',
        padding: 'none',
        value: 'created_at',
        isNotShowInHeader: true,
        render: (row: Farmer) => {
          if (row?.created_at !== undefined && row?.created_at !== null) {
            const updatedAt = sub(new Date(row?.created_at), { hours: 5 });
            return (
              <Box>
                {format(updatedAt, 'dd MMM yyyy', { locale: es })}
                <Box fontSize="12px" color="#9FA2B4">
                  {formatToTimeZone(row?.created_at, 'hh:mm aa', {
                    timeZone: 'America/Lima'
                  })}
                </Box>
              </Box>
            );
          }
        }
      },
      {
        sorteable: false,
        align: 'center',
        text: 'Acción',
        value: '',
        render: (row: Clothe) => {
          return (
            <Box display="flex" flexDirection="row" justifyContent="space-around">
              <Button variant="outlined" onClick={() => handleSelect(row)}>
                <VisibilityOutlinedIcon />
                &nbsp;&nbsp;Ver hilo
              </Button>
            </Box>
          );
        }
      }
    ];

    setHeaders(_setHeaders);
  }, [handleDeleteFarmer, classes, handleOpenTagDialog, handleSelect]);

  const handleOnChangeSearch = useCallback(
    (value: any) => {
      handleSearch(value);
    },
    [handleSearch]
  );

  const renderItem = useCallback(
    (data: any) => {
      return (
        <CompositionComponent isSelect={false} data={data} handleSelect={handleSelect} showAll={false} type="hilo" />
      );
    },
    [handleSelect]
  );

  return (
    <>
      <Grid container={true} spacing={1}>
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ display: 'flex', justifyContent: 'space-between' }}
          flexDirection={{ xs: 'column', md: 'row' }}
        >
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
                  marginBottom: '5px'
                }}
              >
                Hilos
              </div>
            </Box>
            <Box>
              <Breadcrumbs
                breadcrumbs={[
                  {
                    path: routes.dashboard,
                    component: <Icon fontSize="small">home</Icon>
                  },
                  {
                    component: 'Hilos'
                  }
                ]}
              />
            </Box>
          </Box>

          <Box display="flex" sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mr="10px">
              <Button
                variant="outlined"
                fullWidth
                onClick={() => refreshTable()}
                startIcon={<CachedRoundedIcon />}
                style={{ textTransform: 'inherit' }}
              >
                Actualizar
              </Button>
            </Box>
            {/* <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <ActionsMenu
                icon={
                  <Button
                    variant="contained"
                    style={{ background: '#536471', minWidth: '179px', boxShadow: 'none', textTransform: 'inherit' }}
                    startIcon={!isDownloading && <FileDownloadIcon />}
                    component="span"
                    disabled={isDownloading}
                  >
                    {isDownloading ? <CircularProgress size={25} /> : 'Descargar archivo'}
                  </Button>
                }
                listItems={[
                  {
                    onClick: () => handleDownloadProducersList('basic'),
                    icon: '',
                    text: 'Lista de productores'
                  },
                  {
                    onClick: () => handleDownloadProducersList('all'),
                    icon: '',
                    text: 'Información personal'
                  },
                  {
                    onClick: () => handleDownloadProducersList('productive_units'),
                    icon: '',
                    text: 'Unidades productivas'
                  }
                  // {
                  //   onClick: () => handleOpenLoadFileAdditionalData(),
                  //   icon: '',
                  //   text: 'Información personal'
                  // }
                ]}
              />
            </Box> */}
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          {/* <Paper elevation={2} style={{ padding: '0px', marginTop: '0px' }}> */}
          {/* <FiltersComponent handleApplyFilters={handleApplyFilters} handleSearch={handleSearch} /> */}
          <Box style={{ marginRight: '16px', backgroundColor: 'white' }} width={'100%'}>
            <TextFieldSearch onChange={handleOnChangeSearch} isAnimated={false} fullWidth size="small" />
          </Box>
          <Box mt={2}>
            {/* <Button variant="contained" startIcon={<ListIcon />} className={classes.buttonStyle}> */}
            <Button
              variant="contained"
              style={{
                background: '#F2994A',
                boxShadow: 'none',
                textTransform: 'inherit',
                marginLeft: '0px',
                marginTop: isActiveDesktop ? '8px' : 0
              }}
              startIcon={<Icon>arrow_upward</Icon>}
              fullWidth={isActiveDesktop}
              component="span"
              onClick={async () => {
                setIsOpenDialog(true);
              }}
            >
              Subir hilos
            </Button>
            <Button
              variant="contained"
              onClick={handleView}
              startIcon={!view ? <ListIcon /> : <ImageOutlinedIcon />}
              fullWidth={isActiveDesktop}
              className={classes.buttonStyle}
              style={{ marginLeft: isActiveDesktop ? '0px' : '16px', marginTop: isActiveDesktop ? '8px' : 0 }}
            >
              Ver como {!view ? 'lista' : 'imagen'}
            </Button>
          </Box>
          {/* </Paper> */}
          <>
            {view ? (
              <Paper elevation={2} style={{ padding: '20px', marginTop: '16px' }}>
                <DataTable
                  headers={headers}
                  stickyHeader={false}
                  onLoad={_paginateFarmers}
                  refresh={isRefresh}
                  isCollapsible={isActiveDesktop}
                  hideSearch={true}
                />
              </Paper>
            ) : (
              <Box mt={2}>
                <ListViewComponent
                  pagination={_paginateFarmers}
                  renderItem={renderItem}
                  rowsPerPage={10}
                  searchValue={debouncedValue}
                />
              </Box>
            )}
          </>
        </Grid>
      </Grid>
      {isOpenDialog && (
        <UploadMassiveLoadYarnsDialog
          open={isOpenDialog}
          closeAction={(refresh: boolean) => {
            setIsOpenDialog(false);
            if (refresh) {
              history(`${routes.clothesFileListLoaded}#2`);
            }
          }}
        />
      )}
      {isOpenClothesDialog && (
        <ClothesDialog
          open={true}
          organizationId={auth?.organizationTheme?.organizationId ?? ''}
          saveAction={handleSave}
          closeAction={handleClothesDialog}
          attributesRelation={attributesRelation}
          nameProduct={NameProduct}
          showProduct={ShowProduct}
        />
      )}
    </>
  );
};

export default React.memo(YarnsComponent);
