import React, { useCallback } from 'react';
import { Box, Typography, Icon } from '@mui/material';
import { useTheme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import UploadFile from './UploadFile';
import UploadImage from '~assets/icons/Upload.png';

import { showMessage } from '~utils/Messages';

type UploadFileStatusProps = {
  uploadFileStatus: 'PENDING' | 'UPLOADING' | 'SUCCESS' | 'FAILED';
  file: File | undefined;
  onDropFile: (file: File) => void;
};

const UploadFileStatus: React.FC<UploadFileStatusProps> = (props: UploadFileStatusProps) => {
  const { uploadFileStatus, file: currentFile, onDropFile } = props;
  const classes = useStyles();
  const theme = useTheme();
  const handleDropFile = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      if (file) {
        //validation 10 MB
        if (file.size >= 1e7) {
          showMessage('', 'El archivo es muy pesado.', 'error', true);
          return;
        }
        onDropFile(file);
      }
    },
    [onDropFile]
  );

  switch (uploadFileStatus) {
    case 'PENDING':
      return (
        <>
          <UploadFile
            icon={<img src={UploadImage} alt="UploadImage" />}
            sx={{
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.lighter,
              p: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              minHeight: '200px'
            }}
            accept=".xlsx,.xls"
            onDrop={handleDropFile}
            caption={
              <>
                {currentFile === undefined ? (
                  <Box>
                    <Typography>Arrastra tu archivo aquí</Typography>
                    <Box>
                      o
                      <Typography my={1} display="inline" fontWeight={600}>
                        {' '}
                        selecciónalo desde tu computador.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography display="inline">Archivo:</Typography>
                    <Typography display="inline" fontWeight={600}>
                      {' '}
                      {currentFile.name}
                    </Typography>
                  </Box>
                )}
              </>
            }
          />
        </>
      );
    case 'UPLOADING':
      return (
        <>
          <Box
            sx={{
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.lighter,
              p: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              minHeight: '200px'
            }}
          >
            <Icon sx={{ fontSize: '50px !important' }} className={classes.rotateIcon}>
              cached_rounded
            </Icon>
            <Typography my={1}>Subiendo...</Typography>
            <Typography my={1} fontWeight={600}>
              {currentFile?.name}
            </Typography>
          </Box>
        </>
      );
    case 'SUCCESS':
      return (
        <>
          <Box
            sx={{
              borderRadius: 2,
              color: theme.palette.success.main,
              backgroundColor: theme.palette.success.lighter,
              p: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Icon sx={{ fontSize: '50px !important' }}>sentiment_satisfied_alt_rounded</Icon>
            <Typography my={1}>El archivo ha sido subido de forma exitosa</Typography>
            <Typography my={1} fontWeight={600}>
              {currentFile?.name}
            </Typography>
          </Box>
        </>
      );
    case 'FAILED':
      return (
        <>
          <UploadFile
            icon={<Icon sx={{ fontSize: '50px !important' }}>error_outline_rounded</Icon>}
            sx={{
              borderRadius: 2,
              color: theme.palette.error.main,
              backgroundColor: theme.palette.error.lighter,
              p: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              minHeight: '200px'
            }}
            accept=".xlsx,.xls"
            onDrop={handleDropFile}
            caption={
              <>
                {currentFile === undefined ? (
                  <Box>
                    <Typography my={1} textAlign="center">
                      Has ingresado un Excel de forma incorrecta, asegúrate de completar todos los campos.
                    </Typography>
                    <Box textAlign="center">
                      Arrastra tu archivo aquí
                      <Typography my={1} display="inline" fontWeight={600} textAlign="center">
                        {' '}
                        selecciónalo desde tu computador.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography display="inline">Archivo:</Typography>
                    <Typography display="inline" fontWeight={600}>
                      {' '}
                      {currentFile.name}
                    </Typography>
                  </Box>
                )}
              </>
            }
          />
        </>
      );
    default:
      return <></>;
  }
};

const useStyles = makeStyles(() =>
  createStyles({
    rotateIcon: {
      animation: '$spin 2s linear infinite'
    },
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(360deg)'
      },
      '100%': {
        transform: 'rotate(0deg)'
      }
    }
  })
);

export default UploadFileStatus;
