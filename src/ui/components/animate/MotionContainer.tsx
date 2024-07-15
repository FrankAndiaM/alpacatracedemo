import React from 'react';
import { motion } from 'framer-motion';
// material
import { Box, BoxProps } from '@mui/material';
//
import { varWrapEnter } from './variants';

// ----------------------------------------------------------------------

type MotionContainerProps = {
  initial?: boolean | string;
  open?: boolean;
} & BoxProps;

export default function MotionContainer({ open, children, ...other }: MotionContainerProps) {
  return (
    <Box component={motion.div} initial={false} animate={open ? 'animate' : 'exit'} variants={varWrapEnter} {...other}>
      {children}
    </Box>
  );
}
