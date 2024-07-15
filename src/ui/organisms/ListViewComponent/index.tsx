import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
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

type ListViewComponentProps = {
  pagination(
    page: number,
    perPage: number,
    orderBy: string,
    order: string,
    search: string
  ): Promise<AxiosResponse<any>>;
  rowsPerPage: number;
  searchValue: string;
  renderItem: (row: any) => any;
};

const ListViewComponent: React.FC<ListViewComponentProps> = (props: ListViewComponentProps) => {
  const { pagination, renderItem, rowsPerPage, searchValue } = props;
  const classes = useStyles();
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(rowsPerPage ?? 10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const _listItems = useCallback(async () => {
    if (!isLoading && hasMore) {
      setIsLoading(true);

      await pagination(page, itemsPerPage, '', '', searchValue)
        .then((res: any) => {
          const data = res?.data?.data;
          const maxPages = Math.ceil(data.total / itemsPerPage);
          // if (data.items && data.items.length > 0) {
          setItems((prevValues: any[]) => [...prevValues, ...(data.items ?? [])]);
          //   setInitialItems((prevValues: any[]) => [...prevValues, ...(data.items ?? [])]);
          if (page === maxPages) {
            setHasMore((prev: boolean) => !prev);
          } else {
            setPage((prev: number) => prev + 1);
          }
          //   if (page === 1 && data.items.length > 0) {
          //     // loadDataRowSelected(data.items[0]);
          //     setSelectedIndex(0);
          //   }
          // }
          setIsLoading(false);
        })
        .catch(() => {
          showMessage('', 'Problemas al cargar los formularios.', 'error', true);
          setHasMore((prev: boolean) => !prev);
          setIsLoading(false);
        });
    }
  }, [isLoading, hasMore, pagination, page, itemsPerPage, searchValue]);

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

  return (
    <>
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
          height: '64vh',
          paddingBottom: '16px',
          overflow: 'auto',
          display: items?.length === 0 ? 'flex' : 'block',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Grid container spacing={2}>
          {items?.length === 0 ? (
            <Grid item xs={2}>
              No se encontraron registros disponibles.
            </Grid>
          ) : (
            items.map((element: any, index: number) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={`item_list_${index}`}>
                {renderItem(element)}
              </Grid>
            ))
          )}
        </Grid>
      </div>
    </>
  );
};

export default React.memo(ListViewComponent);
