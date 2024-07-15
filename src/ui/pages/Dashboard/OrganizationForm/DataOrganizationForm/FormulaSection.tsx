import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Grid, Typography, Box, InputBase, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Button from '~atoms/Button/Button';
import { makeStyles } from '@mui/styles';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { ObjFormula, Operation, OperationType } from './FormulaTypes';
// import SelectField from '~ui/atoms/SelectField/SelectField';
const arrOperators = ['+', '-', '*', '/', '%'];

const OPERATIONS: Operation = {
  addition: {
    id: 1,
    display_name: '+',
    type: 'operator'
  },
  subtraction: {
    id: 2,
    display_name: '-',
    type: 'operator'
  },
  multiplication: {
    id: 3,
    display_name: '*',
    type: 'operator'
  },
  division: {
    id: 4,
    display_name: '/',
    type: 'operator'
  },
  percentage: {
    id: 5,
    display_name: '%',
    type: 'operator'
  }
};

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
      background: '#888',
      borderRadius: '13px'
    },

    /* Handle on hover */
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#888'
    }
  },
  itemFormula: {
    padding: '8px 12px',
    height: '37px',
    backgroundColor: '#EFF3F4',
    borderRadius: '20px',
    marginRight: '12px',
    fontSize: '17px',
    color: '#6E767D',
    marginBottom: '12px',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '56px'
  },
  itemTextFormula: {
    padding: '8px 12px',
    height: '37px',
    backgroundColor: '#EFF3F4',
    borderRadius: '20px',
    marginRight: '12px',
    fontSize: '14px',
    color: '#6E767D',
    marginBottom: '12px',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '56px'
  },
  itemNumberFormula: {
    padding: '8px 12px',
    height: '37px',
    backgroundColor: '#EFF3F4',
    borderRadius: '20px',
    marginRight: '12px',
    fontSize: '14px',
    color: '#6E767D',
    marginBottom: '12px',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputNumberFormula: {
    minWidth: '40px'
  }
}));

type FormulaSectionProps = {
  arrayFieldsToFormula: ObjFormula[];
  initialFormula: string;
  // handleOnSelectField: (value: ObjFormula) => void;
  handleOnSaveCurrentFormula: (value: string, valuec: string) => void;
  handleOnSaveAttributeFormula: (possible_values?: any[]) => void;
};

const checkUuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

const FormulaSection: React.FC<FormulaSectionProps> = (props: FormulaSectionProps) => {
  const { arrayFieldsToFormula, handleOnSaveCurrentFormula, initialFormula, handleOnSaveAttributeFormula } = props;
  const classes = useStyles();
  // const [formula] = useState<string>('{{30}} {{+}} {{012b8fc8-ba81-4dcf-b6ee-138418845a26}} {{-}} {{25}} ');
  const [formula, setFormula] = useState<string>('');
  const [arrFormula, setArrFormula] = useState<ObjFormula[]>([]);
  const [errorFormula, setErrorFormula] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<number>(0);
  const [showNewValue, setShowNewValue] = useState<boolean>(false);
  // const [selectedValueField, setSelectedValueField] = useState<ObjFormula | undefined>(undefined);

  useEffect(() => {
    if (initialFormula !== '') {
      setFormula(initialFormula);
    } else {
      setFormula('');
      setArrFormula([]);
    }
  }, [initialFormula]);

  const onlyNumbers = useCallback((value: number) => {
    if (!isNaN(value)) {
      setNewValue(value);
    }
  }, []);

  const handleShowNewValue = useCallback(() => {
    setShowNewValue((prev: boolean) => !prev);
  }, []);

  const handleOnSaveAttribute = useCallback(() => {
    handleShowNewValue();
  }, [handleShowNewValue]);

  const handleOnSelectOperation = useCallback((element_id: ObjFormula) => {
    // const op = OPERATIONS[element_id];
    setArrFormula((prev: ObjFormula[]) => {
      //No empieza con un operador
      const last = prev[prev.length - 1];
      if (last && last.value === '%' && element_id.type === 'operator' && element_id.value !== '%') {
        return [...prev, element_id];
      }
      if (prev.length === 0 && element_id.type !== 'operator') {
        return [...prev, element_id];
      }
      //ultimo elemento
      if (
        (last && last.type === 'field' && element_id.type === 'number') ||
        (last && last.type === 'number' && element_id.type === 'field')
      ) {
        setErrorFormula(true);
        return prev;
      }
      // if (last && last.type === 'number' && element_id.type === 'field') {
      //   return prev;
      // }

      //No se incluirán dos tipos iguales seguidos
      if (last && last.type !== element_id.type) {
        return [...prev, element_id];
      }
      //Luego de un field o número, solo puede ir un operador
      // if (
      //   last &&
      //   (last.type === 'field' || last.type === 'number') &&
      //   (element_id.type === 'field' || element_id.type === 'number')
      // ) {
      //   return prev;
      // }
      setErrorFormula(true);
      return prev;
    });
    // console.log(element_id);
  }, []);

  const addToFormula = useCallback(
    (e: any) => {
      if (e.key === 'Enter') {
        setNewValue((prev: number) => {
          const obj: ObjFormula = {
            value: `${prev}`,
            type: 'number'
          };
          //No permite ingresar el valor 0 a la formula
          if (prev !== 0) {
            handleOnSelectOperation(obj);
          }
          handleShowNewValue();
          return 0;
        });
      }
    },
    [handleOnSelectOperation, handleShowNewValue]
  );
  const addToFormulaBlur = useCallback(() => {
    setNewValue((prev: number) => {
      const obj: ObjFormula = {
        value: `${prev}`,
        type: 'number'
      };
      //No permite ingresar el valor 0 a la formula
      if (prev !== 0) {
        handleOnSelectOperation(obj);
      }
      handleShowNewValue();
      return 0;
    });
  }, [handleOnSelectOperation, handleShowNewValue]);

  // const handleChangeSelectAttribute = () => {
  //   setSelectedValueField(() => {
  //     return undefined;
  //   });
  // };

  const handleOnSelectFormulaField = useCallback(
    (value: string) => {
      if (value) {
        const field = arrayFieldsToFormula.find((element: ObjFormula) => element.id === value);
        const obj: ObjFormula = {
          value: `${field?.value}`,
          type: 'field',
          id: value
        };
        handleOnSelectOperation(obj);
        // setSelectedValueField(undefined);
        // handleChangeSelectAttribute();
      }
    },
    [arrayFieldsToFormula, handleOnSelectOperation]
  );

  const handleOnDeleteAttribute = () => {
    setArrFormula((arrValues: ObjFormula[]) => {
      const arr = arrValues.slice(0, -1);
      //   console.log(arr);
      return arr;
    });
  };

  useEffect(() => {
    if (formula === '') {
      return;
    }
    const localFormula = formula.trim();
    // const regex = /{([^}]+)}|\d+(\.\d+)?|[+\-*%/]/g;
    // const matchStrings = localFormula.match(regex);
    // if (matchStrings) {
    // const arrFormula = matchStrings.map((item: string) => item.replace(/[{}]/g, ''));
    const arrFormula = localFormula.split(' ');
    // console.log(arrFormula);
    const newArrFormula: ObjFormula[] = arrFormula.map((element: string) => {
      let type: OperationType = 'field';
      const obj: ObjFormula = {
        value: '',
        type: 'field'
      };
      if (!isNaN + element) type = 'number';
      if (arrOperators.includes(element)) type = 'operator';
      obj.value = `${element}`;
      if (checkUuidRegex.test(element)) {
        const fieldSelected = arrayFieldsToFormula.find((field: ObjFormula) => field.id === element);
        if (fieldSelected) {
          obj.id = fieldSelected.id;
          obj.value = fieldSelected.value;
          type = 'field';
        }
      }
      obj.type = type;
      // if()
      return obj;
    });

    setArrFormula(newArrFormula);
    // }
  }, [arrayFieldsToFormula, formula]);

  const renderFormula = useCallback((): ReactNode => {
    let divArr: ReactNode = <></>;
    if (arrFormula.length > 0) {
      divArr = arrFormula.map((element: ObjFormula, index: number) => {
        let str = element.value;
        if (checkUuidRegex.test(element.value)) {
          const field = arrayFieldsToFormula.find((obj: ObjFormula) => obj.id === element.value);
          str = field?.value || element.value;
        }
        return (
          <Box
            className={arrOperators.includes(element.value) ? classes.itemFormula : classes.itemTextFormula}
            key={`key_${element.value}_${index}`}
          >
            {str}
          </Box>
        );
      });
    }
    return divArr;
  }, [arrFormula, arrayFieldsToFormula, classes]);

  useEffect(() => {
    let formulaFinal = '';
    let formulaToCheck = '';
    if (arrFormula.length > 0) {
      arrFormula.forEach((element: ObjFormula) => {
        if (element.type === 'field') {
          formulaFinal += `${element.id} `;
          formulaToCheck += '1 ';
        } else {
          if (element.value === '%') {
            formulaFinal += `${element.value} `;
            formulaToCheck += '/ 100 ';
          } else {
            formulaFinal += `${element.value} `;
            formulaToCheck += `${element.value} `;
          }
        }
      });
    }
    // if (isValidMathExpression(formulaToCheck)) {
    handleOnSaveCurrentFormula(formulaFinal.trim(), formulaToCheck.trim());
    // }
    // console.log(isValidMathExpression(formulaToCheck));
    // console.log(formulaFinal);
  }, [arrFormula, handleOnSaveCurrentFormula]);

  useEffect(() => {
    if (errorFormula) {
      setTimeout(() => {
        setErrorFormula(false);
      }, 300);
    }
  }, [errorFormula]);

  return (
    // <Grid container>}
    <Grid item xs={12}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        // sx={{
        //   display: 'flex',
        // }}
      >
        <Typography>Formula</Typography>
        <Box
          style={{
            height: '185px',
            width: '100%',
            backgroundColor: '#D9D9D9',
            borderRadius: '10px',
            overflow: 'auto',
            boxShadow: errorFormula ? '0px 0px 6px #EB5757' : 'none'
            // boxShadow: '0px 0px 6px #EB5757'
          }}
          className={classes.scrollBarClass}
        >
          <Box display={'flex'} flexWrap={'wrap'} p={3}>
            {renderFormula()}
            {showNewValue && (
              <Box className={classes.itemNumberFormula} sx={{ width: `${newValue.toString().length + 8}ch` }}>
                <InputBase
                  type="number"
                  className={classes.inputNumberFormula}
                  autoFocus
                  value={newValue}
                  onChange={(e: any) => onlyNumbers(+e.target.value)}
                  onKeyPress={(e: any) => addToFormula(e)}
                  onBlur={() => addToFormulaBlur()}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Box display="flex" justifyContent="flex-end" flexWrap={'wrap'} width="100%">
          <Button text="Añadir valor" variant="contained" onClick={() => handleOnSaveAttribute()} />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Campo de formulario</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={''}
              // defaultValue={selectedValueField}
              label="Campo de formulario"
              onChange={(e: any) => {
                handleOnSelectFormulaField(e.target.value);
              }}
              sx={{ width: '100%' }}
            >
              <MenuItem value={''}>{'Seleccione un valor'}</MenuItem>
              {arrayFieldsToFormula.map((element: ObjFormula, index: number) => {
                return (
                  <MenuItem key={index} value={element.id}>
                    {element.value}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {/* <SelectField
            id={'fieldValue'}
            label={'Campo del formulario'}
            name={'fieldValue'}
            items={arrayFieldsToFormula}
            value={selectedValueField}
            itemText="value"
            itemValue=""
            onChange={(name, value) => {
              handleOnSelectFormulaField(value);
              console.log(name);
              console.log(value);
            }}
          /> */}
        </Box>
        <Box display="flex" justifyContent="flex-end" flexWrap={'wrap'} width="100%">
          {/* <Button text="Guardar" variant="contained" onClick={() => renderFormula()} /> */}
          <Button
            text=""
            startIcon={<BackspaceIcon />}
            sx={{ height: '100%' }}
            variant="contained"
            onClick={() => handleOnDeleteAttribute()}
          />
          {Object.keys(OPERATIONS).map((key: string) => (
            <Button
              key={`${OPERATIONS[key].display_name}_${OPERATIONS[key].id}`}
              text={OPERATIONS[key].display_name}
              variant="contained"
              onClick={() => {
                const obj: ObjFormula = {
                  type: 'operator',
                  value: OPERATIONS[key].display_name
                };
                handleOnSelectOperation(obj);
              }}
            />
          ))}
        </Box>
      </Grid>
      <Box pt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button text="Guardar" variant="contained" onClick={() => handleOnSaveAttributeFormula()} />
      </Box>
    </Grid>
    // </Grid>
  );
};

export default React.memo(FormulaSection);
