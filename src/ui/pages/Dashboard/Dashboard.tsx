import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Box, Paper } from '@mui/material';
import Page from '~atoms/Page/Page';
import { makeStyles } from '@mui/styles';
import { Theme } from '~ui/themes';
import { getNumberIssuedCredentials, getTotalClothes } from '~services/dashboard';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded';
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import { paginateReceivedCredentials } from '~services/share_credentials';
import CardComponent from './Dashboard/components/CardComponent';
import WelcomeImage from './Dashboard/components/WelcomeImage';

const CompDashboard = () => {
  const classes = useStyles();
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);
  const [isProducerLoading, setIsProducerLoading] = useState<boolean>(true);
  // const [isFormLoading, setIsFormLoading] = useState<boolean>(true);
  const [numberIssuedCredentials, setNumberIssuedCredentials] = useState<number | undefined>(undefined);
  const [isLoadingNumberIssuedCredentials, setIsLoadingNumberIssuedCredentials] = useState<boolean>(true);
  const [clothesCount, setClothesCount] = useState<number>(0);
  const [receivedCount, setReceivedCount] = useState<number>(0);
  const [isLoadingReceivedCount, setIsLoadingReceivedCount] = useState<boolean>(true);

  useEffect(() => {
    getNumberIssuedCredentials()
      .then((res: any) => {
        setIsLoadingNumberIssuedCredentials(false);
        setNumberIssuedCredentials(res?.data?.data?.total_issued_credentials ?? 0);
      })
      .catch((_error: any) => {
        setNumberIssuedCredentials(0);
        setIsLoadingNumberIssuedCredentials(false);
      });
  }, []);

  useEffect(() => {
    getTotalClothes(organizationTheme?.organizationId)
      .then((result: any) => {
        const { data } = result?.data;
        if (data && data.total_clothes) {
          setClothesCount(data?.total_clothes || 0);
        }
        setIsProducerLoading(false);
      })
      .catch(() => {
        // console.log(err);
        setIsProducerLoading(false);
      });
  }, [organizationTheme]);

  useEffect(() => {
    paginateReceivedCredentials(
      1,
      12,
      'created_at',
      'desc',
      undefined,
      organizationTheme?.organizationId,
      'Organizations'
    )
      .then((result: any) => {
        const { data } = result?.data;
        if (data && data.total) {
          setReceivedCount(data.total || 0);
        }
        setIsLoadingReceivedCount(false);
      })
      .catch(() => {
        setIsLoadingReceivedCount(false);
      });
  }, [organizationTheme]);

  return (
    <Page title="Dashboard: App">
      <Grid container spacing={4} alignItems="stretch" direction="row" justifyContent="space-evenly">
        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
          <Paper className={classes.welcomeCardStyles}>
            <Box p={4} display="flex" justifyContent="space-between">
              <Box>
                <Box fontWeight="bold" mb={1} fontSize="1.7rem">
                  ¡Bienvenidos {organizationTheme?.organizationName}!
                </Box>
                <Box>Aquí podrás registrar y revisar toda la información de tu actividad productiva.</Box>
              </Box>
              <Box p={1} display={{ xs: 'none', md: 'block' }}>
                <WelcomeImage />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper sx={{ height: '100%', borderRadius: '16px' }}>
            <Box p={4} height="100%" display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Box fontWeight="bold" mb={1} fontSize="1.7rem">
                  {/* CITE AREQUIPA */}
                  {organizationTheme?.parentOrganization?.short_name ?? 'No registra'}
                </Box>
                <Box>Solución tecnológica que valida, evidencia y automatiza tus actividades productivas.</Box>
              </Box>
              <Box mt={1}>
                {organizationTheme?.parentOrganization?.theme?.contact?.phone && (
                  <Box textAlign="left" display="flex">
                    <WhatsAppIcon />
                    &nbsp;&nbsp;{organizationTheme?.parentOrganization?.theme?.contact?.phone ?? ''}
                    {/* +51 913 371 207 */}
                  </Box>
                )}
                {organizationTheme?.parentOrganization?.theme?.contact?.email && (
                  <Box textAlign="left" display="flex" mt={1}>
                    <EmailIcon />
                    &nbsp;&nbsp;
                    <span style={{ textDecoration: 'underline' }}>
                      {/* jchambilla@itp.gob.pe */}
                      {organizationTheme?.parentOrganization?.theme?.contact?.email ?? 'No registra'}
                    </span>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <CardComponent
          name="PRENDAS REGISTRADAS"
          value={clothesCount ?? 0}
          icon={<CheckroomRoundedIcon className={classes.iconColor} />}
          isLoading={isProducerLoading}
        />
        <CardComponent
          name="CERTIFICADOS EMITIDOS"
          value={numberIssuedCredentials ?? 0}
          icon={<CreditCardRoundedIcon className={classes.iconColor} />}
          isLoading={isLoadingNumberIssuedCredentials}
        />
        <CardComponent
          name="CERTIFICADOS RECIBIDOS"
          value={receivedCount ?? 0}
          icon={<FileCopyRoundedIcon className={classes.iconColor} />}
          isLoading={isLoadingReceivedCount}
        />
      </Grid>
    </Page>
  );
};

const useStyles: any = makeStyles((theme: Theme) => ({
  welcomeCardStyles: {
    borderRadius: '16px',
    backgroundColor: theme.palette.primary.lighter
  },
  container: {
    paddingTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0)
    }
  },
  separateButton: {
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      paddingBottom: theme.spacing(1)
    }
  },
  iconColor: {
    color: theme.palette.primary.dark,
    fontSize: '26px'
  },
  titleWelcome: {
    textAlign: 'left',
    fontSize: '1.6em',
    // color:'#214036',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(2)
    }
  },
  titleWelcomeAssociation: {
    textAlign: 'center',
    fontSize: '1.7em',
    // color:'#214036',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(2)
    }
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
    // height: '300px'
  },
  paperItemsAge: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background: '#D0F2FF',
    borderRadius: '16px',
    // [theme.breakpoints.down('md')]: {
    //   paddingBottom: theme.spacing(2),
    // },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  },
  paperItemsProducer: {
    padding: theme.spacing(4),
    textAlign: 'center',
    background: '#C8FACD',
    color: 'theme.palette.text.secondary',
    borderRadius: '16px',
    // [theme.breakpoints.down('md')]: {
    //   paddingBottom: theme.spacing(2),
    // },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  },
  paperItemsForm: {
    padding: theme.spacing(4),
    textAlign: 'center',
    background: '#FFF7CD',
    color: 'theme.palette.text.secondary',
    borderRadius: '16px',
    // [theme.breakpoints.down('md')]: {
    //   paddingBottom: theme.spacing(2),
    // },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  },
  titleAgros: {
    fontSize: '1.3em',
    padding: '0 5px',
    fontWeight: 'bold',
    paddingBottom: theme.spacing(2)
  },
  paperAgros: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  },
  listEmoticon: {
    paddingBottom: theme.spacing(1.5),
    fontSize: '1.2em'
  },
  valueValoration: {
    fontSize: '1.2em'
  },
  barLineDissatisfied: {
    background: '#FA6C6D',
    height: '20px'
  },
  barLineNeutral: {
    background: '#FDD35E',
    height: '20px'
  },
  barLineSatisfied: {
    background: '#92C678',
    height: '20px'
  },
  percentageValueDissatisfied: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#FA6C6D'
  },
  percentageValueNeutral: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#FDD35E'
  },
  percentageValueSatisfied: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#92C678'
  },
  fabContact: {
    color: '#005249',
    background: 'linear-gradient(135deg, rgba(0, 123, 85, 0) 0%, rgba(0, 123, 85, 0.24) 97.35%);',
    opacity: 0.4
  },
  fabPhone: {
    background: '#F2994A',
    opacity: 0.4
  },
  fabSMS: {
    background: '#8AB833',
    opacity: 0.4
  },
  titleItems: {
    textAlign: 'left',
    color: '#214036'
  },

  countItems: {
    fontSize: '2em',
    fontWeight: 'bold'
  },
  subtitleItems: {
    fontSize: '0.9em',
    fontWeight: 600,
    textAlign: 'center'
  },
  titlePaper: {
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    paddingBottom: '40px'
  },
  titlePaperLink: {
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    color: theme.palette.primary.main,
    textDecoration: 'none'
  },
  iconPlot: {
    color: 'red'
  },
  logoEmoticon: {
    width: '60px',
    [theme.breakpoints.down('lg')]: {
      width: '60px'
    },
    [theme.breakpoints.down('md')]: {
      width: '50px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '50px'
    }
  }
}));

export default React.memo(CompDashboard);
