import React, { useState, useEffect, useCallback, useReducer, useRef, ReactNode } from 'react';
import { Autocomplete as MaterialAutocomplete } from '@mui/material';
import { TextField, FormHelperText, FormControl, FormGroup, CircularProgress } from '@mui/material';
import useStyles from './Autocomplete.css';
import clsx from 'clsx';
import { AxiosResponse } from 'axios';
import useDebounce from '~hooks/use_debounce';
import { dataReducer, initialState } from './dataReducer';

type AutocompleteProps = {
  id: string;
  label: string;
  name: string;
  value: any;
  initialValue?: any;
  defaultValue: any;
  itemText?: string;
  itemValue?: string;
  fullWidth?: boolean;
  variant?: 'standard' | 'outlined';
  onLoad(page: number, search: string): Promise<AxiosResponse<any>>;
  onChange?(name: string, value: any): void;
  renderOption?(value: any): ReactNode;
  errors?: any;
  touched?: any;
  disabled?: boolean;
  clear?: boolean;
};

const Autocomplete: React.FC<AutocompleteProps> = (props: AutocompleteProps) => {
  const isCompMounted = useRef(null);
  const {
    id,
    name,
    label,
    disabled,
    onChange,
    itemText,
    itemValue,
    errors,
    touched,
    onLoad,
    renderOption,
    variant = 'standard',
    clear
  } = props;
  const [currentValue, setCurrentValue] = useState<any>(null);
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const debouncedValue = useDebounce<string>(state.search, 500);
  const classes = useStyles();

  const handleLoadData = useCallback(() => {
    dispatch({ type: 'setIsLoading', payload: { isLoading: true } });
    onLoad(state.page, debouncedValue)
      .then((res: any) => {
        const {
          data: { total, items, total_pages }
        } = res.data;
        if (isCompMounted.current) {
          dispatch({ type: 'setIsLoading', payload: { isLoading: false } });
          dispatch({ type: 'setItems', payload: { items, total, totalPages: total_pages } });
        }
      })
      .catch(() => {
        if (isCompMounted.current) {
          dispatch({ type: 'setIsLoading', payload: { isLoading: false } });
          dispatch({ type: 'setItems', payload: { items: [], total: 0 } });
        }
      });
  }, [onLoad, state.page, debouncedValue]);

  const _onChange = useCallback(
    (event: any, newValue: any) => {
      setCurrentValue(newValue);
      onChange && onChange(name, newValue);
    },
    [name, onChange]
  );

  const _onInputChange = useCallback((_: React.SyntheticEvent, value: string) => {
    dispatch({ type: 'setSearch', payload: { search: value } });
  }, []);

  const handleScroll = useCallback(
    (event: any) => {
      const target = event.target;
      if (!state.isLoading && target.scrollHeight - target.scrollTop === target.clientHeight) {
        dispatch({ type: 'setPage', payload: { page: ++state.page } });
      }
    },
    [state.isLoading, state.page]
  );

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  useEffect(() => {
    setCurrentValue(null);
  }, [clear]);

  return (
    <FormGroup row ref={isCompMounted}>
      <FormControl fullWidth>
        <MaterialAutocomplete
          clearOnEscape
          autoComplete
          autoHighlight
          loading={state.isLoading}
          size="small"
          disabled={disabled}
          options={state.items}
          getOptionLabel={(option: any) => {
            if (option && renderOption) return renderOption(option);
            if (option) return itemText ? option[itemText] : String(option);
            return '';
          }}
          id={id}
          value={currentValue}
          isOptionEqualToValue={(option: any, value: any) => {
            if (option && value) {
              if (itemValue) return option[itemValue] === value[itemValue];
              return option === value;
            }
            return false;
          }}
          onChange={_onChange}
          onInputChange={_onInputChange}
          ListboxProps={{
            role: 'list-box',
            onScroll: handleScroll
          }}
          renderInput={(params: any) => (
            <TextField
              {...params}
              name={name}
              label={label}
              margin="normal"
              variant={variant}
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {state.isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
          noOptionsText="No se encontraron coincidencias"
          loadingText="Cargando..."
          className={clsx(errors?.[name] && touched?.[name] && Boolean(errors[name]) && classes.error)}
        />
        <FormHelperText error={errors?.[name] && touched?.[name] && Boolean(errors[name])} style={{ marginTop: '0px' }}>
          {errors?.[name] && touched?.[name] ? errors[name] : ''}
        </FormHelperText>
      </FormControl>
    </FormGroup>
  );
};

export default React.memo(Autocomplete);
