import React from 'react';
import { Radio, Box } from '@mui/material';

type ButtonProps = {
  label?: string | React.ReactNode;
  name?: string;
  value?: string;
  checkedSelect: string;
  disabled?: boolean;
  onChange?(event: any): void;
  sx?: any;
};

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { label, name, value, checkedSelect, onChange } = props;

  return (
    <Box width="auto" display="inline-flex" flexDirection="row" alignItems="center">
      <Radio checked={checkedSelect === value} onChange={onChange} value={value} name={name} />
      {label && <Box display="inline-flex">{label}</Box>}
    </Box>
  );
};

export default Button;
