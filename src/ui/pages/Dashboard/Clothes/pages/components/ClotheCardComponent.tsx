import { Box, Button, Card, Grid, Typography, useMediaQuery } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Clothe } from '~models/clothes';
import { OrganizationFormAttributeEdit } from '~models/organizationFormAttribute';
import { makeStyles } from '@mui/styles';
import PanelDefault from '~assets/img/clothe_default.svg';
// import YarnDefault from '~assets/img/yarn_default.png';
import Image from '../Tabs/components/Image';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
// import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
// import { useNavigate } from 'react-router-dom';
import { renderModelValue } from '~utils/composition';
import IsCredentialChip from '../../components/IsCredentialChip';
import { useTheme } from '@mui/material/styles';
import ImageAttributeClothe from '../../components/ImageAttr';

const useStyles: any = makeStyles(() => ({
  fieldStyle: {
    color: '#2F3336',
    fontSize: '15px',
    fontWeight: 600
  }
}));

type CompositionComponentProps = {
  data: Clothe;
  type: string; //prenda
  handleSelect(composition: Clothe | undefined): void;
  isSelect: boolean;
  showAll: boolean;
};

const MAX_FIELDS: number = 2;

type ItemComponentProps = {
  display_name: string;
  value: string;
};

const ItemComponent: React.FC<ItemComponentProps> = ({ display_name, value }) => {
  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ textAlign: 'center' }}>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {display_name}:&nbsp;
        </Typography>
        <Typography variant="body2" fontWeight={600} color={'#212B36'} gutterBottom>
          {renderModelValue(value) || '-'}
        </Typography>
      </Box>
    </Grid>
  );
};

const CompositionComponent: React.FC<CompositionComponentProps> = (props: CompositionComponentProps) => {
  const { data, type, handleSelect, showAll } = props;
  const [urlImage, setUrlImage] = useState<string>(PanelDefault);
  const [attributes, setAttributes] = useState<OrganizationFormAttributeEdit[]>([]);
  const [attributesImage, setAttributesImage] = useState<OrganizationFormAttributeEdit[]>([]);
  const themes = useTheme();
  const classes = useStyles();
  const isActiveDesktop = useMediaQuery(themes.breakpoints.down('md'));
  //   const history = useNavigate();

  //   const handleShow = useCallback(
  //     (element: Clothe | undefined) => {
  //       //   handleSelect(element);
  //     //   const typeComposition = type === 'hilo' ? 'YARN' : 'FABRIC';
  //     //   history(`/dashboard/composition/${element?.id}/${typeComposition}`);
  //       // setShowMore((prev: boolean) => !prev);
  //     },
  //     [history, type]
  //   );

  const handleSelectCard = useCallback(
    (element: Clothe | undefined) => {
      handleSelect(element);
      // setShowMore((prev: boolean) => !prev);
    },
    [handleSelect]
  );

  useEffect(() => {
    // console.log(data);
    if (data && data.image_path && data.image_path !== '') {
      setUrlImage(`${COMMUNITY_BASE_URL_S3}${data.image_path}`);
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
      }
    }
  }, [data]);

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
          <Image image={`${urlImage}`} large={showAll} />
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={showAll ? 7 : 12}
          lg={showAll ? 7 : 12}
          xl={showAll ? 7 : 12}
          sx={
            showAll
              ? isActiveDesktop
                ? { display: 'flex', flexDirection: 'column' }
                : {
                    display: 'grid',
                    gridTemplateRows: 'repeat(7, 39px)',
                    gridGap: '10px',
                    gridAutoFlow: 'column',
                    justifyItems: 'start'
                  }
              : {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }
          }
        >
          <Grid item xs={12} sm={12} lg={12} xl={12} style={showAll ? { gridRow: '1 / 3' } : {}}>
            <Typography
              variant="body2"
              component={'span'}
              gutterBottom
              style={{
                display: 'flex',
                flexDirection: showAll ? 'column' : 'row',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="body2"
                sx={showAll ? { fontSize: '20px', color: 'text.secondary' } : { color: 'text.secondary' }}
              >
                Código de {type}:&nbsp;
              </Typography>
              <Typography className={classes.fieldStyle} style={{ fontSize: showAll ? '28px' : '15px' }}>
                {data.code ?? '-'}
              </Typography>
            </Typography>
          </Grid>
          <ItemComponent
            display_name={'Última actualización'}
            value={
              data?.updated_at
                ? `${formatInTimeZone(new Date(data?.updated_at), 'America/Lima', 'dd/MM/yyyy', {
                    locale: es
                  })}`
                : '-'
            }
          />
          <Grid item xs={12} sm={12} lg={12} xl={12} style={showAll ? { gridRow: '1 / 3' } : {}}>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="body2"
                mb={1}
                textAlign={'center'}
                sx={showAll ? { fontSize: '20px', color: 'text.secondary' } : { color: 'text.secondary' }}
              >
                Estado del certificado:&nbsp;
              </Typography>
              <IsCredentialChip is_credential_issued={data?.is_credential_issued || false} />
            </Box>
          </Grid>
          {/* <ItemComponent display_name={'Material'} value={data.composition ?? '-'} />
          {showAll && (
            <>
              <ItemComponent display_name={'Descripción'} value={data.description ?? '-'} />
              <ItemComponent display_name={'Medida'} value={data.nm ?? '-'} />
              <ItemComponent display_name={'Presentación'} value={data.colors_code ?? '-'} />
            </>
          )} */}

          {showAll && attributes?.length > 0 ? (
            attributes
              .slice(0, showAll ? attributes.length : MAX_FIELDS)
              .filter((element) => element)
              .map((element: OrganizationFormAttributeEdit, index: number) => {
                if (element.attribute_type === 'photo') {
                  return (
                    <Grid
                      key={`element_info_${index}`}
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{ gridRow: '3 / -1' }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {element.name}:&nbsp;
                      </Typography>
                      {/* <Image key={`element_info_${index}`} 
                      image={`${COMMUNITY_BASE_URL_S3}${element?.value?.image}`} /> */}
                      <ImageAttributeClothe image={element?.value?.image} />
                    </Grid>
                  );
                }
                return (
                  <ItemComponent key={`element_info_${index}`} display_name={element?.name} value={element?.value} />
                );
              })
          ) : (
            <></>
          )}
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
                  sm={6}
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
              style={{ width: '250px' }}
              startIcon={<RemoveRedEyeOutlinedIcon />}
              onClick={() => handleSelectCard(data)}
            >
              Ver prenda
            </Button>
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default CompositionComponent;
