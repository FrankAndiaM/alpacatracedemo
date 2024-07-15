import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Dialog, Divider, DialogActions } from '@mui/material';
import { Typography, Switch } from '@mui/material';
import { DialogContent, DialogTitle, Box, Grid, Icon } from '@mui/material';
import { Fab } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import SelectField from '~ui/atoms/SelectField/SelectField';
import Button from '~ui/atoms/Button/Button';
import { showMessage } from '~utils/Messages';
import { useSelector } from 'react-redux';
import {
  listCredentialSchemaCategories,
  createCredentialSchema
} from '~services/digital_identity/credential/credential';
import PreviewCredentialSchema from '../../../components/PreviewCredentialSchema';

const inputValues: any[] = [
  {
    id: 'string',
    description: 'Texto'
  },
  {
    id: 'number',
    description: 'Número'
  },
  {
    id: 'date',
    description: 'Fecha'
  },
  {
    id: 'boolean',
    description: 'Si/No'
  }
];

const validPeriods: any = [
  { name: '3m', description: '3 meses' },
  { name: '6m', description: '6 meses' },
  { name: '1y', description: '1 año' },
  { name: '100y', description: 'Sin caducidad' }
];

type CreatePredeterminedCredencialSchemaDialogProps = {
  onClose: (isRefresh?: boolean) => void;
};

const CreatePredeterminedCredencialSchemaDialog: React.FC<CreatePredeterminedCredencialSchemaDialogProps> = (
  props: CreatePredeterminedCredencialSchemaDialogProps
) => {
  const { onClose } = props;
  const isCompMounted = useRef(null);
  const { auth }: any = useSelector((state: any) => state);
  const [steps, setSteps] = useState<'basic' | 'preview'>('basic');
  const [credentialSchemaAttributes, setCredentialSchemaAttributes] = useState<any[]>([]);
  const [credentialSchemaCategories, setCredentialSchemaCategories] = useState<any[]>([]);
  const [isCredentialSchemaCategoriesLoading, setIsCredentialSchemaCategoriesLoading] = useState<boolean>(true);

  const credential = {
    name: '',
    description: '',
    version: 1,
    valid_period: null,
    credential_schema_category_id: null,
    is_support_revocation: false,
    is_unique: false
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
      if (credentialSchemaAttributes.length === 0) {
        showMessage('', 'Debe agregar al menos un atributo', 'warning');
        formik.setSubmitting(false);
        return;
      }

      if (steps === 'basic') {
        setSteps('preview');
        formik.setSubmitting(false);
        return;
      }

      const newCredentialAttributes = credentialSchemaAttributes.map((credentialAttribute: any, index: number) => {
        const newAttribute = Object.assign({}, credentialAttribute);
        newAttribute.position = index;
        return newAttribute;
      });
      createCredentialSchema({
        ...values,
        organization_id: auth?.organizationTheme?.organizationId,
        credential_schema_type: 'predetermined',
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
      // }
    },
    validationSchema
  });

  const handleOnChangeCategory = useCallback(
    (name: string, value: string) => {
      formik.setFieldValue(name, value);
    },
    [formik]
  );

  const validateExistDuplicateAttributes = useCallback((attributes: any[]) => {
    return attributes.some((current_attribute: any, index: number) => {
      return attributes.some(
        (prev_attributes: any, idx: number) => current_attribute.name === prev_attributes.name && index !== idx
      );
    });
  }, []);

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    if (validateExistDuplicateAttributes(credentialSchemaAttributes)) {
      showMessage('Nombre repetidos', '', 'warning');
      return;
    }
    formik.handleSubmit();
  }, [formik, credentialSchemaAttributes, validateExistDuplicateAttributes]);

  const handleOnClose = useCallback(() => {
    if (formik.isSubmitting) return;
    onClose();
  }, [onClose, formik]);

  const handleOnChange = useCallback((e: any, index: number) => {
    const { name, value } = e.target;
    setCredentialSchemaAttributes((prevValue: any[]) => {
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

  const handleOnChangeSwitchAttribute = useCallback((e: any, index: number) => {
    const { name, checked } = e.target;
    setCredentialSchemaAttributes((prevValue: any[]) => {
      const newValues = prevValue.map((attribute: any, idx: number) => {
        if (idx === index) {
          const newValues: any = Object.assign({}, attribute);
          newValues[name] = checked;
          return newValues;
        }
        return attribute;
      });
      return newValues;
    });
  }, []);

  const handleOnChangeAttributeType = useCallback((e: any, index: number) => {
    const { value } = e.target;
    setCredentialSchemaAttributes((prevValue: any[]) => {
      const newValues = prevValue.map((attribute: any, idx: number) => {
        if (idx === index) {
          const newValues: any = Object.assign({}, attribute);
          newValues['attribute_type'] = value;
          newValues['default_value'] = '';
          return newValues;
        }
        return attribute;
      });
      return newValues;
    });
  }, []);

  const handleRemoveAttribute = useCallback((index: number) => {
    setCredentialSchemaAttributes((prevValue: any[]) => {
      const newValues = prevValue.filter((attribute: any, idx: number) => idx !== index);
      return newValues;
    });
  }, []);

  const handleAddAttribute = useCallback(() => {
    setCredentialSchemaAttributes((prevValues: any[]) => {
      prevValues.push({
        name: '',
        default_value: '',
        description: '',
        attribute_type: 'string',
        possible_values: [],
        is_required: false
      });
      return [...prevValues];
    });
  }, []);

  const handleOnChangeSwitch = useCallback(
    (e: any) => {
      const { name, checked } = e.target;
      formik.setFieldValue(name, checked);
    },
    [formik]
  );

  const handleOnBackStep = useCallback(
    (step: 'basic' | 'preview') => {
      if (formik.isSubmitting) return;
      setSteps(step);
    },
    [formik]
  );

  const handleChangeVersion = useCallback(
    (name: string, value: number) => {
      if (value > 0) {
        formik.setFieldValue(name, value);
      }
    },
    [formik]
  );

  useEffect(() => {
    listCredentialSchemaCategories()
      .then((res: any) => {
        if (!isCompMounted.current) return;
        const data = res.data.data;
        setCredentialSchemaCategories(data);
        setIsCredentialSchemaCategoriesLoading(false);
      })
      .catch(() => {
        if (!isCompMounted.current) return;
        setIsCredentialSchemaCategoriesLoading(false);
        showMessage('', 'Problemas al cargar las categorías de los certificados', 'error');
      });
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
          {steps === 'basic' && (
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
                onClick={() => handleOnBackStep('basic')}
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
          {steps === 'basic' && (
            <>
              {/* CREDENTIAL BASIC INFORMATION */}
              <Grid container spacing={1}>
                <Grid item={true} xs={12} sm={12} md={12} lg={5} xl={5}>
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

                <Grid item={true} xs={12} sm={12} md={12} lg={3} xl={3}>
                  <SelectField
                    id="credential_schema_category_id"
                    name="credential_schema_category_id"
                    label="Categoría"
                    items={credentialSchemaCategories}
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
                <Grid item={true} xs={12} sm={12} md={12} lg={2} xl={2}>
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

                <Grid item={true} xs={12} sm={12} md={12} lg={2} xl={2}>
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

                <Grid item={true} xs={12} sm={12} md={12} lg={5} xl={5}>
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

                <Grid item={true} xs={12} sm={12} md={12} lg={2} xl={2}>
                  <Box display="flex" alignItems="center" width="100%" height="100%">
                    <Typography>Revocable:</Typography>
                    <Box display="flex" alignItems="center" mx={1}>
                      <Switch
                        onChange={handleOnChangeSwitch}
                        name="is_support_revocation"
                        id="is_support_revocation"
                        disabled={formik.isSubmitting}
                        value={formik.values.is_support_revocation}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item={true} xs={12} sm={12} md={12} lg={2} xl={2}>
                  <Box display="flex" alignItems="center" width="100%" height="100%">
                    <Typography>Única:</Typography>
                    <Box display="flex" alignItems="center" mx={1}>
                      <Switch
                        onChange={handleOnChangeSwitch}
                        name="is_unique"
                        id="is_unique"
                        disabled={formik.isSubmitting}
                        value={formik.values.is_unique}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* CREDENTIAL ADD ATTRIBUTES */}
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box display="flex">
                  <Box style={{ backgroundColor: '#FFFFFF' }} color="#3F860C" py={2} fontWeight="bold" fontSize="16px">
                    Afirmaciones del certificado
                  </Box>
                  <Box>
                    <Fab
                      color="primary"
                      aria-label="add"
                      size="small"
                      onClick={handleAddAttribute}
                      disabled={formik.isSubmitting}
                    >
                      <Icon>add</Icon>
                    </Fab>
                  </Box>
                </Box>

                <Divider style={{ backgroundColor: '#3F860C', height: '2px' }} />

                {/* CREDENTIAL ATTRIBUTES */}
                <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                  {credentialSchemaAttributes?.map((attribute: any, index: number) => (
                    <Grid container key={`attribute_${index}`} spacing={1}>
                      <Grid item={true} xs={12} sm={3} md={3} lg={3} xl={3}>
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
                      </Grid>

                      <Grid item={true} xs={12} sm={3} md={3} lg={2} xl={2}>
                        <SelectField
                          id="attribute_type"
                          name="attribute_type"
                          label="Tipo de variable"
                          value={attribute.attribute_type}
                          items={inputValues}
                          onChange={(name: string, value: any) =>
                            handleOnChangeAttributeType({ target: { name, value } }, index)
                          }
                          disabled={formik.isSubmitting}
                          itemText="description"
                          itemValue="id"
                        />
                      </Grid>
                      <Grid item={true} xs={12} sm={4} md={4} lg={4} xl={4}>
                        {attribute?.attribute_type === 'string' && (
                          <TextField
                            id="default_value"
                            name="default_value"
                            type="text"
                            label="Valor del atributo"
                            autoComplete="off"
                            value={attribute?.default_value}
                            onChange={(e: any) => handleOnChange(e, index)}
                            disabled={formik.isSubmitting}
                          />
                        )}
                        {attribute?.attribute_type === 'number' && (
                          <TextField
                            id="default_value"
                            name="default_value"
                            type="number"
                            label="Valor del atributo"
                            autoComplete="off"
                            value={attribute?.default_value}
                            onChange={(e: any) => handleOnChange(e, index)}
                            disabled={formik.isSubmitting}
                          />
                        )}
                        {attribute?.attribute_type === 'boolean' && (
                          <>
                            <Box display="flex" alignItems="center" mx={1} width="100%" height="100%">
                              <Box>No</Box>
                              <Box>
                                <Switch
                                  onChange={(e: any) => handleOnChangeSwitchAttribute(e, index)}
                                  name="default_value"
                                  id="default_value"
                                  disabled={formik.isSubmitting}
                                  value={attribute?.default_value ?? false}
                                />
                              </Box>
                              <Box>Si</Box>
                            </Box>
                          </>
                        )}
                        {attribute?.attribute_type === 'date' && (
                          <TextField
                            id="default_value"
                            name="default_value"
                            type="date"
                            label="Valor del atributo"
                            autoComplete="off"
                            value={attribute?.default_value}
                            onChange={(e: any) => handleOnChange(e, index)}
                            disabled={formik.isSubmitting}
                          />
                        )}
                      </Grid>

                      <Grid item={true} xs={1} sm={1} md={1} lg={1} xl={1}>
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                          <Fab
                            style={{ background: '#e85a5a' }}
                            aria-label="remove"
                            size="small"
                            disabled={formik.isSubmitting}
                            onClick={() => handleRemoveAttribute(index)}
                          >
                            <Icon>remove</Icon>
                          </Fab>
                        </Box>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </>
          )}
          {/* CREDENTIAL PREVIEW */}
          {steps === 'preview' && (
            <PreviewCredentialSchema credentialAttributes={credentialSchemaAttributes} credential={formik.values} />
          )}
        </DialogContent>
        <DialogActions>
          {steps === 'basic' && (
            <>
              <Button
                onClick={() => handleOnClose()}
                variant="contained"
                disabled={formik.isSubmitting}
                text="Cancelar"
                sx={{
                  background: '#6E767D',
                  '&:hover': {
                    bgcolor: '#6E767D'
                  }
                }}
              />

              <Button
                onClick={() => onSubmit()}
                color="primary"
                variant="contained"
                disabled={formik.isSubmitting}
                isLoading={formik.isSubmitting}
                text="Previsualizar"
              />
            </>
          )}
          {steps === 'preview' && (
            <>
              <Box width="100%" display="flex" justifyContent="center">
                <Button
                  onClick={() => onSubmit()}
                  color="primary"
                  variant="contained"
                  disabled={formik.isSubmitting}
                  isLoading={formik.isSubmitting}
                  text="Crear certificado"
                  sx={{
                    height: '45px',
                    width: '250px'
                  }}
                />
              </Box>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CreatePredeterminedCredencialSchemaDialog;
