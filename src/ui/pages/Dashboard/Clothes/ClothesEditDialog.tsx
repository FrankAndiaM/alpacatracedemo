import React, { useCallback, useState } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Box, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~ui/atoms/Button/Button';
import { AttributesRelation, Clothe } from '~models/clothes';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';
import DateField from '~ui/atoms/DateField/DateField';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
// import Autocomplete from '~ui/atoms/Autocomplete/ServerSide/Autocomplete';
// import { code_clothe, form_clothe, name_clothe, panels_response, yarns_response } from '~utils/RequiredIDs';
import { paginateListFormsData } from '~services/organization/formsv2';
// import { OrganizationFormAttributeEdit } from '~models/organizationFormAttribute';
// import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
// import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
// import Image from '~molecules/ImageModal/Image';
// import { useTheme } from '@mui/material';
import { renderModelValue, renderYarnsCode } from '~utils/composition';
// import { format, parseISO } from 'date-fns';
// import { es } from 'date-fns/locale';
// import ErrorsField from '~ui/atoms/ErrorField';

type ClothesEditDialogProps = {
  open: boolean;
  clothe?: Clothe;
  organizationId: string;
  attributesRelation: AttributesRelation;
  closeAction(isUpdateTable?: boolean): void;
  saveAction(clothe: Clothe): Promise<AxiosResponse<any>>;
  nameProduct: string;
  showProduct: boolean;
};

const ClothesEditDialog: React.FC<ClothesEditDialogProps> = (props: ClothesEditDialogProps) => {
  const { open, clothe, organizationId, attributesRelation, closeAction, saveAction, nameProduct, showProduct } = props;
  //   const [schemaData, setSchemaData] = useState<OrganizationFormAttributeEdit[]>([]);
  const [isEdit] = useState<boolean>(!!clothe?.id);
  // const theme = useTheme();
  //   const [formSelected, setFormSelected] = useState<any>(undefined);
  //   const { code, fabric_inventories, name, yarns, image_path, production_at } =
  attributesRelation?.attributes_relationship;
  const _paginateForms = useCallback(
    (page: number, search: string) => {
      return paginateListFormsData('FREE', page, 20, 'name', 'ASC', search, attributesRelation?.gather_form_id);
    },
    [attributesRelation?.gather_form_id]
  );

  const renderArray = useCallback((value: any, sep: string): string => {
    let str = '';
    value.forEach((element: any, index: number) => {
      str += `${element.value ?? ''}`;
      if (index < value.length - 1) {
        str += `${sep} `;
      }
    });

    return str;
  }, []);

  const newFarmer: Clothe = {
    organization_id: organizationId,
    name: clothe?.name ?? '',
    code: clothe?.code ?? '',
    production_at: clothe?.production_at ?? '',
    yarns: clothe?.yarns ?? [],
    image_path: clothe?.image_path ?? '',
    additional_info: clothe?.additional_info,
    ...clothe
  };

  // validation
  const validationSchema = yup.object().shape({
    name: yup.string().required('Campo requerido.'),
    code: yup.string().required('Campo requerido.').min(3, 'Mínimo 3 caracteres').max(40, 'Máximo 40 caracteres'),
    production_at: yup.string().required('Campo requerido.'),
    yarns: yup.array().min(1, 'La prenda debe tener al menos 1 hilo').required('Se requiere el campo hilos')
    // image_path: yup.string().required('Campo requerido'),
    // image_path: yup.lazy((value) => {
    //   return typeof value === 'object'
    //     ? yup.object().required('Se requiere el campo imagen').typeError('Se requiere el campo imagen')
    // typeError is necessary here, otherwise we get a bad-looking yup error
    //     : yup.string().required('Se requiere el campo imagen');
    // })
  });

  const formik = useFormik({
    initialValues: newFarmer,
    onSubmit: (farmer: Clothe) => {
      //Verifica Phone

      const errors: any = {};

      if (Object.keys(errors).length !== 0) {
        formik.setSubmitting(false);
        formik.setErrors(errors);
        return;
      }
      //   if (!farmer.fabric_inventories) {
      //     farmer.fabric_inventories = [];
      //   }
      //   if (!farmer.yarns) {
      //     farmer.yarns = [];
      //   }

      //filter fields relation
      //   const arrRelationValues = Object.values(attributesRelation?.attributes_relationship);
      //   const newSchema = schemaData.filter((element: OrganizationFormAttributeEdit) => {
      //     if (element.id) {
      //       return !arrRelationValues.includes(element.id);
      //     }
      //     return true;
      //   });
      //   farmer.additional_info = newSchema;

      const prevFarmer = Object.assign({}, farmer);
      //delete yarns
      //delete fabric
      delete prevFarmer.yarns;
      delete prevFarmer.fabric_inventories;

      saveAction(prevFarmer)
        .then((res: any) => {
          const { message } = res?.data?.data;
          showMessage('', message, 'success');
          closeAction(true);
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al crear la prenda.';
          const data = err?.response?.data;
          if (data?.hasOwnProperty('error')) {
            showMessage('', data?.error?.message ?? errorMessage, 'error', true);
          } else if (data?.hasOwnProperty('errors')) {
            formik.setErrors(data.errors);
          } else {
            showMessage('', errorMessage, 'error', true);
          }
          formik.setSubmitting(false);
        });
    },
    validationSchema
  });

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  const handleGenerateCode = useCallback(() => {
    const code = uuidv4().replace('-', '').substring(0, 10).toUpperCase();
    if (code) {
      //   console.log(code);
      formik.setFieldValue('code', code);
    }
  }, [formik]);

  const handleOnChangeSelectPhoneInput = useCallback(
    (value: any, name: string) => {
      const val = moment(value).format('YYYY-MM-DD');
      if (val !== 'Invalid date') {
        formik.setFieldValue(name, val);
      } else {
        formik.setFieldValue(name, '');
      }
      // formik.setFieldValue(name, value);
    },
    [formik]
  );

  //   useEffect(() => {
  //     console.log(clothe);
  //     // setSchemaData(clothe?.additional_info ?? []);
  //   }, [clothe]);

  return (
    <Dialog
      open={open}
      title={isEdit ? 'Editar prenda' : 'Nueva prenda'}
      subtitle={isEdit ? 'EDITAR INFORMACIÓN DE LA PRENDA' : 'INFORMACIÓN DE LA NUEVA PRENDA'}
      onClose={() => closeAction()}
      hideActions
      actions={<></>}
    >
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography>Nombre de la prenda</Typography>
          <TextField
            id="name"
            name="name"
            type="text"
            size="small"
            label=""
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting || clothe?.is_credential_issued}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography>Código de la prenda</Typography>
          <Box display={'flex'}>
            <Button
              text={'Generar código'}
              variant="contained"
              sx={{
                width: '160px',
                boxShadow: 0,
                height: '41px',
                marginTop: '8px'
              }}
              onClick={() => handleGenerateCode()}
            />
            <TextField
              id="code"
              name="code"
              type="text"
              label=""
              size="small"
              variant="outlined"
              style={{ marginTop: '16px' }}
              value={formik.values.code}
              onChange={(event: any) => {
                const { value } = event.target;
                if (value && typeof value === 'string' && value.length <= 40) {
                  formik.setFieldValue('code', value);
                }
              }}
              disabled={formik.isSubmitting || clothe?.is_credential_issued}
              errors={formik.errors}
              touched={formik.touched}
            />
          </Box>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography>Fecha de producción</Typography>
          <DateField
            id="production_at"
            name="production_at"
            label=""
            value={formik.values.production_at}
            onChange={(value: any, _keyboardInputValue?: string | undefined) =>
              handleOnChangeSelectPhoneInput(value, 'production_at')
            }
            disabled={formik.isSubmitting || clothe?.is_credential_issued}
            errors={formik.errors}
            touched={formik.touched}
            variant={'outlined'}
            size="small"
            maxDate={new Date()}
          />
        </Grid>
        {isEdit ? (
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography>Hilo(s)</Typography>
            <TextField
              id="yarns"
              name="yarns"
              type="text"
              size="small"
              label=""
              variant="outlined"
              value={renderYarnsCode(formik.values.yarns ?? [])}
              disabled={true}
              errors={formik.errors}
              touched={formik.touched}
            />
          </Grid>
        ) : (
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography>Hilo(s)</Typography>
            <TextField
              id="yarns"
              name="yarns"
              type="text"
              size="small"
              label=""
              variant="outlined"
              value={renderModelValue(formik.values.yarns)}
              disabled={true}
              errors={formik.errors}
              touched={formik.touched}
            />
          </Grid>
        )}
        {showProduct && (
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography>{nameProduct}(s)</Typography>
            <TextField
              id="fabric_inventories"
              name="fabric_inventories"
              type="text"
              size="small"
              label=""
              variant="outlined"
              value={renderArray(formik.values.fabric_inventories ?? [], ' - ')}
              disabled={true}
            />
          </Grid>
        )}

        {/* {schemaData &&
          schemaData.length > 0 &&
          schemaData.map((attribute: OrganizationFormAttributeEdit, idx: number) => {
            if (!Object.values(attributesRelation?.attributes_relationship).includes(attribute?.id || '')) {
              if (attribute.attribute_type === 'photo') {
                return (
                  <Grid
                    key={`element_info_${idx}`}
                    item={true}
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ alignSelf: 'flex-end' }}
                  >
                    <Typography>
                      {attribute.name || ''}
                      {attribute.is_required && ' (Obligatorio)'}
                    </Typography>
                    {attribute?.value?.image ? (
                      <Image image={`${COMMUNITY_BASE_URL_S3}${attribute?.value?.image}`} />
                    ) : (
                      <Box
                        style={{
                          width: '100px',
                          height: '100px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: '8px',
                          backgroundColor: '#DCDCDC'
                        }}
                      >
                        <AddPhotoAlternateOutlinedIcon style={{ fontSize: '45px', color: 'rgba(149, 149, 149, 1)' }} />
                      </Box>
                    )}
                  </Grid>
                );
              }
              if (attribute.attribute_type === 'title') {
                return <></>;
              }
              return (
                <>
                  {Object.values(attributesRelation?.attributes_relationship).includes(attribute?.id || '') ? (
                    <Grid
                      key={`element_info_${idx}`}
                      item={true}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{ alignSelf: 'flex-end' }}
                    >
                      <Typography>
                        {attribute.name || ''}
                        {attribute.is_required && ' (Obligatorio)'}
                      </Typography>
                      <TextField
                        id={attribute.name}
                        name={attribute.name}
                        type="text"
                        size="small"
                        label=""
                        variant="outlined"
                        value={renderModelValue(attribute.value) ?? ''}
                      />
                    </Grid>
                  ) : (
                    <Grid
                      key={`element_info_${idx}`}
                      item={true}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{ alignSelf: 'flex-end' }}
                    >
                      <Typography>
                        {attribute.name || ''}
                        {attribute.is_required && ' (Obligatorio)'}
                      </Typography>
                      <TextField
                        id={attribute.name}
                        name={attribute.name}
                        type="text"
                        size="small"
                        label=""
                        variant="outlined"
                        value={attribute.value ?? ''}
                        disabled={true}
                      />
                    </Grid>
                  )}
                </>
              );
            }
            return <></>;
          })} */}

        {/* <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <ErrorsField errors={formik.errors} fields={['image_path', 'name']} />
        </Grid> */}
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box display="flex" justifyContent={'space-between'} width={'100%'} mt={3}>
            <Button
              onClick={() => closeAction()}
              variant="outlined"
              disabled={formik.isSubmitting}
              sx={{ margin: 0 }}
              text="Cancelar"
            />

            <Button
              onClick={() => onSubmit()}
              color="primary"
              variant="contained"
              disabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
              text={!isEdit ? 'Crear nueva prenda' : 'Guardar'}
              sx={{ margin: 0 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(ClothesEditDialog);
