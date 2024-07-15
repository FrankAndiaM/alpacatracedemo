import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Dialog, Divider, DialogActions } from '@mui/material';
import { DialogContent, DialogTitle, Box, Grid, Icon } from '@mui/material';
import { Fab, FormControlLabel, Checkbox, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import SelectField from '~ui/atoms/SelectField/SelectField';
import Button from '~ui/atoms/Button/Button';
import { OrganizationForm } from '~models/organizationForm';
import { OrganizationFormAttribute } from '~models/organizationFormAttribute';
import { showMessage } from '~utils/Messages';
import {
  listCredentialSchemaCategories,
  createCredentialSchemaFromForm
} from '~services/digital_identity/credential/credential';
import { listAllOrganizationForm } from '~services/organization/formsv2';
import PreviewCredentialSchema from '../../../components/PreviewCredentialSchema';
import Autocomplete from '~ui/atoms/Autocomplete/Autocomplete';
import { useSelector } from 'react-redux';

type CreateFormCredentialSchemaDialogProps = {
  onClose: (isRefresh?: boolean) => void;
};

const validPeriods: any = [
  { name: '3m', description: '3 meses' },
  { name: '6m', description: '6 meses' },
  { name: '1y', description: '1 año' },
  { name: '100y', description: 'Sin caducidad' }
];

type CreateFormCredentialSchemaProps = {
  onClose: (isRefresh?: boolean) => void;
};

const CreateFormCredentialSchemaDialog: React.FC<CreateFormCredentialSchemaDialogProps> = (
  props: CreateFormCredentialSchemaProps
) => {
  const isCompMounted = useRef(null);
  const { auth }: any = useSelector((state: any) => state);
  const { organizationId } = auth?.organizationTheme;
  const { onClose }: CreateFormCredentialSchemaDialogProps = props;
  const [steps, setSteps] = useState<'basic' | 'complement' | 'preview'>('basic');
  const [credentialCategories, setCredentialCategories] = useState<any[]>([]);
  const [organizationForms, setOrganizationForms] = useState<OrganizationForm[]>([]);
  const [credentialAttributes, setCredentialAttributes] = useState<any[]>([]);
  const [organizationFormSelected, setOrganizationFormSelected] = useState<OrganizationForm | undefined>(undefined);
  const [isCredentialSchemaCategoriesLoading, setIsCredentialSchemaCategoriesLoading] = useState<boolean>(true);
  const [isOrganizationFormsLoading, setIsOrganizationFormsLoading] = useState<boolean>(true);

  const credential = {
    name: '',
    description: '',
    version: 1,
    valid_period: null,
    credential_schema_category_id: null
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('Campo requerido'),
    description: yup.string().required('Campo requerido'),
    version: yup.number().integer('El campo debe ser un número').required('Campo requerido'),
    valid_period: yup.string().required('Campo requerido').nullable(),
    credential_schema_category_id: yup.string().required('Campo requerido').nullable()
  });

  const formik = useFormik({
    initialValues: credential,
    onSubmit: (values: any) => {
      const currentCredentialAttributes = Array.from(credentialAttributes);
      //Verifica Phone
      if (steps === 'basic') {
        setSteps('complement');
        formik.setSubmitting(false);
        return;
      }
      if (steps === 'complement') {
        formik.setSubmitting(false);
        if (organizationFormSelected === undefined) {
          showMessage('', 'Debe seleccionar un formulario', 'warning');
          return;
        }
        if (currentCredentialAttributes.length === 0) {
          showMessage('', 'Debe agregar al menos un atributo', 'warning');
          return;
        }
        setSteps('preview');
        return;
      }
      if (steps === 'preview') {
        const newCredentialAttributes = currentCredentialAttributes.map((credentialAttribute: any, index: number) => {
          const newAttribute = Object.assign({}, credentialAttribute);
          newAttribute.position = index;
          return newAttribute;
        });
        createCredentialSchemaFromForm({
          gather_form_id: organizationFormSelected?.id,
          credential: values,
          credential_attributes: newCredentialAttributes
        })
          .then(() => {
            showMessage('', 'Certificado creado con éxito.', 'success');
            onClose(true);
          })
          .catch((err: any) => {
            formik.setSubmitting(false);
            const data = err?.response?.data;
            if (data?.error?.message !== undefined) {
              showMessage('', data?.error?.message, 'error', true);
              return;
            }
            showMessage('', 'Problemas al crear el certificado.', 'error', true);
          });
      }
    },
    validationSchema
  });

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  const handleOnClose = useCallback(() => {
    if (formik.isSubmitting) return;
    onClose();
  }, [onClose, formik]);

  const handleOnChangeCategory = useCallback(
    (name: string, value: string) => {
      formik.setFieldValue(name, value);
    },
    [formik]
  );

  const handleOnChangeOrganizationForm = useCallback(
    (name: string, value: any) => {
      const currentOrganization = organizationForms.find(
        (organizationForm: OrganizationForm) => organizationForm.id === value
      );
      setOrganizationFormSelected(currentOrganization);
      setCredentialAttributes([]);
    },
    [organizationForms]
  );

  /**
   * transform FormAttributeType To CredentialAttributeType
   */
  const transformAttributeType = useCallback((attributeType: string): string => {
    switch (attributeType) {
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      case 'gps_point':
        return 'string';
      case 'georeference':
        return 'string';
      case 'altitude':
        return 'string';
      case 'list_options':
        return 'enum';
      case 'boolean':
        return 'boolean';
      case 'multiple_selection':
        return 'string';
      default:
        return 'string';
    }
  }, []);

  const availableAttributes = useCallback((attributeType: string): boolean => {
    if (
      [
        'string',
        'number',
        'date',
        'gps_point',
        'georeference',
        'altitude',
        'list_options',
        'boolean',
        'multiple_selection'
      ].includes(attributeType)
    ) {
      return true;
    }
    return false;
  }, []);

  const handleOnAddAttribute = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, attribute: OrganizationFormAttribute, question: string) => {
      const {
        target: { checked }
      } = event;
      if (checked) {
        setCredentialAttributes((prevValues: any[]) => {
          const newAttribute = {
            gather_form_attribute_id: attribute.id,
            question,
            name: attribute.name,
            description: attribute.description || '',
            attribute_type: transformAttributeType(attribute.attribute_type),
            possible_values: attribute.possible_values || [],
            is_required: attribute.is_required || false
          };
          return [...prevValues, newAttribute];
        });
        return;
      }

      setCredentialAttributes((prevValues: any[]) => {
        const newAttributes = prevValues.filter(
          (prevAttribute: any) => prevAttribute.gather_form_attribute_id !== attribute.id
        );
        return newAttributes;
      });
    },
    [transformAttributeType]
  );

  const handleOnChange = useCallback((e: any, index: number) => {
    const { name, value } = e.target;
    setCredentialAttributes((prevValue: any[]) => {
      const newValues = prevValue.map((attribute: any, idx: number) => {
        if (idx === index) {
          const newValues: any = Object.assign({}, attribute);
          newValues[name] = value;
          return newValues;
        }
        return attribute;
      });
      return newValues;
    });
  }, []);

  const handleChangeVersion = useCallback(
    (name: string, value: number) => {
      if (value > 0) {
        formik.setFieldValue(name, value);
      }
    },
    [formik]
  );

  useEffect(() => {
    listAllOrganizationForm(organizationId, 'ALL')
      .then((res: any) => {
        if (!isCompMounted.current) return;
        const data = res?.data?.data;
        setOrganizationForms(data);
        setIsOrganizationFormsLoading(false);
      })
      .catch(() => {
        if (!isCompMounted.current) return;
        showMessage('', 'Problemas al cargar los formularios.', 'warning');
      });
  }, [organizationId]);

  const handleOnBackStep = useCallback((step: 'basic' | 'complement' | 'preview') => {
    setSteps(step);
  }, []);

  useEffect(() => {
    listCredentialSchemaCategories()
      .then((res: any) => {
        if (!isCompMounted.current) return;
        const data = res.data.data;
        setCredentialCategories(data);
        setIsCredentialSchemaCategoriesLoading(false);
      })
      .catch(() => {
        if (!isCompMounted.current) return;
        setIsCredentialSchemaCategoriesLoading(false);
        showMessage('', 'Problemas al cargar las categorías de los certificados', 'error');
      });
  }, []);

  const getIsChecked = useCallback((attributeId: string, credential: any[]): boolean => {
    return credential.some((credentialAttribute: any) => credentialAttribute.gather_form_attribute_id === attributeId);
  }, []);

  return (
    <>
      <Dialog
        // keepMounted
        ref={isCompMounted}
        fullWidth
        open
        onClose={handleOnClose}
        aria-labelledby="alert-dialog-credentials"
        aria-describedby="alert-dialog-credentials"
        maxWidth="lg"
      >
        <DialogTitle>
          {steps === 'complement' && (
            <>
              <Fab
                size="medium"
                sx={{
                  backgroundColor: '#000000',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#000000'
                  }
                }}
                aria-label="add"
                onClick={() => handleOnBackStep('basic')}
              >
                <Icon>arrow_back</Icon>
              </Fab>
            </>
          )}
          {steps !== 'preview' && (
            <>
              <Box fontSize="1.5rem" color="#000000">
                Crear certificado
              </Box>
              <Box color="#000000" fontSize="0.9rem">
                <span>Completa los datos correspondientes</span>
              </Box>
            </>
          )}
          {steps === 'preview' && (
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Fab
                size="medium"
                sx={{
                  backgroundColor: '#000000',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#000000'
                  }
                }}
                aria-label="add"
                onClick={() => handleOnBackStep('complement')}
              >
                <Icon>arrow_back</Icon>
              </Fab>
              <Box display="flex" flexDirection="column">
                <Box fontSize="1.5rem" textAlign="center">
                  Previsualización de certificado
                </Box>
                <Box fontWeight={400} fontSize="15px" textAlign="center">
                  Al emitir puede que algunos atributos se muestren vacíos por no ser obligatorios
                </Box>
              </Box>
              <Box />
            </Box>
          )}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {/* CREDENTIAL BASIC INFORMATION */}
          {steps === 'basic' && (
            <>
              <Grid container spacing={1}>
                <Grid item={true} xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                    id="name"
                    name="name"
                    type="text"
                    label="Nombre del certificado"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    disabled={formik.isSubmitting}
                    errors={formik.errors}
                    touched={formik.touched}
                    // variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={12} md={12} lg={6} xl={6}>
                  <TextField
                    id="description"
                    name="description"
                    type="text"
                    label="Descripción"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    disabled={formik.isSubmitting}
                    errors={formik.errors}
                    touched={formik.touched}
                    // variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={12} md={12} lg={6} xl={6}>
                  <SelectField
                    id="credential_schema_category_id"
                    name="credential_schema_category_id"
                    label="Categoría"
                    items={credentialCategories}
                    itemText="description"
                    itemValue="id"
                    value={formik.values.credential_schema_category_id}
                    onChange={handleOnChangeCategory}
                    errors={formik.errors}
                    touched={formik.touched}
                    disabled={formik.isSubmitting}
                    isLoading={isCredentialSchemaCategoriesLoading}
                    // variant="outlined"
                  />
                </Grid>
                <Grid item={true} xs={12} sm={12} md={12} lg={3} xl={3}>
                  <TextField
                    id="version"
                    name="version"
                    type="number"
                    label="Version"
                    value={formik.values.version}
                    onChange={(e: any) => handleChangeVersion(e.target.name, e.target.value)}
                    disabled={formik.isSubmitting}
                    errors={formik.errors}
                    touched={formik.touched}
                    // variant="outlined"
                  />
                </Grid>

                <Grid item={true} xs={12} sm={12} md={12} lg={3} xl={3}>
                  <SelectField
                    id="valid_period"
                    name="valid_period"
                    label="Vigencia"
                    items={validPeriods}
                    itemText="description"
                    itemValue="name"
                    value={formik.values.valid_period}
                    onChange={handleOnChangeCategory}
                    errors={formik.errors}
                    touched={formik.touched}
                    disabled={formik.isSubmitting}
                    // variant="outlined"
                  />
                </Grid>
              </Grid>
            </>
          )}
          {/* CREDENTIAL ATTRIBUTES */}
          {steps === 'complement' && (
            <>
              <Grid container spacing={1}>
                <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} pb={2}>
                  <Box>Selecciona el formulario correspondiente y luego edita las preguntas según se requiera</Box>
                  <Box component="span">
                    <strong>Nota:</strong> Solo los formularios de productor pueden ser convertidos a certificados.
                  </Box>
                  <Box>
                    <Autocomplete
                      id={'organization_form_id'}
                      label={'Formularios'}
                      name={'organization_form_id'}
                      itemText="name"
                      itemValue="id"
                      items={organizationForms}
                      value={organizationFormSelected}
                      defaultValue={organizationFormSelected}
                      onChange={handleOnChangeOrganizationForm}
                      disabled={formik.isSubmitting}
                      errors={formik.errors}
                      touched={formik.touched}
                      isDataLoading={isOrganizationFormsLoading}
                    />
                    {/* <SelectField
                      id="organization_form_id"
                      name="organization_form_id"
                      label="Formularios"
                      itemText="display_name"
                      itemValue="id"
                      items={organizationForms}
                      value={organizationFormSelected}
                      onChange={handleOnChangeOrganizationForm}
                      disabled={formik.isSubmitting}
                      errors={formik.errors}
                      touched={formik.touched}
                      isLoading={isOrganizationFormsLoading}
                    /> */}
                  </Box>
                </Grid>
                <Grid
                  item={true}
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                  sx={{ borderRight: '1px solid', borderColor: '#919eab3d' }}
                >
                  <Box fontWeight={700}>Preguntas del formulario</Box>
                  <Box fontSize="0.9em" mt={1} pr={1}>
                    Selecciona las preguntas según los datos que quieras que estén en el certificado. Ejem:
                    <Box component="span" fontWeight={700}>
                      {' Dato Nombre - Pregunta "¿Cuál es tu nombre?"'}
                    </Box>
                    <br />
                    <br />
                    Las preguntas de color{' '}
                    <Box component="span" color="#3D8761" fontWeight={700}>
                      verde
                    </Box>{' '}
                    son opcionales, es probable que algunas no incluyan respuesta.
                  </Box>
                  <Box pl={2} pt={2}>
                    {organizationFormSelected !== undefined &&
                      organizationFormSelected?.schema?.data?.map(
                        (attribute: OrganizationFormAttribute, index: number) => (
                          <React.Fragment key={`form_attribute_${index}`}>
                            <Box>
                              {availableAttributes(attribute?.attribute_type) ? (
                                <FormControlLabel
                                  label={`${index + 1}. ${attribute?.name}`}
                                  control={
                                    <Checkbox
                                      id={`form_attribute_${attribute?.id}`}
                                      name={`form_attribute_${attribute?.id}`}
                                      checked={getIsChecked(attribute?.id ?? '', credentialAttributes)}
                                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        handleOnAddAttribute(event, attribute, `${index + 1}. ${attribute?.name}`)
                                      }
                                      sx={{
                                        color: 'black',
                                        '&.Mui-checked': {
                                          color: 'black'
                                        }
                                      }}
                                    />
                                  }
                                  sx={{
                                    color: attribute?.is_required ? '#000000' : '#21764B',
                                    '.MuiFormControlLabel-label': {
                                      fontWeight: 700
                                    }
                                  }}
                                />
                              ) : (
                                <Tooltip
                                  title={
                                    'Los atributos de tipo firma, foto, condicional o audio no encuentran disponibles'
                                  }
                                  arrow
                                >
                                  <FormControlLabel
                                    label={`${index + 1}. ${attribute?.name}`}
                                    control={
                                      <Checkbox
                                        disabled
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                          handleOnAddAttribute(event, attribute, `${index + 1}. ${attribute?.name}`)
                                        }
                                      />
                                    }
                                    sx={{ '.MuiFormControlLabel-label': { fontWeight: 700 } }}
                                  />
                                </Tooltip>
                              )}
                            </Box>
                          </React.Fragment>
                        )
                      )}
                  </Box>
                </Grid>
                <Grid item={true} xs={12} sm={12} md={12} lg={6} xl={6}>
                  <Box fontWeight={700}>Datos adicionales</Box>
                  <Box fontSize="0.9em" mt={1}>
                    Estas son las preguntas que se van a mostrar en el certificado.
                  </Box>
                  <Box mt={3.5}>
                    {credentialAttributes?.map((attribute: any, index: number) => (
                      <React.Fragment key={`form_attribute_${index}`}>
                        <Box>
                          <Box
                            fontWeight={700}
                            fontSize="0.9.rem"
                            sx={{ color: attribute?.is_required ? '#000000' : '#21764B' }}
                          >
                            {attribute?.question}
                          </Box>
                          <TextField
                            id="name"
                            name="name"
                            type="text"
                            label="Atributo"
                            autoComplete="off"
                            value={attribute?.name}
                            onChange={(e: any) => handleOnChange(e, index)}
                            disabled={formik.isSubmitting}
                          />
                        </Box>
                      </React.Fragment>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
          {/* CREDENTIAL PREVIEW */}
          {steps === 'preview' && (
            <PreviewCredentialSchema credentialAttributes={credentialAttributes} credential={formik.values} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleOnClose()} variant="outlined" disabled={formik.isSubmitting} text="Cancelar" />

          <Button
            onClick={() => onSubmit()}
            color="primary"
            variant="contained"
            disabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
            text={steps === 'basic' ? 'Siguiente' : steps === 'complement' ? 'Previsualizar' : 'Crear certificado'}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateFormCredentialSchemaDialog;
