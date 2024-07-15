import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Box, Icon, IconButton, Tooltip } from '@mui/material';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { deleteOfflineZone, paginateOffLineZones } from '~services/organization/form';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { showDeleteQuestion, showMessage } from '~utils/Messages';
import Button from '~atoms/Button/Button';
import FormDialog from './SelectionFormDialog';
import routes from '~routes/routes';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import DateCell from '~ui/atoms/DateCell/DateCell';
import SelectionDetailDialog from './SelectionDetailDialog';
import { convertGDToUTM } from '~utils/formatCoords';
import { useTheme } from '@mui/material/styles';

type MapSelectionFormProps = unknown;

const MapSelectionForm: React.FC<MapSelectionFormProps> = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [refreshTable, setRefreshTable] = useState<boolean>(false);
  const [zoneSelected, setZoneSelected] = useState<any>(undefined);
  const theme = useTheme();

  const _paginateOffLineZones = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return paginateOffLineZones(page, per_page, sort_by, order, search);
    },
    []
  );

  const handleOnDialog = useCallback(() => {
    setIsCreateDialogOpen((prevValue: boolean) => !prevValue);
  }, []);

  const handleOpenDetailDialog = useCallback(() => {
    setIsDetailDialogOpen((prevValue: boolean) => !prevValue);
  }, []);

  const handleSelectOfflineZone = useCallback(
    (row: any) => {
      setZoneSelected(row);
      handleOpenDetailDialog();
    },
    [handleOpenDetailDialog]
  );

  const handleRefreshTable = useCallback(() => {
    setRefreshTable((prev: boolean) => !prev);
  }, []);

  const handleDeleteOfflineZone = useCallback(
    (row: any) => {
      showDeleteQuestion('ADVERTENCIA', 'Está seguro de eliminar la zona', 'warning', false, [
        'Cancelar',
        'Eliminar'
      ]).then((response: any) => {
        if (response) {
          deleteOfflineZone(row.id)
            .then(() => {
              showMessage('', 'Se elimino correctamente.', 'success');
              handleRefreshTable();
            })
            .catch(() => {
              showMessage('', 'Problemas al eliminar el mapa.', 'error', true);
            });
        }
      });
    },
    [handleRefreshTable]
  );

  useEffect(() => {
    const _setheaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Nombre de mapa',
        value: 'name',
        padding: 'none'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Puntos GPS seleccionados',
        value: 'display_name',
        padding: 'none',
        render: (row: any) => {
          const north = convertGDToUTM(row?.northeast_point?.coordinates);
          const south = convertGDToUTM(row?.southwest_point?.coordinates);
          // console.log(convertGDToUTM(south));
          return (
            <Tooltip title={`${north}, ${south}`} arrow>
              <Box sx={{ whiteSpace: 'nowrap', width: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {`${north}, ${south}` ?? ''}
              </Box>
            </Tooltip>
          );
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Fecha de registro',
        value: 'created_at',
        padding: 'none',
        render: (row: any) => <DateCell date={row?.created_at} />
        // render: (row: any) => {
        //   if (row?.created_at !== undefined) {
        //     const created_at = sub(new Date(row?.created_at), { hours: 5 });
        //     return (
        //       <Box>
        //         {format(new Date(created_at), 'dd MMM yyyy', { locale: es })}
        //         <Box fontSize="12px" color="#9FA2B4">
        //           {formatToTimeZone(created_at, 'hh:mm aa', {
        //             timeZone: 'America/Lima'
        //           })}
        //         </Box>
        //       </Box>
        //     );
        //   }
        // }
      },
      {
        sorteable: false,
        align: 'center',
        text: 'Acción',
        value: '',
        render: (row: any) => {
          return (
            <Box display="flex" justifyContent={'center'}>
              <Tooltip title="Ver mapa">
                <IconButton onClick={() => handleSelectOfflineZone(row)} component="span" size="small">
                  <Icon>map</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton onClick={() => handleDeleteOfflineZone(row)} component="span" size="small">
                  <Icon>delete</Icon>
                </IconButton>
              </Tooltip>
            </Box>
          );
        }
      }
    ];
    setHeaders(_setheaders);
  }, [handleDeleteOfflineZone, handleSelectOfflineZone]);

  return (
    <>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box mb="20px">
            <Grid container>
              <Grid item={true} xs={12} sm={12} md={12} lg={6} xl={6}>
                <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
                  Seleccionar mapas
                </Box>
                <Box>
                  <Breadcrumbs
                    breadcrumbs={[
                      {
                        path: routes.dashboard,
                        component: <Icon fontSize="small">home</Icon>
                      },
                      {
                        path: routes.organizationForm,
                        component: 'Formularios '
                      },
                      {
                        component: 'Seleccionar mapas'
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
                  <Button
                    text="Seleccionar mapa"
                    variant="contained"
                    startIcon={<AddLocationAltIcon />}
                    onClick={handleOnDialog}
                  />
                </>
              }
              onLoad={_paginateOffLineZones}
              refresh={refreshTable}
            />
          </Paper>
        </Grid>
      </Grid>
      {isCreateDialogOpen && <FormDialog onClose={handleOnDialog} refreshTable={handleRefreshTable} />}
      {isDetailDialogOpen && <SelectionDetailDialog onClose={handleOpenDetailDialog} zoneSelected={zoneSelected} />}
    </>
  );
};

export default MapSelectionForm;
