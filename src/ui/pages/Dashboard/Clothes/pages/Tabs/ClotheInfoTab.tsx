import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Card, Grid, Paper, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AttributesRelation, AttributesRelationDefault, Clothe } from '~models/clothes';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
// import { capitalizeAllWords } from '~utils/Word';
// import ClothesDialog from '../../ClothesDialog';
import { AxiosResponse } from 'axios';
// import { updateFarmer } from '~services/farmer';
import { OrganizationFormAttributeEdit } from '~models/organizationFormAttribute';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material';
import { renderModelValue } from '~utils/composition';
import { capitalize } from '~utils/Word';
import ImageAttributeClothe from '../../components/ImageAttr';
import { updateClothe } from '~services/clothes';
import ClothesEditDialog from '../../ClothesEditDialog';
const useStyles: any = makeStyles(() => ({
  fieldStyle: {
    color: '#2F3336',
    fontSize: '15px',
    fontWeight: 600
  }
}));

type defaultVal = {
  display_name: string;
  value: keyof Clothe;
  type?: string;
};

type ClothesInfoTabProps = {
  clothe?: Clothe;
  onHandle?: any;
  organizationId: string;
  farmerId: string;
};

const ClothesInfoTab: React.FC<ClothesInfoTabProps> = (props: ClothesInfoTabProps) => {
  const classes = useStyles();
  const { auth }: any = useSelector((state: any) => state);
  // const theme = useTheme();
  const NameProduct: string = auth?.organizationTheme?.name_product;
  const ShowProduct: boolean = auth?.organizationTheme?.show_product;
  const { clothe, onHandle, organizationId, farmerId } = props;
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [additionalInfo, setAdditionalInfo] = useState<Array<OrganizationFormAttributeEdit>>(
    clothe?.additional_info ?? []
  );
  const [attributesRelation, setAttributesRelation] = useState<AttributesRelation>(AttributesRelationDefault);
  const [defaultValues, setDefaultValues] = useState<defaultVal[]>([]);

  useEffect(() => {
    if (auth?.organizationTheme?.attributes_relation && Array.isArray(auth?.organizationTheme?.attributes_relation)) {
      const relation = auth?.organizationTheme?.attributes_relation.find(
        (element: any) => element?.entity_model_type === 'Clothes'
      );
      if (relation) {
        setAttributesRelation(relation);
      }
    }
  }, [auth?.organizationTheme?.attributes_relation]);
  const handleCloseDialog = useCallback(() => {
    onHandle();
    setIsOpenDialog((prevValue: boolean) => !prevValue);
  }, [onHandle]);

  const handleOpenDialog = useCallback(() => {
    setIsOpenDialog((prevValue: boolean) => !prevValue);
  }, []);

  const handleSaveDialog = useCallback(
    (data: Clothe): Promise<AxiosResponse<any>> => {
      return updateClothe(farmerId, data);
    },
    [farmerId]
  );

  const renderArray = useCallback((value: any, sep: string): string => {
    let str = '';
    if (Array.isArray(value)) {
      value.forEach((element: any, index: number) => {
        str += `${element.code ?? ''}`;
        if (index < value.length - 1) {
          str += `${sep} `;
        }
      });
    }

    return str;
  }, []);

  useEffect(() => {
    const defaultValues: defaultVal[] = [
      {
        display_name: 'Nombre de la prenda',
        value: 'name'
      },
      {
        display_name: 'Código',
        value: 'code'
      },
      {
        display_name: 'Fecha de producción',
        value: 'production_at'
      },
      {
        display_name: 'Hilos conformados',
        value: 'yarns',
        type: 'array'
      }
    ];
    if (ShowProduct) {
      defaultValues.push({
        display_name: `${NameProduct} conformados`,
        value: 'fabric_inventories',
        type: 'array'
      });
    }
    setDefaultValues(defaultValues);
  }, [NameProduct, ShowProduct]);

  useEffect(() => {
    //filter
    // console.log(clothe);
    const schemaData = clothe?.additional_info;
    if (schemaData && schemaData?.length > 0) {
      const arrRelationValues = Object.values(attributesRelation?.attributes_relationship);
      const newSchema = schemaData.filter((element: OrganizationFormAttributeEdit) => {
        if (element.id) {
          return !arrRelationValues.includes(element.id);
        }
        return true;
      });
      setAdditionalInfo(newSchema ?? []);
    }
  }, [attributesRelation?.attributes_relationship, clothe]);

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="flex-start">
          <Box display="flex" justifyContent={'space-between'} width={'100%'}>
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                INFORMACIÓN DE PRENDA
              </Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                sx={{ paddingInline: '32px' }}
                onClick={handleOpenDialog}
                startIcon={<EditRoundedIcon />}
                disabled={clothe?.is_credential_issued}
              >
                Editar
              </Button>
            </Box>
          </Box>
          <Paper
            key="info_pcommunication"
            sx={{
              p: 3,
              width: 1,
              bgcolor: 'background.neutral',
              border: '1px solid #6E767D',
              borderRadius: '8px'
            }}
          >
            <Grid container spacing={2}>
              {defaultValues.map((element: defaultVal, index: number) => {
                return (
                  <Grid key={`item_default_${index}`} item xs={12} sm={6} lg={6} xl={6}>
                    <Typography variant="body2" gutterBottom>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {capitalize(element.display_name ?? '')} &nbsp;
                      </Typography>
                      <Typography className={classes.fieldStyle}>
                        {element.type ? (
                          <>{element.type === 'array' && clothe && renderArray(clothe[element.value] ?? [], ' - ')}</>
                        ) : (
                          (clothe && clothe[element.value]) ?? '-'
                        )}
                      </Typography>
                    </Typography>
                  </Grid>
                );
              })}

              {additionalInfo.length > 0 ? (
                additionalInfo.map((element: OrganizationFormAttributeEdit, index: number) => {
                  // const { data } = element;
                  if (element.attribute_type === 'photo') {
                    // console.log(element?.value?.image);
                    return (
                      <Grid key={`element_info_${index}`} item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {capitalize(element.name ?? '')}: &nbsp;
                        </Typography>
                        <ImageAttributeClothe image={element?.value?.image} />
                      </Grid>
                    );
                  }
                  if (element.attribute_type === 'model') {
                    return (
                      <Grid key={`element_info_${index}`} item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {capitalize(element.name ?? '')}: &nbsp;
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color={'#212B36'} gutterBottom>
                          {renderModelValue(element.value) || '-'}
                        </Typography>
                      </Grid>
                    );
                  }
                  if (element.attribute_type === 'title') {
                    return <></>;
                  }
                  return (
                    <Grid key={`element_info_${index}`} item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {capitalize(element.name ?? '')}: &nbsp;
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color={'#212B36'} gutterBottom>
                        {element.value !== '' ? element.value : '-' || '-'}
                      </Typography>
                    </Grid>
                    // element &&
                    // element.length > 0 &&
                    // element.map((additional: AdditionalRow, idx: number) => {
                    //   return (
                    //   );
                    // })
                  );
                })
              ) : (
                <></>
              )}
            </Grid>
          </Paper>
        </Stack>
      </Card>
      {isOpenDialog && (
        <ClothesEditDialog
          open={isOpenDialog}
          closeAction={handleCloseDialog}
          saveAction={handleSaveDialog}
          clothe={clothe}
          attributesRelation={attributesRelation}
          organizationId={organizationId}
          nameProduct={NameProduct}
          showProduct={ShowProduct}
        />
      )}
    </>
  );
};

export default ClothesInfoTab;
