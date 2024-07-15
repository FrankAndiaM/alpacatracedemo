import React, { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Grid } from '@mui/material';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~ui/atoms/Button/Button';
import Dialog from '~ui/molecules/Dialog/Dialog';

// const useStyles: any = makeStyles(() => ({
//   title: {
//     wordBreak: 'break-all',
//     color: 'white'
//   },
//   subTitle: {
//     fontSize: '0.68rem',
//     opacity: '0.72',
//     color: 'white'
//   }
// }));

type GenerateLinkDialogProps = {
  onSaveAction: (name: string, description: string) => void;
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
};

const GenerateLinkDialog: React.FC<GenerateLinkDialogProps> = (props: GenerateLinkDialogProps) => {
  const { onSaveAction, onClose, open, isLoading } = props;
  //   const classes = useStyles();

  const initialValues = {
    name: '',
    description: '-'
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('Campo requerido.')
  });

  const formik = useFormik({
    initialValues,
    onSubmit: (values: any) => {
      onSaveAction(values.name, values.description);
    },
    validationSchema
  });

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  const clearFormik = useCallback(() => {
    formik.setSubmitting(false);
    formik.resetForm();
  }, [formik]);

  const handleOnClose = useCallback(() => {
    clearFormik();
    onClose();
  }, [clearFormik, onClose]);

  // useEffect(() => {
  //   return () => {
  //     clearFormik();
  //   };
  // }, [clearFormik]);

  return (
    <>
      <Dialog
        // keepMounted
        title="Compartir certificado"
        subtitle="Copia link o descarga la imagen QR"
        scroll="body"
        open={open}
        onClose={handleOnClose}
        aria-labelledby="alert-dialog-credentials"
        aria-describedby="alert-dialog-credentials"
        hideActions
      >
        <Grid container={true}>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography fontSize={14}>¿Con qué nombre lo quieres compartir?</Typography>
            <TextField
              id="name"
              name="name"
              type="text"
              variant="outlined"
              label=""
              placeholder="Ingresa el nombre para el conjunto de certificados"
              value={formik.values.name}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              touched={formik.touched}
              autoComplete="off"
            />
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box display="flex" justifyContent={{ xs: 'space-between', md: 'space-evenly' }} width={'100%'}>
              <Button onClick={() => onClose()} variant="outlined" disabled={formik.isSubmitting} text="Cancelar" />

              <Button
                onClick={() => onSubmit()}
                color="primary"
                variant="contained"
                disabled={formik.isSubmitting && isLoading}
                isLoading={formik.isSubmitting && isLoading}
                text="Compartir"
              />
            </Box>
          </Grid>
          {/* <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                id="description"
                name="description"
                variant="filled"
                type="text"
                label="Con la finalidad de"
                multiline
                rowsMax={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
                errors={formik.errors}
                touched={formik.touched}
              />
            </Grid> */}
        </Grid>
        {/* <Box
            sx={{
              backgroundColor: '#00822B',
              borderRadius: '1rem',
              color: 'white',
              padding: '12px 24px',
              '&:hover': { cursor: 'pointer' }
            }}
            height="100%"
            justifyContent="center"
            display="flex"
            onClick={onSubmit}
            my={2}
          >
            Generar link o QR
          </Box> */}
      </Dialog>
    </>
  );
};

export default GenerateLinkDialog;
