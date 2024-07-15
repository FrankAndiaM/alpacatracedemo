import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Paper, LinearProgress, Icon, Avatar } from '@mui/material';
import { Card, Select, Divider, MenuItem, Box, Grid } from '@mui/material';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { capitalizeAllWords } from '~utils/Word';
import routes from '~routes/routes';
import {
  getPendingCredential,
  issuePendingCredential,
  rejectPendingCredential
} from '~services/agro_leaders/pending_credential';
import { useNavigate, useParams } from 'react-router-dom';
import { showMessage, showYesNoQuestion } from '~utils/Messages';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import RejectCredentialDialog from './RejectCredentialDialog';

type ShowPendingCredentialsProps = unknown;

const ShowPendingCredentials: React.FC<ShowPendingCredentialsProps> = () => {
  const history = useNavigate();
  // eslint-disable-next-line
  // @ts-ignore
  const { credential_id } = useParams();
  if (!credential_id) history(routes.verifyCredential);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isRequestLoading, setIsRequestLoading] = useState<boolean>(false);

  const [pendingCredential, setPendingCredential] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');

  useEffect(() => {
    getPendingCredential(credential_id ?? '')
      .then((res: any) => {
        setPendingCredential(res.data.data);
        setSelectedStatus(res?.data?.data?.status);
        setIsLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar el certificado.', 'error', true);
        history(routes.verifyCredential);
      });
  }, [history, credential_id]);

  const _handleOnChangeStatus = useCallback(
    (event: any) => {
      const { value } = event.target;
      if (value === 'rejected') {
        // open dialog
        setIsDialogOpen(true);
      }
      if (value === 'issued') {
        showYesNoQuestion(
          '¿Desea emitir el certificado? Una vez emitido no se podrá realizar ningún cambio',
          '',
          'warning'
        ).then((res: any) => {
          if (res) {
            setIsRequestLoading(true);
            issuePendingCredential(credential_id ?? '')
              .then(() => {
                setIsRequestLoading(false);
                setSelectedStatus(value);
                showMessage('', 'Certificado emitido.', 'success');
              })
              .catch((err: any) => {
                setIsRequestLoading(false);
                const data = err?.response?.data;
                if (data?.error?.message !== undefined) {
                  showMessage('', data?.error?.message, 'error', true);
                  return;
                }
                if (data?.message !== undefined) {
                  showMessage('', data?.message, 'error', true);
                  return;
                }
                showMessage('', 'Problemas al emitir el certificado.', 'error', true);
              });
          }
        });
      }
    },
    [credential_id]
  );

  const _handleOnClose = useCallback((isUpdated?: boolean) => {
    if (isUpdated !== undefined && isUpdated) {
      setSelectedStatus('rejected');
    }
    setIsDialogOpen(false);
  }, []);

  const _handleOnSave = useCallback((credentialId: any, data: any) => {
    return rejectPendingCredential(credentialId, data);
  }, []);

  return (
    <>
      <Box
        style={{
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          marginRight: '10px',
          fontSize: '1.7em',
          fontWeight: 500,
          color: '#446125'
        }}
      >
        Credenciales por verificar
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
      <Box mt={1}>{isLoading && <LinearProgress />}</Box>

      <Box color="#1A1E2C" fontSize="17px" mt={3} mb={1}>
        Datos del Agente
      </Box>
      <Box>
        <Paper>
          <Box py={3} px={1}>
            <Grid container>
              <Grid item xs={12} sm={12} md={6} lg={5} xl={5}>
                <Box display="flex" p={1} alignItems="center">
                  <Avatar alt={pendingCredential?.agro_leader?.first_name} style={{ marginRight: '10px' }} />
                  <Typography>
                    {capitalizeAllWords(
                      `${pendingCredential?.agro_leader?.first_name ?? ''} ${
                        pendingCredential?.agro_leader?.last_name ?? ''
                      }`
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={12} sm={4} md={2} lg={2} xl={2}>
                <Box display="flex" alignItems="center" justifyContent="center" p={1}>
                  <Box>
                    <Box color="#1A1E2C" fontSize="14px" fontWeight="bold">
                      {pendingCredential?.agro_leader?.dni ?? <>&nbsp;</>}
                    </Box>
                    <Box color="#8E94A7" fontSize="12px">
                      DNI
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={12} sm={4} md={2} lg={2} xl={2}>
                <Box display="flex" alignItems="center" justifyContent="center" p={1}>
                  <Box>
                    <Box color="#1A1E2C" fontSize="14px" fontWeight="bold">
                      {pendingCredential?.agro_leader?.whatsapp_number ?? 'No registra'}
                    </Box>
                    <Box color="#8E94A7" fontSize="12px">
                      Whatsapp
                    </Box>
                  </Box>
                  <Box>
                    <WhatsAppIcon style={{ color: '#2F80ED', marginLeft: '10px', marginRight: '10px' }} />
                  </Box>
                </Box>
              </Grid>

              <Divider orientation="vertical" flexItem />
              <Grid item xs={12} sm={4} md={2} lg={2} xl={2}>
                <Box display="flex" alignItems="center" justifyContent="center" p={1}>
                  <Box>
                    <Box color="#1A1E2C" fontSize="14px" fontWeight="bold">
                      {pendingCredential?.agro_leader?.phone ?? 'No registra'}
                    </Box>
                    <Box color="#8E94A7" fontSize="12px">
                      Celular
                    </Box>
                  </Box>
                  <Box>
                    <Icon style={{ color: '#2F80ED', marginLeft: '10px', marginRight: '10px' }}>phone</Icon>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Box color="#1A1E2C" fontSize="17px" mt={3} mb={1}>
        Datos del Productor
      </Box>
      <Box>
        <Paper>
          <Box py={3} px={1}>
            <Grid container>
              <Grid item xs={12} sm={12} md={6} lg={5} xl={5}>
                <Box display="flex" p={1} alignItems="center">
                  <Avatar alt={pendingCredential?.farmer?.first_name} style={{ marginRight: '10px' }} />
                  <Typography>
                    {capitalizeAllWords(
                      `${pendingCredential?.farmer?.first_name ?? ''} ${pendingCredential?.farmer?.last_name ?? ''}`
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={12} sm={4} md={2} lg={2} xl={2}>
                <Box display="flex" alignItems="center" justifyContent="center" p={1}>
                  <Box>
                    <Box color="#1A1E2C" fontSize="14px" fontWeight="bold">
                      {pendingCredential?.farmer?.dni ?? <>&nbsp;</>}
                    </Box>
                    <Box color="#8E94A7" fontSize="12px">
                      DNI
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={12} sm={4} md={2} lg={2} xl={2}>
                <Box display="flex" alignItems="center" justifyContent="center" p={1}>
                  <Box>
                    <Box color="#1A1E2C" fontSize="14px" fontWeight="bold">
                      {pendingCredential?.farmer?.whatsapp_number ?? 'No registra'}
                    </Box>
                    <Box color="#8E94A7" fontSize="12px">
                      Whatsapp
                    </Box>
                  </Box>
                  <Box>
                    <WhatsAppIcon style={{ color: '#2F80ED', marginLeft: '10px', marginRight: '10px' }} />
                  </Box>
                </Box>
              </Grid>

              <Divider orientation="vertical" flexItem />
              <Grid item xs={12} sm={4} md={2} lg={2} xl={2}>
                <Box display="flex" alignItems="center" justifyContent="center" p={1}>
                  <Box>
                    <Box color="#1A1E2C" fontSize="14px" fontWeight="bold">
                      {pendingCredential?.farmer?.phone ?? 'No registra'}
                    </Box>
                    <Box color="#8E94A7" fontSize="12px">
                      Celular
                    </Box>
                  </Box>
                  <Box>
                    <Icon style={{ color: '#2F80ED', marginLeft: '10px', marginRight: '10px' }}>phone</Icon>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Box color="#1A1E2C" fontSize="17px" mt={3} mb={1}>
        Certificado a verificar
      </Box>
      <Box>
        <Paper>
          <Box p={2}>
            <Grid container>
              <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                <Card>
                  <Box mt={1}>{isRequestLoading && <LinearProgress />}</Box>
                  <Box p={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Box color="#828282">Fecha de registro del certificado</Box>
                      <Box color="#828282">
                        {pendingCredential?.created_at !== undefined &&
                          format(new Date(parseInt(pendingCredential?.created_at) * 1000), 'dd MMM yyyy', {
                            locale: es
                          })}
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6" gutterBottom>
                        {pendingCredential?.credential_name}
                      </Typography>
                      <Select
                        id="state_verify_farmer"
                        variant="outlined"
                        value={selectedStatus}
                        disabled={
                          selectedStatus === 'issued' ||
                          selectedStatus === 'rejected' ||
                          isRequestLoading ||
                          pendingCredential?.status !== 'pending'
                        }
                        style={{
                          background: selectedStatus === 'issued' || selectedStatus === 'rejected' ? 'grey' : '#FFAC2F',
                          marginLeft: '0.8rem',
                          padding: '0px',
                          borderRadius: '10px',
                          border: '0px solid',
                          height: '30px',
                          fontSize: '16px',
                          color: 'white'
                        }}
                        onChange={_handleOnChangeStatus}
                      >
                        <MenuItem value="pending" disabled>
                          Por verificar
                        </MenuItem>
                        <MenuItem value="issued">Emitir</MenuItem>
                        <MenuItem value="rejected">En observación</MenuItem>
                      </Select>
                    </Box>
                    <Divider style={{ height: '2px' }} />
                    <Box p={1}>
                      {pendingCredential?.credential_data !== undefined &&
                        Object.keys(pendingCredential?.credential_data)?.map((attribute: any, index: number) => (
                          <Box display="flex" justifyContent="space-between" key={`attribute_${attribute}_${index}`}>
                            <Typography>{attribute}</Typography>
                            <Typography>{pendingCredential?.credential_data[attribute]}</Typography>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
      {isDialogOpen && (
        <RejectCredentialDialog onClose={_handleOnClose} onSave={_handleOnSave} credential_id={credential_id} />
      )}
    </>
  );
};

export default ShowPendingCredentials;
