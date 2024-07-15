import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, List, ListItemButton } from '@mui/material';
import Radio from '@mui/material/Radio';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { showMessage } from '~utils/Messages';
import TextFieldSearch from '~ui/molecules/TextFieldSearch/TextFieldSearch';
import { makeStyles } from '@mui/styles';
import useDebounce from '~hooks/use_debounce';

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
  paginate: any;
  loadDataRowSelected: (row: any) => void;
  rowsPerPage?: number;
  renderItem?: (row: any) => any;
  isRefresh?: boolean;
};

const ListItemSelect: React.FC<ListItemSelectProps> = (props: ListItemSelectProps) => {
  const { paginate, loadDataRowSelected, rowsPerPage, renderItem } = props;
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(rowsPerPage ?? 10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearch = useDebounce(searchValue, 2000);
  const [initialItems, setInitialItems] = useState<any[]>([]);

  const handleListItemClick = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      loadDataRowSelected(items[index]);
    },
    [items, loadDataRowSelected]
  );

  const _listItems = useCallback(async () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      await paginate(page, itemsPerPage, '', '', '')
        .then((res: any) => {
          const completeData = res?.data?.data;
          if (completeData && Array.isArray(completeData.items) && completeData.items.length > 0) {
            const newItems = completeData.items.filter((element: any) => !element?.is_credential_issued);
            const data = { ...completeData, items: newItems };
            const maxPages = Math.ceil(data.total / itemsPerPage);
            // if (data.items && data.items.length > 0) {
            setItems((prevValues: any[]) => [...prevValues, ...(data.items ?? [])]);
            setInitialItems((prevValues: any[]) => [...prevValues, ...(data.items ?? [])]);
            if (page === maxPages) {
              setHasMore((prev: boolean) => !prev);
            } else {
              setPage((prev: number) => prev + 1);
            }
            if (page === 1 && data.items.length > 0) {
              loadDataRowSelected(data.items[0]);
              setSelectedIndex(0);
            }
          }
          // }
          setIsLoading(false);
        })
        .catch(() => {
          showMessage('', 'Problemas al cargar los formularios.', 'error', true);
          loadDataRowSelected({});
          setHasMore((prev: boolean) => !prev);
          setIsLoading(false);
        });
    }
  }, [isLoading, hasMore, paginate, page, itemsPerPage, loadDataRowSelected]);

  // const refreshSearch = useCallback(() => {
  //   setPage(0);
  //   setItems([]);
  //   setHasMore(true);
  //   setSearchValue('');
  //   _listItems();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (isRefresh) refreshSearch();
  // }, [isRefresh, refreshSearch]);

  // useEffect(() => {
  //   refreshSearch();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isRefresh]);

  const handleOnChangeSearch = useCallback(
    (value: any) => {
      if (value === '' && initialItems.length > 0) {
        setItems(initialItems);
        loadDataRowSelected(initialItems[0]);
        setSelectedIndex(0);
        // setInitialItems([]);
      }
      setSearchValue(value);
    },
    [initialItems, loadDataRowSelected]
  );

  const handleScroll = useCallback(async () => {
    if (elementRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = elementRef.current;
      const diff = scrollTop + clientHeight - scrollHeight;
      if (diff > -1) {
        // TO SOMETHING HERE
        await _listItems();
      }
    }
  }, [_listItems]);

  useEffect(() => {
    _listItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _getSearch = useCallback(
    async (search: string) => {
      setIsLoading(true);
      const completeData = await paginate(1, itemsPerPage, '', '', search).then((res: any) => res?.data?.data);
      // const maxPages = Math.ceil(data.total / itemsPerPage);
      if (completeData && Array.isArray(completeData.items) && completeData.items.length > 0) {
        const newItems = completeData.items.filter((element: any) => !element?.is_credential_issued);
        const data = { ...completeData, items: newItems };
        setItems(data.items ?? []);
        loadDataRowSelected(data.items[0]);
        setSelectedIndex(0);
      }
      setIsLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemsPerPage, paginate, setSelectedIndex]
  );

  useEffect(() => {
    // console.log('here');
    // async function getSearch() {
    //   setIsLoading(true);
    //   const completeData =
    // await paginate(1, itemsPerPage, '', '', debouncedSearch).then((res: any) => res?.data?.data);
    //   // const maxPages = Math.ceil(data.total / itemsPerPage);
    //   if (completeData && Array.isArray(completeData.items) && completeData.items.length > 0) {
    //     const newItems = completeData.items.filter((element: any) => !element?.is_credential_issued);
    //     const data = { ...completeData, items: newItems };
    //     setItems(data.items ?? []);
    //     loadDataRowSelected(data.items[0]);
    //     setSelectedIndex(0);
    //   }
    //   setIsLoading(false);
    // }
    // console.log(debouncedSearch);
    if (debouncedSearch !== '') _getSearch(debouncedSearch);
  }, [_getSearch, debouncedSearch]);

  return (
    // <Box sx={{ bgcolor: 'background.paper' }}>
    <>
      <TextFieldSearch fullWidth maxLengthValue={50} isAnimated={false} onChange={handleOnChangeSearch} />
      {isLoading && (
        <Box my={1} key="loading">
          <LinearProgress loading={true} />
        </Box>
      )}
      <div
        ref={elementRef}
        onScroll={handleScroll}
        className={classes.scrollBarClass}
        style={{
          // height: '85%',
          height: '400px',
          overflow: 'auto',
          display: items?.length === 0 ? 'flex' : 'block',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <List>
          {items?.length === 0 ? (
            <Box px={2}>No se encontraron registros disponibles.</Box>
          ) : (
            items.map((element: any, index: number) => {
              return (
                <ListItemButton
                  key={`item_list_${index}`}
                  selected={selectedIndex === index}
                  onClick={() => selectedIndex !== index && handleListItemClick(index)}
                >
                  <Box display="flex" alignItems={'center'}>
                    <Box>
                      <Radio checked={selectedIndex === index} />
                    </Box>
                    {renderItem && renderItem(element)}
                  </Box>
                </ListItemButton>
              );
            })
          )}
        </List>
      </div>
    </>
    // </Box>
  );
};

export default ListItemSelect;