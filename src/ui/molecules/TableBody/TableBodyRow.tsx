import React, { useState, useCallback } from 'react';
import { TableHeadColumn } from '../TableHead/TableHead';
import { IconButton, TableRow, TableCell, Collapse, Divider, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useStyles from './TableBody.css';

type TableBodyRowProps = {
  headers: TableHeadColumn[];
  row: any;
};

const TableBodyRow: React.FC<TableBodyRowProps> = (props: TableBodyRowProps) => {
  const { headers, row } = props;
  const classes = useStyles();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleOnCollapse = useCallback(() => {
    setIsCollapsed((prevValue: boolean) => !prevValue);
  }, []);

  return (
    <>
      <TableRow className={classes.celda}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={handleOnCollapse}>
            {isCollapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {headers.map((column: TableHeadColumn, columnIndex: number) => {
          /* evalúa si el head es de acciones no se renderiza aquí, sino en el siguiente */
          if (column.isNotShowInHeader === undefined || !column.isNotShowInHeader) {
            return (
              <React.Fragment key={`table_value_${columnIndex}`}>
                <TableCell align={column.align} className={classes.bodyCell}>
                  {/* valida si render esta disponible */}
                  {column.render ? column.render(row) : row[column.value]}
                </TableCell>
              </React.Fragment>
            );
          }
          return null;
        })}
      </TableRow>
      <TableRow>
        <TableCell colSpan={200}>
          <Collapse in={isCollapsed} timeout="auto" unmountOnExit>
            {headers.map((column: TableHeadColumn, columnIndex: number) => {
              /* evalúa si el head es de acciones no se renderiza aquí, sino en el siguiente */
              if (column.isNotShowInHeader !== undefined && column.isNotShowInHeader) {
                return (
                  <React.Fragment key={`table_value_${columnIndex}`}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        {column.text}
                      </Grid>
                      <Grid item xs={8}>
                        {/* valida si render esta disponible */}
                        {column.render ? column.render(row) : row[column.value]}
                      </Grid>
                    </Grid>
                  </React.Fragment>
                );
              }
              return null;
            })}
            <Divider />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TableBodyRow;
