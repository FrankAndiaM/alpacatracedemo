import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Dialog, Divider, DialogActions } from '@mui/material';
import { DialogContent, DialogTitle, Box, Grid, Icon } from '@mui/material';
import { Fab, FormControlLabel, Checkbox, Chip } from '@mui/material';
import TextFieldMaterial from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import SelectField from '~ui/atoms/SelectField/SelectField';
import Button from '~ui/atoms/Button/Button';
import { showMessage } from '~utils/Messages';
import {
  listCredentialSchemaCategories,
  createCredentialSchema
} from '~services/digital_identity/credential/credential';
import { useSelector } from 'react-redux';
import PreviewCredentialSchema from '../../../components/PreviewCredentialSchema';
import CredentialBasicInformation from './CredentialBasicInformation';

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
  },
  {
    id: 'enum',
    description: 'Categórica'
  }
];

type CreateDefaultCredentialSchemaDialogProps = {
  onClose: (isRefresh?: boolean) => void;
};

const CreateDefaultCredentialSchemaDialog: React.FC<CreateDefaultCredentialSchemaDialogProps> = (
  props: CreateDefaultCredentialSchemaDialogProps
) => {
  const { onClose } = props;
  const isCompMounted = useRef(null);
  const { auth }: any = useSelector((state: any) => state);
  const [steps, setSteps] = useState<'basic' | 'preview'>('basic');
  const [credentialSchemaAttributes, setCredentialSchemaAttributes] = useState<any[]>([]);
  const [credentialSchemaCategories, setCredentialSchemaCategories] = useState<any[]>([]);
  const [isCredentialSchemaCategoriesLoading, setIsCredentialSchemaCategoriesLoading] = useState<boolean>(true);

  const [openDialogItem, setOpenDialogItem] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any>({});

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
        credential_schema_type: 'default',
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
        description: '',
        attribute_type: '',
        possible_values: [],
        is_required: false
      });
      return [...prevValues];
    });
  }, []);

  const handleOpenItemDialog = useCallback((attrib: any, index: number) => {
    setOpenDialogItem(true);
    setCurrentValue({
      index,
      ...attrib
    });
  }, []);

  const handleCloseItemDialog = useCallback(() => {
    setOpenDialogItem(false);
    setCurrentValue({});
  }, []);

  const handleDeletePosibleItem = useCallback((index: number) => {
    setCurrentValue((prevValue: any) => {
      const newValues: any = Object.assign({}, prevValue);
      newValues.possible_values = newValues.possible_values?.filter((currentValue: any, idx: number) => idx !== index);
      return newValues;
    });
  }, []);

  const handleSavePosibleItems = useCallback(() => {
    setCredentialSchemaAttributes((prevValue: any[]) => {
      const newValues = prevValue.map((attribute: any, idx: number) => {
        if (idx === currentValue?.index) {
          const newValues: any = Object.assign({}, currentValue);
          setCurrentValue({});
          return newValues;
        }
        return attribute;
      });
      return newValues;
    });
    setOpenDialogItem(false);
  }, [currentValue]);

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

  const handleOnBackStep = useCallback(
    (step: 'basic' | 'preview') => {
      if (formik.isSubmitting) return;
      setSteps(step);
    },
    [formik]
  );

  const handleOnChangeSwitch = useCallback(
    (e: any) => {
      const { name, checked } = e.target;
      formik.setFieldValue(name, checked);
    },
    [formik]
  );

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
              <CredentialBasicInformation
                formik={formik}
                credentialSchemaCategories={credentialSchemaCategories}
                handleOnChangeCategory={handleOnChangeCategory}
                isCredentialSchemaCategoriesLoading={isCredentialSchemaCategoriesLoading}
                handleOnChangeSwitch={handleOnChangeSwitch}
              />

              {/* CREDENTIAL ADD ATTRIBUTES*/}
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
                {/* {formik?.errors?.attributes && (
              <FormHelperText error>Registre los atributos del certificado</FormHelperText>
            )} */}
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
                      <Grid item={true} xs={12} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="description"
                          name="description"
                          type="text"
                          label="Descripción"
                          autoComplete="off"
                          value={attribute?.description}
                          onChange={(e: any) => handleOnChange(e, index)}
                          disabled={formik.isSubmitting}
                        />
                      </Grid>
                      <Grid item={true} xs={12} sm={3} md={3} lg={2} xl={2}>
                        <SelectField
                          id="attribute_type"
                          name="attribute_type"
                          label="Tipo de variable"
                          value={null}
                          items={inputValues}
                          onChange={(name: string, value: any) => handleOnChange({ target: { name, value } }, index)}
                          disabled={formik.isSubmitting}
                          itemText="description"
                          itemValue="id"
                        />
                      </Grid>
                      {attribute?.attribute_type === 'enum' && (
                        <Grid item={true} xs={12} sm={3} md={1} lg={1} xl={1}>
                          <Button
                            text="Agregar Items"
                            onClick={() => handleOpenItemDialog(attribute, index)}
                            color="secondary"
                            variant="outlined"
                          />
                        </Grid>
                      )}
                      <Grid item={true} xs={1} sm={1} md={1} lg={1} xl={1}>
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="is_required"
                                checked={attribute?.is_required}
                                onChange={(e: any) =>
                                  handleOnChange(
                                    { target: { name: e?.target?.name, value: e?.target?.checked } },
                                    index
                                  )
                                }
                                disabled={formik.isSubmitting}
                                color="primary"
                              />
                            }
                            label="Requerido"
                          />
                        </Box>
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

      {/* Category options */}
      <Dialog
        disableEscapeKeyDown
        maxWidth="sm"
        open={openDialogItem}
        title="Atributos"
        onClose={() => handleCloseItemDialog()}
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="center">
            <span> Atributos </span>
          </Box>
        </DialogTitle>

        <Divider />
        <DialogContent>
          <TextFieldMaterial
            id="tags"
            variant="outlined"
            fullWidth
            InputProps={{ style: { border: '1px solid #6ca72d' } }}
            name="tags"
            type="text"
            autoComplete="off"
            onKeyPress={(e: any) => {
              if (e.key === 'Enter') {
                const value = e?.target?.value;
                setCurrentValue((prevValue: any) => {
                  const newValues: any = Object.assign({}, prevValue);
                  newValues.possible_values = [...newValues.possible_values, value];
                  return newValues;
                });
                e.target.value = '';
              }
            }}
            // className={classes?.TextField}
          />
          <ul
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              width: '100%',
              height: 'auto',
              listStyle: 'none',
              padding: '0px',
              margin: '20px 0px',
              boxShadow: 'none'
            }}
          >
            {currentValue?.possible_values?.map((label: any, i: number) => {
              return (
                <li key={`chip_${i}_${label}`} style={{ margin: '5px' }}>
                  <Chip color="primary" onDelete={() => handleDeletePosibleItem(i)} label={label} />
                </li>
              );
            })}
          </ul>
        </DialogContent>

        <DialogActions>
          <Button
            text="Cancelar"
            onClick={() => handleCloseItemDialog()}
            color="secondary"
            variant="contained"
            sx={{
              background: '#6E767D',
              '&:hover': {
                bgcolor: '#6E767D'
              }
            }}
          />
          <Button onClick={() => handleSavePosibleItems()} color="primary" variant="contained" text="Guardar" />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDefaultCredentialSchemaDialog;
