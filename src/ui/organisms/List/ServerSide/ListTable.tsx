import React, { useRef, useCallback, useReducer, useEffect, ReactNode } from 'react';
import { Pagination, Box, ListItem, Divider, Checkbox } from '@mui/material';
import { List, CircularProgress, Typography } from '@mui/material';
import TextFieldSearch from '~molecules/TextFieldSearch/TextFieldSearch';
import { AxiosResponse } from 'axios';
import useDebounce from '~hooks/use_debounce';
import { listReducer, initialState } from './listTableReducer';

type ListTableProps = {
  itemsSelected: any[];
  onSelectItem: (value: any) => void;
  itemId: string;
  itemDescription: string;
  labelSelectedRecords?: string;
  labelEmpty?: string;
  renderItem?: (value: any, isSelect: boolean, onSelectItem: any) => ReactNode;
  onLoad(page: number, perPage: number, orderBy: string, order: string, search: string): Promise<AxiosResponse<any>>;
};

const ListTable: React.FC<ListTableProps> = (props: ListTableProps) => {
  const isCompMounted = useRef(null);
  const { onLoad, itemsSelected, onSelectItem, itemId, itemDescription, renderItem }: ListTableProps = props;
  const { labelEmpty, labelSelectedRecords }: ListTableProps = props;
  const [state, dispatch] = useReducer(listReducer, initialState);
  const debouncedValue = useDebounce<string>(state.search, 500);

  const handleLoadData = useCallback(() => {
    dispatch({ type: 'setIsLoading', payload: { isLoading: true } });
    onLoad(state.page, state.perPage, state.orderBy, state.order ?? '', debouncedValue)
      .then((res: any) => {
        const {
          data: { total, items }
        } = res.data;
        if (isCompMounted.current) {
          dispatch({ type: 'setIsLoading', payload: { isLoading: false } });
          dispatch({ type: 'setItems', payload: { items, total, totalPages: Math.ceil(total / state.perPage) } });
        }
      })
      .catch(() => {
        if (isCompMounted.current) {
          dispatch({ type: 'setIsLoading', payload: { isLoading: false } });
          dispatch({ type: 'setItems', payload: { items: [], total: 0 } });
        }
      });
  }, [onLoad, state.page, state.perPage, state.orderBy, state.order, debouncedValue]);

  const handleOnChangeSearch = useCallback((value: any) => {
    dispatch({ type: 'setSearch', payload: { search: value } });
  }, []);

  const verifyIfIsSelected = (producer: any): boolean => {
    return itemsSelected.some((value: any) => value[itemId] === producer[itemId]);
  };

  const _onChangePage = useCallback((_event: React.ChangeEvent<unknown>, newPage: number) => {
    dispatch({ type: 'setPage', payload: { auxPage: newPage, page: newPage } });
  }, []);

  useEffect(() => {
    handleLoadData();
  }, [handleLoadData]);

  return (
    <>
      <Box component="span" fontWeight={700} px={1} py={2}>
        {labelSelectedRecords}: {itemsSelected.length}
      </Box>
      <Box display="flex" alignItems="center" mt={2} px={1} pb={1} ref={isCompMounted}>
        <TextFieldSearch onChange={handleOnChangeSearch} />
      </Box>
      {state?.isLoading && (
        <>
          <Box minHeight="30vh" display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress color="primary" size={50} />
          </Box>
        </>
      )}
      {state?.items.length === 0 && !state?.isLoading && (
        <Box mt={2} mr={1} minHeight="30vh">
          {labelEmpty}
        </Box>
      )}
      {state?.items.length !== 0 && !state.isLoading && (
        <div>
          <List
            sx={{
              overflow: 'auto',
              maxHeight: '50vh'
            }}
            subheader={<li />}
          >
            {state?.items?.map((value: any, index: number) => {
              return (
                <Box key={`list_item_${index}`}>
                  {renderItem ? (
                    renderItem(value, verifyIfIsSelected(value), onSelectItem)
                  ) : (
                    <ListItem role={undefined} dense button onClick={() => onSelectItem(value)}>
                      <Box display="flex" alignItems="center">
                        <Checkbox checked={verifyIfIsSelected(value)} />
                        <Typography>{value[itemDescription]}</Typography>
                      </Box>
                    </ListItem>
                  )}
                  <Divider />
                </Box>
              );
            })}
          </List>

          <Box display="flex" justifyContent="center">
            <Pagination
              page={state.page}
              count={state.totalPages}
              onChange={_onChangePage}
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </div>
      )}
    </>
  );
};

ListTable.defaultProps = {
  labelEmpty: 'No se encontraron registros disponibles',
  labelSelectedRecords: 'Registros seleccionados'
};

export default React.memo(ListTable);
