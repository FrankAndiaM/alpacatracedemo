import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Box, Icon } from '@mui/material';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { showMessage } from '~utils/Messages';
import routes from '~routes/routes';
import IconButton from '~ui/atoms/IconButton/IconButton';
import { AgroLeader } from '~models/agroLeader';
import { paginateDeletedAgroLeaders, restoreAgroLeaders } from '~services/agro_leaders';
import { useTheme } from '@mui/material/styles';

type DisabledAgentsProps = unknown;

const DisabledAgents: React.FC<DisabledAgentsProps> = () => {
  const [isRefresh, setIsRefresh] = useState<boolean>(true);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const theme = useTheme();

  const _paginateDeletedAgroLeaders = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return paginateDeletedAgroLeaders(page, per_page, sort_by, order, search);
    },
    []
  );

  const handleRestoreAgroLeader = useCallback((leader: AgroLeader): Promise<any | undefined> => {
    return new Promise(async (resolve: any, reject: any) => {
      if (leader?.id) {
        restoreAgroLeaders(leader?.id ?? '')
          .then(() => {
            // setIsFormRestoring(false);
            setIsRefresh((prevValue: boolean) => !prevValue);
            resolve('Agente restaurado.');
          })
          .catch((err: any) => {
            const data = err?.response?.data;
            if (data?.hasOwnProperty('error')) {
              showMessage('', data?.error?.message ?? '', 'error', true);
              reject(data?.error?.message);
            } else {
              reject('Problemas al restaurar el agente.');
            }
          });
      } else {
        reject('Problemas al restaurar el agente');
      }
    });
  }, []);

  useEffect(() => {
    const _setHeaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Agente',
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
        text: 'Teléfono',
        padding: 'none',
        value: 'phone'
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
        align: 'center',
        text: 'Acción',
        value: '',
        render: (row: AgroLeader) => {
          return (
            <Box display="flex" flexDirection="row" justifyContent="center">
              <Box px={1}>
                <IconButton
                  onClickAsync={() => handleRestoreAgroLeader(row)}
                  icon="restore"
                  tooltipText="Restaurar"
                  alertMessage={{
                    title: 'ADVERTENCIA',
                    text: '¿Está seguro de restaurar al agente?'
                  }}
                />
              </Box>
            </Box>
          );
        }
      }
    ];
    setHeaders(_setHeaders);
  }, [handleRestoreAgroLeader]);

  return (
    <>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box mb="20px">
            <Grid container>
              <Grid item={true} xs={12} sm={12} md={12} lg={6} xl={6}>
                <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
                  Agentes
                </Box>
                <Box>
                  <Breadcrumbs
                    breadcrumbs={[
                      {
                        path: routes.dashboard,
                        component: <Icon fontSize="small">home</Icon>
                      },
                      {
                        component: 'Agentes '
                      }
                    ]}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <DataTable
              headers={headers}
              stickyHeader={false}
              onLoad={_paginateDeletedAgroLeaders}
              refresh={isRefresh}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DisabledAgents;
