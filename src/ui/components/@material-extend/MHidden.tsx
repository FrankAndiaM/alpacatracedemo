import React, { ReactNode } from 'react';
// material
import { Breakpoint, Theme, useMediaQuery } from '@mui/material';

// ----------------------------------------------------------------------

type MHiddenProps = {
  children: ReactNode;
  width: 'xsDown' | 'smDown' | 'mdDown' | 'lgDown' | 'xlDown' | 'xsUp' | 'smUp' | 'mdUp' | 'lgUp' | 'xlUp';
};

export default function MHidden({ width, children }: MHiddenProps) {
  const breakpoint = width.substring(0, 2) as Breakpoint;
  const hiddenUp = useMediaQuery<Theme>((theme: any) => theme.breakpoints.up(breakpoint));
  const hiddenDown = useMediaQuery<Theme>((theme: any) => theme.breakpoints.down(breakpoint));

  if (width.includes('Down')) {
    return hiddenDown ? null : <>{children}</>;
  }

  if (width.includes('Up')) {
    return hiddenUp ? null : <>{children}</>;
  }

  return null;
}
