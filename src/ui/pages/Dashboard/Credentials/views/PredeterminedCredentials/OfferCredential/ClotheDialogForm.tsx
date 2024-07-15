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
// import { code_clothe, form_clothe, name_clothe, panels_response, yarns_response } from '~utils/RequiredIDs';
import Autocomplete from '~ui/atoms/Autocomplete/ServerSide/Autocomplete';
import { paginateListFormsData } from '~services/organization/formsv2';

type ClotheDialogFormProps = {
  open: boolean;
  clothe?: Clothe;
  organizationId: string;
  closeAction(isUpdateTable?: boolean): void;
  attributesRelation: AttributesRelation;
  saveAction(clothe: Clothe): Promise<AxiosResponse<any>>;
  nameProduct: string;
  showProduct: boolean;
};

const ClotheDialogForm: React.FC<ClotheDialogFormProps> = (props: ClotheDialogFormProps) => {
  const { open, clothe, organizationId, closeAction, saveAction, attributesRelation, nameProduct, showProduct } = props;
  const [isEdit] = useState<boolean>(!!clothe?.id);
  const [formSelected, setFormSelected] = useState<any>(undefined);
  const { code, fabric_inventories, name, yarns } = attributesRelation?.attributes_relationship;

  const _paginateForms = useCallback(
    (page: number, search: string) => {
      // const newFilters = Object.assign({}, filters);
      // newFilters.search_type = debouncedValue.searchType;
      // return listAllFormData(page, 20, 'name', 'ASC', search, newFilters);

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
    ...clothe
  };

  // validation
  const validationSchema = yup.object().shape({
    name: yup.string().required('Campo requerido.'),
    code: yup.string().required('Campo requerido.'),
    production_at: yup.string().required('Campo requerido.')
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

      const prevFarmer = Object.assign({}, farmer);
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

  return (
    <Dialog
      open={open}
      title={'Nueva prenda'}
      subtitle="INFORMACIÓN DE LA NUEVA PRENDA"
      onClose={() => closeAction()}
      hideActions
      actions={<></>}
    >
      <Grid container={true} spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Autocomplete
            id={'form_selected'}
            label={'Selecciona una respuesta de formulario'}
            name={'form_selected'}
            variant="outlined"
            onChange={(_: any, value: any) => {
              if (value) {
                const { data } = value;
                if (data && data[yarns] && Array.isArray(data[yarns])) {
                  // setYarnsSelected(data[yarns]);
                  // setClotheSelected((prev: Clothe | undefined) => {
                  formik.setFieldValue('yarns', data[yarns]);
                  //   return { ...prev, yarns: data[yarns_response] };
                  // });
                }
                if (data && data[fabric_inventories] && Array.isArray(data[fabric_inventories])) {
                  formik.setFieldValue('fabric_inventories', data[fabric_inventories]);
                  // setPanelsSelected(data[panels_response]);
                  // setClotheSelected((prev: Clothe | undefined) => {
                  //   return { ...prev, panels_clothes: data[panels_response] };
                  // });
                }
                setFormSelected(value);
              } else {
                setFormSelected(undefined);
                formik.setFieldValue('yarns', []);
                formik.setFieldValue('fabric_inventories', []);
              }
            }}
            onLoad={_paginateForms}
            renderOption={(value: any) => {
              const { data } = value;
              if (value && data) {
                return `${data[name]} - ${data[code]}`;
              }
              return '';
            }}
            value={formSelected}
            defaultValue={undefined}
          />
        </Grid>
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
                marginTop: Boolean(formik.errors['code']) ? '8px' : '0px'
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
              value={formik.values.code}
              onChange={formik.handleChange}
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
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography>Hilo(s)</Typography>
          <TextField
            id="yarns"
            name="yarns"
            type="text"
            size="small"
            label=""
            variant="outlined"
            value={renderArray(formik.values.yarns ?? [], ' - ')}
            disabled={true}
          />
        </Grid>
        {showProduct && (
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography>{nameProduct}(s)</Typography>
            <TextField
              id="panels_clothes"
              name="panels_clothes"
              type="text"
              size="small"
              label=""
              variant="outlined"
              value={renderArray(formik.values.fabric_inventories ?? [], ' - ')}
              disabled={true}
            />
          </Grid>
        )}
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

export default React.memo(ClotheDialogForm);
