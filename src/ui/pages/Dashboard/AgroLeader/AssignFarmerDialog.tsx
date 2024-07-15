import React, { useState, useCallback, useEffect } from 'react';
import { Grid, List, ListItem, Checkbox, ListItemText, Box, Divider, ListItemIcon } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { Farmer } from '~models/farmer';
import TextFieldSearch from '~ui/molecules/TextFieldSearch/TextFieldSearch';
import { showMessage } from '~utils/Messages';
import Dialog from '~ui/molecules/Dialog/Dialog';
import Button from '~atoms/Button/Button';

type AssignFarmerDialogProps = {
  agroLeaderId: string;
  farmers: Farmer[];
  isLoadingFarmers: boolean;
  closeAction(updateTable?: boolean): void;
  saveAction(agroLeaderId: any, data: any): Promise<AxiosResponse<any>>;
};

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

const AssignFarmerDialog: React.FC<AssignFarmerDialogProps> = (props: AssignFarmerDialogProps) => {
  const { agroLeaderId, farmers, saveAction, closeAction, isLoadingFarmers }: AssignFarmerDialogProps = props;
  const classes = useStyles();
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
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
      const valueFarmers = value.farmers.map((farmer: any) => farmer.id);
      saveAction(agroLeaderId, { farmers: valueFarmers })
        .then(() => {
          // const message = res?.data?.message;
          showMessage('', 'Asignación confirmada.', 'success');
          closeAction(true);
        })
        .catch((err: any) => {
          if (err.response.data) {
            showMessage(
              '',
              err?.response?.data?.error?.message || 'Problemas al asignar a los productores',
              'error',
              true
            );
            formik.setSubmitting(false);
            return;
          }
          showMessage('', 'Problemas al registrar.', 'error', true);
          formik.setSubmitting(false);
        });
    }
  });

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

  useEffect(() => {
    setAllFarmers(farmers);
  }, [farmers]);

  return (
    <>
      <Dialog
        open={true}
        title="Asignar productores"
        subtitle="Selecciona a los productores para asignarlos al agente."
        onClose={() => closeAction()}
        actions={
          <>
            <Button text="Cancelar" onClick={() => closeAction()} variant="outlined" disabled={formik.isSubmitting} />
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
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box fontWeight={600}>Productores Seleccionados: {countFarmersSelected}</Box>
              <Box>
                <TextFieldSearch label="Buscar" onChange={handleOnChangeSearch} isAnimated={false} />
              </Box>
            </Box>
            <List className={classes.root} subheader={<li />}>
              <Box>
                <ListItem role={undefined} dense button onClick={handleSelectAll}>
                  <ListItemIcon>
                    <Checkbox edge="start" checked={isAllSelected} disableRipple />
                  </ListItemIcon>
                  <ListItemText id="all" primary="Seleccionar todos" />
                </ListItem>
                <Divider />
              </Box>
              {isLoadingFarmers ? (
                <>
                  <Box>Cargando productores...</Box>
                </>
              ) : (
                <>
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
            </List>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default AssignFarmerDialog;
