import React from 'react';
import { Box, Typography } from '@mui/material';
import LoadingImage from '~assets/svg/loading_icon.png';
import './LoadingResponse.scss';

type LoadingResponseProps = {
  totalItems?: number;
  itemsLoaded?: number;
};

const LoadingResponse: React.FC<LoadingResponseProps> = (props: LoadingResponseProps) => {
  const { totalItems, itemsLoaded }: LoadingResponseProps = props;

  return (
    <>
      <Box display="flex" justifyContent="center" my={5}>
        <img
          className="rotate linear infinite"
          src={`${LoadingImage}?w=164&h=164&fit=crop&auto=format`}
          srcSet={`${LoadingImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
          alt="loading"
          loading="lazy"
        />
      </Box>
      <Typography textAlign="center" fontWeight={600}>
        Procesando emisión
      </Typography>
      {totalItems !== undefined && itemsLoaded !== undefined && (
        <>
          <Typography textAlign="center" fontWeight={600}>
            {itemsLoaded} {totalItems === 1 ? <>certificado emitido</> : <>certificados emitidos</>} de {totalItems}
          </Typography>
        </>
      )}
      <Typography textAlign="center">
        Por favor no recargues o salgas de la página, de lo contrario la emisión se cancelará
      </Typography>
    </>
  );
};

export default LoadingResponse;
