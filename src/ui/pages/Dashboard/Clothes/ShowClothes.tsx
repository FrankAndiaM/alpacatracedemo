import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
// import roundAccountBox from '@iconify/icons-ic/round-account-box';
// import mapIcon from '@iconify/icons-ic/map';
import homeFilled from '@iconify/icons-ant-design/home-filled';
// import fileFilled from '@iconify/icons-ant-design/file-filled';
import descriptionRound from '@iconify/icons-ic/round-description';
// import roundCategory from '@iconify/icons-ic/round-category';
import roundPerson from '@iconify/icons-ic/round-person';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import Page from '~ui/atoms/Page/Page';
import routes from '~routes/routes';
import { Typography, Box, Tab, Card, Tabs, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
// import { getFarmer } from '~services/farmer';
// import { Farmer } from '~models/farmer';
import { showMessage } from '~utils/Messages';
import { capitalizeAllWords } from '~utils/Word';
import { experimentalStyled as styled } from '@mui/material/styles';
// import Farm from './FarmTab';
// import Profile from './ProfileTab';
import ProfileCover from '~ui/molecules/ProfileCover/ProfileCover';
// import ActionsMenu from '~ui/pages/Dashboard/Farmer/Components/FarmTab/ActionsMenu';
// import { getFarmsFromFarmer } from '~services/farmer';
// import ClothesDialog from './ClothesDialog';
import CredentialsTab from './CredentialsTab';
import ProfileTab from './pages/Tabs/ProfileTab';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import Loading from '~ui/atoms/Loading';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
// import { AxiosResponse } from 'axios';
import { getOneClothe, updateImageClothe } from '~services/clothes';
import { Clothe } from '~models/clothes';
// import ClothesIcon from '~assets/svg/Clothe_icon.svg';
// import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import LaundryLogo from '~assets/img/laundry.svg';

const TabsWrapperStyle = styled('div')(({ theme }: any) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center'
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3)
  }
}));

const useStyles: any = makeStyles(() => ({
  root: {
    padding: '10px'
  },
  media: {
    height: 140
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
    fontSize: '1.7em',
    fontWeight: 500,
    color: '#212B36'
  }
}));

type ShowClothesProps = unknown;

const ShowClothes: React.FC<ShowClothesProps> = () => {
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);
  const history = useNavigate();
  // eslint-disable-next-line
  // @ts-ignore
  const { farmer_id } = useParams();
  const [farmer, setFarmer] = useState<Clothe | undefined>(undefined);
  // const [isOpenClothesDialog, setIsOpenClothesDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState('Ficha de prenda');
  const [profilePath, setProfilePath] = useState<any>(undefined);

  if (!farmer_id) history(routes.clothes);

  const farmerId: string = farmer_id !== undefined ? farmer_id : '';
  const classes = useStyles();

  const handleChangeTab = (e: any, newValue: string) => {
    setCurrentTab(newValue);
  };

  const _getClothe = useCallback(() => {
    getOneClothe(farmerId, '')
      .then((res: any) => {
        const { data } = res?.data;
        if (data) {
          setFarmer(data);
          if (data.image_path) {
            setProfilePath(data?.image_path ? `${COMMUNITY_BASE_URL_S3}${data?.image_path}` : LaundryLogo);
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los datos del productor.', 'error', true);
        history(routes.clothes);
      });
  }, [farmerId, history]);

  const handleUpdateImage = useCallback(
    (newImage: any) => {
      const formData = new FormData();
      if (newImage !== undefined) {
        formData.append('image', newImage.file);
        // formData.append('file_name', newImage.file_name);
        // formData.append('file_type', newImage.file_type);
      } else {
        showMessage('', 'Debe seleccionar una imagen', 'warning', false);
        return;
      }
      formData.append('entity_model_id', farmerId);
      formData.append('entity_model_type', 'Clothes');

      updateImageClothe(formData)
        .then(() => {
          showMessage('Correcto', 'Imagen actualizada correctamente', 'success', false);
        })
        .catch(() => {
          showMessage('', 'Ocurrió un problema al actualizar la imagen, inténtelo nuevamente.', 'error', false);
          setProfilePath(profilePath);
        });
    },
    [farmerId, profilePath]
  );

  // const handleUpdate = useCallback((clothe: Clothe) => {
  //   return updateClothe(clothe?.id ?? '', clothe);
  // }, []);

  // const _getFarmByFarmer = useCallback(
  //   (isReturnHome?: boolean) => {
  //     if (isReturnHome !== undefined && isReturnHome) setCurrentTab('Perfil');

  //     getFarmsFromFarmer(farmerId)
  //       .then((res: any) => {
  //         const data = res?.data?.data;
  //         setFarms(data?.items);
  //         setFarm((prevValue: any) => {
  //           if (prevValue?.id !== undefined) {
  //             const currentFarm = data?.items?.find((item: any) => item.id === prevValue.id);
  //             return currentFarm;
  //           }
  //           return {};
  //         });
  //       })
  //       .catch(() => {
  //         showMessage('', 'Problemas al cargar los datos del productor.', 'error', true);
  //         history(routes.farmers);
  //       });
  //   },
  //   [farmerId, history]
  // );

  useEffect(() => {
    _getClothe();
  }, [_getClothe]);

  const handleOnFormDialog = useCallback(
    (isUpdated?: boolean) => {
      isUpdated && _getClothe();
      // setIsOpenClothesDialog((prevValue: boolean) => !prevValue);
    },
    [_getClothe]
  );

  const PROFILE_TABS = [
    {
      value: 'Ficha de prenda',
      icon: <Icon icon={roundPerson} width={20} height={20} />,
      component: (
        <Loading isLoading={isLoading} figureProgress={<LinearProgress loading={true} />} isData={farmer !== undefined}>
          <ProfileTab
            clothe={farmer}
            onHandle={_getClothe}
            onCreateFarm={handleOnFormDialog}
            organizationId={organizationTheme?.organizationId ?? ''}
          />
        </Loading>
      )
    },
    {
      value: 'Certificados blockchain',
      icon: <Icon icon={descriptionRound} width={20} height={20} />,
      component: <CredentialsTab />
    }
  ];

  return (
    <Page title="Prendas">
      <Container sx={{ paddingInline: { xs: 0, md: 2 } }}>
        <Typography className={classes.title} style={{ marginBottom: '15px' }}>
          Prendas
        </Typography>
        <Box mb="25px">
          <Breadcrumbs
            breadcrumbs={[
              {
                path: '/dashboard',
                component: <Icon icon={homeFilled} width={20} height={20} />
              },
              {
                path: '/dashboard/clothes',
                component: 'Prendas'
              },
              {
                component: capitalizeAllWords(farmer?.name ?? '')
              }
            ]}
          />
        </Box>
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative'
          }}
        >
          <ProfileCover
            fullName={capitalizeAllWords(farmer?.name ?? '')}
            position="Prenda"
            type="user"
            src={profilePath ?? LaundryLogo}
            isEdit={!farmer?.is_credential_issued}
            onEditImage={handleUpdateImage}
          />
          <TabsWrapperStyle>
            <Tabs
              value={currentTab}
              scrollButtons="auto"
              variant="scrollable"
              allowScrollButtonsMobile
              onChange={handleChangeTab}
            >
              {PROFILE_TABS.map((tab: any) =>
                tab?.render_actions ? (
                  tab?.render_actions(tab.value)
                ) : (
                  <Tab
                    disableRipple
                    key={tab.value}
                    value={tab.value}
                    icon={tab.icon}
                    label={tab.value}
                    iconPosition="start"
                    sx={{
                      textTransform: 'none'
                    }}
                  />
                )
              )}
            </Tabs>
          </TabsWrapperStyle>
        </Card>
        {PROFILE_TABS.map((tab: any) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
      {/* {isOpenClothesDialog && (
        <ClothesDialog
          open={isOpenClothesDialog}
          clothe={undefined}
          closeAction={handleOnFormDialog}
          saveAction={handleUpdate}
          organizationId={organizationTheme?.organizationId ?? ''}
          defaultKeys={[]}
        />
      )} */}
    </Page>
  );
};

export default React.memo(ShowClothes);
