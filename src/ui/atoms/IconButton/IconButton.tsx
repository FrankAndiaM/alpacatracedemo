import React, { useState, useCallback } from 'react';
import { Icon, CircularProgress, Box, Tooltip } from '@mui/material';
import IconButtonMaterial from '@mui/material/IconButton';
import { showMessage, showYesNoQuestion } from '~utils/Messages';

type AlertMessage = {
  title: string;
  text: string;
  icon?: 'warning' | 'error' | 'success' | 'info';
  dangerMode?: boolean;
};

type IconButtonProps = {
  onClick?(): void;
  onClickAsync?(): Promise<string | undefined>;
  icon: string;
  disabled?: boolean;
  color?: string;
  tooltipText?: string;
  alertMessage?: AlertMessage;
};

const IconButton: React.FC<IconButtonProps> = (props: IconButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onClick, onClickAsync, icon, disabled, color, tooltipText, alertMessage } = props;

  const handleOnClick = useCallback(async () => {
    if (onClick !== undefined) {
      onClick();
    }
    if (onClickAsync !== undefined) {
      const result: boolean = await showYesNoQuestion(
        alertMessage?.title || '',
        alertMessage?.text || '',
        alertMessage?.icon || 'warning',
        alertMessage?.dangerMode || false
      );
      if (result) {
        setIsLoading(true);
        onClickAsync()
          ?.then((message: any) => {
            showMessage('', message, 'success');
            setIsLoading(false);
          })
          .catch((errorMessage: string) => {
            showMessage('', errorMessage, 'error', true);
            setIsLoading(false);
          });
      }
    }
  }, [onClick, onClickAsync, alertMessage]);

  return (
    <>
      <Box position="relative">
        {isLoading && (
          <CircularProgress
            color="primary"
            sx={{
              position: 'absolute',
              width: '30px !important',
              height: '30px !important',
              marginLeft: '2px',
              marginTop: '2px'
            }}
          />
        )}
        <IconButtonMaterial aria-label="save" onClick={handleOnClick} size="small" disabled={isLoading || disabled}>
          <Tooltip title={tooltipText || ''} arrow>
            <Icon fontSize="small" sx={isLoading || disabled ? {} : { color }}>
              {icon}
            </Icon>
          </Tooltip>
        </IconButtonMaterial>
      </Box>
    </>
  );
};

IconButton.defaultProps = {
  color: '#212B36',
  tooltipText: '',
  alertMessage: {
    title: '',
    text: '',
    icon: 'warning',
    dangerMode: false
  }
};

export default React.memo(IconButton);
