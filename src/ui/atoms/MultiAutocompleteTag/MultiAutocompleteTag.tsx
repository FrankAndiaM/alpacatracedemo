/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useCallback } from 'react';
import MaterialAutocomplete from '@mui/material/Autocomplete';
import {
  TextField,
  FormHelperText,
  FormControl,
  FormGroup,
  CircularProgress,
  Chip,
  FilterOptionsState
} from '@mui/material';
import useStyles from './MultiAutocompleteTag.css';
import clsx from 'clsx';

type MultiAutocompleteTagProps = {
  id: string;
  label: string | React.ReactNode;
  name: string;
  items: any[];
  defaultValue: any;
  itemText?: string;
  itemValue?: string;
  fullWidth?: boolean;
  limitTags?: number;
  isChecked?: boolean;
  onChange?(name: string, value: any): void;
  onBlur?(name: string, value: any): void;
  onInputChange?(value: string): Promise<boolean>;
  errors?: any;
  touched?: any;
  disabled?: boolean;
  variant?: 'standard' | 'outlined' | 'filled' | undefined;
  refresh?: boolean;
  shrinkLabel?: boolean;
};

const MultiAutocompleteTag: React.FC<MultiAutocompleteTagProps> = (props: MultiAutocompleteTagProps) => {
  const { id, variant, shrinkLabel, name, label, items, disabled, onChange, onInputChange, itemText, errors, touched } =
    props;

  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [textImput, setTextImput] = useState<string>('');
  const classes = useStyles();

  const allSelected = items?.length === selectedOptions?.length;

  const handleSelectAll = useCallback(
    (isSelected: any) => {
      if (isSelected) {
        setSelectedOptions(items);
        onChange && onChange(name, items);
      } else {
        setSelectedOptions([]);
        onChange && onChange(name, []);
      }
    },
    [items, name, onChange]
  );

  const _onChange = useCallback(
    (event: any, selectedOptions: any, reason: any) => {
      if (reason === 'selectOption' || reason === 'removeOption') {
        if (selectedOptions.find((option: any) => option?.value === 'select-all')) {
          handleSelectAll(!allSelected);
        } else {
          setSelectedOptions(selectedOptions);
          onChange && onChange(name, selectedOptions);
        }
      } else if (reason === 'clear') {
        setSelectedOptions([]);
        onChange && onChange(name, []);
      }
    },
    [allSelected, onChange, handleSelectAll, name]
  );

  const _onInputChange = useCallback(
    (event: any, value: string) => {
      setTextImput(value);
      if (onInputChange) {
        setIsLoading(true);
        onInputChange(value)
          .then(() => {
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    },
    [onInputChange]
  );

  return (
    <FormGroup row>
      <FormControl fullWidth>
        <MaterialAutocomplete
          multiple
          id={id}
          options={items}
          disableCloseOnSelect
          disabled={disabled}
          value={selectedOptions}
          getOptionLabel={(option: any) => {
            if (option) return itemText ? option[itemText] ?? '' : String(option);
            return '';
          }}
          renderTags={(option: any, getTagProps: any) => {
            return selectedOptions.map((option: any, index: number) => (
              <Chip
                key={`option_${index}`}
                variant="outlined"
                label={option[itemText ?? ''] ?? ''}
                {...getTagProps({ index })}
              />
            ));
          }}
          filterOptions={(options: any, state: FilterOptionsState<any>) => {
            const filtered = options.filter((option: any) => {
              if (itemText) {
                return String(option[itemText])
                  ?.toLowerCase()
                  ?.includes(state?.inputValue?.toLowerCase());
              }
              return option?.includes(state?.inputValue);
            });
            const values: any = [];
            if (!allSelected) {
              values.push({ [itemText ? itemText : 'description']: 'Seleccionar Todos', value: 'select-all' });
            }
            return [...values, ...filtered];
          }}
          // autoHighlight
          onChange={_onChange}
          onInputChange={_onInputChange}
          renderInput={(params: any) => {
            return (
              <TextField
                {...params}
                name={name}
                label={(selectedOptions?.length == 0 && textImput == '') && label}
                InputLabelProps={{ shrink: shrinkLabel ?? undefined }}
                margin="normal"
                variant={variant ?? 'standard'}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            );
          }}
          noOptionsText="No se encontraron coincidencias"
          className={clsx(errors?.[name] && touched?.[name] && Boolean(errors[name]) && classes.error)}
        />
        <FormHelperText error={errors?.[name] && touched?.[name] && Boolean(errors[name])} style={{ marginTop: '0px' }}>
          {errors?.[name] && touched?.[name] ? errors[name] : ''}
        </FormHelperText>
      </FormControl>
    </FormGroup>
  );
};

MultiAutocompleteTag.defaultProps = {
  // disableClearable: false
  isChecked: false,
  limitTags: 20
};

export default React.memo(MultiAutocompleteTag);
