import React, { useCallback, useRef, useState } from 'react';
import { Box, Snackbar } from '@mui/material';
import { Theme } from '@mui/material/styles';
// import { format } from 'date-fns';
// import { es } from 'date-fns/locale';
import { Dialog } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Button from '~ui/atoms/Button/Button';
import { ShareDidResponse } from '../CredentialsSelection';
import QRComponent from '~ui/molecules/QRComponent';
import html2canvas from 'html2canvas';
import { saveAsBlob } from '~utils/downloadExcel';
import { showMessage } from '~utils/Messages';

const useStyles: any = makeStyles((theme: Theme) => ({
  title: {
    wordBreak: 'break-all',
    color: 'white'
  },
  subTitle: {
    fontSize: '0.68rem',
    opacity: '0.72',
    color: 'white'
  },
  copyLink: {
    textDecoration: 'underline',
    fontSize: '16px',
    color: theme.palette.primary.main,
    fontWeight: 700,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  infoLink: {
    maxWidth: '220px',
    wordBreak: 'break-word',
    textAlign: 'center',
    fontSize: '16px',
    color: theme.palette.primary.main,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  textGreen: {
    color: theme.palette.primary.main,
    textAlign: 'center'
  }
}));

type ShareOptionsDialogProps = {
  open: boolean;
  onClose: () => void;
  didOptions?: ShareDidResponse;
  shareInfo?: any;
};

const ShareOptionsDialog: React.FC<ShareOptionsDialogProps> = (props: ShareOptionsDialogProps) => {
  const { onClose, open, didOptions, shareInfo } = props;
  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const classes = useStyles();
  const exportRef = useRef<HTMLDivElement>(null);

  const handleCloseSnack = useCallback(() => {
    setOpenSnack((prev: boolean) => !prev);
  }, []);

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(`${text}`);
    setOpenSnack(true);
  }, []);

  const handleDownloadQR = useCallback(async () => {
    if (exportRef.current) {
      // console.log('hay elemento');
      try {
        const canvas = await html2canvas(exportRef.current);
        const image = canvas.toDataURL('image/png', 1.0);
        saveAsBlob(image, `${didOptions?.path ?? ''}`);
      } catch (error) {
        showMessage('', 'Error intentar descargar el código qr, inténtelo nuevamente.', 'error', true);
      }
    }
  }, [didOptions]);

  return (
    <>
      <Dialog
        // keepMounted
        scroll="body"
        fullWidth
        open={open}
        onClose={handleOnClose}
        aria-labelledby="alert-dialog-credentials"
        aria-describedby="alert-dialog-credentials"
        PaperProps={{
          sx: { margin: { xs: 0, md: 2 } }
        }}
      >
        <Box p={3}>
          <Box px={2} py={1}>
            <Box display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
              <Box fontWeight={700} fontSize="16px">
                Compartir certificado
              </Box>
              <Box fontWeight={700} fontSize="14px" color="gray">
                Copia link o descarga la imagen QR
              </Box>
              {shareInfo && (
                <Box mt={2}>
                  <Box className={classes.textGreen}>Estas compartiendo </Box>
                  <Box textAlign={'center'}>
                    <span className={classes.infoLink}>{shareInfo?.credentials_quantity ?? 0}</span> certificados
                    {shareInfo?.producers_quantity !== 0 && (
                      <>
                        &nbsp;de&nbsp;<span className={classes.infoLink}>{shareInfo?.producers_quantity ?? 0} </span>{' '}
                        productores{' '}
                      </>
                    )}
                    <span className={classes.infoLink}>
                      {shareInfo?.excludes_quantity !== '' ? shareInfo?.excludes_quantity : ''}
                    </span>
                  </Box>
                </Box>
              )}
              <Box display="flex" my={2} justifyContent={'center'}>
                <Box
                  width={'50%'}
                  display={'flex'}
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection={'column'}
                >
                  <Box className={classes.infoLink}>{didOptions?.full_path ?? ''}</Box>
                  <Box
                    className={classes.copyLink}
                    onClick={() => {
                      handleCopyToClipboard(didOptions?.full_path ?? '');
                    }}
                  >
                    copiar link
                  </Box>
                </Box>
                {/* <Box
                  ml={2}
                  width={'50%'}
                  display={'flex'}
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection={'column'}
                >
                  <Box className={classes.infoLink}>{didOptions?.code ?? ''}</Box>
                  <Box
                    className={classes.copyLink}
                    onClick={() => {
                      handleCopyToClipboard(didOptions?.code ?? '');
                    }}
                  >
                    copiar clave
                  </Box>
                </Box> */}
              </Box>
              <Box className={classes.infoLink}>o</Box>
              <Box ref={exportRef} m={{ xs: 0, md: 2 }} p={2} borderRadius="16px">
                <div
                  style={{
                    padding: '16px',
                    border: '1px solid #000000',
                    borderRadius: '16px'
                  }}
                >
                  <QRComponent value={`${didOptions?.full_path ?? ''}`} />
                </div>
              </Box>
              <Box className={classes.copyLink} onClick={handleDownloadQR}>
                Descargar QR
              </Box>
              {/* <Box>{showStatus(issuedCredential?.credential_status?.name)}</Box> */}
            </Box>
          </Box>

          <Box my={2} width={'100%'} display="flex" justifyContent={'center'}>
            <Button
              onClick={handleOnClose}
              color="primary"
              variant="outlined"
              text="Cancelar"
              sx={{ padding: '12px 24px' }}
            />
            <Button
              onClick={handleOnClose}
              color="primary"
              variant="contained"
              text="Aceptar"
              sx={{ padding: '12px 24px' }}
            />
          </Box>
        </Box>
      </Dialog>
      {
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSnack}
          onClose={handleCloseSnack}
          message="Copiado correctamente"
          key={'copy-snackbar'}
          autoHideDuration={1000}
        />
      }
    </>
  );
};

export default ShareOptionsDialog;
