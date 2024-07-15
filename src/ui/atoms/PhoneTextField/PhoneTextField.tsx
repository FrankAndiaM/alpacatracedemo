import React, { useCallback } from 'react';
import { Box, InputLabel, FormHelperText } from '@mui/material';
import 'react-phone-input-2/lib/bootstrap.css';
import PhoneInput from 'react-phone-input-2';
import useStyles from './../Autocomplete/Autocomplete.css';
import clsx from 'clsx';

type PhoneTextFieldProps = {
  id: string;
  label: string;
  name: string;
  value: any;
  onChange?(value: string, name: string): void;
  errors?: any;
  touched?: any;
  disabled?: boolean;
};

const PhoneTextField: React.FC<PhoneTextFieldProps> = (props: PhoneTextFieldProps) => {
  const { id, name, label, value, onChange, errors, touched, disabled } = props;
  const classes = useStyles();

  const handleOnChange = useCallback(
    (value: string) => {
      onChange && onChange(value, name);
    },
    [onChange, name]
  );

  return (
    <Box my={1} className={clsx(errors?.[name] && touched?.[name] && Boolean(errors[name]) && classes.error)}>
      <InputLabel id={id} shrink={true}>
        {label}
      </InputLabel>
      <PhoneInput
        country={'pe'}
        value={value}
        onChange={(value: string) => handleOnChange(value)}
        inputStyle={{
          width: '100%',
          height: '32px',
          border: 'none',
          borderBottom: '1px solid',
          borderRadius: '0px'
        }}
        inputProps={{ id, name }}
        disabled={disabled}
      />
      <FormHelperText error={errors?.[name] && touched?.[name] && Boolean(errors[name])} style={{ marginTop: '0px' }}>
        {errors && errors[name] && touched && touched[name] ? errors[name] : ''}
      </FormHelperText>
    </Box>
  );
};

PhoneTextField.defaultProps = {
  disabled: false,
  errors: {},
  id: '',
  label: '',
  onChange: (e: any) => e,
  touched: {},
  value: ''
};

export default React.memo(PhoneTextField);
