import React from 'react';
import { Dialog, Divider, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';

type DialogProps = {
  actions?: React.ReactNode;
  children?: React.ReactNode;
  onClose: (value: boolean) => void;
  open: boolean;
  title?: any;
  subtitle?: string;
  scroll?: 'body' | 'paper';
  hideActions?: boolean;
};

const ComponentDialog: React.FC<DialogProps> = (props: DialogProps) => {
  const { open, title, subtitle, onClose, children, actions, hideActions, ...rest } = props;

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog
      // keepMounted
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: { margin: { xs: 0, md: '16px' } }
      }}
      max-width="500px"
      {...rest}
    >
      {title && (
        <DialogTitle>
          <Box display="flex" justifyContent="center">
            <span> {title} </span>
          </Box>
          <Box display="flex" justifyContent="center" color="#3D4C63" fontSize="0.9rem">
            <span> {subtitle} </span>
          </Box>
        </DialogTitle>
      )}
      <Divider />
      <DialogContent>{children}</DialogContent>
      {!hideActions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

// default values
ComponentDialog.defaultProps = {
  scroll: 'paper'
};

export default React.memo(ComponentDialog);
