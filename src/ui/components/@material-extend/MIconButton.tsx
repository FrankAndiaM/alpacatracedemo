/* eslint-disable @typescript-eslint/typedef */
import React, { forwardRef } from 'react';
// material
import { alpha, useTheme } from '@mui/material/styles';
import { IconButton, IconButtonProps } from '@mui/material';
//
import { ButtonAnimate } from '../animate';

// ----------------------------------------------------------------------

type MIconButtonProps = {
  color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
} & Omit<IconButtonProps, 'color'>;

const MIconButton = forwardRef<HTMLButtonElement, MIconButtonProps>(
  ({ color = 'default', children, sx, ...other }: any, ref: any) => {
    const theme: any = useTheme();

    if (color === 'default' || color === 'inherit' || color === 'primary' || color === 'secondary') {
      return (
        <ButtonAnimate>
          <IconButton ref={ref} color={color} sx={sx} {...other}>
            {children}
          </IconButton>
        </ButtonAnimate>
      );
    }

    return (
      <ButtonAnimate>
        <IconButton
          ref={ref}
          sx={{
            color: theme?.palette[color]?.main,
            '&:hover': {
              bgcolor: alpha(theme?.palette[color]?.main, theme?.palette?.action?.hoverOpacity)
            },
            ...sx
          }}
          {...other}
        >
          {children}
        </IconButton>
      </ButtonAnimate>
    );
  }
);

export default MIconButton;
