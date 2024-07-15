import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Grid, List, ListItem, Checkbox, ListItemText, Box, Divider, ListItemIcon } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useFormik } from 'formik';
import { Farmer } from '~models/farmer';
import TextFieldSearch from '~ui/molecules/TextFieldSearch/TextFieldSearch';
import { showMessage } from '~utils/Messages';
import Dialog from '~ui/molecules/Dialog/Dialog';
import Button from '~atoms/Button/Button';
import {
  issueCredential,
  listAvailableProducersToIssueCredential
} from '~services/digital_identity/credential/credential';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300
  },
  listSection: {
    backgroundColor: 'inherit'
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0
  }
}));

type OfferFormCredentialDialogProps = {
  credentialId: string;
  onClose(updateTable?: boolean): void;
};

const OfferFormCredentialDialog: React.FC<OfferFormCredentialDialogProps> = (props: OfferFormCredentialDialogProps) => {
  const { credentialId, onClose }: OfferFormCredentialDialogProps = props;
  const classes = useStyles();
  const isCompMounted = useRef(null);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [isLoadingFarmers, setIsLoadingFarmers] = useState<boolean>(true);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [allFarmers, setAllFarmers] = useState<Farmer[]>([]);
  const [countFarmersSelected, setCountFarmersSelected] = useState<number>(0);

  const formik = useFormik({
    initialValues: {
      farmers: []
    },
    onSubmit: (value: any) => {
      if (value?.farmers?.length === 0) {
        showMessage('', 'Por favor, seleccione algún productor.', 'warning');
        formik.setSubmitting(false);
        return;
      }
      const valueFarmers = value?.farmers?.map((farmer: any) => farmer.id);
      issueCredential(credentialId, { producers: valueFarmers })
        .then(() => {
          showMessage(
            '',
            'Se ha iniciado el proceso de emisión de certificados a los productores seleccionados.',
            'success'
          );
          onClose(true);
        })
        .catch(() => {
          formik.setSubmitting(false);
          showMessage('', 'Problemas al emitir los certificados.', 'error');
        });
    }
  });

  useEffect(() => {
    listAvailableProducersToIssueCredential(credentialId)
      .then((res: any) => {
        if (!isCompMounted.current) return;
        const data = res?.data?.data || [];
        setFarmers(data);
        setAllFarmers(data);
        setIsLoadingFarmers(false);
      })
      .catch(() => {
        if (!isCompMounted.current) return;
        setIsLoadingFarmers(false);
        showMessage('', 'Problemas al obtener los productores disponibles.', 'error');
      });
  }, [credentialId]);

  const verifyIfFarmerExist = useCallback(
    (farmer_id: any) => {
      return formik?.values?.farmers?.some((value: any) => value.id === farmer_id);
    },
    [formik]
  );

  const handleOnChangeSearch = useCallback(
    (search: any) => {
      const newArray = farmers.filter((arr: any) => {
        for (const key in arr) {
          if (String(arr[key]).toLowerCase().includes(search.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
      setAllFarmers(newArray);
      if (isAllSelected) {
        formik.setFieldValue('farmers', newArray);
        setCountFarmersSelected(newArray.length);
      }
    },
    [formik, farmers, isAllSelected]
  );

  const handleFarmer = useCallback(
    (farmer: any) => {
      const result = formik?.values?.farmers?.some((value: any) => value.id === farmer?.id);
      if (!result) {
        const newValues = [...formik?.values?.farmers, farmer];
        formik.setFieldValue('farmers', newValues);
        setCountFarmersSelected((prevValue: number) => ++prevValue);
      } else {
        const newValues = formik?.values?.farmers?.filter((value: any) => value.id !== farmer?.id);
        formik.setFieldValue('farmers', newValues);
        setCountFarmersSelected((prevValue: number) => --prevValue);
      }
    },
    [formik]
  );

  const handleSelectAll = useCallback(() => {
    setIsAllSelected((prevValue: boolean) => {
      if (prevValue) {
        formik.setFieldValue('farmers', []);
        setCountFarmersSelected(0);
      } else {
        formik.setFieldValue('farmers', allFarmers);
        setCountFarmersSelected(allFarmers.length);
      }
      return !prevValue;
    });
  }, [formik, allFarmers]);

  const handleOnClose = useCallback(() => {
    if (formik.isSubmitting) return;
    onClose();
  }, [formik, onClose]);

  return (
    <Box ref={isCompMounted}>
      <Dialog
        open
        title="Asignar productores"
        subtitle="Selecciona a los productores a emitir el certificado."
        onClose={() => handleOnClose()}
        actions={
          <>
            <Button text="Cancelar" onClick={() => handleOnClose()} variant="outlined" disabled={formik.isSubmitting} />
            <Button
              onClick={formik.handleSubmit}
              color="primary"
              disabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
              variant="contained"
              text={'Guardar'}
            />
          </>
        }
      >
        <Grid container>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box>
              <Box component="span" fontWeight={700}>
                Importante:{' '}
              </Box>
              <Box component="span"> Sólo se mostrarán los productores que tengan un formulario completado.</Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box fontWeight={600}>Productores Seleccionados: {countFarmersSelected}</Box>
              <Box>
                <TextFieldSearch label="Buscar" onChange={handleOnChangeSearch} isAnimated={false} />
              </Box>
            </Box>
            <List className={classes.root} subheader={<li />}>
              {isLoadingFarmers ? (
                <>
                  <Box>Cargando productores</Box>
                  <LinearProgress loading={true} />
                </>
              ) : (
                <>
                  {allFarmers?.length === 0 ? (
                    <Box mt={1}>No se encontraron productores disponibles</Box>
                  ) : (
                    <>
                      <Box>
                        <ListItem role={undefined} dense button onClick={handleSelectAll}>
                          <ListItemIcon>
                            <Checkbox edge="start" checked={isAllSelected} disableRipple />
                          </ListItemIcon>
                          <ListItemText id="all" primary="Seleccionar todos" />
                        </ListItem>
                        <Divider />
                      </Box>
                      {allFarmers?.map((farmer: any) => {
                        const labelId = `checkbox-list-label-${farmer.id}`;
                        return (
                          <Box key={farmer?.id}>
                            <ListItem role={undefined} dense button onClick={() => handleFarmer(farmer)}>
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={verifyIfFarmerExist(farmer?.id)}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              </ListItemIcon>
                              <ListItemText id={labelId} primary={farmer?.full_name} />
                            </ListItem>
                            <Divider />
                          </Box>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </List>
          </Grid>
        </Grid>
      </Dialog>
    </Box>
  );
};

export default OfferFormCredentialDialog;
