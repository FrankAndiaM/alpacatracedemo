import React, { useCallback } from 'react';
import { Dialog, DialogContent, Box } from '@mui/material';

type messageProps = {
  title: string;
  setConfirm?: any;
  confirmCallback?: any;
};

const ConfirmNavigation: React.FC<messageProps> = (props: messageProps) => {
  const { title, setConfirm, confirmCallback } = props;

  const allowTransition = useCallback(() => {
    setConfirm(false);
    confirmCallback(true);
  }, [confirmCallback, setConfirm]);

  const blockTransition = useCallback(() => {
    setConfirm(false);
    confirmCallback(false);
  }, [confirmCallback, setConfirm]);

  const handleResponse = useCallback(
    (response: boolean) => {
      if (response) {
        allowTransition();
        return;
      }
      blockTransition();
    },
    [allowTransition, blockTransition]
  );

  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogContent>
        <Box>
          <div className="swal-icon swal-icon--warning">
            <span className="swal-icon--warning__body">
              <span className="swal-icon--warning__dot"></span>
            </span>
          </div>
          <div className="swal-title">{title}</div>
          <Box className="swal-text" width="100%" textAlign="center">
            Si no guardas los cambios realizados perderás todo lo avanzado.
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <div className="swal-button-container">
            <button className="swal-button swal-button--cancel" onClick={() => handleResponse(false)}>
              Cancelar
            </button>

            <div className="swal-button__loader">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="swal-button-container">
            <button
              className="swal-button swal-button--confirm swal-button--danger"
              onClick={() => handleResponse(true)}
            >
              Salir
            </button>

            <div className="swal-button__loader">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ConfirmNavigation);
