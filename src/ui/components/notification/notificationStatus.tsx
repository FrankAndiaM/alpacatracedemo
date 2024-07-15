import React, { useEffect, useState } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import {
  Card,
  // CardHeader,
  // Divider,
  // Stepper,
  // Step,
  // StepLabel,
  // StepConnector,
  // stepConnectorClasses,
  // StepIconProps,
  CircularProgress,
  Grid,
  Box
} from '@mui/material';
import { experimentalStyled as styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import BaseOptionChart from '../charts/BaseOptionChart';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
// import DoneIcon from '@mui/icons-material/Done';
// import FlagIcon from '@mui/icons-material/Flag';
// import DoneAllIcon from '@mui/icons-material/DoneAll';

// ---------------------------------------------------------------------

const GetTextColorForLabel = (text: string) => {
  let color = '#F29944';
  switch (text) {
    case 'delivered':
      color = '#F1A91D';
      break;
    case 'completed':
      color = '#40BF4C';
      break;
    case 'sent':
      color = '#FFFFFF';
      break;

    case 'failed_request':
      color = '#D04444';
      break;
    case 'read':
      color = '#00AB55';
      break;

    case 'queued':
      color = '#EFB034';
      break;

    case 'undelivered':
      color = '#D04444';
      break;

    case 'failed':
      color = '#212B36';
      break;

    case 'expired':
      color = '#7A7070';
      break;

    case 'ringing':
      color = '#AC44D0';
      break;

    case 'answered':
      color = '#4452D0';
      break;

    case 'busy':
      color = '#8E7676';
      break;

    case 'no-answer':
      color = '#919EAB';
      break;

    case 'cancelled':
      color = '#7A7070';
      break;

    case 'in-progress':
      color = '#5844D0';
      break;

    case 'requested_communication':
      color = '#50A8D9';
      break;

    case 'received':
      color = '#FFE16A;';
      break;
    case 'incomplete-call':
      color = '#B4E0CB';
      break;
    case 'completed-call':
      color = '#00AB55';
      break;
    case 'unanswered-call':
      color = '#D6E4FF';
      break;
  }
  return color;
};

const GetTextColor = (text: string) => {
  let color = '#212B36';
  if (text === 'failed' || text === 'read' || text === 'completed-call') color = '#FFFFFF';
  return color;
};

// ----------------------------------------------------------------------

const CHART_HEIGHT = 240;
const LEGEND_HEIGHT = 0;

const ChartWrapperStyle = styled('div')(({ theme }: any) => ({
  minHeight: CHART_HEIGHT,

  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important' as 'relative',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// const ColorlibConnector = styled(StepConnector)(() => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: {
//     top: 5
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 2,
//     backgroundColor: '#727272',
//     borderRadius: 1
//   }
// }));

// const ColorlibStepIconRoot = styled('div')<{
//   ownerState: { completed?: boolean; active?: boolean };
// }>(() => ({
//   zIndex: 1,
//   color: '#727272',
//   width: 50,
//   height: 10,
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center'
// }));

// const steps = ['Comunicación solicitada', 'Cola de espera', 'Enviado', 'Entregado', 'Leído'];

// function ColorlibStepIcon(props: StepIconProps) {
//   const { active, completed, className } = props;

//   const icons: { [index: string]: React.ReactElement } = {
//     1: <FlagIcon fontSize="small" />,
//     2: <AccessTimeIcon fontSize="small" />,
//     3: <SendIcon fontSize="small" />,
//     4: <DoneIcon fontSize="small" />,
//     5: <DoneAllIcon fontSize="small" />
//   };

//   return (
//     <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
//       {icons[String(props.icon)]}
//     </ColorlibStepIconRoot>
//   );
// }
// ----------------------------------------------------------------------

const useStyles: any = makeStyles(() => ({
  titleStyle: {
    fontSize: '18px',
    color: '#212B36',
    fontWeight: 700,
    lineHeight: '28px'
  },
  subtitleStyle: {
    fontSize: '14px',
    color: '#212B36',
    fontWeight: 700,
    lineHeight: '22px',
    marginRight: '16px'
  },
  boxStatus: {
    boxShadow: 'none',
    borderRadius: '21px',
    padding: '5px 20px',
    width: 'fit-content',
    height: '35px',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  boxClose: {
    height: '15px',
    width: '15px',
    background: '#FFFFFF',
    borderRadius: '50%',
    marginRight: '8px',
    color: '#000000',
    display: 'flex'
  }
}));

type ShowNotificationProps = {
  labels: string[];
  values: number[];
  colors: string[];
  type: string;
};

const AppCurrentDownload: React.FC<ShowNotificationProps> = ({
  labels,
  values,
  colors,
  type
}: ShowNotificationProps) => {
  // const theme = useTheme();
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enviados, setEnviados] = useState<number>(0);
  const [recibidos, setRecibidos] = useState<number>(0);
  const [noRecibidos, setNoRecibidos] = useState<number>(0);
  const [leidos, setLeidos] = useState<number>(0);
  const [incompletas, setIncompletas] = useState<number>(0);
  const [completadas, setCompletadas] = useState<number>(0);
  const [noContestadas, setNoContestadas] = useState<number>(0);

  const chartOptions = merge(BaseOptionChart(), {
    colors: colors,
    labels: labels,
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: ['#212B36'],
      width: 1,
      dashArray: 0
    },
    legend: { show: false, floating: true, horizontalAlign: 'center' },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName: string) => fNumber(seriesName),
        title: {
          formatter: (seriesName: string) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '82%',
          labels: {
            value: {
              formatter: (val: number | string) => fNumber(val)
            },
            total: {
              formatter: (w: { globals: { seriesTotals: number[] } }) => {
                const sum = w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                return fNumber(sum);
              }
            }
          }
        }
      }
    }
  });

  useEffect(() => {
    //eviados es el total
    let enviados = 0;
    if (values.length > 0 && type !== '') {
      for (let i = 0; i < labels.length; i++) {
        if (labels[i] === 'No Recibidos') {
          let noRecibidos = 0;
          noRecibidos = Number(values[i]);
          setNoRecibidos(noRecibidos);
        }
        if (labels[i] === 'Recibidos' || labels[i] === 'Entregado') {
          let recibidos = 0;
          recibidos = Number(values[i]);
          setRecibidos(recibidos);
        }
        if (labels[i] === 'Leído') {
          let leidos = 0;
          leidos = Number(values[i]);
          setLeidos(leidos);
        }
        if (labels[i] === 'Llamada Incompleta') {
          let incompletas = 0;
          incompletas = Number(values[i]);
          setIncompletas(incompletas);
        }
        if (labels[i] === 'Llamada Completada') {
          let completadas = 0;
          completadas = Number(values[i]);
          setCompletadas(completadas);
        }
        if (labels[i] === 'No Contestó') {
          let noContestadas = 0;
          noContestadas = Number(values[i]);
          setNoContestadas(noContestadas);
        }
        enviados += Number(values[i]);
      }
    }
    setIsLoading(false);
    setEnviados(enviados);
  }, [labels, type, values]);

  return (
    <Card style={{ height: '100%', padding: '30px', fontSize: '14px' }}>
      {/* <Divider style={{ width: '100%' }} sx={{ mb: 3, mt: 2 }} /> */}
      {/* <Stepper style={{ padding: '1px' }} activeStep={-1} alternativeLabel connector={<ColorlibConnector />}>
        {steps.map((label: string) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper> */}
      {/* <Divider style={{ width: '100%' }} sx={{ mt: 2 }} /> */}

      {isLoading ? (
        <Grid container direction="row" height="100%" display={'flex'} justifyContent="center" alignItems={'center'}>
          <CircularProgress color="primary" />
        </Grid>
      ) : (
        <Grid container direction="row" height="100%" spacing={4}>
          <Grid item justifyContent="start" alignItems="center">
            <Box className={classes.titleStyle}>Resumen de total envío</Box>
          </Grid>
          <Grid container item spacing={4} direction="row" justifyContent="center" alignItems="stretch">
            <Grid item={true} xs={12} sm={12} md={4} lg={4} xl={4} display="flex" alignItems={'center'}>
              <ChartWrapperStyle dir="ltr">
                <ReactApexChart type="donut" series={values} options={chartOptions} height={190} />
              </ChartWrapperStyle>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={8} lg={8} xl={8} fontSize={14}>
              <Grid container spacing={4} direction="row" justifyContent="center" alignItems="stretch">
                {/* Enviados - todos */}
                <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'column'}>
                  <Box
                    className={classes.boxStatus}
                    sx={{
                      background: GetTextColorForLabel('sent'),
                      color: GetTextColor('sent'),
                      border: '1px solid',
                      borderColor: GetTextColor('sent')
                    }}
                  >
                    {/* <SendIcon fontSize="small" style={{ marginRight: '8px' }} /> {enviados} Enviados */}
                    <SendIcon fontSize="small" style={{ marginRight: '8px' }} /> {enviados} Enviados
                  </Box>
                  <Box>El total de mensajes que enviaste</Box>
                </Grid>
                {/* Recibidos - sms y wsp */}
                {(type === 'sms' || type === 'wsp') && (
                  <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'column'}>
                    <Box>
                      <Box
                        className={classes.boxStatus}
                        sx={{
                          background: GetTextColorForLabel('received'),
                          color: GetTextColor('received'),
                          border: '1px solid',
                          borderColor: GetTextColorForLabel('received')
                        }}
                      >
                        {/* {notificationFarmer?.notification_status?.display_name
                              ? notificationFarmer?.notification_status?.display_name
                              : '-'}  */}
                        <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> {recibidos} Recibidos
                        {/* <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> 
                                {recibidos} Recibidos */}
                      </Box>
                    </Box>
                    <Box>El mensaje ya está disponible en el celular del productor, para que lo pueda leer.</Box>
                  </Grid>
                )}
                {/* Leidos - wsp */}
                {type === 'wsp' && (
                  <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'column'}>
                    <Box>
                      <Box
                        className={classes.boxStatus}
                        sx={{
                          background: GetTextColorForLabel('read'),
                          color: GetTextColor('read'),
                          border: '1px solid',
                          borderColor: GetTextColorForLabel('read')
                        }}
                      >
                        {/* {notificationFarmer?.notification_status?.display_name
                              ? notificationFarmer?.notification_status?.display_name
                              : '-'}  */}
                        <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> {leidos} Leidos
                        {/* <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> 
                                {recibidos} Recibidos */}
                      </Box>
                    </Box>
                    <Box>El productor ha abierto el mensaje en su celular.</Box>
                  </Grid>
                )}
                {/* Llamada incompleta - call */}
                {type === 'call' && (
                  <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'column'}>
                    <Box>
                      <Box
                        className={classes.boxStatus}
                        sx={{
                          background: GetTextColorForLabel('incomplete-call'),
                          color: GetTextColor('incomplete-call'),
                          border: '1px solid',
                          borderColor: GetTextColorForLabel('incomplete-call')
                        }}
                      >
                        {/* {notificationFarmer?.notification_status?.display_name
                              ? notificationFarmer?.notification_status?.display_name
                              : '-'}  */}
                        <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> {incompletas}{' '}
                        Llamadas incompletas
                        {/* <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> 
                                {recibidos} Recibidos */}
                      </Box>
                    </Box>
                    <Box>El mensaje no fue escuchado completamente.</Box>
                  </Grid>
                )}
                {/* Llamadas completadas - call */}
                {type === 'call' && (
                  <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'column'}>
                    <Box>
                      <Box
                        className={classes.boxStatus}
                        sx={{
                          background: GetTextColorForLabel('completed-call'),
                          color: GetTextColor('completed-call'),
                          border: '1px solid',
                          borderColor: GetTextColorForLabel('completed-call')
                        }}
                      >
                        {/* {notificationFarmer?.notification_status?.display_name
                              ? notificationFarmer?.notification_status?.display_name
                              : '-'}  */}
                        <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> {completadas}{' '}
                        Llamadas completadas
                        {/* <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> 
                                {recibidos} Recibidos */}
                      </Box>
                    </Box>
                    <Box>La llamada fue contestada y finalizada.</Box>
                  </Grid>
                )}
                {/* Llamadas no contestadas - call */}
                {type === 'call' && (
                  <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'column'}>
                    <Box>
                      <Box
                        className={classes.boxStatus}
                        sx={{
                          background: GetTextColorForLabel('unanswered-call'),
                          color: GetTextColor('unanswered-call'),
                          border: '1px solid',
                          borderColor: GetTextColorForLabel('unanswered-call')
                        }}
                      >
                        {/* {notificationFarmer?.notification_status?.display_name
                              ? notificationFarmer?.notification_status?.display_name
                              : '-'}  */}
                        <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> {noContestadas}{' '}
                        Llamadas no contestadas
                        {/* <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> 
                                {recibidos} Recibidos */}
                      </Box>
                    </Box>
                    <Box>No hubo respuesa o la llamada fue rechazada.</Box>
                  </Grid>
                )}
                {/* No Recibidos - todos */}
                <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'column'}>
                  <Box
                    className={classes.boxStatus}
                    sx={{
                      background: GetTextColorForLabel('failed'),
                      color: GetTextColor('failed'),
                      border: '1px solid',
                      borderColor: GetTextColor('failed')
                    }}
                  >
                    {/* {notificationFarmer?.notification_status?.display_name
                          ? notificationFarmer?.notification_status?.display_name
                          : '-'}  */}
                    <Box className={classes.boxClose}>
                      {' '}
                      <CloseIcon sx={{ fontSize: '15px' }} />{' '}
                    </Box>{' '}
                    {noRecibidos} No recibidos
                  </Box>
                  <Box>El total de mensajes que no llegaron a su destino debido a que el número no existe.</Box>
                </Grid>

                {/* <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'column'}>
                    <Box
                      className={classes.boxStatus}
                      sx={{
                        background: GetTextColorForLabel('sent'),
                        color: GetTextColor('sent'),
                        border: '1px solid',
                        borderColor: GetTextColor('sent')
                      }}
                    >
                      <SendIcon fontSize="small" style={{ marginRight: '8px' }} /> {enviados} Enviados
                    </Box>
                    <Box>El total de mensajes que enviaste</Box>
                  </Grid>
                  <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'column'}>
                    <Box>
                      <Box
                        className={classes.boxStatus}
                        sx={{
                          background: GetTextColorForLabel('received'),
                          color: GetTextColor('received'),
                          border: '1px solid',
                          borderColor: GetTextColorForLabel('received')
                        }}
                      >
                        <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: '8px' }} /> {recibidos} Recibidos
                      </Box>
                    </Box>
                    <Box>El mensaje ya está disponible en el celular del productor, para que lo pueda leer.</Box>
                  </Grid>
                  <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} flexDirection={'column'}>
                    <Box
                      className={classes.boxStatus}
                      sx={{
                        background: GetTextColorForLabel('failed'),
                        color: GetTextColor('failed'),
                        border: '1px solid',
                        borderColor: GetTextColor('failed')
                      }}
                    >
                      <Box className={classes.boxClose}>
                        {' '}
                        <CloseIcon sx={{ fontSize: '15px' }} />{' '}
                      </Box>{' '}
                      {noRecibidos} No recibidos
                    </Box>
                    <Box>El total de mensajes que no llegaron a su destino debido a que el número no existe.</Box>
                  </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Card>
  );
};

export default React.memo(AppCurrentDownload);
