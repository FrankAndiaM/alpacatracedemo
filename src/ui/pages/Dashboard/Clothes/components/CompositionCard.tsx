import React, { useCallback, useState } from 'react';
import { Grid, Card, Typography, Button } from '@mui/material';
import { Yarn } from '~models/clothes';
import { makeStyles } from '@mui/styles';
import Image from '../pages/Tabs/components/Image';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import { OrganizationFormAttributeEdit } from '~models/organizationFormAttribute';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PanelDefault from '~assets/img/panel_default.svg';
import YarnDefault from '~assets/img/yarn_default.svg';
import ImageAttributeClothe from './ImageAttr';

const useStyles: any = makeStyles(() => ({
  fieldStyle: {
    color: '#2F3336',
    fontSize: '15px',
    fontWeight: 600
  }
}));
type CompositionCardProps = {
  data: Yarn;
  type: 'panel' | 'hilo'; //panel | hilo
  handleSelect(composition: Yarn | undefined): void;
  showAll: boolean;
};

const MAX_FIELDS: number = 2;

const CompositionCard: React.FC<CompositionCardProps> = (props: CompositionCardProps) => {
  const { data, type, handleSelect, showAll } = props;

  const [urlImage] = useState<string>(type === 'hilo' ? YarnDefault : PanelDefault);
  const [attributes] = useState<OrganizationFormAttributeEdit[]>([]);
  const classes = useStyles();

  const handleShow = useCallback(
    (element: Yarn | undefined) => {
      handleSelect(element);
      // setShowMore((prev: boolean) => !prev);
    },
    [handleSelect]
  );

  //   useEffect(() => {
  //     let hasPhoto = false;
  //     let newArray: OrganizationFormAttributeEdit[] | undefined = [];
  //     if (data && data.additional_info && data.additional_info.length > 0) {
  //       newArray = data?.additional_info?.filter((element: OrganizationFormAttributeEdit) => {
  //         if (element.attribute_type === 'photo' && !hasPhoto) {
  //           hasPhoto = true;
  //           setUrlImage(element?.value?.image);
  //           return false;
  //         }
  //         return true;
  //       });
  //       if (newArray && newArray.length > 0) {
  //         setAttributes(newArray);
  //       }
  //     }
  //   }, [data]);

  return (
    <Grid item xs={12} sm={showAll ? 12 : 4} lg={showAll ? 12 : 3} xl={showAll ? 12 : 3}>
      <Card
        sx={{
          p: 3,
          width: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%'
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
            <Image image={`${COMMUNITY_BASE_URL_S3}${urlImage}`} large={showAll} />
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
                ? {
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
                  Código del {type}:&nbsp;
                </Typography>
                <Typography className={classes.fieldStyle} style={{ fontSize: showAll ? '28px' : '15px' }}>
                  {data.code ?? '-'}
                </Typography>
              </Typography>
            </Grid>

            {attributes?.length > 0 ? (
              attributes
                .slice(0, showAll ? attributes.length : MAX_FIELDS)
                .filter((element) => element)
                .map((element: OrganizationFormAttributeEdit, index: number) => {
                  if (element.attribute_type === 'photo') {
                    return (
                      <Grid key={`element_info_${index}`} item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {element.name}:&nbsp;
                        </Typography>
                        <ImageAttributeClothe image={element?.value?.image} />
                        {/* <Image
                          image={`${COMMUNITY_BASE_URL_S3}${element?.value?.image}`}
                        /> */}
                      </Grid>
                    );
                  }
                  return (
                    <Grid key={`element_info_${index}`} item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography
                        variant="body2"
                        gutterBottom
                        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
                      >
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {element.name}:&nbsp;
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color={'#212B36'} gutterBottom>
                          {element.value !== '' ? element.value : '-'}
                        </Typography>
                      </Typography>
                    </Grid>
                  );
                })
            ) : (
              <></>
            )}
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
            {showAll ? (
              <Button variant="outlined" endIcon={<VisibilityOffOutlinedIcon />} onClick={() => handleShow(undefined)}>
                Ocultar información
              </Button>
            ) : (
              <Button
                variant="outlined"
                fullWidth
                endIcon={<RemoveRedEyeOutlinedIcon />}
                onClick={() => handleShow(data)}
              >
                Mas información
              </Button>
            )}
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default CompositionCard;
