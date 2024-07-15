import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Box, Icon, Tooltip, Chip } from '@mui/material';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { capitalizeAllWords } from '~utils/Word';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { listAllPendingCredentials } from '~services/agro_leaders/pending_credential';
import { showMessage } from '~utils/Messages';
import { useNavigate } from 'react-router-dom';

type PendingCredentialsComponentProps = unknown;

const PendingCredentialsComponent: React.FC<PendingCredentialsComponentProps> = () => {
  const history = useNavigate();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [items, setItems] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleViewCredential = useCallback(
    (credential: any) => {
      history(`${routes.verifyCredential}/${credential.id}`);
    },
    [history]
  );

  useEffect(() => {
    const _setheaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Productor',
        value: 'farmer.full_name',
        padding: 'none',
        render: (row: any) => {
          return <div>{capitalizeAllWords(row?.farmer?.first_name + ' ' + row?.farmer?.last_name)}</div>;
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Agente',
        value: 'agro_leader.full_name',
        padding: 'none',
        render: (row: any) => {
          return <div>{capitalizeAllWords(row?.agro_leader?.first_name + ' ' + row?.agro_leader?.last_name)}</div>;
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Certificado',
        padding: 'none',
        value: 'credential_name'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Estado',
        padding: 'none',
        value: 'status',
        render: (row: any) => {
          let colorBox = '';
          let labelText = '';
          let textColor = '';
          if (row?.status === 'rejected') {
            colorBox = '#EB5757';
            textColor = 'white';
            labelText = 'En observación';
          }
          if (row?.status === 'pending') {
            labelText = 'pendiente';
          }
          return <Chip label={labelText} style={{ background: colorBox, color: textColor }} />;
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Ultima actualizacion',
        padding: 'none',
        value: 'updated_at',
        render: (row: any) => {
          if (row?.created_at !== undefined) {
            const created_at = new Date(parseInt(row?.created_at) * 1000);
            return (
              <Box>
                {format(created_at, 'dd MMM yyyy', { locale: es })}
                <Box fontSize="12px" color="#9FA2B4">
                  {format(created_at, 'hh:mm aa', { locale: es })}
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
            <Tooltip title="Ver certificado" arrow>
              <Icon onClick={() => handleViewCredential(row)}>arrow_forward_ios</Icon>
            </Tooltip>
          );
        }
      }
    ];
    setHeaders(_setheaders ? _setheaders : []);
  }, [handleViewCredential]);

  useEffect(() => {
    listAllPendingCredentials()
      .then((res: any) => {
        setItems(res?.data?.data);
        setIsLoading(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
        const data = err?.response?.data;
        if (data?.error?.message !== undefined) {
          showMessage('', data?.error?.message, 'error', true);
          return;
        }
        if (data?.message !== undefined) {
          showMessage('', data?.message, 'error', true);
          return;
        }
        showMessage('', 'Problemas al cargar los certificado.', 'error', true);
      });
  }, []);

  return (
    <>
      <Grid container={true} spacing={1}>
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
                  color: '#0E4535',
                  marginBottom: '5px'
                }}
              >
                Credenciales por verificar
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
                    component: 'Credenciales por verificar'
                  }
                ]}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box display="flex" alignItems="center" mb={2}></Box>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper data-testid="Paper" elevation={2} style={{ padding: '20px' }}>
            <Grid container={true}>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <DataTable headers={headers} stickyHeader={false} items={items} loading={isLoading} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PendingCredentialsComponent;
