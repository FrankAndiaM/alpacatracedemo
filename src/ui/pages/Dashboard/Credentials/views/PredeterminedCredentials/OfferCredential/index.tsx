import React, { useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { Paper, Grid, Typography, Dialog, DialogContent, Tabs, Tab } from '@mui/material';
import { Box, Icon } from '@mui/material';
import { useSelector } from 'react-redux';
import routes from '~routes/routes';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { showMessage } from '~utils/Messages';
import Button from '~atoms/Button/Button';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
// import { paginateProducerDigitalIdentity } from '~services/farmer';
// import ListTable from '~ui/organisms/List/ServerSide/ListTable';
// import ShowCredential from './ShowCredential';
// import { offerPredeterminedCredential } from '~services/digital_identity/credential/predetermined';
import { Farmer } from '~models/farmer';
import LoadingResponse from '~ui/pages/Dashboard/Credentials/components/LoadingResponse.tsx';
import OfferErrorDialog from './OfferErrorDialog';
// import SelectField from '~ui/atoms/SelectField/SelectField';
// import { paginateOrganizationsConnected } from '~services/organization/organizationConnection';
// import { AxiosResponse } from 'axios';
import { createClothe, paginateClothes, updateClothe } from '~services/clothes';
// import useDebounce from '~hooks/use_debounce';
import { AttributesRelation, Clothe, CompositionClothe } from '~models/clothes';
import CheckroomRoundedIcon from '@mui/icons-material/CheckroomRounded';
import ListItemSelect from './ListItemSelect';
import IssueDialog from './IssueDialog';
// import Autocomplete from '~ui/atoms/Autocomplete/ServerSide/Autocomplete';
import { paginateListFormsData } from '~services/organization/formsv2';
// import { FilterDataForms } from '~models/organizationForm';
import { offerCredential } from '~services/digital_identity/credential/credential';
// import { code_clothe, form_clothe, name_clothe, panels_response, yarns_response } from '~utils/RequiredIDs';
// import ClotheDialogForm from './ClotheDialogForm';
import { useTheme } from '@mui/material/styles';
import ClothesDialog from '~ui/pages/Dashboard/Clothes/ClothesDialog';

// type SearchFilter = {
//   text: string;
//   searchType: string;
// };

type OfferPredeterminedCredentialViewProps = {
  credentialSchema: CredentialSchemaModel;
  onClose: (updateTable?: boolean) => void;
  attributesRelation: AttributesRelation;
};

const OfferPredeterminedCredentialView: React.FC<OfferPredeterminedCredentialViewProps> = (
  props: OfferPredeterminedCredentialViewProps
) => {
  const { credentialSchema, onClose, attributesRelation } = props;
  const { auth }: any = useSelector((state: any) => state);
  const NameProduct: string = auth?.organizationTheme?.name_product;
  const ShowProduct: boolean = auth?.organizationTheme?.show_product;
  // const { organizationId } = auth?.organizationTheme;
  const theme = useTheme();
  const isCompMounted = useRef(null);
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState<boolean>(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);
  const [subjectEntitiesSelected] = useState<Clothe[]>([]);
  const [countProducersLoaded, setProducersLoaded] = useState<number>(0);
  const [producersErrorLoad, setProducersErrorLoad] = useState<Farmer[]>([]);
  // const [subjectModelType, setSubjectModelType] = useState<'Farmers' | 'Organizations'>('Farmers');
  const [isOpenIssueDialog, setIsOpenIssueDialog] = useState<boolean>(false);
  const [isOpenClothesDialog, setIsOpenClothesDialog] = useState<boolean>(false);
  const [isRefreshTable, setIsRefreshTable] = useState<boolean>(false);

  const [clotheSelected, setClotheSelected] = useState<Clothe | undefined>(undefined);
  // const [clotheSelectedInitial, setClotheSelectedInitial] = useState<Clothe | undefined>(undefined);
  // const [formSelected, setFormSelected] = useState<any>(undefined);
  const [yarnsSelected, setYarnsSelected] = useState<CompositionClothe[]>([]);
  const [panelsSelected, setPanelsSelected] = useState<CompositionClothe[]>([]);
  const [hasDefaultData, setHasDefaultData] = useState<boolean>(true);
  // const [recentSelect, setRecentSelect] = useState<boolean>(true);
  // const { code, fabric_inventories, name, yarns } = attributesRelation?.attributes_relationship;

  // const [clearField, setClearField] = useState<boolean>(false);

  // const handleClearField = useCallback(() => {
  //   setClearField((prev: boolean) => !prev);
  // }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshTable((prev: boolean) => !prev);
  }, []);

  const handleOpenIssueDialog = useCallback(() => {
    setIsOpenIssueDialog((prev: boolean) => !prev);
  }, []);

  const _paginateForms = useCallback(
    (page: number, search: string) => {
      // const newFilters = Object.assign({}, filters);
      // newFilters.search_type = debouncedValue.searchType;
      // return listAllFormData(page, 20, 'name', 'ASC', search, newFilters);

      return paginateListFormsData('FREE', page, 20, 'name', 'ASC', search, attributesRelation?.gather_form_id);
    },
    [attributesRelation?.gather_form_id]
  );

  const _paginateClothes = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return paginateClothes(auth?.organizationTheme?.organizationId, '', page, per_page, sort_by, order, search, {});
    },
    [auth]
  );

  function timeout(ms: number) {
    return new Promise((resolve: any) => setTimeout(resolve, ms));
  }

  const renderArray = useCallback((value: any, sep: string): string => {
    let str = '';
    value.forEach((element: any, index: number) => {
      str += `${element.code ?? element.value ?? ''}`;
      if (index < value.length - 1) {
        str += `${sep} `;
      }
    });

    return str;
  }, []);

  const handleIssueCredentials = useCallback(
    async (entities: any[]) => {
      if (entities.length === 0) {
        showMessage('Por favor seleccione una prenda para emitir el certificado', '', 'warning');
        return;
      }
      setIsLoadingDialogOpen(true);

      for (const entity of entities) {
        if (isCompMounted.current) {
          try {
            await offerCredential(credentialSchema?.id ?? '', {
              subject_model_id: entity.id,
              subject_model_type: 'Clothes',
              issuer_model_id: auth?.organizationTheme?.organizationId,
              issuer_model_type: 'Organizations',
              credential_data: {
                'Nombre de la prenda': entity?.name,
                Código: entity?.code,
                'Fecha de producción': entity?.production_at,
                'Panel(es)': renderArray(entity?.fabric_inventories ?? [], ' -'),
                'Hilo(s)': renderArray(entity?.yarns ?? [], ' -')
              }
            });
            const data: any = {
              is_credential_issued: true,
              name: entity?.name
            };
            if (!hasDefaultData) {
              data.yarns = entity.yarns;
              data.fabric_inventories = entity.fabric_inventories;
            }
            await updateClothe(entity?.id, data);
          } catch (error) {
            setProducersErrorLoad((prevValue: Farmer[]) => [...prevValue, entity]);
          }
          setProducersLoaded((prevValue: number) => ++prevValue);
          await timeout(100);
          continue;
        }
        break;
      }
      if (isCompMounted.current) {
        setProducersErrorLoad((prevValue: Farmer[]) => {
          if (prevValue.length !== 0) {
            setIsErrorDialogOpen(true);
            return prevValue;
          }
          showMessage('Los certificados se han emitido correctamente', '', 'success');
          onClose(true);
          return prevValue;
        });
      }
      setHasDefaultData(true);
    },
    [auth?.organizationTheme?.organizationId, renderArray, credentialSchema?.id, hasDefaultData, onClose]
  );

  // const handleOnSelectItem = (producerId: any) => {
  //   setSubjectEntitiesSelected((prevValues: any[]) => {
  //     const result = prevValues?.some((value: any) => value === producerId);
  //     if (!result) {
  //       return [...prevValues, producerId];
  //     }
  //     const newValues = prevValues?.filter((value: any) => value !== producerId);
  //     return newValues;
  //   });
  // };

  // const handleEntityOnChange = useCallback((_: any, value: any) => {
  //   setSubjectModelType(value);
  //   setSubjectEntitiesSelected([]);
  // }, []);

  const renderItem = useCallback((value: any): ReactNode => {
    return (
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        p={1}
        fontWeight={600}
        color={'#2F3336'}
      >
        <Box>
          <CheckroomRoundedIcon />
        </Box>
        <Box>
          <Typography>{value.name ?? ''}</Typography>
          <Typography fontSize={12}>Código de la prenda: {value.code ?? ''}</Typography>
        </Box>
      </Box>
    );
  }, []);

  const handleClothesDialog = useCallback(
    (update?: boolean) => {
      if (update) {
        handleRefresh();
      }
      setIsOpenClothesDialog((prev: boolean) => !prev);
    },
    [handleRefresh]
  );

  const handleSave = useCallback((farmer: Clothe) => {
    return createClothe(farmer);
  }, []);

  useEffect(() => {
    // if (
    //   (clotheSelected?.yarns && clotheSelected?.yarns?.length > 0) ||
    //   (clotheSelected?.fabric_inventories && clotheSelected?.fabric_inventories?.length > 0)
    // ) {
    //   setRecentSelect(false);
    // } else {
    //   setRecentSelect(true);
    // }
    if (clotheSelected?.yarns && clotheSelected?.yarns?.length > 0) {
      setYarnsSelected(clotheSelected?.yarns);
    } else {
      setYarnsSelected([]);
    }
    if (clotheSelected?.fabric_inventories && clotheSelected?.fabric_inventories?.length > 0) {
      setPanelsSelected(clotheSelected?.fabric_inventories);
    } else {
      setPanelsSelected([]);
    }
  }, [clotheSelected]);

  return (
    <>
      <Box pb={{ xs: 0, md: 2 }} ref={isCompMounted}>
        <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} justifyContent={'space-between'}>
          <Box>
            <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
              Certificados blockchain
            </Box>
            <Breadcrumbs
              breadcrumbs={[
                {
                  path: routes.dashboard,
                  component: <Icon fontSize="small">home</Icon>
                },
                {
                  path: routes.credential,
                  component: 'Certificados blockchain'
                },
                {
                  component: 'Emitir certificado'
                }
              ]}
            />
          </Box>
          <Box mt={{ xs: 2, md: 0 }}>
            <Button
              text="Regresar"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<Icon>arrow_back</Icon>}
              onClick={() => {
                onClose();
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box my={2}>
        <Tabs value={0} aria-label="disabled tabs example">
          <Tab label="Prendas" />
        </Tabs>
      </Box>
      <Grid container spacing={4}>
        {/* Producers */}

        <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
          <Paper
            elevation={1}
            sx={{
              p: 1,
              position: 'relative',
              height: '100%'
            }}
          >
            <ListItemSelect
              renderItem={renderItem}
              paginate={_paginateClothes}
              loadDataRowSelected={(row: any) => {
                // setYarnsSelected([]);
                // setPanelsSelected([]);
                // handleClearField();
                // setFormSelected(undefined);
                setClotheSelected(row);
                // setClotheSelectedInitial(row);
              }}
              isRefresh={isRefreshTable}
            />
            {/* <Box>
              <Button
                variant="outlined"
                text={'Registrar nueva prenda'}
                sx={{ width: '100%' }}
                onClick={() => setIsOpenClothesDialog((prev: boolean) => !prev)}
              />
            </Box> */}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={7} lg={7} xl={7}>
          <Paper sx={{ p: 2, height: '100%' }}>
            {clotheSelected ? (
              <Grid container px={{ xs: 2, md: 4 }} py={{ xs: 1, md: 2 }}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'flex-start'}
                    fontWeight={400}
                    color={'#2F3336'}
                    fontSize={18}
                  >
                    <Box>
                      <CheckroomRoundedIcon sx={{ fontSize: { xs: '64px', md: '110px' }, fontWeight: 600 }} />
                    </Box>
                    <Box ml={{ xs: 1, md: 5 }}>
                      <Typography>{'Prenda'}</Typography>
                      <Typography fontWeight={600} fontSize={{ xs: 18, md: 28 }}>
                        {clotheSelected?.name ?? ''}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid container spacing={4} mt={1}>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography color={'#6E767D'} fontSize={12} fontWeight={600}>
                      1. Nombre de la prenda
                    </Typography>
                    <Typography color={'#2F3336'} fontSize={14} fontWeight={600}>
                      {clotheSelected?.name ?? ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography color={'#6E767D'} fontSize={12} fontWeight={600}>
                      2. Código de la prenda
                    </Typography>
                    <Typography color={'#2F3336'} fontSize={14} fontWeight={600}>
                      {clotheSelected?.code ?? ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography color={'#6E767D'} fontSize={12} fontWeight={600}>
                      3. Fecha de producción
                    </Typography>
                    <Typography color={'#2F3336'} fontSize={14} fontWeight={600}>
                      {clotheSelected?.production_at ?? ''}
                    </Typography>
                  </Grid>
                  {ShowProduct && panelsSelected.length > 0 && (
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography color={'#6E767D'} fontSize={12} fontWeight={600}>
                        4. {NameProduct} conformados
                      </Typography>
                      <Typography color={'#2F3336'} fontSize={14} fontWeight={600}>
                        {renderArray(panelsSelected, '-')}
                      </Typography>
                    </Grid>
                  )}
                  {yarnsSelected.length > 0 && (
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography color={'#6E767D'} fontSize={12} fontWeight={600}>
                        5. Hilos conformados
                      </Typography>
                      <Typography color={'#2F3336'} fontSize={14} fontWeight={600}>
                        {renderArray(yarnsSelected, '-')}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                {ShowProduct && panelsSelected.length <= 0 && yarnsSelected.length <= 0 && (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={2}>
                    <Typography fontSize={12}>
                      <span style={{ fontWeight: 700, color: '#EB7923' }}>AVISO:</span> Esta prenda no tiene{' '}
                      {NameProduct}(s) ni hilo(s) seleccione un formulario para completar los campos faltantes.
                    </Typography>
                  </Grid>
                )}
                {/* {recentSelect && (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Autocomplete
                      id={'form_selected'}
                      label={'Selecciona una respuesta de formulario'}
                      name={'form_selected'}
                      value={formSelected}
                      defaultValue={undefined}
                      // clear={clearField}
                      onChange={(_: any, value: any) => {
                        if (value) {
                          const { data } = value;
                          // console.log(value);
                          if (data && data[yarns] && Array.isArray(data[yarns])) {
                            setYarnsSelected(data[yarns]);
                            setHasDefaultData(false);
                            setClotheSelected((prev: Clothe | undefined) => {
                              return { ...prev, yarns: data[yarns] };
                            });
                          }
                          if (data && data[fabric_inventories] && Array.isArray(data[fabric_inventories])) {
                            setPanelsSelected(data[fabric_inventories]);
                            setHasDefaultData(false);
                            setClotheSelected((prev: Clothe | undefined) => {
                              return { ...prev, fabric_inventories: data[fabric_inventories] };
                            });
                          }

                          setFormSelected(value);
                        } else {
                          setFormSelected(undefined);
                          // setYarnsSelected(yarnsSelectedInitial ?? []);
                          // setPanelsSelected(panelsSelectedInitial ?? []);
                          setClotheSelected(clotheSelectedInitial);

                          setHasDefaultData(true);
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
                    />
                  </Grid>
                )} */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Box display="flex" justifyContent="flex-end" my={1}>
                    <Button
                      text="Siguiente"
                      variant="contained"
                      onClick={handleOpenIssueDialog}
                      disabled={yarnsSelected.length === 0}
                    />
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Box display="flex" mt={4} justifyContent="center" alignItems="center" width="100%">
                <Typography fontSize="1.7em" color="#CFD9DE" align="center">
                  No hay prenda seleccionada.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {isOpenIssueDialog && (
        <IssueDialog
          open={true}
          closeAction={handleOpenIssueDialog}
          clothe={clotheSelected}
          credentialSchema={credentialSchema}
          organizationTheme={auth?.organizationTheme}
          handleIssueCredentials={handleIssueCredentials}
          subjectEntitiesSelected={subjectEntitiesSelected}
          showProduct={ShowProduct}
        />
      )}

      {isLoadingDialogOpen && (
        <>
          <Dialog open>
            <DialogContent>
              <LoadingResponse totalItems={subjectEntitiesSelected.length} itemsLoaded={countProducersLoaded} />
            </DialogContent>
          </Dialog>
        </>
      )}
      {isErrorDialogOpen && (
        <OfferErrorDialog
          producersErrorLoad={producersErrorLoad}
          onClose={() => {
            onClose(true);
          }}
        />
      )}
      {isOpenClothesDialog && (
        <ClothesDialog
          open={true}
          organizationId={auth?.organizationTheme?.organizationId ?? ''}
          saveAction={handleSave}
          closeAction={handleClothesDialog}
          attributesRelation={attributesRelation}
          nameProduct={NameProduct}
          showProduct={ShowProduct}
        />
      )}
    </>
  );
};

export default OfferPredeterminedCredentialView;
