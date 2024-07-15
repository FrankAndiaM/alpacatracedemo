import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  FormHelperText,
  Input,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  Select,
  FormControl,
  FormGroup
} from '@mui/material';

type MultiSelectFieldType = {
  id: string;
  name: string;
  label: string | React.ReactNode;
  items: any[];
  onChange(name: string, values: any[]): void;
  defaultValues?: any[];
  itemText?: string;
  errors?: any;
  touched?: any;
  disabled?: boolean;
};

const MultiSelectField: React.FC<MultiSelectFieldType> = (props: MultiSelectFieldType) => {
  const { id, name, label, items, onChange, defaultValues, itemText, errors, touched, disabled } = props;
  const [values, setValues] = useState<any[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const selectRef = useRef(null);

  useEffect(() => {
    if (defaultValues) {
      setValues(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAll = useCallback(() => {
    let currentValues;
    if (isAllSelected) {
      currentValues = [];
    } else {
      currentValues = items;
    }
    setValues(currentValues);
    onChange && onChange(name, currentValues);
    setIsAllSelected((prevValue: boolean) => !prevValue);
  }, [isAllSelected, items, name, onChange]);

  const handleOnChange = useCallback(
    (event: any) => {
      const { name, value } = event.target;
      if (value.some((item: any) => item === undefined)) {
        return;
      }

      let newValues: any[] = [];
      for (let i = 0; i < value.length; i++) {
        const result = value?.filter((item: any) => item?.id === value[i]?.id);
        if (result.length === 1) {
          newValues = [...newValues, value[i]];
        }
      }
      setValues(newValues);
      onChange && onChange(name, newValues);
      if (newValues.length !== items.length && isAllSelected) setIsAllSelected(false);
      if (newValues.length === items.length && !isAllSelected) setIsAllSelected(true);
    },
    [isAllSelected, items, onChange]
  );

  return (
    <FormGroup row>
      <FormControl fullWidth error={errors && errors[name] && touched && touched[name] && Boolean(errors[name])}>
        <InputLabel id={id}>{label}</InputLabel>
        <Select
          ref={selectRef}
          disabled={disabled}
          labelId={`${id}_label`}
          id={id}
          name={name}
          multiple
          value={values}
          onChange={handleOnChange}
          input={<Input />}
          renderValue={(selected: any) =>
            selected.map((value: any) => (itemText ? value[itemText] : String(value))).join(', ')
          }
        >
          <MenuItem onClick={handleSelectAll} value={undefined}>
            <Checkbox checked={isAllSelected} color="primary" />
            <ListItemText primary={'Seleccionar todos'} />
          </MenuItem>
          {items.map((item: any) => (
            <MenuItem key={item.id} value={item}>
              <Checkbox checked={values.some((value: any) => value.id === item.id)} color="primary" />
              <ListItemText primary={itemText ? item[itemText] : String(item)} />
              {/* item.description ? item.description : item.name  */}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{errors && errors[name] && touched && touched[name] ? errors[name] : ''}</FormHelperText>
      </FormControl>
    </FormGroup>
  );
};

export default React.memo(MultiSelectField);
