import React, { useRef } from 'react';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TextField, FormGroup, FormControl, IconButton, Icon } from '@mui/material';

type DateFieldProps = {
  id: string;
  label: string;
  name: string;
  placeholder?: string;
  margin?: 'none' | 'dense' | 'normal';
  variant?: 'standard' | 'outlined' | 'filled' | undefined;
  value: any;
  onChange: (value: any, keyboardInputValue?: string | undefined) => void;
  onBlur?: (event: any) => void;
  errors?: any;
  touched?: any;
  disabled?: boolean;
  style?: any;
  maxDate?: any;
  minDate?: any;
  size?: 'small' | 'medium';
};

const DateField: React.FC<DateFieldProps> = (props: DateFieldProps) => {
  const inputRef = useRef<any>(null);
  const { id, label, name, value, size, onChange, onBlur, errors, touched, disabled, variant, maxDate, minDate } =
    props;

  const clearDateField = () => {
    onChange(null);
  };

  return (
    <>
      <FormGroup row sx={{ mt: '8px' }}>
        <FormControl
          fullWidth
          variant={variant}
          // className={clsx(classes.root, errors?.[name] && touched?.[name] && Boolean(errors[name]) && classes.error)}
        >
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
              inputRef={inputRef}
              label={label}
              inputFormat="DD/MM/YYYY"
              value={value}
              maxDate={maxDate}
              minDate={minDate}
              onChange={onChange}
              disabled={disabled}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  id={id}
                  name={name}
                  onBlur={onBlur}
                  size={size || 'medium'}
                  variant={variant}
                  error={errors[name] && touched[name] && Boolean(errors[name])}
                  helperText={errors[name] && touched[name] ? errors[name] : ''}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {value !== null && value !== '' && (
                          <IconButton size="small" sx={{ p: 0 }} onClick={clearDateField}>
                            <Icon fontSize="small">close</Icon>
                          </IconButton>
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
      </FormGroup>
    </>
  );
};

DateField.defaultProps = {
  disabled: false,
  errors: {},
  id: '',
  label: '',
  margin: 'normal',
  onBlur: (e: any) => e,
  onChange: (e: any) => e,
  touched: {},
  value: '',
  variant: 'standard',
  style: {}
};

export default DateField;
