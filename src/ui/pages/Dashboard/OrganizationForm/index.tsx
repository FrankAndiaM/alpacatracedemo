import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Box, Icon, Tooltip, IconButton } from '@mui/material';
// import { Button as MatButton } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
// import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import {
  archiveForm,
  deleteForm,
  duplicateForm,
  // listDownloadForms,
  listOrganizationForm
} from '~services/organization/formsv2';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
// import EmptyFormImg from '~ui/assets/img/empty_form.png';
import { useNavigate } from 'react-router-dom';
import { showDeleteQuestion, showMessage, showYesNoQuestion } from '~utils/Messages';
// import DateCell from '~atoms/DateCell/DateCell';
// import Button from '~atoms/Button/Button';
import FormDialog from './FormDialog';
import routes from '~routes/routes';
// import { es } from 'date-fns/locale';
// import { format } from 'date-fns';
// import { formatToTimeZone } from 'date-fns-timezone';
// import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
// import ActionsMenu from './actionsMenu';
// import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
// import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import swal from 'sweetalert';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
// import FiltersComponent from './FiltersComponents/FiltersComponent';
import { FilterForms } from '~models/organizationForm';
import useDebounce from '~hooks/use_debounce';
// import moment from 'moment';
// import { downloadExcel } from '~utils/downloadExcel';

// const getFormType = (entry_entity_type: string): string => {
//   let type = 'General';
//   if (entry_entity_type === 'FREE') type = 'Organización';
//   if (entry_entity_type === 'PRODUCTIVE_UNIT') type = 'Unidad productiva';
//   return type;
// };

const useStyles: any = makeStyles(() => ({
  modalStyles: {
    '& .swal-title': {
      fontWeight: 700,
      color: '#000000'
    },
    '& .swal-text': {
      textAlign: 'center'
    },
    '& .swal-footer': {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '16px',
      '& .swal-button-container': {
        '& .cancelStyle': {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          border: '1px solid #000000',
          '&:hover': {
            backgroundColor: '#FFFFFF',
            color: '#000000'
          }
        },
        '& .confirmStyle': {
          backgroundColor: '#00955b',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#00955b',
            color: '#FFFFFF'
          }
        }
      }
    }
  }
}));

type FormComponentProps = unknown;

// const ProductImgStyle = styled('img')(() => ({
//   top: 0,
//   width: 'auto',
//   height: 'auto',
//   objectFit: 'cover'
// }));

const FormComponent: React.FC<FormComponentProps> = () => {
  const themes = useTheme();
  const isActiveDesktop = useMediaQuery(themes.breakpoints.down('md'));
  const classes = useStyles();
  const history = useNavigate();
  const { auth }: any = useSelector((state: any) => state);

  const ShowProduct: boolean = auth?.organizationTheme?.show_product;
  const relation = auth?.organizationTheme?.attributes_relation.find(
    (element: any) => element?.entity_model_type === 'FabricInventories'
  );
  const elements: string[] = [];
  if (relation) {
    elements.push(relation.gather_form_id ?? '');
    // setElementsFilterTable(elements);
  }
  const { organizationId } = auth?.organizationTheme;

  const [elementsFilterTable] = useState<string[]>(elements ?? []);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  // const [headersArchive, setHeadersArchive] = useState<TableHeadColumn[]>([]);
  // const [items, setItems] = useState<any[]>([]);
  const [searchTex] = useState<string>('');
  const debouncedValue = useDebounce<string>(searchTex, 500);
  const [isRefresh, setIsRefresh] = useState<boolean>(true);

  const [filters] = useState<FilterForms>({
    owner_model_id: organizationId,
    is_active: true,
    archived_at: false,
    form_type: 'ALL',
    search: '',
    status: 'all'
  });

  const refreshTable = useCallback(() => {
    setIsRefresh((prev: boolean) => !prev);
  }, []);

  const handleOnDialog = useCallback(() => {
    setIsDialogOpen((prevValue: boolean) => !prevValue);
  }, []);

  const handleEditOrganizationForm = useCallback(
    (row: any) => {
      history(`${routes.organizationForm}/${row.id}`);
    },
    [history]
  );

  const _paginateForms = useCallback(
    (page: number, per_page: number, sort_by: string, order: string) => {
      return listOrganizationForm(page, per_page, sort_by, order, debouncedValue, filters);
    },
    [debouncedValue, filters]
  );

  // const handleDownload = useCallback(() => {
  //   listDownloadForms(filters)
  //     .then((resp: any) => {
  //       const { data } = resp.data;
  //       if (data?.length === 0) {
  //         showMessage('', 'No se encontraron registros con errores', 'warning', true);
  //         return;
  //       }
  //       setIsLoadingDownload(true);
  //       const colsWch: any[] = Array(6).fill({ wch: 24 });
  //       const headers: any[] = [
  //         'Nombre del formulario',
  //         'Tipo del formulario',
  //         'Descripción',
  //         'Fecha de creación',
  //         'Última fecha de actualización',
  //         'Estado'
  //       ];
  //       const excelData: any[][] = data?.map((values: any) => {
  //         return [
  //           values?.name ?? '',
  //           getFormType(values?.entry_entity_type ?? ''),
  //           values?.description ?? '',
  //           moment(values?.created_at).format('DD/MM/YYYY'),
  //           moment(values?.updated_at).format('DD/MM/YYYY'),
  //           values?.is_editable ? 'Editable' : 'No editable'
  //         ];
  //       });
  //       downloadExcel('Formularios', 'platillas_de_formularios.xlsx', [headers, ...excelData], colsWch);
  //       setIsLoadingDownload(false);
  //     })
  //     .catch(() => {
  //       setIsLoadingDownload(false);
  //       showMessage('', 'Problemas al descargar los registros con errores', 'error', true);
  //     });
  // }, [filters]);

  // const listAllOrganizationForm = useCallback(() => {
  // setIsLoading(true);
  // setItems([]);
  // listOrganizationForm(filters)
  //   .then((res: any) => {
  //     setItems(res.data.data.items);
  //     setIsLoading(false);
  //   })
  //   .catch((err: any) => {
  //     setIsLoading(false);
  //     const errorMessage = 'Problemas al cargar los formularios.';
  //     const data = err?.response?.data;
  //     if (data?.hasOwnProperty('error')) {
  //       showMessage('', data?.error?.message ?? errorMessage, 'error', true);
  //     } else {
  //       showMessage('', errorMessage, 'error', true);
  //     }
  //   });
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleRemoveOrganizationForm = useCallback(
    (row: any) => {
      showDeleteQuestion('¿Seguro que quieres eliminar el formulario?', 'Esta acción no se puede deshacer.').then(
        (response: any) => {
          if (response) {
            deleteForm(row.id)
              .then(() => {
                showMessage('', 'Formulario eliminado.', 'success');
                // listAllOrganizationForm();
                refreshTable();
              })
              .catch(() => {
                showMessage('', 'Problemas al eliminar el Formulario.', 'error', true);
              });
          }
        }
      );
    },
    [refreshTable]
  );

  const handleArchivateOrganizationForm = useCallback(
    (row: any) => {
      // const title = row.is_archived ? 'Mostrar formulario' : 'Archivar formulario';
      const description = row.archived_at
        ? 'Este formulario se mostrará en la lista principal de formularios y será visible en el app.'
        : 'Este formulario será archivado y ya no estará visible en la lista de formularios activos en el app. No te preocupes, podrás acceder a él en cualquier momento en la vista de formularios archivados si lo necesitas en el futuro. ¿Estas seguro de archivar este formulario? ';
      // const question = '¿Estas seguro de archivar este formulario?';
      const actionString = row.archived_at ? 'Mostrar formulario' : 'Archivar';
      const title = row.archived_at ? 'Mostrar formulario' : 'Estas a punto de archivar un formulario';

      // showDeleteQuestion(title, description, 'info', false, ['Cancelar', actionString])

      swal({
        title: title,
        text: description,
        buttons: {
          cancel: {
            text: 'Cancelar',
            closeModal: true,
            value: 'cancel',
            visible: true,
            className: 'cancelStyle'
          },
          confirm: {
            text: actionString,
            className: 'confirmStyle'
          }
        },
        className: classes.modalStyles
      }).then((response: any) => {
        if (response !== 'cancel') {
          // console.log()
          if (row.archived_at) {
            archiveForm(row.id, false)
              .then(() => {
                showMessage('', 'Se restauró el formulario.', 'success');
                refreshTable();
                // setEntryType(row.entry_entity_type);
                // setShowTable(1);
                // listAllOrganizationForm();
              })
              .catch(() => {
                showMessage('', 'Problemas al restaurar el Formulario.', 'error', true);
              });
          } else {
            archiveForm(row.id, true)
              .then(() => {
                // setShowTable(2);
                // setEntryType('all');
                showMessage('', '¡Muy bien el formulario ha sido archivado!', 'success');
                refreshTable();
                // listAllOrganizationForm();
              })
              .catch(() => {
                showMessage('', 'Problemas al archivar el Formulario.', 'error', true);
              });
          }
        }
      });
    },
    [classes, refreshTable]
  );

  const handleDuplicateOrganizationForm = useCallback(
    (row: any) => {
      showYesNoQuestion('', '¿Está seguro de duplicar el formulario?').then((response: any) => {
        if (response) {
          duplicateForm(row.id)
            .then(() => {
              showMessage('', 'Formulario duplicado.', 'success');
              // listAllOrganizationForm();
              refreshTable();
            })
            .catch(() => {
              showMessage('', 'Problemas al duplicar el Formulario.', 'error', true);
            });
        }
      });
    },
    [refreshTable]
  );

  const handleViewDataOrganizationForm = useCallback(
    (row: any) => {
      history(`${routes.organizationForm}/${row.id}/data?entry_entity_type=${row.entry_entity_type}`);
      // history.push(`${routes.organizationForm}/${row.id}/data`);
    },
    [history]
  );

  // const handleApplyFilters = useCallback((filters: FilterForms) => {
  //   setFilters(filters);
  // }, []);

  // const handleSearch = useCallback((value: any) => {
  //   // console.log(value);
  //   setSearchTex(value);
  // }, []);

  useEffect(() => {
    const _setHeaders: any = [
      {
        sorteable: false,
        align: 'left',
        text: 'Tipo de formulario',
        value: 'name',
        padding: 'none'
      },
      // {
      //   sorteable: false,
      //   align: 'left',
      //   text: 'Tipo de formulario',
      //   value: 'entry_entity_type',
      //   padding: 'none',
      //   render: (row: any) => <>{getFormType(row?.entry_entity_type ?? '')}</>
      // },
      {
        sorteable: false,
        align: 'left',
        text: 'Descripción',
        value: 'description',
        padding: 'none',
        isNotShowInHeader: true
      },
      {
        sorteable: false,
        align: 'center',
        text: 'Acciones',
        value: '',
        render: (row: any) => {
          return (
            <>
              <Tooltip title={'Ver formulario'}>
                <IconButton onClick={() => handleViewDataOrganizationForm(row)}>
                  <Icon sx={{ color: 'rgba(83, 100, 113, 1)' }}>visibility</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title={'Editar formulario'}>
                <IconButton onClick={() => handleEditOrganizationForm(row)}>
                  <Icon sx={{ color: 'rgba(83, 100, 113, 1)' }}>edit</Icon>
                </IconButton>
              </Tooltip>
            </>
            // {
            //   onClick: () => {
            //     // if (row?.entry_entity_type === 'FREE') {
            //     //   handleViewDataOrganizationForm(row, 'general');
            //     //   return;
            //     // }
            //     handleViewDataOrganizationForm(row);
            //   },
            //   icon: <Icon sx={{ color: '#67AE1C' }}>visibility</Icon>,
            //   text: 'Ver respuestas'
            // }
          );
        }
      }
    ];

    setHeaders(_setHeaders);
  }, [
    handleEditOrganizationForm,
    handleViewDataOrganizationForm,
    handleRemoveOrganizationForm,
    handleDuplicateOrganizationForm,
    handleArchivateOrganizationForm
  ]);

  // const handleChangeShowTable = useCallback(
  //   (e: any, newValue: number) => {
  //     if (newValue !== showTable) {
  //       setShowTable(newValue);
  //       setFilters((prev: FilterForms) => {
  //         return { ...prev, archived_at: newValue === 2 };
  //       });
  //       refreshTable();
  //     }
  //   },
  //   [showTable, refreshTable]
  // );

  // useEffect(() => {
  //   setFilters((prev: FilterForms) => {
  //     return { ...prev, search: debouncedValue };
  //   });
  // }, [debouncedValue]);

  // useEffect(() => {
  //   refreshTable();
  // }, [showTable]);

  return (
    <>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box mb="20px">
            <Grid container>
              <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
                <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={themes.palette.primary.main}>
                  Formularios
                </Box>
                <Box>
                  <Breadcrumbs
                    breadcrumbs={[
                      {
                        path: routes.dashboard,
                        component: <Icon fontSize="small">home</Icon>
                      },
                      {
                        component: 'Formularios '
                      }
                    ]}
                  />
                </Box>
              </Grid>

              {/* <Grid
                item={true}
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
              >
                <Box display={'flex'} alignItems={'center'}>
                  <MatButton
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
                  </MatButton>
                  <Button
                    text="Crear formulario"
                    variant="contained"
                    onClick={handleOnDialog}
                    startIcon={<Icon>add</Icon>}
                  />
                </Box>
              </Grid> */}
            </Grid>
          </Box>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper data-testid="Paper" elevation={3} style={{ padding: '20px' }}>
            {/* <FiltersComponent
              organizationId={organizationId}
              showTable={showTable}
              handleApplyFilters={handleApplyFilters}
              handleSearch={handleSearch} 
            /> */}
            <DataTable
              headers={headers}
              onLoad={_paginateForms}
              refresh={isRefresh}
              // items={items}
              isCollapsible={isActiveDesktop}
              // loading={isLoading}
              // isSearch={false}
              hideSearch={true}
              textNoItems={'No se encontraron resultados.'}
              filters={
                ShowProduct
                  ? undefined
                  : {
                      field: 'id',
                      elements: elementsFilterTable
                    }
              }
            />
          </Paper>
        </Grid>
      </Grid>
      {isDialogOpen && <FormDialog onClose={handleOnDialog} />}
    </>
  );
};

export default FormComponent;
