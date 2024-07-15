import React, { useCallback } from 'react';
import { Dialog, DialogContent, Box } from '@mui/material';
import Button from '~ui/atoms/Button/Button';

import TrashSvg from '~assets/icons/trash1.svg';
import CheckSvg from '~assets/icons/check.svg';

type ConfirmMessageProps = {
  title: string;
  icon: 'delete' | 'success';
  handleCloseOnClick: () => void;
};

const CustomConfirmMessage: React.FC<ConfirmMessageProps> = (props: ConfirmMessageProps) => {
  const { title, icon, handleCloseOnClick } = props;

  const handleClose = useCallback(() => {
    handleCloseOnClick();
  }, [handleCloseOnClick]);

  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogContent>
        <Box mb={1}>
          <Box textAlign="center" fontWeight={700} fontSize="1.1em" mb="0.6em">
            <img src={icon === 'delete' ? TrashSvg : CheckSvg} alt="" />
          </Box>
          <Box textAlign="center" fontWeight={700} paddingX="1em" fontSize="1.1em" mb="0.6em">
            {title}
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            text="Continuar"
            color="inherit"
            sx={{ color: '#FFFFFF', background: '#219653', '&:hover': { background: '#219653' } }}
            variant="contained"
            onClick={() => {
              handleClose();
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CustomConfirmMessage);
