import React from 'react';
import { makeStyles } from '@mui/styles';
import MaterialLinearProgress from '@mui/material/LinearProgress';

const useStyles: any = makeStyles(() => ({
  colorPrimary: {
    backgroundColor: '#b2dfdb'
  }
}));

type LinearProgressProps = {
  loading: boolean;
};

const LinearProgress: React.FC<LinearProgressProps> = (props: LinearProgressProps) => {
  const classes = useStyles();
  const { loading } = props;

  return <>{loading && <MaterialLinearProgress classes={classes} />}</>;
};

export default LinearProgress;
