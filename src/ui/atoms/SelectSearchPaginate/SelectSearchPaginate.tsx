import React, { useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Tooltip,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams
} from '@mui/material';
import useDebounce from '~hooks/use_debounce';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export type MultipleSelectOption = {
  display_name: string;
  id: string;
};

type MultipleSelectCheckmarkProps = {
  paginate: any;
  labelText: string | React.ReactNode;
  shrinkLabel?: boolean;
  labelSelected?: string;
  handleSetItems: (selected: any) => void;
  noItemsText?: string;
  renderItem?: (row: any) => any;
  getOptionDisabled?: (row: any) => boolean;
};

const MultipleSelectCheckmark: React.FC<MultipleSelectCheckmarkProps> = (props: MultipleSelectCheckmarkProps) => {
  const {
    paginate,
    labelText,
    shrinkLabel,
    labelSelected,
    handleSetItems,
    noItemsText,
    renderItem,
    getOptionDisabled
  } = props;
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemsPerPage] = useState<number>(20);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearch = useDebounce(searchValue, 1000);

  const [querySearch, setQuerySearch] = useState<string>('');
  const handleOnChangeInput = useCallback((e: any) => {
    if (e.target.value && e.target.value.length > 0) {
      setQuerySearch(e.target.value);
    } else {
      setQuerySearch('');
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (querySearch.length > 0) {
      setSearchValue(querySearch);
    } else {
      setSearchValue('');
    }
  }, [querySearch]);

  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );
  
  useEffect(() => {
    async function getSearch() {
      setIsLoading(true);
      const data = await paginate(1, itemsPerPage, '', '', debouncedSearch).then((res: any) => res?.data?.data);

      if (data && data.items.length > 0) {
        setItems(data.items ?? []);
      }
      setIsLoading(false);
    }

    getSearch();
  }, [debouncedSearch, itemsPerPage, paginate]);

  const _onChange = useCallback(
    (event: any, newValue) => {
      handleSetItems(newValue);
      if(newValue){
        setQuerySearch(labelSelected ? newValue[labelSelected] : '');
      }
      else{
        setQuerySearch('');
      }
      
    },
    [handleSetItems, labelSelected, setQuerySearch]
  );

  return (
    <Autocomplete
      id="asynchronous-demo"
      limitTags={1}
      fullWidth={true}
      onKeyDown={handleKeyDown}
      sx={{
        width: '100%',
        zIndex: 999,
        backgroundColor: 'white',
        maxHeight: '56px',
        '& .MuiAutocomplete-paper': { zIndex: 999, backgroundColor: 'white' }
      }}
      onChange={_onChange}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      disableCloseOnSelect={true}
      getOptionDisabled={getOptionDisabled}
      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
      getOptionLabel={(option: any) => (labelSelected ? option[labelSelected] : option.full_name ?? '')}
      // eslint-disable-next-line @typescript-eslint/typedef
      renderOption={(props, option: any) => (
        <li {...props}>{renderItem ? renderItem(option) : option.full_name ?? ''}</li>
      )}
      options={items}
      loading={isLoading}
      noOptionsText={noItemsText ?? 'No hay opciones'}
      renderTags={(value: any, _renderTags: AutocompleteRenderGetTagProps) => {
        return value.name;
      }}
      onInputChange={handleOnChangeInput}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={(querySearch == '') && labelText}
          InputLabelProps={{ shrink: shrinkLabel ?? undefined }}
          sx={{ zIndex: 999, backgroundColor: 'white' }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {!isLoading && (
                  <Tooltip title="buscar">
                    <SearchRoundedIcon
                      fontSize="small"
                      sx={{ '&:hover': { cursor: 'pointer' } }}
                      onClick={handleSearch}
                    />
                  </Tooltip>
                )}
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
};

export default MultipleSelectCheckmark;
