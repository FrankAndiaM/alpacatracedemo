import React, { useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { Typography, Switch } from '@mui/material';
import TextField from '~ui/atoms/TextField/TextField';
import SelectField from '~ui/atoms/SelectField/SelectField';

type CredentialBasicInformationProps = {
  formik: any;
  credentialSchemaCategories: any[];
  handleOnChangeCategory: (name: string, value: string) => void;
  isCredentialSchemaCategoriesLoading: boolean;
  handleOnChangeSwitch: (e: any) => void;
};

const validPeriods: any = [
  { name: '3m', description: '3 meses' },
  { name: '6m', description: '6 meses' },
  { name: '1y', description: '1 año' },
  { name: '100y', description: 'Sin caducidad' }
];

const CredentialBasicInformation: React.FC<CredentialBasicInformationProps> = (
  props: CredentialBasicInformationProps
) => {
  const {
    formik,
    credentialSchemaCategories,
    handleOnChangeCategory,
    isCredentialSchemaCategoriesLoading,
    handleOnChangeSwitch
  } = props;

  const handleChangeVersion = useCallback(
    (name: string, value: number) => {
      if (value > 0) {
        formik.setFieldValue(name, value);
      }
    },
    [formik]
  );

  return (
    <>
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
            label="Periodo"
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
    </>
  );
};

export default CredentialBasicInformation;
