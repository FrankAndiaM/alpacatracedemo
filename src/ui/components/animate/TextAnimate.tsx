import React from 'react';
import { motion, MotionProps } from 'framer-motion';
// material
import { Box, BoxProps } from '@mui/material';
//
import { varFadeInUp } from './variants';

// ----------------------------------------------------------------------

type Props = BoxProps & MotionProps;

type TextAnimateProps = {
  text: string;
} & Props;

export default function TextAnimate({ text, variants, sx, ...other }: TextAnimateProps) {
  return (
    <Box
      component={motion.h1}
      sx={{
        typography: 'h1',
        overflow: 'hidden',
        display: 'inline-flex',
        ...sx
      }}
      {...other}
    >
      {text.split('').map((letter: any, index: any) => (
        <motion.span key={index} variants={variants || varFadeInUp}>
          {letter}
        </motion.span>
      ))}
    </Box>
  );
}
