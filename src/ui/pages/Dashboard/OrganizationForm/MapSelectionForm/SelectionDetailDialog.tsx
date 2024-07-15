import React, { useEffect, useState } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
// import Button from '~atoms/Button/Button';
import { Grid, Box, Paper, Button } from '@mui/material';
import MapSelection from './MapSelection';
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles(() => ({
  title: {
    color: '#536471',
    fontSize: '22px',
    fontWeight: 700,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  subtitle: {
    color: '#637381',
    fontSize: '14px'
  },
  papperStyles: {
    color: '#212B36',
    fontSize: 16,
    backgroundColor: '#F4F6F8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontWeight: 600
  }
}));

type DetailDialogProps = {
  onClose(): void;
  zoneSelected: any;
};

const DetailDialog: React.FC<DetailDialogProps> = (props: DetailDialogProps) => {
  const { onClose, zoneSelected } = props;
  const [mapCenter, setMapCenter] = useState<any[]>([]);
  const [rectangle, setRectangle] = useState<any[]>([]);
  const classes = useStyles();

  useEffect(() => {
    if (zoneSelected) {
      const north = zoneSelected?.northeast_point?.coordinates;
      const south = zoneSelected?.southwest_point?.coordinates;
      //center
      const coods = [south[1], south[0]];
      setMapCenter(coods ?? []);
      //rectangle
      const arrRectangle = [
        [north[1], north[0]],
        [south[1], south[0]]
      ];
      setRectangle(arrRectangle);
    }
  }, [zoneSelected]);

  return (
    <Dialog
      open
      title={''}
      subtitle=""
      onClose={() => onClose()}
      actions={
        <Box display="flex" justifyContent={'center'} width={'100%'}>
          <Button sx={{ width: '50%' }} onClick={() => onClose()} color="primary" variant="contained">
            Aceptar
          </Button>
        </Box>
      }
    >
      <Box className={classes.title}>Mapa Seleccionado</Box>
      <Paper className={classes.papperStyles} elevation={0}>
        <Grid container={true} spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box className={classes.subtitle}>Nombre</Box>
            <Box>{zoneSelected?.name ?? ''}</Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box className={classes.subtitle}>Departamento</Box>
            <Box>{zoneSelected?.department?.description ?? ''}</Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box className={classes.subtitle}>Provincia</Box>
            <Box>{zoneSelected?.province?.description ?? ''}</Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box className={classes.subtitle}>Distrito</Box>
            <Box>{zoneSelected?.district?.description ?? ''}</Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Box className={classes.subtitle}>Dirección</Box>
            <Box>{zoneSelected?.address ?? ''}</Box>
          </Grid>
        </Grid>
      </Paper>
      <Grid container={true} spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <MapSelection center={mapCenter} rectangle={rectangle} editDraw={true} />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default DetailDialog;
