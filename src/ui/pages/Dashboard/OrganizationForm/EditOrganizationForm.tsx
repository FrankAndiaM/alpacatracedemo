/* eslint-disable @typescript-eslint/typedef */
import React, { useCallback, useState, useEffect } from 'react';
import { OrganizationFormAttribute, OrganizationFormAttributeType } from '~models/organizationFormAttribute';
import { Box, Icon, Grid, Tabs, Tab, Dialog, IconButton, Divider } from '@mui/material';
import { Switch, Paper, FormControlLabel } from '@mui/material';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
// import {
//   createOrganizationFormAttributes
//   getOrganizationForm,
//   deleteOrganizationForm
// } from '~services/organization/form';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { OrganizationForm } from '~models/organizationForm';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '~ui/atoms/TextField/TextField';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import { showMessage, showDeleteQuestion } from '~utils/Messages';
import FormItem from './components/FormItem';
import routes from '~routes/routes';
import Button from '~atoms/Button/Button';
import ListOfOptionsComponent from './components/ListOfOptions';
// import { inputRemoveAllASCII } from '~utils/inputs';
import { Droppable, DragDropContext, DropResult } from 'react-beautiful-dnd';
import SelectField from '~ui/atoms/SelectField/SelectField';
// import { Prompt } from 'react-router-dom';
import { Theme, useMediaQuery } from '@mui/material';
import EditOrganizationFormName from './EditOrganizationFormName';
import { refreshToken } from '~redux-store/actions/authActions';
import PreviewOrganizationForm from './PreviewOrganizationForm';
import CoursesIcon from '~assets/icons/courses.svg';
// import MatSimpleIcon from '~assets/icons/mat_simple.svg';
// import ConditionalIcon from '~assets/icons/conditional_icon.svg';
import FormulaSection from './DataOrganizationForm/FormulaSection';
import { ObjFormula } from './DataOrganizationForm/FormulaTypes';
import { 
  // deleteForm, 
  getOrganizationFormV2, updateFormSchema } from '~services/organization/formsv2';
import { v4 as uuidv4 } from 'uuid';
import { isValidMathExpression } from '~utils/formatNumber';
// import ConditionalSection from './DataOrganizationForm/ConditionalSection';
import ConditionalOptions from './components/ConditionalOptions';
import { useAppDispatch } from '~redux-store/store';
import { useTheme } from '@mui/material/styles';

type ShowOrganizationFormComponentProps = unknown;

const categories = [
  // { id: '', description: 'Seleccionar categoría' },
  { id: 'personal', description: 'Información personal' },
  { id: 'productive', description: 'Información productiva' },
  { id: 'economic', description: 'Información económica' }
];

const fieldsPlaceholders: any = {
  section: 'Ingrese el título de la sección. Ejemplo: Datos de parcela',
  number: 'Ingrese la pregunta. Ejemplo: ¿Cuántas plantas hay en la parcela?',
  string: 'Ingrese la pregunta. Ejemplo: Describa el estado de la parcela.',
  date: 'Ingrese la pregunta. Ejemplo: Fecha de último abono.',
  photo: 'Ingrese la pregunta. Ejemplo: Fotografía del campo.',
  signature: 'Ingrese la pregunta. Ejemplo: Firma del productor.',
  gps_point: 'Ingrese la pregunta. Ejemplo: GPS de la parcela.',
  georeference: 'Ingrese la pregunta. Ejemplo: Polígono de la parcela.',
  list_options: 'Ingrese la pregunta. Ejemplo: Seleccione  la opción.',
  altitude: 'Ingrese la pregunta. Ejemplo: Altitud de la parcela.'
};

type EditFormAttributeProps = {
  errors: any;
  textFieldPlaceholder: string;
  currentAttribute: any | undefined;
  handleOnChangeField: (e: any) => void;
  handleOnChangeSelectField: (name: any, value: any) => void;
  handleOnSaveAttribute: (possible_values?: any[]) => void;
  arrayFieldsToFormula: ObjFormula[];
  handleOnSaveCurrentFormula: (value: string, valuec: string) => void;
  handleOnSaveCurrentConditionalSchemas: (schemas: any[]) => void;
};

const EditFormAttribute: React.FC<EditFormAttributeProps> = (props: EditFormAttributeProps) => {
  const {
    errors,
    textFieldPlaceholder,
    currentAttribute,
    handleOnChangeField,
    handleOnChangeSelectField,
    handleOnSaveAttribute,
    arrayFieldsToFormula,
    handleOnSaveCurrentFormula,
    handleOnSaveCurrentConditionalSchemas
  } = props;

  return (
    <Paper
      elevation={4}
      sx={{
        p: '10px'
      }}
    >
      <Grid container={true} spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="name"
            name="name"
            type="text"
            autoComplete="off"
            label={currentAttribute?.attribute_type !== 'title' ? 'Pregunta' : 'Título de la sección'}
            placeholder={textFieldPlaceholder}
            value={currentAttribute?.name}
            onChange={(e: any) => handleOnChangeField(e)}
            errors={errors}
            touched={errors}
          />
        </Grid>
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="name"
            name="name"
            type="text"
            autoComplete="off"
            label="Nombre Interno"
            placeholder="Ingrese el nombre interno"
            value={currentAttribute?.name}
            onChange={(e: any) => handleOnChangeField(e)}
            errors={errors}
            touched={errors}
          />
        </Grid> */}
        {!['title', 'formula'].includes(currentAttribute?.attribute_type) && (
          <>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <SelectField
                id="category"
                name="category"
                label="Categoría de la pregunta"
                items={categories}
                value={currentAttribute?.category}
                onChange={handleOnChangeSelectField}
                itemText="description"
                itemValue="id"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                id="description"
                name="description"
                type="text"
                autoComplete="off"
                label="Descripción (opcional)"
                value={currentAttribute?.description ?? ''}
                onChange={(e: any) => handleOnChangeField(e)}
                rowsMax={4}
                multiline
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <FormControlLabel
                sx={{
                  marginLeft: '0'
                }}
                label="Pregunta obligatoria"
                labelPlacement="start"
                control={
                  <Switch
                    onChange={(e: any) =>
                      handleOnChangeField({
                        target: {
                          name: e?.target?.name,
                          value: e?.target?.checked
                        }
                      })
                    }
                    checked={currentAttribute?.is_required}
                    name="is_required"
                    id="is_required"
                  />
                }
              />
            </Grid>
          </>
        )}
        {currentAttribute?.attribute_type === 'formula' && (
          <>
            <FormulaSection
              arrayFieldsToFormula={arrayFieldsToFormula}
              initialFormula={currentAttribute?.formula ?? ''}
              handleOnSaveCurrentFormula={handleOnSaveCurrentFormula}
              handleOnSaveAttributeFormula={handleOnSaveAttribute}
            />
          </>
        )}
        {currentAttribute?.attribute_type === 'conditional' && (
          <>
            <ConditionalOptions
              currentItems={currentAttribute?.schemas || []}
              onSave={handleOnSaveCurrentConditionalSchemas}
            />
          </>
        )}
        {['list_options', 'multiple_selection'].includes(currentAttribute?.attribute_type) && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <ListOfOptionsComponent onSave={handleOnSaveAttribute} currentItems={currentAttribute?.possible_values} />
          </Grid>
        )}

        {!['list_options', 'multiple_selection', 'conditional', 'formula'].includes(
          currentAttribute?.attribute_type
        ) && (
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
            <Button
              text="Guardar"
              disabled={currentAttribute?.is_edit === false}
              variant="contained"
              onClick={() => handleOnSaveAttribute()}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

const ShowOrganizationFormComponent: React.FC<ShowOrganizationFormComponentProps> = () => {
  const dispatch = useAppDispatch();
  const history = useNavigate();
  let position: number = 0;
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isPreventExit, setIsPreventExit] = useState<boolean>(true);
  const [isDeleteSave] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState<boolean>(false);
  const [isFormNameDialogOpen, setIsFormNameDialogOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>();
  const [textFieldPlaceholder, setTextFieldPlaceholder] = useState<string>('');
  const [organizationForm, setOrganizationForm] = useState<OrganizationForm | undefined>(undefined);
  const [currentAttribute, setCurrentAttribute] = useState<any | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [attributes, setAttributes] = useState<OrganizationFormAttribute[]>([]);

  // const [isBlocking] = useState(true);

  // eslint-disable-next-line
  // @ts-ignore
  const { organization_form_id } = useParams();
  if (!organization_form_id) history(routes.organizationForm);
  const organizationFormId: string = organization_form_id !== undefined ? organization_form_id : '';
  const hiddenUp = useMediaQuery<Theme>((theme: any) => theme.breakpoints.up('md'));

  const loadOrganizationForm = useCallback(() => {
    setIsLoading(true);
    getOrganizationFormV2(organizationFormId)
      .then((res: any) => {
        setOrganizationForm(res.data.data);
        setAttributes(res.data?.data?.schema?.data ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar el formulario.', 'error', true);
        setIsLoading(false);
        history(routes.organizationForm);
      });
  }, [organizationFormId, history]);

  const handleAddAttribute = useCallback(
    (type: OrganizationFormAttributeType) => {
      setTextFieldPlaceholder(fieldsPlaceholders[type]);
      setAttributes((prevValues: OrganizationFormAttribute[]) => {
        const newAttribute = {
          id: uuidv4(),
          name: '',
          description: '',
          attribute_type: type,
          category: 'personal',
          possible_values: [],
          schemas: [],
          is_required: false,
          is_public: false
        };
        prevValues.push(newAttribute);
        setCurrentAttribute(() => {
          return Object.assign({}, { ...newAttribute, index: prevValues.length - 1 });
        });
        setCurrentIndex(prevValues.length - 1);
        return [...prevValues];
      });
      if (!hiddenUp) setIsDialogOpen(true);
    },
    [hiddenUp]
  );

  const handleOnDuplicateAttribute = useCallback(async (attribute: OrganizationFormAttribute) => {
    await setAttributes((prevValues: OrganizationFormAttribute[]) => {
      const duplicateAttribute = Object.assign({}, attribute);
      duplicateAttribute.id = uuidv4();
      duplicateAttribute.name = `${attribute.name} (1)`;
      prevValues.push(duplicateAttribute);
      return [...prevValues];
    });
    setCurrentAttribute(undefined);
    setCurrentIndex(-1);
  }, []);

  const handleRemoveAttribute = useCallback((index: number) => {
    showDeleteQuestion('ADVERTENCIA', 'Está seguro de eliminar el componente').then(async (result: any) => {
      if (result) {
        setAttributes((prevValue: OrganizationFormAttribute[]) => {
          const newValues = prevValue.filter((_attribute: OrganizationFormAttribute, idx: number) => idx !== index);
          return newValues;
        });
        setCurrentAttribute(undefined);
        setCurrentIndex(-1);
      }
    });
  }, []);

  const handleOnChangeField = useCallback((e: any) => {
    const { name, value } = e.target;
    setCurrentAttribute((prevValue: OrganizationFormAttribute | undefined) => {
      const newValue: any = Object.assign({}, prevValue);
      newValue[name] = value;
      // if (name === 'display_name') {
      //   newValue['name'] = inputRemoveAllASCII(value)?.toLowerCase();
      // }
      return newValue;
    });
  }, []);

  const handleOnChangeSelectField = useCallback((name: any, value: any) => {
    setCurrentAttribute((prevValue: OrganizationFormAttribute | undefined) => {
      const newValue: any = Object.assign({}, prevValue);
      newValue[name] = value;
      // if (name === 'display_name') {
      //   newValue['name'] = inputRemoveAllASCII(value)?.toLowerCase();
      // }
      return newValue;
    });
  }, []);

  const handleOnSaveAttributeEspecial = useCallback(
    (attr: any) => {
      if (attr?.name === '') {
        setErrors({ name: 'Ingrese la pregunta.' });
        showMessage('', 'Ingrese la pregunta.', 'error', true);
        return;
      }
      if (attr?.attribute_type === 'formula') {
        if (attr?.formula === '' || !attr?.formula) {
          showMessage('', 'Complete el campo formula.', 'error', true);
          return;
        }
        if (attr?.formulac) {
          const isValid = isValidMathExpression(attr?.formulac);
          if (!isValid) {
            showMessage('', 'La formula es incorrecta.', 'error', true);
            return;
          }
        }
      }
      if (attr?.attribute_type === 'conditional') {
        if (attr?.schemas && attr?.schemas.length < 2) {
          showMessage('', 'Ingrese al menos 2 opciones en la pregunta principal', 'error', true);
          return;
        }
      }

      const result = attributes?.some(
        (attrib: OrganizationFormAttribute, index: number) => attrib.name === attr?.name && index !== attr.index
      );
      if (result) {
        setErrors({ name: 'La pregunta ya se encuentra registrada.' });
        showMessage('', 'La pregunta ya se encuentra registrada.', 'error', true);
        return;
      }

      setErrors({});
      setAttributes((prevValue: any[]) => {
        const newValues = prevValue.map((attribute: any, idx: number) => {
          if (idx === attr.index) {
            const newCurrentAttribute: any = Object.assign({}, attr);
            delete newCurrentAttribute.index;
            const newValues: any = Object.assign({}, newCurrentAttribute);
            return newValues;
          }
          return attribute;
        });
        return newValues;
      });
      const message = attr?.attribute_type === 'title' ? 'Sección creada.' : 'Pregunta registrada.';
      showMessage('', message, 'success');
      if (!hiddenUp) setIsDialogOpen(false);
    },
    [attributes, hiddenUp]
  );

  const handleOnSaveAttribute = useCallback(
    (possible_values?: any[]) => {
      // if (currentAttribute?.name === '') {
      //   setErrors({ display_name: 'Ingrese la pregunta.' });
      //   showMessage('', 'Ingrese la pregunta.', 'error', true);
      //   return;
      // }
      // console.log(currentAttribute);
      //validar formula
      if (currentAttribute?.attribute_type === 'formula') {
        if (currentAttribute?.formula === '' || !currentAttribute?.formula) {
          showMessage('', 'Complete el campo formula.', 'error', true);
          return;
        }
        if (currentAttribute?.formulac) {
          const isValid = isValidMathExpression(currentAttribute?.formulac);
          if (!isValid) {
            showMessage('', 'La formula es incorrecta.', 'error', true);
            return;
          }
        }
      }
      if (currentAttribute?.name === '') {
        setErrors({ name: 'Ingrese la pregunta.' });
        showMessage('', 'Ingrese la pregunta.', 'error', true);
        return;
      }

      if (currentAttribute?.attribute_type === 'conditional') {
        if (!currentAttribute?.schemas) {
          showMessage('', 'Ingrese la lista de opciones', 'error', true);
          return;
        }
      }

      if (currentAttribute?.attribute_type === 'list_options') {
        if (possible_values?.length === 0) {
          showMessage('', 'Ingrese la lista de opciones.', 'error', true);
          return;
        }
        const verifyPossibleValues = possible_values?.some((prevValue: string) => prevValue === '');
        if (verifyPossibleValues) {
          showMessage('', 'Complete la lista de opciones.', 'error', true);
          return;
        }
      }
      if (possible_values && possible_values?.length < 2) {
        showMessage('', 'Ingrese al menos 2 opciones.', 'error', true);
        return;
      }
      const result = attributes?.some(
        (attrib: OrganizationFormAttribute, index: number) =>
          attrib.name === currentAttribute?.name && index !== currentAttribute.index
      );
      if (result) {
        setErrors({ name: 'La pregunta ya se encuentra registrada.' });
        showMessage('', 'La pregunta ya se encuentra registrada.', 'error', true);
        return;
      }
      setErrors({});
      setAttributes((prevValue: any[]) => {
        const newValues = prevValue.map((attribute: any, idx: number) => {
          if (idx === currentAttribute.index) {
            const newCurrentAttribute: any = Object.assign({}, currentAttribute);
            delete newCurrentAttribute.index;
            if (possible_values !== undefined) {
              newCurrentAttribute.possible_values = possible_values;
            }
            const newValues: any = Object.assign({}, newCurrentAttribute);
            return newValues;
          }
          return attribute;
        });
        return newValues;
      });
      const message = currentAttribute?.attribute_type === 'title' ? 'Sección creada.' : 'Pregunta registrada.';
      showMessage('', message, 'success');
      if (!hiddenUp) setIsDialogOpen(false);
    },
    [currentAttribute, attributes, hiddenUp]
  );

  const handleOnChange = useCallback(
    (value: OrganizationFormAttribute, index: number) => {
      setCurrentIndex(index);
      setCurrentAttribute({ ...value, index });
      setTextFieldPlaceholder(fieldsPlaceholders[value.attribute_type]);
      if (!hiddenUp) setIsDialogOpen(true);
    },
    [hiddenUp]
  );

  // const handleRemoveOrganizationForm = useCallback(() => {
  //   showDeleteQuestion('¿Seguro que quieres eliminar el formulario?', 'Esta acción no se puede deshacer.').then(
  //     async (result: any) => {
  //       if (result) {
  //         setIsDeleteSave(true);
  //         deleteForm(organizationFormId)
  //           .then(() => {
  //             // setIsPreventExit(false);
  //             showMessage('', 'Formulario eliminado.', 'success');
  //             history(routes.organizationForm);
  //           })
  //           .catch(() => {
  //             setIsDeleteSave(false);
  //             showMessage('', 'Problemas al eliminar el Formulario.', 'error', true);
  //           });
  //       }
  //     }
  //   );
  // }, [organizationFormId, history]);

  const handleSaveOrganizationForm = useCallback(() => {
    const verify = attributes?.some((attrib: OrganizationFormAttribute) => attrib.name === '');
    if (verify) {
      showMessage('', 'Verifique que todos los atributos tengan los datos completos.', 'error', false);
      return;
    }
    const result = attributes?.some((currentAttrib: OrganizationFormAttribute) => {
      const result: any[] = attributes.filter(
        (attrib: OrganizationFormAttribute) => attrib.name === currentAttrib.name
      );
      return result.length > 1;
    });

    if (result) {
      setErrors({ name: 'Hay preguntas que se están repitiendo.' });
      showMessage('', 'Hay preguntas que se están repitiendo.', 'error', true);
      return;
    }
    setIsPreviewDialogOpen(true);
  }, [attributes]);

  const saveOrganizationForm = useCallback((): Promise<string> => {
    const values: any = Object.assign({}, organizationForm);
    //assign position
    const newAttr = attributes.map((element: OrganizationFormAttribute, index: number) => {
      return { ...element, position: index };
    });
    values.schema = newAttr;
    return new Promise(async (resolve: any, reject: any) => {
      updateFormSchema(values)
        .then(() => {
          resolve('Formulario actualizado.');
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al registrar los atributos.';
          const data = err?.response?.data;
          if (data?.hasOwnProperty('error')) {
            reject(data?.error?.message ?? errorMessage);
          } else {
            showMessage('', errorMessage, 'error', true);
            reject(errorMessage);
          }
        });
    });
  }, [organizationForm, attributes]);

  const handleClosePreviewDialog = useCallback(
    (isRefresh?: boolean) => {
      if (isRefresh !== undefined && isRefresh) {
        // setIsPreventExit(false);
        history(`${routes.organizationForm}`);
      }
      setIsPreviewDialogOpen(false);
    },
    [history]
  );

  useEffect(() => {
    loadOrganizationForm();
  }, [loadOrganizationForm]);

  const handleOnDragEnd = useCallback((result: DropResult): void => {
    const { source, destination } = result;
    if (destination === undefined || destination === null) return;
    if (destination.index === source.index) return;
    setCurrentAttribute(undefined);
    setCurrentIndex(-1);
    setAttributes((attribute: OrganizationFormAttribute[]) => {
      const auxValue = Object.assign({}, attribute[source.index]);
      // eslint-disable-next-line @typescript-eslint/typedef
      const prevValues = attribute.filter((_, index: number) => index !== source.index);
      prevValues.splice(destination.index, 0, auxValue);
      return prevValues;
    });
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleFormNameDialog = useCallback(
    (isUpdateTable?: boolean) => {
      if (isUpdateTable !== undefined && isUpdateTable) {
        loadOrganizationForm();
      }
      setIsFormNameDialogOpen((prevValue: boolean) => !prevValue);
    },
    [loadOrganizationForm]
  );
  const [arrToFormule, setArrToFormule] = useState<ObjFormula[]>([]);

  const handleOnSaveCurrentFormula = useCallback((value: string, valuec: string) => {
    setCurrentAttribute((prev: any) => {
      const obj = { ...prev, formula: value, formulac: valuec };
      return obj;
    });
  }, []);

  const handleOnSaveCurrentConditionalSchemas = useCallback(
    (schemas: any[]) => {
      setCurrentAttribute((prev: any) => {
        const obj = { ...prev, schemas: schemas };
        handleOnSaveAttributeEspecial(obj);
        return obj;
      });
    },
    [handleOnSaveAttributeEspecial]
  );

  useEffect(() => {
    const newArr: ObjFormula[] = [];
    attributes.forEach((element: OrganizationFormAttribute, index: number) => {
      if (element.attribute_type === 'number' && index < currentIndex) {
        const newObj: ObjFormula = {
          type: 'field',
          value: element.name,
          id: element.id
        };
        newArr.push(newObj);
      }
    });
    if (newArr) setArrToFormule(newArr);
  }, [attributes, currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshToken());
    }, 1800000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <>
      <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
        Formulario
      </Box>
      <Breadcrumbs
        breadcrumbs={[
          {
            path: routes.dashboard,
            component: <Icon fontSize="small">home</Icon>
          },
          {
            path: routes.organizationForm,
            component: 'Formularios'
          },
          {
            component: organizationForm?.name
          }
        ]}
      />
      <Box mt={1} p={1.5} display="flex" justifyContent="flex-end">
        {/* <Button
          text="Eliminar"
          variant="contained"
          disabled={isDeleteSave}
          isLoading={isDeleteSave}
          sx={{
            bgcolor: theme.palette.error.main,
            '&:hover': {
              bgcolor: theme.palette.error.dark
            }
          }}
          endIcon={<Icon>delete</Icon>}
          onClick={handleRemoveOrganizationForm}
        /> */}
        <Button
          text="Guardar"
          disabled={isDeleteSave}
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark
            }
          }}
          endIcon={<Icon>save</Icon>}
          onClick={handleSaveOrganizationForm}
        />
      </Box>
      {isLoading && <LinearProgress loading={true} />}

      {/* LIST OPTIONS */}
      <Box mt={1} p={1.5} style={{ background: '#F8F4F4' }}>
        <Tabs
          value="number"
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          TabIndicatorProps={{
            style: {
              backgroundColor: '#F8F4F4'
            }
          }}
          sx={{ background: '#e9e9e9', '& button': { color: '#484848' } }}
        >
          <Tab
            iconPosition="start"
            value="title"
            label="Nueva sección"
            icon={<Icon fontSize="small">dehaze</Icon>}
            onClick={() => handleAddAttribute('title')}
            sx={{ color: '#484848 !important', maxWidth: '8rem', p: 1 }}
          />
          <Tab
            iconPosition="start"
            value="number"
            label="Números"
            icon={<Icon fontSize="small">category</Icon>}
            onClick={() => handleAddAttribute('number')}
            sx={{ color: '#484848 !important', maxWidth: '8rem', p: 1 }}
          />
          {/* <Tab
            iconPosition="start"
            value="formula"
            label="Matemática simple"
            icon={<img src={MatSimpleIcon} alt="Matemática simple" style={{ width: '1.7em' }} />}
            onClick={() => handleAddAttribute('formula')}
            sx={{ color: '#484848 !important', maxWidth: '8rem', p: 1 }}
          />
          <Tab
            iconPosition="start"
            value="conditional"
            label="Pregunta conditional"
            icon={<img src={ConditionalIcon} alt="Pregunta conditional" style={{ width: '1.7em' }} />}
            onClick={() => handleAddAttribute('conditional')}
            sx={{ color: '#484848 !important', maxWidth: '8rem', p: 1 }}
          /> */}
          <Tab
            sx={{ maxWidth: '8rem', p: 1, textTransform: 'inherit' }}
            iconPosition="start"
            value="string"
            label="Campo de texto"
            icon={<Icon fontSize="small">text_fields</Icon>}
            onClick={() => handleAddAttribute('string')}
          />
          <Tab
            sx={{ maxWidth: '8rem', p: 1 }}
            iconPosition="start"
            value="date"
            label="Fecha"
            icon={<Icon fontSize="small">calendar_today</Icon>}
            onClick={() => handleAddAttribute('date')}
          />
          <Tab
            sx={{ maxWidth: '8rem', p: 1 }}
            iconPosition="start"
            value="photo"
            label="Fotografía"
            icon={<Icon fontSize="small">add_a_photo</Icon>}
            onClick={() => handleAddAttribute('photo')}
          />
          {/* <Tab
            sx={{ maxWidth: '8rem', p: 1 }}
            iconPosition="start"
            value="signature"
            label="Firma"
            icon={<Icon fontSize="small">edit</Icon>}
            onClick={() => handleAddAttribute('signature')}
          /> */}
          {/* <Tab
            sx={{ maxWidth: '8rem', p: 1 }}
            iconPosition="start"
            value="audio"
            label="Audio"
            icon={<Icon fontSize="small">volume_up</Icon>}
            onClick={() => handleAddAttribute('audio')}
          /> */}
          {/* <Tab
            sx={{ maxWidth: '8rem', p: 1 }}
            iconPosition="start"
            value="gps_point"
            label="Ubicación"
            icon={<Icon fontSize="small">room</Icon>}
            onClick={() => handleAddAttribute('gps_point')}
          />
          <Tab
            sx={{ maxWidth: '9rem', p: 1 }}
            iconPosition="start"
            value="georeference"
            label="Polígono"
            icon={<Icon fontSize="small">map</Icon>}
            onClick={() => handleAddAttribute('georeference')}
          /> */}
          <Tab
            sx={{ maxWidth: '8rem', p: 1, textAlign: 'left', textTransform: 'inherit' }}
            iconPosition="start"
            value="list_options"
            label="Opción única"
            icon={<Icon fontSize="small">list</Icon>}
            onClick={() => handleAddAttribute('list_options')}
          />
          <Tab
            sx={{ maxWidth: '8rem', p: 1, textAlign: 'left', textTransform: 'inherit' }}
            iconPosition="start"
            value="multiple_selection"
            label="Opción múltiple"
            icon={<img src={CoursesIcon} alt="Opción múltiple" />}
            onClick={() => handleAddAttribute('multiple_selection')}
          />
          {/* <Tab
            sx={{ maxWidth: '14rem', p: 1, textAlign: 'left', textTransform: 'inherit' }}
            iconPosition="start"
            value="altitude"
            label="Altitud"
            icon={<Icon fontSize="small">landscape</Icon>}
            onClick={() => handleAddAttribute('altitude')}
          /> */}
        </Tabs>
      </Box>

      <Box p={1} mt={3}>
        <Grid container spacing={1}>
          {/* PHONE */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              width="20em"
              height="39em"
              maxHeight="45em"
              borderRadius="35px"
              borderColor={theme.palette.primary.lighter}
              position="relative"
              style={{
                borderStyle: 'solid',
                borderWidth: '7px',
                background: '#fdfdfd'
              }}
            >
              <Box display="flex" justifyContent="center">
                <Box
                  style={{
                    marginTop: '-2px',
                    position: 'absolute',
                    width: '210px',
                    height: '25px',
                    zIndex: 4,
                    background: theme.palette.primary.lighter,
                    borderBottomLeftRadius: '24px',
                    borderBottomRightRadius: '24px'
                  }}
                />
              </Box>
              <Box mt="40px">
                {organizationForm !== undefined && (
                  <Box px={0.4}>
                    <Box px={1} mb={0.5} fontWeight={500}>
                      Nombre del formulario
                    </Box>
                    <Divider />
                    <Box display="flex" fontWeight={700} fontSize="1.2em" justifyContent="space-between">
                      <Box px={1}>{organizationForm?.name}</Box>
                      <Box display="flex" justifyContent="center" alignItems="center" px={1}>
                        <IconButton onClick={() => handleFormNameDialog()}>
                          <Icon sx={{ color: '#212B36' }}>edit</Icon>
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider />
                  </Box>
                )}
                <Scrollbar
                  sx={{
                    height: '28em',
                    maxHeight: '38em',
                    '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
                  }}
                >
                  <Box p={0.2} mt={2}>
                    <DragDropContext
                      onDragEnd={(result: DropResult, _) => {
                        handleOnDragEnd(result);
                        position = 0;
                      }}
                      onBeforeDragStart={() => {
                        position = 0;
                      }}
                    >
                      <Droppable droppableId="0">
                        {(provided: any) => (
                          <div ref={provided?.innerRef}>
                            {attributes?.map((attribute: OrganizationFormAttribute, idx: number) => {
                              if (attribute.attribute_type !== 'title') {
                                position++;
                              }
                              return (
                                <FormItem
                                  index={idx}
                                  sx={{
                                    bgcolor: idx === currentIndex && attribute.attribute_type !== 'title' && '#c4c4c46e'
                                  }}
                                  onClick={() => {
                                    // if (currentAttribute.attribute_type === 'formula') e.preventDefault();
                                    handleOnChange(attribute, idx);
                                  }}
                                  key={`form_item_${idx}`}
                                  attribute={attribute}
                                  onDelete={() => handleRemoveAttribute(idx)}
                                  onDuplicate={() => handleOnDuplicateAttribute(attribute)}
                                  position={position}
                                  currentIndex={currentIndex}
                                />
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Box>
                </Scrollbar>
              </Box>
            </Box>
          </Grid>

          {/* ATTRIBUTES */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            {!hiddenUp
              ? currentAttribute !== undefined &&
                isDialogOpen && (
                  <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                    {/* hiddenUp */}
                    <EditFormAttribute
                      errors={errors}
                      textFieldPlaceholder={textFieldPlaceholder}
                      currentAttribute={currentAttribute}
                      handleOnChangeField={handleOnChangeField}
                      handleOnChangeSelectField={handleOnChangeSelectField}
                      handleOnSaveAttribute={handleOnSaveAttribute}
                      arrayFieldsToFormula={arrToFormule}
                      handleOnSaveCurrentFormula={handleOnSaveCurrentFormula}
                      handleOnSaveCurrentConditionalSchemas={handleOnSaveCurrentConditionalSchemas}
                    />
                  </Dialog>
                )
              : currentAttribute !== undefined && (
                  <EditFormAttribute
                    errors={errors}
                    textFieldPlaceholder={textFieldPlaceholder}
                    currentAttribute={currentAttribute}
                    handleOnChangeField={handleOnChangeField}
                    handleOnChangeSelectField={handleOnChangeSelectField}
                    handleOnSaveAttribute={handleOnSaveAttribute}
                    arrayFieldsToFormula={arrToFormule}
                    handleOnSaveCurrentFormula={handleOnSaveCurrentFormula}
                    handleOnSaveCurrentConditionalSchemas={handleOnSaveCurrentConditionalSchemas}
                  />
                )}
          </Grid>
        </Grid>
      </Box>

      {isFormNameDialogOpen && organizationForm !== undefined && (
        <EditOrganizationFormName organizationForm={organizationForm} onClose={handleFormNameDialog} />
      )}
      {isPreviewDialogOpen && (
        <PreviewOrganizationForm
          attributes={attributes}
          organizationForm={organizationForm}
          onClose={handleClosePreviewDialog}
          onSave={saveOrganizationForm}
        />
      )}
    </>
  );
};

export default ShowOrganizationFormComponent;
