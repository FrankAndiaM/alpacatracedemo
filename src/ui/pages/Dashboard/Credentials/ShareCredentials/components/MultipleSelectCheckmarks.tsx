import React, { useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Tooltip,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams
} from '@mui/material';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import useDebounce from '~hooks/use_debounce';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250
//     }
//   }
// };

export type MultipleSelectOption = {
  display_name: string;
  id: string;
};

type MultipleSelectCheckmarkProps = {
  paginate: any;
  labelText: string;
  handleSetItems: (selected: any[]) => void;
  noItemsText?: string;
  renderItem?: (row: any) => any;
  getOptionDisabled?: (row: any) => boolean;
};

// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

const MultipleSelectCheckmark: React.FC<MultipleSelectCheckmarkProps> = (props: MultipleSelectCheckmarkProps) => {
  const { paginate, labelText, handleSetItems, noItemsText, renderItem, getOptionDisabled } = props;
  const [open, setOpen] = React.useState(true);
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemsPerPage] = useState<number>(20);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearch = useDebounce(searchValue, 1000);
  // const [itemsSelected, setItemsSelected] = useState<any[]>([]);

  useEffect(() => {
    if (items.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [items]);
  const [querySearch, setQuerySearch] = useState<string>('');
  const handleOnChangeInput = useCallback((e: any) => {
    // console.log(e.target.value);
    if (e.target.value && e.target.value.length > 0) {
      setQuerySearch(e.target.value);
      // setSearchValue(e.target.value);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (querySearch.length > 0) {
      setSearchValue(querySearch);
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

  // const uniqueKeys = (value: any, index: number, self: any[]) => {
  //   return self.indexOf(value) === index;
  // };

  useEffect(() => {
    async function getSearch() {
      setIsLoading(true);
      // setItems([]);
      const data = await paginate(1, itemsPerPage, '', '', debouncedSearch).then((res: any) => res?.data?.data);
      // const maxPages = Math.ceil(data.total / itemsPerPage);
      if (data && data.items.length > 0) {
        // console.log(data);
        setItems((value: any[]) => {
          // const unique = [...data.items, ...value].map((item: any) => item.id).filter(uniqueKeys);
          // console.log(value);
          // console.log(data.items);
          // console.log(unique);
          // return unique ?? [];
          return [...data.items, ...value] ?? [];
        });
        // loadDataRowSelected(data.items[0]);
        // setSelectedIndex(0);
      }
      setIsLoading(false);
    }

    if (debouncedSearch) getSearch();
  }, [debouncedSearch, itemsPerPage, paginate]);

  // useEffect(() => {
  //   handleSetItems(itemsSelected);
  // }, [handleSetItems, itemsSelected]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      multiple
      limitTags={1}
      fullWidth={true}
      onKeyDown={handleKeyDown}
      sx={{
        width: 300,
        zIndex: 999,
        backgroundColor: 'white',
        maxHeight: '56px',
        '& .MuiAutocomplete-paper': { zIndex: 999, backgroundColor: 'white' }
      }}
      // value={itemsSelected}
      onChange={(_e: any, newValue: any[]) => {
        // setItemsSelected(newValue);
        handleSetItems(newValue);
      }}
      open={open}
      // size="small"
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      disableCloseOnSelect={true}
      getOptionDisabled={getOptionDisabled}
      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
      getOptionLabel={(option: any) => option?.full_name ?? ''}
      // eslint-disable-next-line @typescript-eslint/typedef
      renderOption={(props, option: any, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {renderItem ? renderItem(option) : option.full_name ?? ''}
          {/* {option.full_name ?? ''} */}
        </li>
      )}
      options={items}
      loading={isLoading}
      noOptionsText={noItemsText ?? 'No hay opciones'}
      renderTags={(value: any[], _renderTags: AutocompleteRenderGetTagProps) => {
        // if (open) {
        if (value.length > 1) {
          return `${value.length} seleccionados`;
        }
        return value.map((u: any) => u.full_name ?? '').join(', ');
        // }
        // return (
        //   <Box style={{ width: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        //     {value.map((u: any) => u.full_name ?? '').join(', ')}
        //   </Box>
        // );
      }}
      onInputChange={handleOnChangeInput}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={labelText}
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
