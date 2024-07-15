import { Box, Button, Card, Grid, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Yarn,
  FabricInventory,
  CompositionClotheYarns,
  CompositionClothe,
  CompositionClotheFabricInventories
} from '~models/clothes';
import { OrganizationFormAttributeEdit } from '~models/organizationFormAttribute';
import { makeStyles } from '@mui/styles';
import PanelDefault from '~assets/img/panel_default.svg';
import YarnDefault from '~assets/img/yarn_default.svg';
import Image from '../Tabs/components/Image';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
// import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
// import { formatInTimeZone } from 'date-fns-tz';
// import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { renderModelValue } from '~utils/composition';
import ImageAttributeClothe from '../../components/ImageAttr';
import ImageUploadComponent from './ImageUploadComponent';
import { showMessage } from '~utils/Messages';
import { updateImageClothe } from '~services/clothes';

// import { useTheme } from '@mui/material/styles';

const useStyles: any = makeStyles(() => ({
  fieldStyle: {
    color: '#2F3336',
    fontSize: '15px',
    fontWeight: 600
  }
}));

type YarnsDefaultType = {
  key: keyof CompositionClotheYarns;
  display_name: string;
};
type FabricDefaultType = {
  key: keyof CompositionClotheFabricInventories;
  display_name: string;
};

const YarnsDefaultValues: Array<YarnsDefaultType> = [
  {
    key: 'name',
    display_name: 'Nombre'
  },
  {
    key: 'composition',
    display_name: 'Material'
  },
  {
    key: 'colors_code',
    display_name: 'Código de color'
  },
  {
    key: 'title',
    display_name: 'Título'
  },
  {
    key: 'presentation',
    display_name: 'Presentación'
  }
];
const FabricDefaultValues: Array<FabricDefaultType> = [
  {
    key: 'description',
    display_name: 'Descripción'
  },
  {
    key: 'production_at',
    display_name: 'Fecha de producción'
  }
];

type CompositionComponentProps = {
  data: CompositionClothe;
  type: string; //panel | hilo
  handleSelect(composition: any): void;
  isSelect: boolean;
  showAll: boolean;
};

// const MAX_FIELDS: number = 2;

type ItemComponentProps = {
  display_name: string;
  value: string;
  showAll: boolean;
};

const ItemComponent: React.FC<ItemComponentProps> = ({ display_name, value, showAll }) => {
  const str = renderModelValue(value);
  return (
    <>
      {str === '' ? (
        <></>
      ) : (
        <Grid
          item
          xs={showAll ? 12 : 12}
          sm={showAll ? 12 : 12}
          md={showAll ? 6 : 12}
          lg={showAll ? 6 : 12}
          xl={showAll ? 6 : 12}
          style={showAll ? {} : { textAlign: 'center' }}
        >
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: showAll ? 'column' : 'row',
              paddingInline: showAll ? 0 : '10px'
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {display_name}:&nbsp;
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              style={
                showAll
                  ? {
                      textAlign: 'left',
                      maxWidth: '95%',
                      color: '#212B36',
                      fontWeight: 600
                    }
                  : {
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      lineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      textAlign: 'left',
                      maxWidth: '95%',
                      color: '#212B36',
                      fontWeight: 600
                    }
              }
            >
              {str}
            </Typography>
          </Box>
        </Grid>
      )}
    </>
  );
};

const CompositionComponent: React.FC<CompositionComponentProps> = (props: CompositionComponentProps) => {
  const { data, type, handleSelect, isSelect, showAll } = props;
  const [urlImage, setUrlImage] = useState<string>(type === 'hilo' ? YarnDefault : PanelDefault);
  const [attributes, setAttributes] = useState<OrganizationFormAttributeEdit[]>([]);
  const [attributesImage, setAttributesImage] = useState<OrganizationFormAttributeEdit[]>([]);
  const [yarnData, setYarnData] = useState<CompositionClotheYarns | undefined>(undefined);
  const [fabricInventoryData, setFabricInventoryData] = useState<CompositionClotheFabricInventories | undefined>(
    undefined
  );
  const classes = useStyles();
  const history = useNavigate();
  const handleShow = useCallback(
    (element: Yarn | FabricInventory | undefined) => {
      //   handleSelect(element);
      const typeComposition = type === 'hilo' ? 'YARN' : 'FABRIC';
      history(`/dashboard/composition/${element?.id}/${typeComposition}`);
      // setShowMore((prev: boolean) => !prev);
    },
    [history, type]
  );
  const handleSelectCard = useCallback(
    (element: Yarn | FabricInventory | undefined) => {
      handleSelect(element);
      // setShowMore((prev: boolean) => !prev);
    },
    [handleSelect]
  );

  const handleUpdateImage = useCallback(
    (newImage: any) => {
      const formData = new FormData();
      const typeEntity = type === 'hilo' ? 'Yarns' : 'FabricInventories';
      if (newImage !== undefined) {
        formData.append('image', newImage.file);
        // formData.append('file_name', newImage.file_name);
        // formData.append('file_type', newImage.file_type);
      } else {
        showMessage('', 'Debe seleccionar una imagen', 'warning', false);
        return;
      }
      formData.append('entity_model_id', `${data?.id}`);
      formData.append('entity_model_type', typeEntity);

      updateImageClothe(formData)
        .then(() => {
          showMessage('Correcto', 'Imagen actualizada correctamente', 'success', false);
        })
        .catch(() => {
          showMessage('', 'Ocurrió un problema al actualizar la imagen, inténtelo nuevamente.', 'error', false);
          // setProfilePath(profilePath);
        });
    },
    [data?.id, type]
  );

  useEffect(() => {
    if (type === 'hilo') {
      setYarnData(data as CompositionClotheYarns);
    } else {
      setFabricInventoryData(data as CompositionClotheFabricInventories);
    }
  }, [data, type]);

  useEffect(() => {
    if (data && data.image_path && data.image_path !== '') {
      setUrlImage(`${COMMUNITY_BASE_URL_S3}${data.image_path}`);
    } else {
      setUrlImage(type === 'hilo' ? YarnDefault : PanelDefault);
    }
    // let hasPhoto = false;
    let newArray: OrganizationFormAttributeEdit[] | undefined = [];
    const imageArray: OrganizationFormAttributeEdit[] = [];
    if (data && data.additional_info && data.additional_info.length > 0) {
      newArray = data?.additional_info?.filter((element: OrganizationFormAttributeEdit) => {
        if (element.attribute_type === 'photo') {
          // hasPhoto = true;
          if (element?.value?.image && element?.value?.image !== '') {
            imageArray.push(element);
          }
          return false;
        }
        return true;
      });
      if (newArray && newArray.length > 0) {
        setAttributes(newArray);
      }
      if (imageArray && imageArray.length > 0) {
        setAttributesImage(imageArray);
      } else {
        setAttributesImage([]);
      }
    }
  }, [data, type]);

  return (
    <Card
      sx={{
        p: 3,
        width: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        boxShadow: 'none'
      }}
    >
      <Grid
        container
        sx={{
          height: '100%'
          //   display: 'flex',
          //   flexDirection: 'column',
          //   alignItems: 'center'
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={showAll ? 5 : 12}
          lg={showAll ? 5 : 12}
          xl={showAll ? 5 : 12}
          sx={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {showAll && !data?.is_credential_issued ? (
            <ImageUploadComponent src={`${urlImage}`} onEditImage={handleUpdateImage} />
          ) : (
            <Image image={`${urlImage}`} large={showAll} />
          )}
        </Grid>

        <Grid item xs={12} sm={12} md={showAll ? 7 : 12} lg={showAll ? 7 : 12} xl={showAll ? 7 : 12}>
          <Box
            style={{
              display: 'flex',
              flexDirection: showAll ? 'column' : 'row',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
            mb={2}
          >
            <Typography
              variant="body2"
              sx={showAll ? { fontSize: '20px', color: 'text.secondary' } : { color: 'text.secondary' }}
            >
              Código del {type}:&nbsp;
            </Typography>
            <Typography className={classes.fieldStyle} style={{ fontSize: showAll ? '28px' : '15px' }}>
              {data.code ?? '-'}
            </Typography>
          </Box>
          <Grid container>
            {yarnData && (
              <>
                {YarnsDefaultValues.slice(0, showAll ? YarnsDefaultValues.length : 3).map(
                  (element: YarnsDefaultType, index: number) => {
                    const value = yarnData[element.key];
                    let str = '';
                    if (typeof value === 'string') {
                      str = value;
                    }
                    return (
                      <ItemComponent
                        key={`element_yarn_default_${index}`}
                        display_name={element?.display_name}
                        value={str}
                        showAll={showAll}
                      />
                    );
                  }
                )}
              </>
            )}
            {fabricInventoryData && (
              <>
                {FabricDefaultValues.slice(0, showAll ? FabricDefaultValues.length : 3).map(
                  (element: FabricDefaultType, index: number) => {
                    const value = fabricInventoryData[element.key];
                    let str = '';
                    if (typeof value === 'string') {
                      str = value;
                    }
                    return (
                      <ItemComponent
                        key={`element_yarn_default_${index}`}
                        display_name={element?.display_name}
                        value={str}
                        showAll={showAll}
                      />
                    );
                  }
                )}
              </>
            )}

            {showAll && attributes?.length > 0 ? (
              attributes
                .filter((element: OrganizationFormAttributeEdit) => {
                  return element && element.attribute_type !== 'title';
                })
                .map((element: OrganizationFormAttributeEdit, index: number) => {
                  if (element.attribute_type === 'photo') {
                    return (
                      <Grid key={`element_info_${index}`} item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {element.name}:&nbsp;
                        </Typography>
                        {/* <Image
                          key={`element_info_${index}`}
                          image={`${COMMUNITY_BASE_URL_S3}${element?.value?.image}`}
                        /> */}
                        <ImageAttributeClothe image={element?.value?.image} />
                      </Grid>
                    );
                  }
                  return (
                    <ItemComponent
                      key={`element_info_${index}`}
                      display_name={element?.name}
                      value={element?.value}
                      showAll={showAll}
                    />
                  );
                })
            ) : (
              <></>
            )}
          </Grid>
        </Grid>

        <Grid container xs={12} sm={12} lg={12} xl={12} mt={2}>
          {showAll &&
            attributesImage.length > 0 &&
            attributesImage.map((element: OrganizationFormAttributeEdit, index: number) => {
              return (
                <Grid
                  key={`element_info_${index}`}
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={2}
                  xl={2}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    {element.name}:&nbsp;
                  </Typography>
                  <Box display="flex" justifyContent={'center'}>
                    {/* <Image key={`element_info_${index}`} 
                    image={`${COMMUNITY_BASE_URL_S3}${element?.value?.image}`} /> */}
                    <ImageAttributeClothe image={element?.value?.image} />
                  </Box>
                </Grid>
              );
            })}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={12}
          xl={12}
          sx={
            showAll
              ? { width: '100%', display: 'flex', justifyContent: ' flex-end' }
              : {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end'
                }
          }
        >
          {!showAll && (
            <Button
              variant="outlined"
              fullWidth
              endIcon={<RemoveRedEyeOutlinedIcon />}
              onClick={() => (isSelect ? handleSelectCard(data) : handleShow(data))}
            >
              Mas información
            </Button>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default CompositionComponent;
