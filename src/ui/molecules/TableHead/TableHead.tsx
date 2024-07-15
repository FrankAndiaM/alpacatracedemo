import React, { useCallback } from 'react';
import { TableRow, TableCell, TableSortLabel, TableHead } from '@mui/material';
import useStyles from './TableHead.css';

/**
 * ITableHeadColumn define los params de cada columna de la tabla
 */
export type TableHeadColumn = {
  sorteable: boolean;
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
  padding?: 'checkbox' | 'none' | 'normal' | undefined;
  size?: 'medium' | 'small' | undefined;
  variant?: 'body' | 'footer' | 'head' | undefined;
  text: string;
  value: string;
  render?: (value: any) => void;
  isNotShowInHeader?: boolean;
  isNotListView?: boolean;
  maxWidth?: string;
  minWidth?: string;
};

/**
 * ITableHeadProps
 */
export type TableHeadProps = {
  headers: TableHeadColumn[];
  orderBy: string;
  order: 'asc' | 'desc' | undefined;
  createSortHandler: (column: string) => void;
  isCollapsible?: boolean;
};

const CustomTableHead: React.FC<TableHeadProps> = (props: TableHeadProps) => {
  const classes = useStyles();
  const { headers, orderBy, order, createSortHandler, isCollapsible }: TableHeadProps = props;

  const handleSort = useCallback(
    (e: React.FormEvent, column: string) => {
      createSortHandler(column);
    },
    [createSortHandler]
  );

  const renderHeaders = useCallback(
    (currentHeaders: TableHeadColumn[]) => {
      let showKey: boolean = false;
      const allComponents = currentHeaders.map((column: TableHeadColumn, index: number) => {
        const { sorteable, align, padding, size, variant, text, value, isNotShowInHeader, minWidth } = column;
        if (isCollapsible !== undefined && isCollapsible) {
          if (isNotShowInHeader === undefined || !isNotShowInHeader) {
            if (!showKey) {
              showKey = true;
              return (
                <React.Fragment key={`table_column_${index}`}>
                  <TableCell />
                  <TableCell
                    className={classes.rootCell}
                    align={align}
                    padding={padding}
                    sortDirection={orderBy === value ? order : false} //esta bien?
                    size={size}
                    variant={variant}
                    style={{ minWidth }}
                  >
                    {sorteable ? (
                      <TableSortLabel
                        active={orderBy === value}
                        direction={order}
                        onClick={(e: any) => handleSort(e, value)}
                      >
                        {text}
                      </TableSortLabel>
                    ) : (
                      <>{text}</>
                    )}
                  </TableCell>
                </React.Fragment>
              );
            }
            return (
              <TableCell
                className={classes.rootCell}
                key={`table_column_${index}`}
                align={align}
                padding={padding}
                sortDirection={orderBy === value ? order : false} //esta bien?
                size={size}
                variant={variant}
              >
                {sorteable ? (
                  <TableSortLabel
                    active={orderBy === value}
                    direction={order}
                    onClick={(e: any) => handleSort(e, value)}
                  >
                    {text}
                  </TableSortLabel>
                ) : (
                  <>{text}</>
                )}
              </TableCell>
            );
          }
          return null;
        }
        return (
          <TableCell
            className={classes.rootCell}
            key={`table_column_${index}`}
            align={align}
            padding={padding}
            sortDirection={orderBy === value ? order : false} //esta bien?
            size={size}
            variant={variant}
            style={{ minWidth }}
          >
            {sorteable ? (
              <TableSortLabel active={orderBy === value} direction={order} onClick={(e: any) => handleSort(e, value)}>
                {text}
              </TableSortLabel>
            ) : (
              <>{text}</>
            )}
          </TableCell>
        );
      });

      return allComponents;
    },
    [classes, handleSort, isCollapsible, order, orderBy]
  );

  return (
    <>
      <TableHead>
        <TableRow>{renderHeaders(headers)}</TableRow>
      </TableHead>
    </>
  );
};
CustomTableHead.defaultProps = {
  createSortHandler: () => null,
  headers: [],
  order: undefined,
  orderBy: '',
  isCollapsible: false
};
export default React.memo(CustomTableHead);
