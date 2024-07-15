import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Box, Icon, IconButton, Tooltip } from '@mui/material';
// import { experimentalStyled as styled } from '@mui/material/styles';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
// import { restoreOrganizationForm } from '~services/organization/form';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
// import EmptyFormImg from '~ui/assets/img/empty_form.png';
import { showDeleteQuestion, showMessage } from '~utils/Messages';
// import Button from '~atoms/Button/Button';
import FormDialog from './FormDialog';
import routes from '~routes/routes';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { useSelector } from 'react-redux';
import { listOrganizationForm, restoreForm } from '~services/organization/formsv2';
import { FilterForms } from '~models/organizationForm';
import { useTheme } from '@mui/material/styles';

type DisabledOrganizationFormProps = unknown;

const getFormType = (entry_entity_type: string): string => {
  let type = 'General';
  if (entry_entity_type === 'FREE') type = 'Organización';
  if (entry_entity_type === 'PRODUCTIVE_UNIT') type = 'Unidad productiva';
  return type;
};

// const ProductImgStyle = styled('img')(() => ({
//   top: 0,
//   width: 'auto',
//   height: 'auto',
//   objectFit: 'cover'
// }));

const DisabledOrganizationForm: React.FC<DisabledOrganizationFormProps> = () => {
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormRestoring, setIsFormRestoring] = useState<boolean>(false);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  // const [items, setItems] = useState<any[]>([]);
  const { auth }: any = useSelector((state: any) => state);
  const { organizationId } = auth?.organizationTheme;
  const [isRefresh, setIsRefresh] = useState<boolean>(true);

  const [filters] = useState<FilterForms>({
    owner_model_id: organizationId,
    form_type: 'ALL',
    archived_at: false,
    is_active: false
  });

  const _paginateForms = useCallback(
    (page: number, per_page: number, sort_by: string, order: string) => {
      return listOrganizationForm(page, per_page, sort_by, order, '', filters);
    },
    [filters]
  );

  const refreshTable = useCallback(() => {
    setIsRefresh((prev: boolean) => !prev);
  }, []);

  const handleOnDialog = useCallback(() => {
    setIsDialogOpen((prevValue: boolean) => !prevValue);
  }, []);

  // const listAllOrganizationForm = useCallback(() => {
  //   listOrganizationForm(filters)
  //     .then((res: any) => {
  //       const { items } = res?.data?.data;
  //       if (Array.isArray(items) && items.length > 0) {
  //         setItems(items);
  //       }
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

  const handleRestoreOrganizationForm = useCallback(
    (row: any) => {
      showDeleteQuestion('ADVERTENCIA', 'Está seguro de restaurar el formulario', 'warning', false, [
        'Cancelar',
        'Restaurar'
      ]).then((response: any) => {
        if (response) {
          setIsFormRestoring(true);
          restoreForm(row.id)
            .then(() => {
              setIsFormRestoring(false);
              showMessage('', 'Formulario restaurado.', 'success');
              // listAllOrganizationForm();
              refreshTable();
            })
            .catch(() => {
              setIsFormRestoring(false);
              showMessage('', 'Problemas al restaurar el Formulario.', 'error', true);
            });
        }
      });
    },
    [refreshTable]
  );

  useEffect(() => {
    const _setheaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Nombre del formulario',
        value: 'name',
        padding: 'none'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Tipo de formulario',
        value: 'entry_entity_type',
        padding: 'none',
        render: (row: any) => <>{getFormType(row?.entry_entity_type ?? '')}</>
      },
      // {
      //   sorteable: true,
      //   align: 'left',
      //   text: 'Nombre del formulario en excel',
      //   value: 'name',
      //   padding: 'none'
      // },
      {
        sorteable: true,
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
        render: (row: any) => {
          if (row?.created_at !== undefined) {
            // const created_at = sub(new Date(row?.created_at), { hours: 5 });
            return (
              <Box>
                {format(new Date(row?.created_at), 'dd MMM yyyy', { locale: es })}
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
        sorteable: true,
        align: 'left',
        text: 'Última fecha de actualización',
        value: 'updated_at',
        padding: 'none',
        render: (row: any) => {
          if (row?.updated_at !== undefined) {
            // const updated_at = sub(new Date(row?.updated_at), { hours: 5 });
            return (
              <Box>
                {format(new Date(row?.updated_at), 'dd MMM yyyy', { locale: es })}
                <Box fontSize="12px" color="#9FA2B4">
                  {formatToTimeZone(row?.updated_at, 'hh:mm aa', {
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
        render: (row: any) => {
          return (
            <Box display="flex">
              <Tooltip title="Restaurar">
                <IconButton onClick={() => handleRestoreOrganizationForm(row)} component="span" size="small">
                  <Icon>restore</Icon>
                </IconButton>
              </Tooltip>
            </Box>
          );
        }
      }
    ];
    setHeaders(_setheaders);
  }, [handleRestoreOrganizationForm]);

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
            </Grid>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <LinearProgress loading={isFormRestoring} />
          {
            <Paper data-testid="Paper" elevation={3} style={{ padding: '20px' }}>
              {/* <DataTable headers={headers} items={items} isSearch={false} /> */}
              <DataTable
                headers={headers}
                onLoad={_paginateForms}
                refresh={isRefresh}
                hideSearch={true}
                textNoItems={'No se encontraron resultados.'}
              />
            </Paper>
          }
        </Grid>
      </Grid>
      {isDialogOpen && <FormDialog onClose={handleOnDialog} />}
    </>
  );
};

export default DisabledOrganizationForm;
