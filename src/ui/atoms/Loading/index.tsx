import React, { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';

type LoadingProps = {
  figureProgress?: ReactNode;
  infoIsData?: ReactNode;
  isLoading: boolean;
  isData: boolean;
  children: ReactNode;
};

const Loading: React.FC<LoadingProps> = ({ figureProgress, isLoading, children, isData, infoIsData }: any) => {
  return (
    <>
      {isLoading ? (
        figureProgress ? (
          figureProgress
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            height="100%"
            minHeight={'400px'}
          >
            <CircularProgress color="primary" size={50} />
          </Box>
        )
      ) : isData ? (
        children
      ) : infoIsData ? (
        infoIsData
      ) : (
        <Box height="300px" display="flex" justifyContent="center" alignItems="center">
          No hay datos recopilados
        </Box>
      )}
    </>
  );
};

export default React.memo(Loading);
