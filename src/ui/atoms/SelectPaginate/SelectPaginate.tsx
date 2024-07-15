import React, { useState, useCallback, useEffect } from 'react';
import { Box, Select, MenuItem, InputLabel } from '@mui/material';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { showMessage } from '~utils/Messages';
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles(() => ({
  scrollBarClass: {
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    /* Track */
    '&::-webkit-scrollbar-track': {
      background: '#ffffff'
    },

    /* Handle */
    '&::-webkit-scrollbar-thumb': {
      background: '#D9D9D9',
      borderRadius: '13px'
    },

    /* Handle on hover */
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#888'
    }
  }
}));

type ListItemSelectProps = {
  variant?: 'filled' | 'standard' | 'outlined';
  label: string | React.ReactNode;
  name: string;
  id: string;
  value: any;
  disabled?: boolean;
  paginate: any;
  itemValue?: string;
  onChange?: (name: any, value: any) => void;
  rowsPerPage?: number;
  renderItem?: (row: any) => any;
  renderText?: (row: any) => any;
};

const ListItemSelect: React.FC<ListItemSelectProps> = (props: ListItemSelectProps) => {
  const {
    paginate,
    id,
    variant,
    name,
    disabled,
    label,
    onChange,
    value,
    itemValue,
    rowsPerPage,
    renderItem,
    renderText
  } = props;
  const classes = useStyles();

  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(rowsPerPage ?? 10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentValue, setCurrentValue] = useState<any>('');

  const _listItems = useCallback(async () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);

      await paginate(page, itemsPerPage, '', '', '')
        .then((res: any) => {
          const data = res?.data?.data;
          const maxPages = Math.ceil(data.total / itemsPerPage);
          // if (data.items && data.items.length > 0) {
          setItems((prevValues: any[]) => [...prevValues, ...(data.items ?? [])]);
          if (page === maxPages) {
            setHasMore((prev: boolean) => !prev);
          } else {
            setPage((prev: number) => prev + 1);
          }

          // }
          setIsLoading(false);
        })
        .catch(() => {
          showMessage('', 'Problemas al cargar los formularios.', 'error', true);

          setHasMore((prev: boolean) => !prev);
          setIsLoading(false);
        });
    }
  }, [page, isLoading, hasMore, paginate, itemsPerPage]);

  useEffect(() => {
    let selectedValue = '';
    // if itemValue exist, maybe items is a array object
    if (itemValue) {
      // find value
      selectedValue = items.filter((item: any) => {
        return item[itemValue] === value;
      })[0];
    } else {
      selectedValue = value;
    }
    setCurrentValue(selectedValue || '');
  }, [itemValue, items, value]);

  const handleScroll = useCallback(
    (event: any) => {
      const target = event.target;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const diff = scrollTop + clientHeight - scrollHeight;
      if (diff > -1) {
        // TO SOMETHING HERE
        _listItems();
      }
    },
    [_listItems]
  );

  useEffect(() => {
    async function getSearch() {
      setIsLoading(true);
      setItems([]);
      const data = await paginate(1, itemsPerPage, '', '', '').then((res: any) => res?.data?.data);
      if (data && data.items.length > 0) {
        setItems(data.items ?? []);
      }
      setIsLoading(false);
    }

    getSearch();
  }, [itemsPerPage, paginate]);

  const _onChange = useCallback(
    (event: any) => {
      const { value } = event.target;
      setCurrentValue(value);
      // valida onChange porque puede ser undefined
      onChange !== undefined && onChange(name, itemValue ? value[itemValue] : String(value));
    },
    [itemValue, name, onChange]
  );

  return (
    <>
      <InputLabel id="demo-simple-select-label" style={{ color: '#2F3336', marginBottom: '8px' }}>
        {label}
      </InputLabel>
      <Select
        variant={variant ?? 'outlined'}
        labelId={`${id}_label`}
        fullWidth
        id={id}
        name={name}
        value={currentValue}
        MenuProps={{
          style: {
            maxHeight: '300px'
          },
          PaperProps: {
            className: classes.scrollBarClass,
            onScroll: handleScroll
          }
        }}
        onChange={_onChange}
        renderValue={(selected: any) => (renderText ? renderText(selected) : selected?.name ?? '')}
        disabled={disabled}
        endAdornment={
          isLoading && (
            <Box my={1} key="loading">
              <LinearProgress loading={true} />
            </Box>
          )
        }>
        {items.map((item: any, index: number) => (
          <MenuItem
            value={item}
            key={`select_item_${name}_${index}`}
            className={classes.item}
            disabled={item.hasOwnProperty('disabled') ? item.disabled : false}
            classes={{ selected: classes.selected }}>
            {renderItem ? renderItem(item) : item?.name ?? ''}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default ListItemSelect;
