import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Card, Icon, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';
import { showMessage } from '~utils/Messages';
import { assignedFarmersToAgroLeader, getAgroLeader } from '~services/agro_leaders';
import Page from '~ui/atoms/Page/Page';
import ProfileCover from '~ui/molecules/ProfileCover/ProfileCover';
import cover from '~assets/img/farmer_banner.png';
import AgroLeaderProvider, { useAgroLeaderStore, useAgroLeaderDispatch } from './store/agroLeaderContext';
import ProfileView from './views/profile';
import { SET_AGRO_LEADER, SET_ASSIGN_FARMERS } from './store/agroLeaderConstants';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';

const useStyles: any = makeStyles(() => ({
  root: {
    padding: '10px'
  },
  media: {
    height: 140
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
    fontSize: '1.7em',
    fontWeight: 500,
    color: '#212B36'
  }
}));

type ShowAgroLeaderComponentProps = unknown;

const ShowAgroLeaderComponent: React.FC<ShowAgroLeaderComponentProps> = () => {
  const { agroLeader } = useAgroLeaderStore();
  const agroLeaderDispatch = useAgroLeaderDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const history = useNavigate();
  const classes = useStyles();
  // eslint-disable-next-line
  // @ts-ignore
  const { agro_leader_id } = useParams();

  if (!agro_leader_id) history(routes.agroLeader);

  const agroLeaderId: string = agro_leader_id !== undefined ? agro_leader_id : '';

  const _getAgroLeader = useCallback(() => {
    getAgroLeader(agroLeaderId)
      .then((res: any) => {
        setIsLoading(false);
        agroLeaderDispatch({ type: SET_AGRO_LEADER, payload: res.data.data });
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los datos del usuario.', 'error', true);
        history(routes.agroLeader);
      });
  }, [agroLeaderId, history, agroLeaderDispatch]);

  const _ListAssignedFarmers = useCallback(() => {
    assignedFarmersToAgroLeader(agroLeaderId)
      .then((res: any) => {
        agroLeaderDispatch({ type: SET_ASSIGN_FARMERS, payload: res.data.data });
      })
      .catch((err: any) => {
        const errorMessage = 'Problemas al listar los productores asignados.';
        const data = err?.response?.data;
        if (data?.hasOwnProperty('error')) {
          showMessage('', data?.error?.message ?? errorMessage, 'error', true);
        } else {
          showMessage('', errorMessage, 'error', true);
        }
      });
  }, [agroLeaderId, agroLeaderDispatch]);

  useEffect(() => {
    _getAgroLeader();
  }, [_getAgroLeader]);

  useEffect(() => {
    _ListAssignedFarmers();
  }, [_ListAssignedFarmers]);

  return (
    <Page title="Usuarios">
      <Container>
        <Typography className={classes.title} style={{ marginBottom: '15px' }}>
          Usuarios
        </Typography>
        <Box mb="25px">
          <Breadcrumbs
            breadcrumbs={[
              {
                path: '/dashboard',
                component: <Icon fontSize="small">home</Icon>
              },
              {
                path: '/dashboard/farm_agent',
                component: 'Usuarios'
              },
              {
                component: agroLeader?.full_name
              }
            ]}
          />
        </Box>

        <Card
          sx={{
            mb: 3,
            height: 240,
            position: 'relative'
          }}
        >
          <ProfileCover fullName={agroLeader?.full_name} position="Usuario" src={cover} type="agent" />
        </Card>

        {isLoading && (
          <Box sx={{ mb: 1 }}>
            <LinearProgress loading={true} />
          </Box>
        )}
        <Box>
          <ProfileView onHandle={_getAgroLeader} />
        </Box>
      </Container>
    </Page>
  );
};

// export default ShowAgroLeaderComponent;

const ShowAgroLeaderPage: React.FC<any> = () => {
  return (
    <AgroLeaderProvider>
      <ShowAgroLeaderComponent />
    </AgroLeaderProvider>
  );
};

export default ShowAgroLeaderPage;
