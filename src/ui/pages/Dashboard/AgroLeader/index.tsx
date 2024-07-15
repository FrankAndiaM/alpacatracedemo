import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Paper, Box, Button, Icon, Chip, Checkbox, FormControlLabel } from '@mui/material';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { showMessage } from '~/utils/Messages';
import { useNavigate } from 'react-router-dom';
import routes from '~routes/routes';
import AddIcon from '@mui/icons-material/Add';
import AgroLeaderDialog from './AgroLeaderDialog';
import { AgroLeader } from '~models/agroLeader';
import {
  createAgroLeader,
  paginateAgroLeaders,
  updateAgroLeader,
  // deleteAgroLeader,
  resendTemporalPasswordAgroLeader
} from '~services/agro_leaders';
import { AxiosResponse } from 'axios';
import IconButton from '~ui/atoms/IconButton/IconButton';
import TextFieldSearch from '~ui/molecules/TextFieldSearch/TextFieldSearch';
import useDebounce from '~hooks/use_debounce';
import { useTheme } from '@mui/material/styles';

type AgroLeadersComponentProps = unknown;

// type ActivesTypes = {
//   active: boolean;
//   not_active: boolean;
// };

const AgroLeadersComponent: React.FC<AgroLeadersComponentProps> = () => {
  const history = useNavigate();
  const theme = useTheme();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [searchTex, setSearchTex] = useState<string>('');
  const debouncedValue = useDebounce<string>(searchTex, 500);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [agroLeader, setAgroLeader] = useState<AgroLeader | undefined>(undefined);
  const [isRefresh, setIsRefresh] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'active' | 'inactive' | 'all'>('all');

  const _paginateAgroLeaders = useCallback(
    (page: number, per_page: number, sort_by: string, order: string) => {
      return paginateAgroLeaders(page, per_page, sort_by, order, debouncedValue, activeFilter);
    },
    [activeFilter, debouncedValue]
  );

  const handleViewAgroLeader = useCallback(
    (leader: AgroLeader) => {
      history(`${routes.agroLeader}/${leader.id}`);
    },
    [history]
  );

  // const handleDeleteLeader = useCallback(async (leader: AgroLeader): Promise<any | undefined> => {
  //   return new Promise(async (resolve: any, reject: any) => {
  //     if (leader.id) {
  //       deleteAgroLeader(leader.id)
  //         .then((res: any) => {
  //           const { message } = res.data.data;
  //           setIsRefresh((prevValue: boolean) => !prevValue);
  //           resolve(message);
  //         })
  //         .catch(() => {
  //           reject('Problemas al eliminar.');
  //         });
  //     } else {
  //       reject('Problemas al eliminar.');
  //     }
  //   });
  // }, []);

  const handleResendPasswordLeader = useCallback((leader: AgroLeader): Promise<any | undefined> => {
    return new Promise(async (resolve: any, reject: any) => {
      resendTemporalPasswordAgroLeader(leader.id)
        .then(() => {
          // const { message } = res.data.data;
          resolve('Contraseña temporal enviada al usuario.');
        })
        .catch((err: any) => {
          const data = err?.response?.data;
          if (data?.hasOwnProperty('error')) {
            showMessage('', data?.error?.message ?? '', 'error', true);
            reject(data?.error?.message);
          } else {
            reject('Problemas al enviar la contraseña');
          }
        });
    });
  }, []);

  const handleCloseAction = useCallback((isUpdateDataTable?: boolean) => {
    setIsOpenDialog((open: boolean) => !open);
    if (typeof isUpdateDataTable !== 'object' && isUpdateDataTable) {
      setIsRefresh((prevValue: boolean) => !prevValue);
    }
    setAgroLeader(undefined);
  }, []);

  const handleSaveAction = useCallback((data: AgroLeader): Promise<AxiosResponse<any>> => {
    if (data?.id !== undefined && data?.id !== null && data?.id !== '') {
      return updateAgroLeader(data.id, data);
    }
    return createAgroLeader(data);
  }, []);

  useEffect(() => {
    const _setHeaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Nombre',
        value: 'full_name',
        padding: 'none'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'DNI',
        padding: 'none',
        value: 'dni'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Número de teléfono',
        padding: 'none',
        value: 'phone'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Email',
        padding: 'none',
        value: 'email'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Usuario',
        padding: 'none',
        value: 'username'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Estado',
        value: 'user_status',
        render: (value: any) => {
          if (value.user_status === 'active') {
            return (
              <Chip
                label="Activo"
                style={{ background: theme.palette.secondary.lighter, color: theme.palette.secondary.dark }}
              />
            );
          }
          return <Chip label="Inactivo" style={{ background: '#F1F1F1', color: '#5B5B5B' }} />;
        }
      },
      {
        sorteable: false,
        align: 'center',
        text: 'Acción',
        value: '',
        render: (row: AgroLeader) => {
          return (
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Box px={1}>
                <IconButton
                  onClickAsync={() => handleResendPasswordLeader(row)}
                  icon="message"
                  disabled={row?.user_status === 'active'}
                  tooltipText="Enviar contraseña temporal"
                  alertMessage={{
                    title: '¿Está seguro de reenviar la contraseña al usuario?',
                    text: ''
                  }}
                />
              </Box>
              <Box px={1}>
                <IconButton onClick={() => handleViewAgroLeader(row)} icon="visibility" tooltipText="Ver usuario" />
              </Box>
              {/* <Box px={1}>
                <IconButton
                  onClickAsync={() => handleDeleteLeader(row)}
                  icon="delete"
                  tooltipText="Eliminar"
                  alertMessage={{
                    title: '¿Está seguro de eliminar al agente?',
                    text: 'Una vez eliminado, no podrá recuperarlo.',
                    icon: 'warning',
                    dangerMode: true
                  }}
                />
              </Box> */}
            </Box>
          );
        }
      }
    ];
    setHeaders(_setHeaders ? _setHeaders : []);
  }, [handleViewAgroLeader, handleResendPasswordLeader, theme]);

  const handleOnChangeSearch = useCallback((value: any) => {
    // console.log(value);
    setSearchTex(value);
  }, []);

  const handleChangeActiveFilter = useCallback((value: any) => {
    const { name } = value.target;
    setActiveFilter(name);
  }, []);

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
                  color: theme.palette.primary.main,
                  marginBottom: '5px'
                }}
              >
                Usuarios
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
                    component: 'Usuarios'
                  }
                ]}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Button
              variant="contained"
              onClick={() => handleCloseAction()}
              startIcon={<AddIcon />}
              fullWidth
              style={{ textTransform: 'inherit' }}
            >
              Nuevo usuario
            </Button>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper elevation={2} style={{ padding: '20px' }}>
            <Box paddingY={'12px'} display={'flex'} flexDirection={{ xs: 'column', md: 'row' }}>
              <TextFieldSearch onChange={handleOnChangeSearch} isAnimated={false} fullWidth size="small" />
              <Box display={'flex'} marginLeft={{ xs: 0, md: '16px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={activeFilter === 'active'}
                      onChange={handleChangeActiveFilter}
                      color="primary"
                      name="active"
                    />
                  }
                  label="Activo"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={activeFilter === 'inactive'}
                      onChange={handleChangeActiveFilter}
                      color="primary"
                      name="inactive"
                    />
                  }
                  label="Inactivo"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={activeFilter === 'all'}
                      onChange={handleChangeActiveFilter}
                      color="primary"
                      name="all"
                    />
                  }
                  label="Todos"
                />
              </Box>
            </Box>
            <DataTable
              headers={headers}
              stickyHeader={false}
              onLoad={_paginateAgroLeaders}
              refresh={isRefresh}
              hideSearch={true}
            />
          </Paper>
        </Grid>
      </Grid>
      {isOpenDialog && (
        <AgroLeaderDialog closeAction={handleCloseAction} saveAction={handleSaveAction} agroLeader={agroLeader} />
      )}
    </>
  );
};

export default AgroLeadersComponent;
