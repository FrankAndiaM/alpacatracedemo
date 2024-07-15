import React, { useCallback } from 'react';
import { Dialog, DialogContent, Box } from '@mui/material';
import Button from '~ui/atoms/Button/Button';

type messageProps = {
  title: string;
  description: string;
  icon: string;
  textLeftButton: string;
  textRightButton: string;
  colorRightButton: string;
  handleOnClick: (result: boolean) => void;
};

const ShowMessage: React.FC<messageProps> = (props: messageProps) => {
  const { title, description, icon, textLeftButton, textRightButton, colorRightButton, handleOnClick } = props;

  const handleResponse = useCallback(
    (response: boolean) => {
      handleOnClick(response);
    },
    [handleOnClick]
  );

  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogContent>
        <Box mb={1}>
          <Box textAlign="center" fontWeight={700} fontSize="1.1em" mb="0.6em">
            <img src={icon} alt="" />
          </Box>
          <Box textAlign="center" fontWeight={700} paddingX="1em" fontSize="1.1em" mb="0.6em">
            {title}
          </Box>
          <Box textAlign="center" fontSize="1.1em" paddingX="3em">
            {description}
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            text={textLeftButton}
            color="inherit"
            sx={{ color: '#333333', borderColor: '#333333', marginRight: '20px' }}
            onClick={() => {
              handleResponse(false);
            }}
            variant="outlined"
          />
          <Button
            text={textRightButton}
            color="inherit"
            sx={{
              color: '#FFFFFF',

              background: colorRightButton,
              '&:hover': { background: colorRightButton }
            }}
            variant="contained"
            onClick={() => {
              handleResponse(true);
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ShowMessage);
