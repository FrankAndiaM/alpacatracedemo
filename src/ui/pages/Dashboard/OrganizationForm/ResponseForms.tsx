import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Grid,
  Paper,
  Box,
  Icon,
  // Button,
  // CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
// import { experimentalStyled as styled } from '@mui/material/styles';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
// import { restoreOrganizationForm } from '~services/organization/form';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
// import EmptyFormImg from '~ui/assets/img/empty_form.png';
// import { showMessage } from '~utils/Messages';
// import Button from '~atoms/Button/Button';
import FormDialog from './FormDialog';
import routes from '~routes/routes';
// import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
// import { es } from 'date-fns/locale';
// import { format, sub } from 'date-fns';
// import { formatToTimeZone } from 'date-fns-timezone';
// import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { useSelector } from 'react-redux';
import {
  getFormDataById,
  // listAllDownloadData,
  listAllFormData
} from '~services/organization/formsv2';
import { FilterDataForms } from '~models/organizationForm';
import FiltersResponseComponent from './FiltersComponents/FiltersResponseComponent';
import useDebounce from '~hooks/use_debounce';
import DateCell from '~ui/atoms/DateCell/DateCell';
import { useNavigate } from 'react-router-dom';
// import ActionsMenu from './actionsMenu';
// import { downloadExcel } from '~utils/downloadExcel';
// import moment from 'moment';
import ResponseDialog from './components/ResponseDialog';
import ReadMoreRoundedIcon from '@mui/icons-material/ReadMoreRounded';
import { useTheme } from '@mui/material/styles';
// import {
//   code_clothe,
//   code_clothe_response_panels,
//   code_clothe_response_yarns,
//   name_clothe,
//   name_clothe_response_panels,
//   name_clothe_response_yarns
// } from '~utils/RequiredIDs';

// function getChipStatus(color: string, bgColor: string, text: string): React.ReactNode {
//   return (
//     <>
//       <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
//         <Box
//           sx={{
//             height: '32px',
//             width: '96px',
//             backgroundColor: bgColor,
//             // backgroundColor: 'rgba(84, 214, 44, 0.16)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             padding: '1px 8px',
//             borderRadius: '6px'
//           }}
//         >
//           <Typography fontSize={12} color={color} fontWeight={700}>
//             {/* <Typography fontSize={12} color="#229A16" fontWeight={700}> */}
//             {text ?? ''}
//           </Typography>
//         </Box>
//       </Box>
//     </>
//   );
// }

type ResponseFormsProps = unknown;

// const getDataStatus = (status: string): string => {
//   let str = 'Completo';
//   if (status === 'PENDING') str = 'Pendiente';
//   if (status === 'UNFINISHED') str = 'Incompleto';
//   return str;
// };

// const ProductImgStyle = styled('img')(() => ({
//   top: 0,
//   width: 'auto',
//   height: 'auto',
//   objectFit: 'cover'
// }));

type SearchFilter = {
  text: string;
  searchType: string;
};
const ResponseForms: React.FC<ResponseFormsProps> = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  //   const [isFormRestoring, setIsFormRestoring] = useState<boolean>(false);
  const history = useNavigate();
  const theme = useTheme();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  // const [items, setItems] = useState<any[]>([]);
  const [showProductiveUnitColumn, setShowProductiveUnitColumn] = useState<boolean>(false);
  const { auth }: any = useSelector((state: any) => state);
  // const { code, fabric_inventories, name, yarns } = auth?.attributes_relation;
  const { organizationId } = auth?.organizationTheme;
  const [isRefresh] = useState<boolean>(true);
  const [resetPages, setResetPages] = useState<boolean>(true);
  const [searchTex, setSearchTex] = useState<SearchFilter>({
    text: '',
    searchType: 'all'
  });
  const debouncedValue = useDebounce<SearchFilter>(searchTex, 500);

  const [filters, setFilters] = useState<FilterDataForms>({
    owner_model_id: organizationId
  });

  const _paginateForms = useCallback(
    (page: number, per_page: number, sort_by: string, order: string) => {
      const newFilters = Object.assign({}, filters);
      newFilters.search_type = debouncedValue.searchType;
      return listAllFormData(page, per_page, sort_by, order, debouncedValue.text, newFilters);
    },
    [debouncedValue, filters]
  );

  const searchResponse = useCallback(
    (row: any, type: 'name' | 'code'): ReactNode => {
      const { data, gather_form } = row;
      if (auth?.organizationTheme?.attributes_relation && Array.isArray(auth?.organizationTheme?.attributes_relation)) {
        const relation = auth?.organizationTheme?.attributes_relation.find(
          (element: any) => element?.gather_form_id === gather_form?.id
        );
        if (relation) {
          const { code, name } = relation?.attributes_relationship;
          if (data && type === 'name') {
            const value = data[name];
            if (value) {
              return <>{value}</>;
            }
          }
          if (data && type === 'code') {
            const value = data[code];
            if (value) {
              return <>{value}</>;
            }
          }
        }
      }
      return <></>;
    },
    [auth?.organizationTheme?.attributes_relation]
  );

  const handleOnDialog = useCallback(() => {
    setIsDialogOpen((prevValue: boolean) => !prevValue);
  }, []);

  const handleResetPages = useCallback(() => {
    setResetPages((prev: boolean) => !prev);
  }, []);

  // const listAllOrganizationForm = useCallback(() => {
  //   setIsLoading(true);
  //   listAllFormData(filters)
  //     .then((res: any) => {
  //       const { items } = res?.data?.data;
  //       setItems(items);
  //       setIsLoading(false);
  //     })
  //     .catch((err: any) => {
  //       setIsLoading(false);
  //       const errorMessage = 'Problemas al cargar los formularios.';
  //       const data = err?.response?.data;
  //       if (data?.hasOwnProperty('error')) {
  //         showMessage('', data?.error?.message ?? errorMessage, 'error', true);
  //       } else {
  //         showMessage('', errorMessage, 'error', true);
  //       }
  //     });
  // }, [filters]);

  //   const handleRestoreOrganizationForm = useCallback(
  //     (row: any) => {
  //       showDeleteQuestion('ADVERTENCIA', 'Está seguro de restaurar el formulario', 'warning', false, [
  //         'Cancelar',
  //         'Restaurar'
  //       ]).then((response: any) => {
  //         if (response) {
  //           setIsFormRestoring(true);
  //           restoreForm(row.id)
  //             .then(() => {
  //               setIsFormRestoring(false);
  //               showMessage('', 'Formulario restaurado.', 'success');
  //               listAllOrganizationForm();
  //             })
  //             .catch(() => {
  //               setIsFormRestoring(false);
  //               showMessage('', 'Problemas al restaurar el Formulario.', 'error', true);
  //             });
  //         }
  //       });
  //     },
  //     [listAllOrganizationForm]
  //   );

  const handleApplyFilters = useCallback(
    (filters: FilterDataForms) => {
      setFilters(() => {
        handleResetPages();
        return filters;
      });
    },
    [handleResetPages]
  );
  // const [serchFilters, setSearchFilters] = useState<FilterDataForms | undefined>(undefined);
  const handleSearch = useCallback((value: any, typeSearch: string) => {
    // setFilters(filters);
    // setSearchFilters(filters);
    // console.log(value);
    setSearchTex({
      text: value,
      searchType: typeSearch
    });
  }, []);

  const handleViewDataOrganizationForm = useCallback(
    (row: any) => {
      history(
        `${routes.organizationForm}/${row.gather_form.id}/data?entry_entity_type=${
          row?.gather_form?.entry_entity_type ?? ''
        }`,
        { state: { module: 'Respuesta de formularios', selected: row.id ?? '' } }
      );
      // history.push(`${routes.organizationForm}/${row.id}/data`);
    },
    [history]
  );
  const [modalShowResponse, setModalShowResponse] = useState<boolean>(false);
  const [selectedFormDataValue, setSelectedFormDataValue] = useState<any | undefined>(undefined);

  const handleModalResponse = useCallback(() => {
    setModalShowResponse((prev: boolean) => !prev);
  }, []);

  const loadDataRowSelected = useCallback(
    (row: any) => {
      // setRowSelected(row);
      getFormDataById(row?.gather_form?.id ?? '', row?.id ?? '')
        .then((resp: any) => {
          setSelectedFormDataValue(() => {
            return { ...resp.data.data, farmer: row?.entry_actor ?? {}, agro_leader: row?.gatherer_actor ?? {} };
          });
          handleModalResponse();
        })
        .catch(() => {
          setSelectedFormDataValue(undefined);
        });
      // }
    },
    [handleModalResponse]
  );

  // const handleOpenViewDataForm = useCallback((row: any) => {
  //   console.log(row);
  //   // history.push(`${routes.organizationForm}/${row.id}/data`);
  // }, []);

  // const [isLoadingDownload, setIsLoadingDownload] = useState<boolean>(false);
  // const handleDownload = useCallback(() => {
  //   listAllDownloadData(filters)
  //     .then((resp: any) => {
  //       const { data } = resp.data;
  //       if (data?.length === 0) {
  //         showMessage('', 'No se encontraron registros con errores', 'warning', true);
  //         return;
  //       }
  //       setIsLoadingDownload(true);
  //       const colsWch: any[] = Array(5).fill({ wch: 24 });
  //       const headers: any[] = [
  //         'Nombre del formulario',
  //         'Nombre del agente',
  //         'Nombre del productor',
  //         'Fecha de creación',
  //         'Estado'
  //       ];
  //       const excelData: any[][] = data?.map((values: any) => {
  //         return [
  //           values?.gather_form?.name ?? '',
  //           values?.gatherer_actor?.full_name ?? '',
  //           values?.entry_actor?.full_name ?? '',
  //           moment(values?.created_at).format('DD/MM/YYYY'),
  //           getDataStatus(values?.form_fill_status)
  //         ];
  //       });
  //       downloadExcel('Respuestas', 'respuestas_de_formularios_por_filtros.xlsx', [headers, ...excelData], colsWch);
  //       setIsLoadingDownload(false);
  //     })
  //     .catch(() => {
  //       setIsLoadingDownload(false);
  //       showMessage('', 'Problemas al descargar los registros con errores', 'error', true);
  //     });
  // }, [filters]);

  const handleAllRows = useCallback((value: string) => {
    setFilters((prev: FilterDataForms) => {
      return { ...prev, search: '', search_type: value };
    });
  }, []);

  useEffect(() => {
    const _setHeaders: any = [
      {
        sorteable: false,
        align: 'left',
        text: 'Nombre',
        value: 'description',
        padding: 'none',
        isNotShowInHeader: true,
        render: (row: any) => (
          <>
            {searchResponse(row, 'name')}
            {/* {row?.gather_form?.entry_entity_type === 'PRODUCTIVE_UNIT'
              ? row?.entry_actor?.producer?.full_name ?? ''
              : row?.entry_actor?.full_name ?? ''} */}
          </>
        )
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Código',
        value: 'name',
        padding: 'none',
        render: (row: any) => <>{searchResponse(row, 'code')}</>
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Tipo de formulario',
        value: 'name',
        padding: 'none',
        render: (row: any) => <>{row?.gather_form?.name ?? ''}</>
      },
      // {
      //   sorteable: false,
      //   align: 'left',
      //   text: 'Nombre del agente',
      //   value: 'description',
      //   padding: 'none',
      //   isNotShowInHeader: true,
      //   render: (row: any) => <>{row?.gatherer_actor?.full_name ?? ''}</>
      // },

      // showProductiveUnitColumn && {
      //   sorteable: false,
      //   align: 'left',
      //   text: 'Nombre de unidad productiva',
      //   value: 'description',
      //   padding: 'none',
      //   isNotShowInHeader: true,
      //   render: (row: any) => <>{row?.entry_actor?.producer ? row?.entry_actor?.name ?? '' : '-'}</>
      // },
      //   {
      //     sorteable: false,
      //     align: 'left',
      //     text: 'Tipo de formulario',
      //     value: 'entry_entity_type',
      //     padding: 'none',
      //     render: (row: any) => <>{getFormType(row?.entry_entity_type ?? '')}</>
      //   },
      {
        sorteable: false,
        align: 'left',
        text: 'Fecha de creación',
        value: 'created_at',
        padding: 'none',
        isNotShowInHeader: true,
        render: (row: any) => <DateCell date={row?.created_at} />
      },
      //   {
      //     sorteable: false,
      //     align: 'left',
      //     text: 'Última fecha de actualización',
      //     value: 'updated_at',
      //     padding: 'none',
      //     isNotShowInHeader: true,
      //     render: (row: any) => <DateCell date={row?.updated_at} />
      //   },
      {
        sorteable: false,
        align: 'center',
        text: 'Acciones',
        value: '',
        render: (row: any) => {
          return (
            <>
              <Tooltip title={'Ver respuesta'}>
                <IconButton onClick={() => loadDataRowSelected(row)}>
                  <Icon sx={{ color: 'rgba(83, 100, 113, 1)' }}>visibility</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title={'Ver respuestas'}>
                <IconButton onClick={() => handleViewDataOrganizationForm(row)}>
                  <ReadMoreRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          );
        }
      }
    ];
    setHeaders(_setHeaders);
  }, [
    handleModalResponse,
    handleViewDataOrganizationForm,
    loadDataRowSelected,
    searchResponse,
    showProductiveUnitColumn
  ]);

  useEffect(() => {
    setFilters((prev: FilterDataForms) => {
      return { ...prev, search: debouncedValue.text, search_type: debouncedValue.searchType };
    });
  }, [debouncedValue]);

  useEffect(() => {
    if (
      (filters?.search_type && filters?.search_type === 'productive_unit') ||
      (filters?.form_type && filters?.form_type === 'PRODUCTIVE_UNIT')
    ) {
      setShowProductiveUnitColumn(true);
    } else {
      setShowProductiveUnitColumn(false);
    }
    // console.log(filters);
  }, [filters]);

  // useEffect(() => {
  //   listAllOrganizationForm();
  // }, [listAllOrganizationForm]);

  return (
    <>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box mb="20px">
            <Grid container>
              <Grid item={true} xs={12} sm={12} md={12} lg={6} xl={6}>
                <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
                  Respuesta de Formularios
                </Box>
                <Box>
                  <Breadcrumbs
                    breadcrumbs={[
                      {
                        path: routes.dashboard,
                        component: <Icon fontSize="small">home</Icon>
                      },
                      {
                        component: 'Formularios',
                        path: routes.organizationForm
                      },
                      {
                        component: 'Respuesta de Formularios'
                      }
                    ]}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {/* <Grid container spacing={2}>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box display="flex" justifyContent={'flex-end'} py={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDownload}
                endIcon={
                  isLoadingDownload ? (
                    <>
                      <CircularProgress size={'20'} />
                    </>
                  ) : (
                    <SaveAltOutlinedIcon />
                  )
                }
              >
                Descargar por filtros
              </Button>
            </Box>
          </Grid>
        </Grid> */}
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          {/* <LinearProgress loading={isFormRestoring} /> */}
          <Paper data-testid="Paper" elevation={3} style={{ padding: '20px' }}>
            <FiltersResponseComponent
              organizationId={organizationId}
              handleApplyFilters={handleApplyFilters}
              handleSearch={handleSearch}
              handleAllRows={handleAllRows}
            />
            <DataTable
              headers={headers}
              onLoad={_paginateForms}
              refresh={isRefresh}
              hideSearch={true}
              textNoItems={'No se encontraron resultados.'}
              resetPages={resetPages}
            />
          </Paper>
        </Grid>
      </Grid>
      {isDialogOpen && <FormDialog onClose={handleOnDialog} />}
      {modalShowResponse && (
        <ResponseDialog onClose={handleModalResponse} selectedFormDataValue={selectedFormDataValue} />
      )}
    </>
  );
};

export default ResponseForms;
