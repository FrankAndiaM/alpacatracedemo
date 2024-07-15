import React from 'react';
import useStyles from './Paper.css';
import { Paper, Grid, Box } from '@mui/material';

/**
 * CustomPaper > PaperProps
 * @params title define the title of paper
 * @params component hace referencia al componente que se va a renderizar en la parte derecha
 * @params children renderiza todo lo que esta dentro del tag <Paper />
 * @params marginTop sirve para el margen que debe tener el Paper en el top
 */

type PaperProps = {
  title?: string;
  component?: React.ReactNode;
  children?: React.ReactNode;
  marginTop?: string;
};

const CustomPaper: React.FC<PaperProps> = (props: PaperProps) => {
  const { title, component }: PaperProps = props;
  const classes = useStyles(props); //porque paso props?
  return (
    <>
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box display="flex" flexDirection="row" mb="40px">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mr="10px"
              fontSize="1.7em"
              fontWeight={500}
              color="#446125"
            >
              {title}
            </Box>
            {component}
          </Box>
        </Grid>
        <Paper data-testid="Paper" className={classes.paper} elevation={2}>
          {props.children}
        </Paper>
      </Grid>
    </>
  );
};
CustomPaper.defaultProps = {
  component: <></>,
  title: ''
};

export default React.memo(CustomPaper);
