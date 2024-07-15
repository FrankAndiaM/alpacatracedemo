import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Button } from '@mui/material';

type LoadingProps = {
  loading: boolean;
  children?: React.ReactNode;
};
const Loading: React.FC<LoadingProps> = (): any => {
  return (
    <Button color="secondary">
      <CircularProgress />
    </Button>
  );
};

export default React.memo(Loading);
