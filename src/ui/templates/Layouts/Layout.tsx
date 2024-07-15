import React, { useEffect, useState, useCallback } from 'react';
import { Container } from '@mui/material';
import ThemeConfig from '~ui/themes';
import Header from '~organisms/Header/Header';
import SideBar from '~organisms/SideBar/SideBar';
import { experimentalStyled as styled } from '@mui/material/styles';
import ScrollToTop from '~atoms/ScrollToTop/ScrollToTop';
import { routes } from '~routes/_nav';
import '~assets/scss/app.scss';
import '../../../i18next';

import { useSnackbar } from 'notistack';
import { getUserData } from '~services/user';
import { forceLogOut, updateTheme } from '~redux-store/actions/authActions';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import LogIDPanel from '~ui/assets/img/id_panel.png';
import cover from '~assets/img/farmer_banner.png';
import { useAppDispatch } from '~redux-store/store';
import { getAttributesRelation } from '~services/clothes';
import { AttributesRelation, AttributesRelationDefault } from '~models/clothes';

export type Props = {
  children?: React.ReactNode;
};

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

// eslint-disable-next-line @typescript-eslint/typedef
const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

const defaultOrganizationTheme: any = {
  initial_gps: [-5.197188653750377, -80.62666654586792],
  farmers_profile_path_logo: cover
};

const CompLayout: React.FC<Props> = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const [activeDrawer, setActiveDrawer] = useState<boolean>(true);
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(true);
  const [logo, setLogo] = useState<any>('');
  const [titulo, setTitulo] = useState('');

  const handleActiveDrawer = useCallback(() => {
    setActiveDrawer((prevValue: any) => !prevValue);
  }, [setActiveDrawer]);

  const alertMessage = useCallback(
    (message: string = 'Error', type: any = 'warning', duration: number = 3000) => {
      return enqueueSnackbar(message, {
        autoHideDuration: duration,
        variant: type,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    },
    [enqueueSnackbar]
  );

  const getLatLong = useCallback((center_point_str?: string) => {
    if (!center_point_str) {
      return defaultOrganizationTheme?.initial_gps;
    }
    const center_point = center_point_str.split(' ');
    const lat = parseFloat(center_point[1]);
    const long = parseFloat(center_point[0]);
    return [lat, long];
  }, []);

  const _getAttributesRelation = useCallback((id: string): Promise<any> => {
    const clothes = new Promise<AttributesRelation>((resolve, _reject) => {
      getAttributesRelation('Clothes', id)
        .then((resp: any) => {
          const { data } = resp?.data;
          resolve(data || AttributesRelationDefault);
        })
        .catch(() => {
          resolve(AttributesRelationDefault);
        });
    });
    const yarns = new Promise<AttributesRelation>((resolve, _reject) => {
      getAttributesRelation('Yarns', id)
        .then((resp: any) => {
          const { data } = resp?.data;
          resolve(data || AttributesRelationDefault);
        })
        .catch(() => {
          resolve(AttributesRelationDefault);
        });
    });
    const fabric = new Promise<AttributesRelation>((resolve, _reject) => {
      getAttributesRelation('FabricInventories', id)
        .then((resp: any) => {
          const { data } = resp?.data;
          resolve(data || AttributesRelationDefault);
        })
        .catch(() => {
          resolve(AttributesRelationDefault);
        });
    });
    return Promise.all([clothes, yarns, fabric]);
  }, []);

  useEffect(() => {
    getUserData()
      .then(async (res: any) => {
        const data = res?.data?.data;
        if (data?.organizations?.length !== 0) {
          const newTheme: any = {};
          const organization = data?.organizations[0]?.organization;
          newTheme['organizationId'] = organization?.id;
          if (organization?.parent_organization) {
            newTheme['parentOrganization'] = organization?.parent_organization;
          }
          if (
            organization?.logo_path !== null &&
            organization?.logo_path !== '' &&
            organization?.logo_path !== undefined
          ) {
            setLogo(COMMUNITY_BASE_URL_S3 + organization?.logo_path);
            newTheme['organizationLogo'] = COMMUNITY_BASE_URL_S3 + organization?.logo_path;
          } else {
            setLogo(LogIDPanel);
            newTheme['organizationLogo'] = LogIDPanel;
          }

          newTheme['organizationName'] = organization?.hasOwnProperty('name') ? organization?.name : '';
          const theme = organization?.theme;

          newTheme['initial_gps'] = getLatLong(organization?.department?.center_point_str ?? null);
          const fabric_inventories = organization?.theme?.global_names?.fabric_inventories;
          if (fabric_inventories) {
            newTheme['show_product'] = Boolean(fabric_inventories?.is_enable);
          } else {
            newTheme['show_product'] = true;
          }
          newTheme['theme'] = organization?.theme || {};
          newTheme['name_product'] = fabric_inventories?.display_name || 'Panel';
          newTheme['attributes_relation'] = await _getAttributesRelation(organization?.id);
          newTheme['farmers_profile_path_logo'] = theme?.hasOwnProperty('farmers_profile_path_logo')
            ? COMMUNITY_BASE_URL_S3 + theme?.farmers_profile_path_logo
            : defaultOrganizationTheme?.farmers_profile_path_logo;
          _getAttributesRelation(organization?.id);
          dispatch(updateTheme(newTheme));
          setIsUserDataLoading(false);
          return;
        }

        alertMessage('Problemas al cargar los datos del usuario.');
        dispatch(forceLogOut());
      })
      .catch(() => {
        alertMessage('Problemas al cargar los datos del usuario.');
        dispatch(forceLogOut());
      });
  }, [_getAttributesRelation, alertMessage, dispatch, getLatLong]);

  if (isUserDataLoading) {
    return (
      <div className="load">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <ThemeConfig>
      <ScrollToTop />
      <RootStyle>
        <Header activeDrawer={activeDrawer} handleActiveDrawer={handleActiveDrawer} titulo={titulo} />
        <SideBar
          activeDrawer={activeDrawer}
          routes={routes}
          handleActiveDrawer={handleActiveDrawer}
          isLogoLoading={isUserDataLoading}
          logo={logo}
          setTitulo={setTitulo}
        />
        <MainStyle>
          <Container maxWidth="xl">{props.children}</Container>
        </MainStyle>
        {/* <Footer /> */}
      </RootStyle>
    </ThemeConfig>
  );
};

export const Layout = React.memo(CompLayout);
