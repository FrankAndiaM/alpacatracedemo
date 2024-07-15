import React, { useCallback } from 'react';
import { FormHelperText, FormControl, FormLabel, Typography } from '@mui/material';
import { Switch, Box } from '@mui/material';
import TextField from '~ui/atoms/TextField/TextField';
import SelectField from '~ui/atoms/SelectField/SelectField';

type CustomInputsProps = {
  id: string;
  name: string;
  label: string;
  input_type: string;
  possible_values: string[];
  value: any;
  onChange: (event: any) => void;
  disabled: boolean;
  errors?: any;
  description: string;
};

const CustomInputs: React.FC<CustomInputsProps> = (props: CustomInputsProps) => {
  const { id, name, label, input_type, value, onChange, disabled, description, possible_values, errors } = props;

  const handleOnChangeSelect = useCallback(
    (field: string, value: any) => {
      const event = {
        target: {
          name: field,
          value
        }
      };
      onChange(event);
    },
    [onChange]
  );

  const handleOnChangeSwitch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      const e = {
        target: {
          name,
          value: checked
        }
      };
      onChange(e);
    },
    [onChange]
  );

  if (input_type === 'enum') {
    return (
      <>
        <SelectField
          id={id}
          name={name}
          items={possible_values}
          label={label}
          value={value}
          onChange={handleOnChangeSelect}
          disabled={disabled}
          errors={errors}
          touched={errors}
        />
        <FormHelperText>{description}</FormHelperText>
      </>
    );
  }

  if (input_type === 'boolean') {
    return (
      <>
        <FormControl component="fieldset">
          <FormLabel component="legend">{label}</FormLabel>
          <Box display="flex" alignItems="center">
            <Typography>No</Typography>
            <Switch onChange={handleOnChangeSwitch} name={name} id={id} disabled={disabled} />
            <Typography>Si</Typography>
          </Box>
        </FormControl>
        <FormHelperText>{description}</FormHelperText>
      </>
    );
  }

  // types: text, number and date
  return (
    <>
      <TextField
        id={id}
        name={name}
        type={input_type}
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        errors={errors}
        touched={errors}
        autoComplete="off"
      />
      <FormHelperText>{description}</FormHelperText>
    </>
  );
};

export default React.memo(CustomInputs);
