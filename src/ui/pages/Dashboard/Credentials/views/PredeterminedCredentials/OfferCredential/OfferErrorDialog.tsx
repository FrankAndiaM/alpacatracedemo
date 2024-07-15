import React from 'react';
import { Typography, Icon, Box } from '@mui/material';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Farmer } from '~models/farmer';
import Button from '~ui/atoms/Button/Button';

type OfferErrorDialogProps = {
  producersErrorLoad: Farmer[];
  onClose: () => void;
};

const OfferErrorDialog: React.FC<OfferErrorDialogProps> = (props: OfferErrorDialogProps) => {
  const { producersErrorLoad, onClose }: OfferErrorDialogProps = props;
  return (
    <>
      <Dialog
        open
        title={
          <Typography fontSize="1.2rem" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            Error en la emisión <Icon sx={{ color: 'red', fontSize: '2.2rem !important' }}>cancel</Icon>
          </Typography>
        }
        onClose={(_: boolean) => {
          //
        }}
        actions={
          <Box display="flex" justifyContent="center" width="100%">
            <Button text="cerrar" variant="contained" color="primary" sx={{ width: '15rem' }} onClick={onClose} />
          </Box>
        }
      >
        <Typography textAlign="center">La emisión falló en las siguientes prendas:</Typography>
        <Box mx={3}>
          {producersErrorLoad?.map((producer: Farmer, index: number) => (
            <Box key={`producer-${index}`}>- {producer?.full_name}</Box>
          ))}
        </Box>
        <Typography textAlign="center">
          Actualiza la página e intenta repetir el proceso de emisión con las prendas que han fallado
        </Typography>
      </Dialog>
    </>
  );
};

export default OfferErrorDialog;
