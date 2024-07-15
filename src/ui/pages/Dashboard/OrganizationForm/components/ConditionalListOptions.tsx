/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Icon, TableRow, IconButton } from '@mui/material';
import { Paper, Box, TableBody, TableCell } from '@mui/material';
import TextField from '~ui/atoms/TextField/TextField';
import TableHead, { TableHeadColumn } from '~molecules/TableHead/TableHead';
import Button from '~atoms/Button/Button';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

type ConditionalListOptionsComponentProps = {
  onSave: (possible_values: any[], attrIdx: number, schemaIdx: number) => void;
  currentItems: any[];
  attrIdx: number;
  schemaIdx: number;
};

const ConditionalListOptionsComponent: React.FC<ConditionalListOptionsComponentProps> = (
  props: ConditionalListOptionsComponentProps
) => {
  const { onSave, currentItems, attrIdx, schemaIdx } = props;
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [items, setItems] = useState<string[]>(currentItems);

  //   useEffect(() => {
  //     setItems(currentItems);
  //   }, [currentItems]);

  const handleSort = useCallback((column: any) => {}, []);

  const handleAddItem = useCallback(() => {
    setItems((prevValue: any[]) => {
      return [...prevValue, ''];
    });
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prevValue: any[]) => {
      const newValues = prevValue.filter((attribute: any, idx: number) => idx !== index);
      return newValues;
    });
  }, []);

  const handleOnChangeField = useCallback((e: any, index: number) => {
    const { name, value } = e.target;
    setItems((prevValue: string[]) => {
      const newValues = prevValue.map((attribute: string, idx: number) => {
        if (idx === index) {
          return value;
        }
        return attribute;
      });

      return newValues;
    });
  }, []);

  //   const handleOnSaveAttribute = useCallback(() => {
  //     onSave(items);
  //   }, [onSave, items]);

  //DRAG ELEMENTS
  let position: number = 0;
  const reorder = (list: string[], startIndex: number, endIndex: number): string[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleOnDragEnd = useCallback(
    (result: DropResult): void => {
      const { source, destination } = result;
      if (destination === undefined || destination === null) return;
      if (destination.index === source.index) return;
      if (!result.destination) {
        return;
      }
      const movedItems = reorder(items, result.source.index, result.destination.index);
      setItems(movedItems);
    },
    [items]
  );

  useEffect(() => {
    setHeaders([
      {
        sorteable: false,
        align: 'left',
        text: 'Descripción',
        padding: 'none',
        value: 'description'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Acción',
        padding: 'none',
        value: 'action'
      }
    ]);
  }, []);

  useEffect(() => {
    onSave(items, attrIdx, schemaIdx);
  }, [attrIdx, items, onSave, schemaIdx]);

  return (
    <>
      <Paper elevation={3} sx={{ p: '20px', paddingBottom: '60px' }}>
        <Box py={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box fontWeight={700} fontSize="1.2rem">
            Listado de opciones
          </Box>
          <Button text="Agregar opción" startIcon={<Icon>add</Icon>} variant="contained" onClick={handleAddItem} />
        </Box>
        <Box>
          <Table stickyHeader={true} size={true ? 'small' : 'medium'} aria-label="table">
            <TableHead headers={headers} orderBy="" order="asc" createSortHandler={handleSort} />
            <DragDropContext
              onDragEnd={(result: DropResult) => {
                handleOnDragEnd(result);
                position = 0;
              }}
              onBeforeDragStart={() => {
                position = 0;
              }}
            >
              <Droppable droppableId="0">
                {(provided: any) => (
                  <TableBody ref={provided?.innerRef}>
                    {items?.map((value: any, index: number) => {
                      return (
                        <Draggable key={`row_${index}_option`} draggableId={index.toString()} index={index}>
                          {(provided2: any, snapshot: any) => (
                            <TableRow
                              ref={provided2?.innerRef}
                              {...provided2.draggableProps}
                              // style={snapshot?.isDragging ? { width: '600px', ...provided2.draggableProps.style }
                              // : {}}
                            >
                              <TableCell align="left">
                                <TextField
                                  fullWidth
                                  id="value"
                                  name="value"
                                  type="text"
                                  autoComplete="off"
                                  label=""
                                  value={value}
                                  onChange={(e: any) => handleOnChangeField(e, index)}
                                />
                              </TableCell>
                              <TableCell align="left">
                                <Box display="flex" alignItems={'center'}>
                                  <IconButton onClick={() => handleRemoveItem(index)} size="small">
                                    <Icon sx={{ color: '#ea0d0d8a' }}>delete</Icon>
                                  </IconButton>
                                  <Box {...provided2.dragHandleProps}>
                                    <Icon>zoom_out_map</Icon>
                                  </Box>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      );
                    })}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>
        </Box>
      </Paper>
      {/* <Box pt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button text="Guardar" variant="contained" onClick={handleOnSaveAttribute} />
      </Box> */}
    </>
  );
};

export default React.memo(ConditionalListOptionsComponent);
