import React, { useState, useCallback, useEffect } from 'react';
import useStyles from './DataTable.css';
import { Table, TableContainer, Paper, Box, Divider } from '@mui/material';
import TableHead, { TableHeadProps, TableHeadColumn } from '~molecules/TableHead/TableHead';
import TableBody from '~molecules/TableBody/TableBody';
import TextFieldSearch from '~molecules/TextFieldSearch/TextFieldSearch';
import TablePagination from '~ui/molecules/TablePagination/TablePagination';

/**
 *
 */
type DataTableProps = {
  headers: TableHeadColumn[];
  items: any[];
  stickyHeader?: boolean;
  loading?: boolean;
  textNoItems?: string;
  totalItems: number;
  onSearch?: (search: string) => void;
  onSort?: (orderBy: string, order: string) => void;
  onPage?: (page: number) => void;
  onPerPage?: (perPage: number) => void;
};

const DataTable: React.FC<DataTableProps> = (props: DataTableProps) => {
  const {
    totalItems,
    headers,
    items,
    stickyHeader,
    loading,
    textNoItems,
    onSearch,
    onSort,
    onPage,
    onPerPage
  }: DataTableProps = props;
  const classes = useStyles();
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<TableHeadProps['order']>('asc');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentItems, setCurrentItems] = useState<any[]>([]);

  const handleSort = useCallback(
    (column: any) => {
      const isDesc: boolean = orderBy === column && order === 'desc';
      onSort && onSort(column, isDesc ? 'asc' : 'desc');
      setOrder(isDesc ? 'asc' : 'desc');
      setOrderBy(column);
    },
    [orderBy, order, onSort]
  );

  const handleOnChangeSearch = useCallback(
    (value: any) => {
      onSearch && onSearch(value);
    },
    [onSearch]
  );

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
      onPage && onPage(newPage);
    },
    [onPage]
  );

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setRowsPerPage(Number(value));
      onPerPage && onPerPage(Number(value));
    },
    [onPerPage]
  );

  useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  return (
    <>
      <Box display="flex" justifyContent="flex-end" px={1} pb={1}>
        <TextFieldSearch onChange={handleOnChangeSearch} />
      </Box>
      <Divider />
      <Paper>
        <TableContainer>
          <Table
            className={classes.table}
            stickyHeader={stickyHeader}
            // eslint-disable-next-line no-constant-condition
            size={true ? 'small' : 'medium'}
            aria-label="table"
          >
            <TableHead headers={headers} orderBy={orderBy} order={order} createSortHandler={handleSort} />
            <TableBody headers={headers} items={currentItems} loading={loading} textNoItems={textNoItems} />
          </Table>
        </TableContainer>
        <TablePagination
          currentCount={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};
DataTable.defaultProps = {
  headers: [], // { text. value, sortable, align, disablePadding}
  items: [],
  stickyHeader: false,
  loading: false,
  textNoItems: 'No se encontraron resultados.'
};
export default React.memo(DataTable);
