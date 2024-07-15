import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FormGroup, FormControl, FormHelperText, InputLabel, Select, Input, MenuItem } from '@mui/material';
import { CircularProgress, Box } from '@mui/material';
import clsx from 'clsx';
import useStyles from './SelectField.css';

type SelectFieldProps = {
  id: string;
  label: string | React.ReactNode;
  name: string;
  items: any[];
  value: any;
  variant?: 'filled' | 'standard' | 'outlined';
  itemText?: string;
  itemValue?: string;
  fullWidth?: boolean;
  isNotUpdateValue?: boolean;
  onChange?: (name: any, value: any) => void;
  onBlur?: (name: string, value: any) => void;
  errors?: any;
  touched?: any;
  disabled?: boolean;
  isLoading?: boolean;
  shrinkLabel?: boolean;
  input?: boolean;
  IconComponent?: any;
  hideLabelOnValue?: boolean;
};

const SelectField: React.FC<SelectFieldProps> = (props: SelectFieldProps) => {
  const {
    id,
    name,
    value,
    label,
    items,
    onChange,
    isNotUpdateValue,
    itemText,
    itemValue,
    disabled,
    errors,
    touched,
    isLoading,
    variant,
    shrinkLabel,
    input,
    IconComponent,
    hideLabelOnValue = false
  } = props;

  const [currentValue, setCurrentValue] = useState<any>('');
  const selectRef = useRef<any>(null);
  const classes = useStyles();

  useEffect(() => {
    let selectedValue = '';
    // if itemValue exist, maybe items is a array of objects
    if (itemValue) {
      // find value
      if (typeof value === 'object' && value?.hasOwnProperty(itemValue)) {
        selectedValue = items.filter((item: any) => item[itemValue] === value[itemValue])[0];
      } else {
        selectedValue = items.filter((item: any) => item[itemValue] === value)[0];
      }
    } else {
      selectedValue = value;
    }
    setCurrentValue(selectedValue || '');
  }, [itemValue, items, value]);

  const _onChange = useCallback(
    (event: any) => {
      const { value } = event.target;
      !isNotUpdateValue && setCurrentValue(value);
      // valida onChange porque puede ser undefined
      onChange !== undefined && onChange(name, itemValue ? value[itemValue] : String(value));
    },
    [itemValue, name, onChange, isNotUpdateValue]
  );

  return (
    <div style={{ paddingTop: '8px', paddingBottom: '8px' }}>
      <FormGroup row>
        <FormControl
          fullWidth
          variant={variant || 'standard'}
          className={clsx(classes.root, errors?.[name] && touched?.[name] && Boolean(errors[name]) && classes.error)}
        >
          {hideLabelOnValue ? (
            currentValue == '' && (
              <InputLabel id={id} className={classes.label} shrink={shrinkLabel}>
                {label}
              </InputLabel>
            )
          ) : (
            <InputLabel id={id} className={classes.label} shrink={shrinkLabel}>
              {label}
            </InputLabel>
          )}
          <Select
            variant={variant || 'standard'}
            inputRef={selectRef}
            labelId={`${id}_label`}
            id={id}
            name={name}
            value={currentValue}
            onChange={_onChange}
            IconComponent={IconComponent}
            input={input ? <Input /> : undefined}
            renderValue={(selected: any) => (itemText ? selected[itemText] : String(selected))}
            disabled={disabled}
            endAdornment={
              isLoading && (
                <Box mr="20px" position="absolute" top="0" right="10px">
                  <CircularProgress color="primary" size={25} thickness={5} />
                </Box>
              )
            }
          >
            {isLoading ? (
              <MenuItem disabled className={classes.item} classes={{ selected: classes.selected }}>
                Cargando...
              </MenuItem>
            ) : (
              items.map((item: any, index: number) => (
                <MenuItem
                  value={item}
                  key={`select_item_${name}_${index}`}
                  className={classes.item}
                  classes={{ selected: classes.selected }}
                >
                  {itemText ? item[itemText] : String(item)}
                </MenuItem>
              ))
            )}
          </Select>
          <FormHelperText
            error={errors?.[name] && touched?.[name] && Boolean(errors[name])}
            style={{ marginTop: '0px', marginLeft: '0px' }}
          >
            {errors?.[name] && touched?.[name] ? errors[name] : ''}
          </FormHelperText>
        </FormControl>
      </FormGroup>
    </div>
  );
};

SelectField.defaultProps = {
  isLoading: false,
  variant: 'standard'
};

export default React.memo(SelectField);
