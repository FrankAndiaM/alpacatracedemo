import React from 'react';
import { Box, Typography } from '@mui/material';
import { isString } from 'lodash';

type ImageViewerProps = {
  url: string | null;
};
const ImageViewer = (props: ImageViewerProps) => {
  const { url } = props;
  return (
    <Box
      sx={{
        width: { xs: '-webkit-fill-available', md: '406px' },
        padding: '8px',
        // backgroundColor: url ? 'transparent' : '#F1F1F1',
        backgroundColor: '#F1F1F1',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {url ? (
        <Box
          component="img"
          alt="logo"
          src={isString(url) ? url : ''}
          sx={{ zIndex: 8, objectFit: 'cover', height: '224px', borderRadius: '1%' }}
        />
      ) : (
        <Box
          sx={{
            height: '224px',
            // width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <Typography>
            Todavía no se ha cargado ninguna <br /> imagen para mostrar
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageViewer;
