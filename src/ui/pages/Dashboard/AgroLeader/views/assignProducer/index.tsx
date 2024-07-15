import React, { useCallback, useState, useEffect } from 'react';
import { Grid, Button, Typography, Box, Card } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignFarmerDialog from '../../AssignFarmerDialog';
import { Farmer } from '~models/farmer';
import { AxiosResponse } from 'axios';
import {
  assignFarmersToAgroLeader,
  assignedFarmersToAgroLeader,
  removeAssignedFarmerToAgroLeader,
  listUnassignedFarmersToAgroLeader
} from '~services/agro_leaders';
import RoomIcon from '@mui/icons-material/Room';
import { useNavigate } from 'react-router-dom';
import routes from '~routes/routes';
import { showMessage } from '~utils/Messages';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import IconButton from '~ui/atoms/IconButton/IconButton';
import { useAgroLeaderStore, useAgroLeaderDispatch } from '../../store/agroLeaderContext';
import { SET_ASSIGN_FARMERS } from '../../store/agroLeaderConstants';

type TabProducerProps = {
  agroLeaderId: string;
};

type FollowerCardProps = {
  follower: Farmer;
  onToggle: any;
  onDelete(): Promise<any | undefined>;
};

function FollowerCard({ follower, onToggle, onDelete }: FollowerCardProps) {
  const { full_name, phone, farms } = follower;

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, height: '100%' }}>
      <Box sx={{ flexGrow: 1, minWidth: 0, pl: 2, pr: 1 }}>
        <Typography variant="subtitle2" fontSize="1em">
          {full_name}
        </Typography>
        <Typography variant="subtitle2" noWrap fontSize="0.78em">
          {phone}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
          {farms && farms.length > 0 && (
            <>
              <Box component={RoomIcon} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {farms[0]?.zone?.name}
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <Box>
        <Box display="flex" flexDirection="row" justifyContent="space-around">
          <IconButton onClick={onToggle} icon="visibility" tooltipText="Ver certificados" color="#27AE60" />
          <IconButton
            onClickAsync={onDelete}
            icon="delete"
            tooltipText="Eliminar"
            alertMessage={{
              title: 'ADVERTENCIA',
              text: 'Está seguro de eliminar el productor asignado.',
              icon: 'warning',
              dangerMode: true
            }}
          />
        </Box>
      </Box>
    </Card>
  );
}

const AssignProducerView: React.FC<TabProducerProps> = (props: TabProducerProps) => {
  const { agroLeaderId }: TabProducerProps = props;
  const { assignedFarmers } = useAgroLeaderStore();
  const agroLeaderDispatch = useAgroLeaderDispatch();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isLoadingFarmers, setIsLoadingFarms] = useState<boolean>(true);

  const history = useNavigate();

  const handleViewFarmer = useCallback(
    (farmer: Farmer) => {
      history(`${routes.farmers}/${farmer.id}`);
    },
    [history]
  );

  const _listUnassignedFarmersToAgroLeader = useCallback(() => {
    setIsLoadingFarms(true);
    listUnassignedFarmersToAgroLeader(agroLeaderId).then((res: any) => {
      setFarmers(res.data.data);
      setIsLoadingFarms(false);
    });
  }, [agroLeaderId]);

  const ListAssignedFarmers = useCallback(() => {
    setIsLoading(true);
    assignedFarmersToAgroLeader(agroLeaderId)
      .then((res: any) => {
        const { data } = res.data;
        agroLeaderDispatch({ type: SET_ASSIGN_FARMERS, payload: data });
        setIsLoading(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
        const errorMessage = 'Problemas al listar los productores asignados.';
        const data = err?.response?.data;
        if (data?.hasOwnProperty('error')) {
          showMessage('', data?.error?.message ?? errorMessage, 'error', true);
        } else {
          showMessage('', errorMessage, 'error', true);
        }
      });
  }, [agroLeaderId, agroLeaderDispatch]);

  const handleCloseAction = useCallback(
    (_updateTable?: boolean) => {
      if (_updateTable !== undefined && _updateTable) {
        ListAssignedFarmers();
        _listUnassignedFarmersToAgroLeader();
      }
      setIsAssignDialogOpen((open: boolean) => !open);
    },
    [ListAssignedFarmers, _listUnassignedFarmersToAgroLeader]
  );

  const handleDeleteFarmer = useCallback(
    (farmer: Farmer): Promise<any | undefined> => {
      return new Promise(async (resolve: any, reject: any) => {
        removeAssignedFarmerToAgroLeader(agroLeaderId, farmer.id)
          .then((res: any) => {
            const message = res.data?.data?.message;
            ListAssignedFarmers();
            _listUnassignedFarmersToAgroLeader();

            resolve(message || 'Productor asignado eliminado.');
          })
          .catch((err: any) => {
            const { data } = err.response;
            if (data?.status && data?.error?.message) {
              reject(data?.error?.message);
            } else {
              reject('Problemas al eliminar.');
            }
          });
      });
    },
    [agroLeaderId, ListAssignedFarmers, _listUnassignedFarmersToAgroLeader]
  );

  const handleSaveAction = useCallback((agroLeaderId: string, data: any): Promise<AxiosResponse<any>> => {
    return assignFarmersToAgroLeader(agroLeaderId, data);
  }, []);

  // useEffect(() => {
  //   ListAssignedFarmers();
  // }, [ListAssignedFarmers]);

  useEffect(() => {
    _listUnassignedFarmersToAgroLeader();
  }, [_listUnassignedFarmersToAgroLeader]);

  return (
    <>
      {isLoading && <LinearProgress loading={true} />}
      <Box sx={{ mt: 5 }}>
        <Box fontWeight={400} mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            Número de productores asignados: <strong>{assignedFarmers?.length ?? 0}</strong>
          </Box>
          <Button variant="contained" onClick={() => handleCloseAction()} startIcon={<AddIcon />}>
            Nuevo productor
          </Button>
        </Box>

        <Grid container spacing={3} direction="row" alignItems="stretch">
          {assignedFarmers.map((follower: any) => (
            <Grid key={follower.id} item xs={12} md={4}>
              <FollowerCard
                follower={follower}
                onToggle={() => handleViewFarmer(follower)}
                onDelete={() => handleDeleteFarmer(follower)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {isAssignDialogOpen && agroLeaderId !== undefined && (
        <AssignFarmerDialog
          agroLeaderId={agroLeaderId}
          farmers={farmers}
          isLoadingFarmers={isLoadingFarmers}
          closeAction={handleCloseAction}
          saveAction={handleSaveAction}
        />
      )}
    </>
  );
};

export default React.memo(AssignProducerView);
