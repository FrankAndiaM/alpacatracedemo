import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import useStyles from './DataTable.css';
import { Table, TableContainer, Paper, Box, Divider } from '@mui/material';
import TableHead, { TableHeadColumn } from '~molecules/TableHead/TableHead';
import TableBody from '~molecules/TableBody/TableBody';
import TextFieldSearch from '~molecules/TextFieldSearch/TextFieldSearch';
import TablePagination from '~ui/molecules/TablePagination/TablePagination';
import { AxiosResponse } from 'axios';
import { dataTableReducer, initialState } from './datatableReducer';
import useDebounce from '~hooks/use_debounce';
import ListView from './ListView';
import { showMessage } from '~utils/Messages';

export type FilterTable = {
  field: string; //nombre del campo a filtrar
  elements: string[]; //valores a filtrar
};

/**
 *
 */
type DataTableProps = {
  headRightComponent?: React.ReactChild;
  headLeftComponent?: React.ReactChild;
  headers: TableHeadColumn[];
  onLoad(page: number, perPage: number, orderBy: string, order: string, search: string): Promise<AxiosResponse<any>>;
  stickyHeader?: boolean;
  refresh?: boolean;
  textNoItems?: string;
  isCollapsible?: boolean;
  isListView?: boolean;
  rowsPerPageOptions?: Array<number | { value: number; label: string }>;
  hideSearch?: boolean;
  resetPages?: boolean;
  titleList?: string;
  subTitleList?: string;
  renderItem?: (row: any) => any;
  loadDataRowSelected?: (row: any) => void;
  value?: any;
  filters?: FilterTable;
};

const DataTable: React.FC<DataTableProps> = (props: DataTableProps) => {
  const isCompMounted = useRef(null);
  const {
    headRightComponent,
    headLeftComponent,
    headers,
    stickyHeader,
    refresh,
    textNoItems,
    onLoad,
    isCollapsible,
    rowsPerPageOptions,
    hideSearch,
    resetPages,
    isListView,
    titleList,
    subTitleList,
    loadDataRowSelected,
    renderItem,
    value,
    filters
  }: DataTableProps = props;
  const [state, dispatch] = useReducer(dataTableReducer, initialState);
  const debouncedValue = useDebounce<string>(state.search, 500);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const classes = useStyles();

  const handleLoadDataTable = useCallback(() => {
    dispatch({ type: 'setIsLoading', payload: { isLoading: true } });
    onLoad(state.page, state.perPage, state.orderBy, state.order ?? '', debouncedValue)
      .then((res: any) => {
        const {
          data: { total, items }
        } = res.data;
        let filterItems;
        if (filters) {
          if (Array.isArray(items) && items.length > 0) {
            filterItems = items.filter((element: any) => {
              return element[filters.field] && !filters.elements.includes(element[filters.field]);
            });
          }
        } else {
          filterItems = items;
        }
        // console.log(filterItems);
        if (isCompMounted.current) {
          dispatch({ type: 'setIsLoading', payload: { isLoading: false } });
          dispatch({ type: 'setItems', payload: { items: filterItems, total } });
        }
      })
      .catch(() => {
        if (isCompMounted.current) {
          dispatch({ type: 'setIsLoading', payload: { isLoading: false } });
          dispatch({ type: 'setItems', payload: { items: [], total: 0 } });
        }
      });
  }, [filters, onLoad, state.page, state.perPage, state.orderBy, state.order, debouncedValue]);

  const handleSort = useCallback(
    (column: any) => {
      const isDesc: boolean = state.orderBy === column && state.order === 'desc';
      dispatch({ type: 'setOrder', payload: { order: isDesc ? 'asc' : 'desc', orderBy: column } });
    },
    [state.orderBy, state.order]
  );

  const _onChangePage = useCallback((_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    // console.log(newPage);
    // console.log(++newPage);
    dispatch({ type: 'setPage', payload: { auxPage: newPage, page: ++newPage } });
  }, []);

  const _onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    dispatch({ type: 'setPage', payload: { auxPage: 0, page: 1 } });
    dispatch({ type: 'setPerPage', payload: { perPage: Number(value) } });
  }, []);

  useEffect(() => {
    dispatch({ type: 'setPage', payload: { auxPage: 0, page: 1 } });
  }, [resetPages]);

  useEffect(() => {
    handleLoadDataTable();
  }, [handleLoadDataTable, refresh]);

  // veo si hay datos para cargar sino cambio el hasMore
  useEffect(() => {
    const maxPages = Math.ceil(state.totalItems / state.perPage);
    if (state.page === maxPages) {
      setHasMore((prev: boolean) => !prev);
    }
  }, [state.page, state.perPage, state.totalItems]);

  // ListView
  const _listItems = useCallback(async () => {
    if (!state.isLoading && hasMore) {
      dispatch({ type: 'setIsLoading', payload: { isLoading: true } });

      await onLoad(state.page, state.perPage, '', '', debouncedValue)
        .then((res: any) => {
          const {
            data: { total, items }
          } = res.data;
          const maxPages = Math.ceil(total / state.perPage);

          dispatch({ type: 'setItems', payload: { items: [...(state.items ?? []), ...(items ?? [])], total } });

          if (state.page === maxPages) {
            setHasMore((prev: boolean) => !prev);
          } else {
            // dispatch({ type: 'setPage', payload: { auxPage: state.page, page: state.page + 1 } });
          }

          // }
          dispatch({ type: 'setIsLoading', payload: { isLoading: false } });
        })
        .catch(() => {
          showMessage('', 'Problemas al cargar los formularios.', 'error', true);
          setHasMore((prev: boolean) => !prev);
          dispatch({ type: 'setIsLoading', payload: { isLoading: false } });
        });
    }
  }, [debouncedValue, hasMore, onLoad, state.items, state.isLoading, state.page, state.perPage]);

  const handleOnChangeSearch = useCallback((value: any) => {
    dispatch({ type: 'setSearch', payload: { search: value } });
  }, []);

  const handleScroll = useCallback(
    async (elementRef: any) => {
      if (elementRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = elementRef.current;
        const diff = scrollTop + clientHeight - scrollHeight;
        if (diff > -1) {
          // TO SOMETHING HERE
          await _listItems();
        }
      }
    },
    [_listItems]
  );

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        px={1}
        pb={1}
        justifyContent={
          headLeftComponent !== undefined || headRightComponent !== undefined ? 'space-between' : 'flex-end'
        }
      >
        {headLeftComponent}
        {!hideSearch && <TextFieldSearch onChange={handleOnChangeSearch} />}
        {headRightComponent}
      </Box>
      <Divider />
      {!isListView && (
        <Paper ref={isCompMounted}>
          <TableContainer>
            <Table
              className={classes.table}
              stickyHeader={stickyHeader}
              // eslint-disable-next-line no-constant-condition
              size={'medium'}
              aria-label="table"
            >
              <TableHead
                headers={headers}
                orderBy={state.orderBy}
                order={state.order}
                createSortHandler={handleSort}
                isCollapsible={isCollapsible}
              />
              <TableBody
                headers={headers}
                items={state.items}
                loading={state.isLoading}
                textNoItems={textNoItems}
                isCollapsible={isCollapsible}
              />
            </Table>
          </TableContainer>
          <TablePagination
            currentCount={state?.totalItems}
            rowsPerPage={state?.rowsPerPage}
            page={state?.auxPage}
            onChangePage={_onChangePage}
            onChangeRowsPerPage={_onChangeRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        </Paper>
      )}

      {isListView && (
        <Paper ref={isCompMounted}>
          <Box color={'#212B36'} fontWeight={700} fontSize={16}>
            {titleList}
          </Box>
          <Box color={'#212B36'} fontWeight={700} fontSize={16}>
            {subTitleList}
          </Box>

          <ListView
            headers={headers}
            hideSearch={hideSearch}
            items={state.items}
            loadDataRowSelected={loadDataRowSelected}
            renderItem={renderItem}
            handleScroll={handleScroll}
            handleSearch={handleOnChangeSearch}
            isLoadingSearch={state.isLoading}
            value={value}
          />
        </Paper>
      )}
    </>
  );
};
DataTable.defaultProps = {
  headers: [], // { text. value, sortable, align, disablePadding}
  stickyHeader: false,
  textNoItems: 'No se encontraron resultados.',
  isCollapsible: false
};

export default React.memo(DataTable);
