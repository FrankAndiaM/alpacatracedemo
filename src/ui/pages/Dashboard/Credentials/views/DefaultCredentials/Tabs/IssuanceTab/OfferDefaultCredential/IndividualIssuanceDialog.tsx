import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Grid, Icon, Typography } from '@mui/material';
import { List, ListItem, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { paginateProducerDigitalIdentity } from '~services/farmer';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { showMessage } from '~utils/Messages';
import TextFieldSearch from '~ui/molecules/TextFieldSearch/TextFieldSearch';
import Button from '~atoms/Button/Button';
import CustomInput from '../../../../../components/CustomInput';
import { useFormik } from 'formik';
import { offerCredential } from '~services/digital_identity/credential/credential';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import { CredentialAttributeModel } from '~models/digital_identity/credential_attribute';
import { paginateOrganizationsConnected } from '~services/organization/organizationConnection';
import SelectField from '~ui/atoms/SelectField/SelectField';

type IndividualIssuanceDialogProps = {
  credentialSchema: CredentialSchemaModel;
  onClose: (typeUseCredential: 'individual' | 'massive' | undefined, isUpdateTable?: boolean) => void;
};

const IndividualIssuanceDialog: React.FC<IndividualIssuanceDialogProps> = (props: IndividualIssuanceDialogProps) => {
  const { credentialSchema, onClose } = props;
  const { auth }: any = useSelector((state: any) => state);
  const isCompMounted = useRef(null);
  const [steps, setSteps] = useState<'select_producer' | 'fill_credential'>('select_producer');
  const [subjectModelType, setSubjectModelType] = useState<'Farmers' | 'Organizations'>('Farmers');
  const [producers, setProducers] = useState<any[]>([]);
  const [allEntities, setAllEntities] = useState<any[]>([]);
  const [entitySelected, setEntitySelected] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [credentialValues, setCredentialValues] = useState<CredentialAttributeModel[]>([]);
  const [errors, setErrors] = useState<any>({});

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      const data: any = {};
      credentialValues.forEach((attribute: any) => (data[attribute?.name] = attribute.value));
      offerCredential(credentialSchema?.id || '', {
        subject_model_id: entitySelected,
        subject_model_type: subjectModelType,
        issuer_model_id: auth?.organizationTheme?.organizationId,
        issuer_model_type: 'Organizations',
        credential_data: data
      })
        .then(() => {
          if (isCompMounted.current) {
            showMessage('', 'Certificado emitido.', 'success');
            onClose(undefined, true);
          }
        })
        .catch((err: any) => {
          if (isCompMounted.current) {
            const data = err?.response?.data;
            setErrors(data?.errors ?? {});
            formik.setSubmitting(false);
            if (data?.error?.message !== undefined) {
              showMessage('', data?.error?.message, 'error', true);
              return;
            }
            if (data?.message !== undefined) {
              showMessage('', data?.message, 'error', true);
              return;
            }
            showMessage('', 'Problemas al emitir el certificado.', 'error', true);
          }
        });
    }
  });

  const loadProducers = useCallback(() => {
    setIsLoading(true);
    return paginateProducerDigitalIdentity(1, 10000, '', '', '');
  }, []);

  const loadOrganizations = useCallback(() => {
    return paginateOrganizationsConnected(auth?.organizationTheme?.organizationId, 1, 10000, '', '', '');
  }, [auth]);

  const _loadEntity = useCallback(
    (modelType: 'Farmers' | 'Organizations') => {
      if (modelType === 'Farmers') {
        return loadProducers();
      }
      return loadOrganizations();
    },
    [loadProducers, loadOrganizations]
  );

  const loadEntity = useCallback(
    (modelType: 'Farmers' | 'Organizations') => {
      setIsLoading(true);
      _loadEntity(modelType)
        .then((res: any) => {
          if (!isCompMounted.current) return;
          const data = res?.data?.data?.items ?? [];
          setProducers(data);
          setAllEntities(data);
          setIsLoading(false);
        })
        .catch(() => {
          if (!isCompMounted.current) return;
          setIsLoading(false);
          showMessage('', 'Problemas al cargar los registros', 'error');
        });
    },
    [_loadEntity]
  );

  const handleOnChangeSearch = useCallback(
    (search: any) => {
      const newArray = producers.filter((arr: any) => {
        for (const key in arr) {
          if (String(arr[key]).toLowerCase().includes(search.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
      setAllEntities(newArray);
    },
    [producers]
  );

  const handleChangeProducer = useCallback((producerId: string) => {
    setEntitySelected(producerId);
  }, []);

  const handleClose = useCallback(() => {
    if (formik.isSubmitting) return;
    if (steps === 'select_producer') {
      onClose(undefined);
      return;
    }
    if (steps === 'fill_credential') {
      setSteps('select_producer');
      return;
    }
  }, [formik, steps, onClose]);

  const onSubmit = useCallback(async () => {
    if (steps === 'select_producer' && entitySelected === '') {
      showMessage('', 'Por favor, seleccione un productor.', 'warning');
      return;
    }
    if (steps === 'select_producer') {
      setSteps('fill_credential');
      return;
    }
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik, steps, entitySelected]);

  const handleChangeAttribute = useCallback((event: any) => {
    const { name, value } = event.target;
    setCredentialValues((prevValue: any[]) => {
      const newValues = prevValue.map((attribute: any) => {
        if (attribute?.name === name) {
          const newValues: any = Object.assign({}, attribute);
          newValues['value'] = value;
          return newValues;
        }
        return attribute;
      });
      return newValues;
    });
  }, []);

  useEffect(() => {
    loadEntity(subjectModelType);
  }, [loadEntity, subjectModelType]);

  useEffect(() => {
    setCredentialValues(() => {
      return (
        credentialSchema?.credential_attributes?.map((attribute: any) => {
          return {
            ...attribute,
            value: ''
          };
        }) ?? []
      );
    });
  }, [credentialSchema]);

  const handleEntityOnChange = useCallback((_: any, value: any) => {
    setSubjectModelType(value);
    setEntitySelected('');
  }, []);

  return (
    <>
      <Box ref={isCompMounted}>
        <Dialog
          open
          title="Emisión de certificado"
          subtitle={
            steps === 'select_producer'
              ? 'Selecciona un productor o emite masivamente'
              : 'Complete los datos del certificado'
          }
          onClose={() => 0}
          actions={
            <>
              <Button
                text={steps === 'select_producer' ? 'Cancelar' : 'Regresar'}
                onClick={() => handleClose()}
                variant="outlined"
                disabled={formik.isSubmitting}
              />
              <Button
                onClick={onSubmit}
                color="primary"
                disabled={formik.isSubmitting}
                isLoading={formik.isSubmitting}
                variant="contained"
                text={steps === 'select_producer' ? 'Siguiente' : 'Emitir certificado'}
              />
            </>
          }
        >
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ fontWeight: 'bold' }}>
              Selecciona el tipo de actor al que deseas emitir
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
              <SelectField
                id="subject_model_type"
                name="subject_model_type"
                label=""
                items={[
                  {
                    id: 'Farmers',
                    name: 'Productores'
                  },
                  {
                    id: 'Organizations',
                    name: 'Organizaciones'
                  }
                ]}
                itemText="name"
                itemValue="id"
                value={subjectModelType}
                onChange={handleEntityOnChange}
                disabled={isLoading}
              />
            </Grid>
          </Grid>
          {subjectModelType === 'Farmers' && (
            <Box
              sx={{ color: 'green', cursor: 'pointer' }}
              display="inline-flex"
              alignItems="center"
              my={1}
              onClick={() => {
                onClose('massive');
              }}
            >
              <Typography component="span" sx={{ textDecoration: 'underline' }}>
                Emitir masivamente
              </Typography>
              <Icon>arrow_forward</Icon>
            </Box>
          )}
          {steps === 'select_producer' && (
            <Grid container>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box>
                  <TextFieldSearch label="Buscar" onChange={handleOnChangeSearch} isAnimated={false} />
                </Box>
                <List subheader={<li />}>
                  {isLoading ? (
                    <>
                      <Box>Cargando</Box>
                      <LinearProgress loading={isLoading} />
                    </>
                  ) : (
                    <>
                      {allEntities.length === 0 ? (
                        <Box mt={1}>No se encontraron registros disponibles</Box>
                      ) : (
                        <RadioGroup value={entitySelected}>
                          {allEntities?.map((entity: any) => {
                            return (
                              <Box key={entity.id}>
                                <ListItem
                                  role={undefined}
                                  dense
                                  button
                                  onClick={() => handleChangeProducer(entity?.id)}
                                >
                                  <FormControlLabel
                                    key={entity?.id}
                                    value={entity?.id}
                                    label={entity?.full_name ?? entity?.name}
                                    control={<Radio />}
                                  />
                                </ListItem>
                                <Divider />
                              </Box>
                            );
                          })}
                        </RadioGroup>
                      )}
                    </>
                  )}
                </List>
              </Grid>
            </Grid>
          )}
          {steps === 'fill_credential' && (
            <>
              <Box sx={{ wordBreak: 'break-word' }}>
                <Box fontWeight={700} fontSize="1.5rem">
                  {credentialSchema?.name}
                </Box>
              </Box>
              <Box my={1.5}>
                <Divider />
              </Box>
              <Grid container>
                {credentialValues?.map((attribute: any, index: number) => (
                  <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} key={`attribute_${index}`}>
                    <CustomInput
                      id={attribute?.name?.toLowerCase()}
                      name={attribute?.name}
                      input_type={attribute?.attribute_type}
                      label={attribute?.name}
                      value={attribute?.value}
                      onChange={handleChangeAttribute}
                      disabled={formik.isSubmitting}
                      description={attribute?.description}
                      possible_values={attribute?.possible_values ?? []}
                      errors={errors}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Dialog>
      </Box>
    </>
  );
};

export default IndividualIssuanceDialog;
