import React, { useState, useCallback } from 'react';
import { Typography, Paper, Grid, Stack, Card, Box, Button } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useAgroLeaderStore } from '../../store/agroLeaderContext';
import EditCommunicationDialog from './EditCommunicationDialog';
// import EditJobDialog from './EditJobDialog';
// import { formatInTimeZone } from 'date-fns-tz';
// import { es } from 'date-fns/locale';
import AgroLeaderDialog from '../../AgroLeaderDialog';
import { AxiosResponse } from 'axios';
import { AgroLeader } from '~models/agroLeader';
import { updateAgroLeader } from '~services/agro_leaders';

type ProfileViewProps = { onHandle?: any };

const ProfileView: React.FC<ProfileViewProps> = ({ onHandle }: ProfileViewProps) => {
  const [isOpenAgroLeaderDialog, setIsOpenAgroLeaderDialog] = useState(false);
  const [isOpenEditCommunicationDialog, setIsOpenEditCommunicationDialog] = useState(false);
  const { agroLeader } = useAgroLeaderStore();

  const handleCloseDialog = useCallback(() => {
    onHandle();
    setIsOpenAgroLeaderDialog((prevValue: boolean) => !prevValue);
  }, [onHandle]);

  const handleAgroLeaderDialog = useCallback(() => {
    setIsOpenAgroLeaderDialog((prevValue: boolean) => !prevValue);
  }, []);

  const handleCloseCommunicationDialog = useCallback(() => {
    setIsOpenEditCommunicationDialog(false);
  }, []);

  const handleSaveAction = useCallback((data: AgroLeader): Promise<AxiosResponse<any>> => {
    return updateAgroLeader(data.id, data);
  }, []);

  // const parseDate = useCallback((date: string) => {
  //   try {
  //     return formatInTimeZone(date, 'America/Lima', 'dd-MM-yyyy', {
  //       locale: es
  //     });
  //   } catch (error) {
  //     return '-';
  //   }
  // }, []);

  return (
    <>
      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          {/* Personal info */}
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} alignItems="flex-start">
              <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                    INFORMACIÓN DE USUARIO
                  </Typography>
                </Box>
                <Box>
                  <Button startIcon={<EditRoundedIcon />} variant="contained" onClick={handleAgroLeaderDialog}>
                    Editar
                  </Button>
                </Box>
              </Box>
              <Paper
                key="info_personal"
                sx={{
                  p: 3,
                  width: 1,
                  bgcolor: 'background.neutral'
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Typography variant="body2" gutterBottom>
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        1. Nombre: &nbsp;
                      </Typography>
                      <Typography sx={{ color: '#2F3336', fontSize: '15px', fontWeight: 600 }}>
                        {agroLeader?.full_name}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Typography variant="body2" gutterBottom>
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        2. DNI: &nbsp;
                      </Typography>
                      <Typography sx={{ color: '#2F3336', fontSize: '15px', fontWeight: 600 }}>
                        {agroLeader?.dni}
                      </Typography>
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Typography variant="body2" gutterBottom>
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        3. Número de teléfono: &nbsp;
                      </Typography>
                      <Typography sx={{ color: '#2F3336', fontSize: '15px', fontWeight: 600 }}>
                        {agroLeader?.phone}
                      </Typography>
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Typography variant="body2" gutterBottom>
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        4. Email: &nbsp;
                      </Typography>
                      <Typography sx={{ color: '#2F3336', fontSize: '15px', fontWeight: 600 }}>
                        {agroLeader?.email}
                      </Typography>
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Typography variant="body2" gutterBottom>
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        5. Usuario: &nbsp;
                      </Typography>
                      <Typography sx={{ color: '#2F3336', fontSize: '15px', fontWeight: 600 }}>
                        {agroLeader?.username}
                      </Typography>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {isOpenAgroLeaderDialog && (
        <AgroLeaderDialog agroLeader={agroLeader} closeAction={handleCloseDialog} saveAction={handleSaveAction} />
      )}

      {isOpenEditCommunicationDialog && <EditCommunicationDialog closeAction={handleCloseCommunicationDialog} />}
    </>
  );
};

export default ProfileView;
