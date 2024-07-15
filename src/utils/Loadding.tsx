import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

type LoadingProps = {
  loading: boolean;
  children?: React.ReactNode;
};
const Loading: React.FC<LoadingProps> = (props: LoadingProps): any => {
  const { loading }: LoadingProps = props;

  if (loading) {
    return (
      <div
        className={`load${loading ? '' : ' loaded'}`}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}
      >
        <CircularProgress />
      </div>
    );
  }
  return props.children;
};

export default React.memo(Loading);
