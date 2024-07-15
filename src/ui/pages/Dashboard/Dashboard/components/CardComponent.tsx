import React from 'react';
import { Box, CircularProgress, Fab, Grid, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '~ui/themes';

const useStyles: any = makeStyles((theme: Theme) => ({
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
    background: theme.palette.primary.lighter,
    color: theme.palette.primary.dark,
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
    color: theme.palette.primary.dark,
    background: theme.palette.gradients.icon
    // opacity: 0.4
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
    textAlign: 'left'
    // color: '#214036'
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

type CardComponentProps = {
  name: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
};

const CardComponent: React.FC<CardComponentProps> = (props: CardComponentProps) => {
  const { name, value, icon, isLoading } = props;
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
      <Paper className={classes.paperItemsForm}>
        <Grid container={true}>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} mb={3}>
            <Fab color="default" className={classes.fabContact} disabled>
              {icon}
            </Fab>
          </Grid>

          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box className={classes.titleItems} display="flex" flexDirection="column" alignItems="center">
              <Box className={classes.countItems}>
                {isLoading ? (
                  <CircularProgress
                    sx={{
                      marginTop: '5px',
                      width: '30px !important',
                      height: '30px !important'
                    }}
                  />
                ) : (
                  value ?? 0
                )}
              </Box>
              <Box className={classes.subtitleItems}>{name ?? ''}</Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default CardComponent;
