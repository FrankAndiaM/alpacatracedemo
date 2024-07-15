import React, { useState, useEffect, useCallback } from 'react';
import { Table, Icon, TableRow, IconButton, Typography, Grid, Tooltip } from '@mui/material';
import { Paper, Box, TableBody, TableCell } from '@mui/material';
import TextField from '~ui/atoms/TextField/TextField';
import TableHead, { TableHeadColumn } from '~molecules/TableHead/TableHead';
import Button from '~atoms/Button/Button';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import ConditionalIcon from '~assets/icons/conditional_icon.svg';
import LineVector from '~assets/icons/line_vector.svg';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import FormatSizeOutlinedIcon from '@mui/icons-material/FormatSizeOutlined';
// import ListOfOptionsComponent from './ListOfOptions';
import ConditionalListOptions from './ConditionalListOptions';
import { v4 as uuidv4 } from 'uuid';
import { showMessage } from '~utils/Messages';

type SchemaResponse = {
  id: string;
  name?: string;
  attribute_type?: string;
  position?: number;
  is_required?: boolean;
  category?: string;
  schemas?: any[];
  possible_values?: string[];
};

type ConditionalOptionsProps = {
  onSave: (possible_values: any[]) => void;
  currentItems: any[];
  // required: boolean;
  // category: string;
};

const ConditionalOptions: React.FC<ConditionalOptionsProps> = (props: ConditionalOptionsProps) => {
  const { onSave, currentItems } = props;
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [items, setItems] = useState<SchemaResponse[]>(currentItems); //principal items

  useEffect(() => {
    setItems(currentItems);
  }, [currentItems]);

  const handleSort = useCallback((column: any) => {
    // eslint-disable-next-line no-console
    console.log(column);
  }, []);

  const handleAddItem = useCallback(() => {
    setItems((prevValue: any[]) => {
      const obj = {
        id: uuidv4(),
        name: '',
        position: prevValue.length - 1,
        attribute_type: 'conditional_option',
        is_required: false,
        category: 'personal',
        schemas: [
          {
            id: uuidv4(),
            name: '',
            attribute_type: 'list_options',
            possible_values: [],
            position: 0,
            is_required: false,
            category: 'personal'
          }
        ]
      };

      return [...prevValue, obj];
    });
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prevValue: any[]) => {
      const newValues = prevValue.filter((_attribute: any, idx: number) => idx !== index);
      return newValues;
    });
  }, []);
  const handleBlockItem = useCallback((index: number) => {
    setItems((prevValue: any[]) => {
      // const newValues = prevValue.filter((_attribute: any, idx: number) => idx !== index);
      const newValues = prevValue.map((element: any, idx: number) => {
        if (index === idx) {
          if (element.schemas.length === 0) {
            element.schemas = [
              {
                id: uuidv4(),
                name: '',
                attribute_type: 'list_options',
                possible_values: [],
                position: 0,
                is_required: false,
                category: 'personal'
              }
            ];
          } else {
            element.schemas = [];
          }
        }
        return element;
      });
      return newValues;
    });
  }, []);

  const handleOnChangeField = useCallback((e: any, index: number) => {
    const { value } = e.target;
    setItems((prevValue: SchemaResponse[]) => {
      const newValues = prevValue.map((attribute: SchemaResponse, idx: number) => {
        if (idx === index) {
          return { ...attribute, name: value };
        }
        return attribute;
      });

      return newValues;
    });
  }, []);

  const handleOnChangeNameField = useCallback((e: any, indexSchema: number) => {
    const { name, value } = e.target;
    setItems((prevValue: SchemaResponse[]) => {
      const newValues = prevValue.map((attribute: SchemaResponse, idx: number) => {
        if (idx === indexSchema) {
          const newSchema = attribute.schemas?.map((schema: any, i: number) => {
            if (i === 0) {
              return { ...schema, [name]: value };
            }
            return schema;
          });
          return { ...attribute, schemas: newSchema };
        }
        return attribute;
      });

      return newValues;
    });
  }, []);

  const handleOnChangeSchemaType = useCallback((itemIdx: number, schemaIdx: number, type: string) => {
    setItems((prevValue: SchemaResponse[]) => {
      const newItems = prevValue.map((attribute: SchemaResponse, idx: number) => {
        if (idx === itemIdx) {
          const newSchema = attribute?.schemas?.map((schema: any, i: number) => {
            if (schemaIdx === i) {
              return { ...schema, attribute_type: type };
            }
            return schema;
          });
          return { ...attribute, schemas: newSchema };
        }
        return attribute;
      });
      return newItems;
    });
  }, []);

  const handleOnSaveAttribute = useCallback((items: any[], attrIdx: number, schemaIdx: number) => {
    setItems((prevValue: SchemaResponse[]) => {
      const newItems = prevValue.map((attribute: SchemaResponse, idx: number) => {
        if (idx === attrIdx) {
          const newSchema = attribute?.schemas?.map((schema: any, i: number) => {
            if (schemaIdx === i) {
              return { ...schema, possible_values: items };
            }
            return schema;
          });
          return { ...attribute, schemas: newSchema };
        }
        return attribute;
      });
      return newItems;
    });
  }, []);

  const handleOnSaveSchemas = useCallback(() => {
    let isLength = false;
    let isComplete = false;
    let isName = false;
    let childFail = -1;
    let schemaFail = -1;
    items.forEach((element: SchemaResponse, indexChild: number) => {
      if (element.schemas && Array.isArray(element.schemas) && element.schemas.length > 0) {
        element.schemas.forEach((schema: any, idxSchema: number) => {
          if (schema.name === '') {
            isName = true;
            childFail = indexChild;
            schemaFail = idxSchema;
            return;
          }
          if (schema.attribute_type === 'list_options') {
            if (schema.possible_values?.length === 0) {
              isLength = true;
              childFail = indexChild;
              schemaFail = idxSchema;
              return;
            }
            const verifyPossibleValues = schema.possible_values?.some((prevValue: string) => prevValue === '');
            if (verifyPossibleValues) {
              isComplete = true;
              childFail = indexChild;
              schemaFail = idxSchema;
              return;
            }
          }
        });
      }
    });

    let name = '';
    let seg_name = '';
    if (schemaFail >= 0 && childFail >= 0) {
      const obj = items[childFail];
      if (obj) {
        seg_name = obj.name ?? '';
        const sch = obj.schemas;
        if (sch) {
          name = sch[schemaFail].name;
        }
      }
    }
    if (isName) {
      showMessage('', `Ingrese el texto en la pregunta de seguimiento a "${seg_name ?? ''}".`, 'error', true);
      return;
    }
    if (isLength) {
      showMessage(
        '',
        `Ingrese la lista de opciones, en la pregunta "${name ?? ''}" con seguimiento a "${seg_name ?? ''}".`,
        'error',
        true
      );
      return;
    }
    if (isComplete) {
      showMessage(
        '',
        `Complete la lista de opciones, en la pregunta "${name ?? ''}" con seguimiento a "${seg_name ?? ''}".`,
        'error',
        true
      );
      return;
    }

    onSave(items);
  }, [items, onSave]);

  //DRAG ELEMENTS
  const reorder = (list: SchemaResponse[], startIndex: number, endIndex: number): SchemaResponse[] => {
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

  return (
    <>
      <Grid item xs={12}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                  }}
                >
                  <Droppable droppableId="0">
                    {(provided: any) => (
                      <TableBody ref={provided?.innerRef}>
                        {items?.map((value: SchemaResponse, index: number) => {
                          return (
                            <Draggable key={`row_${index}_option`} draggableId={index.toString()} index={index}>
                              {(provided2: any, _snapshot: any) => (
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
                                      value={value.name}
                                      onChange={(e: any) => handleOnChangeField(e, index)}
                                    />
                                  </TableCell>
                                  <TableCell align="left">
                                    <Box display="flex" alignItems={'flex-end'}>
                                      <IconButton onClick={() => handleBlockItem(index)} size="small">
                                        <Tooltip
                                          placement="top"
                                          title={
                                            <Box style={{ textAlign: 'center' }}>
                                              {value.schemas?.length === 0 ? (
                                                <>
                                                  Esta pregunta no tiene <br />
                                                  condicional.
                                                </>
                                              ) : (
                                                <>
                                                  Al activar candado, no habrá <br />
                                                  pregunta condicional.
                                                </>
                                              )}
                                            </Box>
                                          }
                                        >
                                          <Icon sx={{ color: value.schemas?.length === 0 ? '#00822B' : '#B9B9B9' }}>
                                            lock
                                          </Icon>
                                        </Tooltip>
                                      </IconButton>
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

          <Box mt={2}>
            <Box width={'100%'}>
              <Box display={'flex'} justifyContent={'flex-end'} sx={{ paddingRight: { xs: '22px', xl: '36px' } }}>
                <img src={ConditionalIcon} alt="Pregunta condicional" style={{ width: '1.5em' }} />
              </Box>
              <img src={LineVector} alt="Pregunta condicional" style={{ width: '100%' }} />
            </Box>
            {items.map((element: SchemaResponse, itemIdx: number) => {
              return (
                <Box mt={4} key={`${element.id}_${itemIdx}`}>
                  <Box display="flex" justifyContent={'space-between'}>
                    <Typography>
                      Esta es pregunta de seguimiento de:{' '}
                      <span style={{ fontWeight: 500, color: '#00822B' }}>{element.name}</span>{' '}
                    </Typography>
                    {element.schemas?.length === 0 && (
                      <Typography>
                        <span style={{ fontWeight: 700, color: '#D84D44' }}>(bloqueado)</span>
                      </Typography>
                    )}
                  </Box>
                  {element.schemas &&
                    element.schemas.length > 0 &&
                    element.schemas.map((schema: any, schemaIdx: number) => {
                      return (
                        <Grid container={true} key={`${schema.id}_${schemaIdx}`} spacing={2} mt={2}>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                              id="name"
                              name="name"
                              type="text"
                              autoComplete="off"
                              label={'Pregunta'}
                              placeholder={'Ingrese la pregunta.'}
                              value={schema?.name}
                              onChange={(e: any) => handleOnChangeNameField(e, itemIdx)}
                              // errors={errors}
                              // touched={errors}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Paper elevation={3} sx={{ p: '20px', paddingBottom: '60px' }}>
                              <Box display={'flex'} justifyContent={'space-between'}>
                                <Box>Tipo de pregunta</Box>
                                <Box display="flex">
                                  <Tooltip title="Lista de opciones">
                                    <IconButton
                                      aria-label="Lista de opciones"
                                      color={schema?.attribute_type === 'list_options' ? 'primary' : 'default'}
                                      onClick={() => handleOnChangeSchemaType(itemIdx, schemaIdx, 'list_options')}
                                    >
                                      <RadioButtonCheckedOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Campo de texto">
                                    <IconButton
                                      aria-label="texto"
                                      color={schema?.attribute_type === 'string' ? 'primary' : 'default'}
                                      onClick={() => handleOnChangeSchemaType(itemIdx, schemaIdx, 'string')}
                                    >
                                      <FormatSizeOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                              <Box>
                                <Box>
                                  {schema?.attribute_type === 'string' && (
                                    <TextField
                                      id="text_string"
                                      name="text_string"
                                      type="text"
                                      label={''}
                                      disabled
                                      placeholder={'Texto de respuesta larga.'}
                                      value={''}
                                    />
                                  )}
                                  {schema?.attribute_type === 'list_options' && (
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                      <ConditionalListOptions
                                        onSave={handleOnSaveAttribute}
                                        currentItems={schema?.possible_values}
                                        attrIdx={itemIdx}
                                        schemaIdx={schemaIdx}
                                      />
                                    </Grid>
                                  )}
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                        </Grid>
                      );
                    })}
                </Box>
              );
            })}
          </Box>
          <Box pt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button text="Guardar" variant="contained" onClick={handleOnSaveSchemas} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(ConditionalOptions);
