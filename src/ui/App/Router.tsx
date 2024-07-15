import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LogIn from '../pages/Auth/LogIn';
import TermsAndConditionsPage from '../pages/Terms';
import { GuardModule } from './GuardModule';
import routesName, { moduleRoute } from '~routes/routes';
import { Layout } from '~templates/Layouts/Layout';
import Root from './Root';
import { Box } from '@mui/material';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { useSelector } from 'react-redux';
// import ThemeConfig from '~ui/themes';

const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ '~pages/Dashboard/Dashboard'));

const AgroLeaderPage = lazy(() => import(/* webpackChunkName: "AgroLederPage" */ '~pages/Dashboard/AgroLeader'));

const DisabledAgroLeaderPage = lazy(
  () => import(/* webpackChunkName: "AgroLederPage" */ '~pages/Dashboard/AgroLeader/DisabledAgroLeader')
);

const ShowAgroLeaderPage = lazy(
  () => import(/* webpackChunkName: "ShowAgroLederPage" */ '~pages/Dashboard/AgroLeader/ShowAgroLeader')
);

const OrganizationFormComponent = lazy(
  () => import(/* webpackChunkName: "OrganizationFormComponent" */ '~ui/pages/Dashboard/OrganizationForm')
);

const ShowOrganizationFormComponent = lazy(
  () =>
    import(
      /* webpackChunkName: "ShowOrganizationFormComponent" */ '~ui/pages/Dashboard/OrganizationForm/EditOrganizationForm'
    )
);

const DataOrganizationFormComponent = lazy(
  () =>
    import(
      /* webpackChunkName: "ShowOrganizationFormComponent" */ '~ui/pages/Dashboard/OrganizationForm/DataOrganizationForm'
    )
);

const DisabledOrganizationFormComponent = lazy(
  () =>
    import(
      /* webpackChunkName: "ShowOrganizationFormComponent" */ '~ui/pages/Dashboard/OrganizationForm/DisabledOrganizationForm'
    )
);
const ResponseFormComponent = lazy(
  () => import(/* webpackChunkName: "ResponseForm" */ '~ui/pages/Dashboard/OrganizationForm/ResponseForms')
);

// const MoreServicesComponent = lazy(() => import(/* webpackChunkName: "Service" */ '~ui/pages/Dashboard/Service'));

const OrganizationProfileComponent = lazy(
  () => import(/* webpackChunkName: "OrganizationProfile" */ '~ui/pages/Dashboard/Organization/profile')
);

const CredentialPage = lazy(() => import(/* webpackChunkName: "CredentialPage" */ '~ui/pages/Dashboard/Credentials'));

const CredentialIdPage = lazy(
  () => import(/* webpackChunkName: "CredentialIdPage" */ '~ui/pages/Dashboard/Credentials/ShowCredential')
);

const IssuedCredentialsPage = lazy(
  () => import(/* webpackChunkName: "CredentialIdPage" */ '~ui/pages/Dashboard/Credentials/IssuedCredentials')
);

const SubjectIssuedCredentialsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "CredentialIdPage" */ '~ui/pages/Dashboard/Credentials/IssuedCredentials/SubjectCredentials'
    )
);

const ShareCredentialsPage = lazy(
  () => import(/* webpackChunkName: "CredentialIdPage" */ '~ui/pages/Dashboard/Credentials/ShareCredentials')
);

const ShareCredentialsSelectionPage = lazy(
  () =>
    import(
      /* webpackChunkName: "CredentialIdPage" */ '~ui/pages/Dashboard/Credentials/ShareCredentials/CredentialsSelection'
    )
);

const DefaultCredentialPage = lazy(
  () =>
    import(/* webpackChunkName: "CredentialIdPage" */ '~ui/pages/Dashboard/Credentials/views/PredeterminedCredentials')
);

const PredeterminedCredentialPage = lazy(
  () => import(/* webpackChunkName: "CredentialIdPage" */ '~ui/pages/Dashboard/Credentials/views/DefaultCredentials')
);

const FormCredentialPage = lazy(
  () => import(/* webpackChunkName: "CredentialIdPage" */ '~ui/pages/Dashboard/Credentials/views/FormCredentials')
);

const ClothesComponent = lazy(() => import(/* webpackChunkName: "ClothesComponent" */ '~pages/Dashboard/Clothes'));
const PanelsComponent = lazy(
  () => import(/* webpackChunkName: "ClothesComponent" */ '~pages/Dashboard/Clothes/pages/Panels')
);
const YarnsComponent = lazy(
  () => import(/* webpackChunkName: "ClothesComponent" */ '~pages/Dashboard/Clothes/pages/Yarns')
);
const CompositionViewComponent = lazy(
  () => import(/* webpackChunkName: "ClothesComponent" */ '~pages/Dashboard/Clothes/pages/ShowComposition')
);
const ShowClothesComponent = lazy(
  () => import(/* webpackChunkName: "ShowClothesComponent" */ '~pages/Dashboard/Clothes/ShowClothes')
);

const ClothesFileListLoaded = lazy(
  () => import(/* webpackChunkName: "ClothesFileListLoaded" */ '~ui/pages/Dashboard/Clothes/pages/MassiveLoad')
);

const ClothesMassiveLoadShowComponent = lazy(
  () =>
    import(/* webpackChunkName: "ClothesMassiveLoadShowComponent" */ '~pages/Dashboard/Clothes/pages/MassiveLoad/Show')
);
const YarnsMassiveLoadShowComponent = lazy(
  () =>
    import(
      /* webpackChunkName: "YarnsMassiveLoadShowComponent" */ '~pages/Dashboard/Clothes/pages/MassiveLoad/ShowYarns'
    )
);
const PanelsMassiveLoadShowComponent = lazy(
  () =>
    import(
      /* webpackChunkName: "PanelsMassiveLoadShowComponent" */ '~pages/Dashboard/Clothes/pages/MassiveLoad/ShowPanels'
    )
);

const WrappedRoutes = () => (
  <Layout>
    <Suspense
      fallback={
        <Box width="100%">
          <LinearProgress loading={true} />
        </Box>
      }
    >
      <Routes>
        <Route
          path={routesName.dashboard}
          element={<GuardModule module_code={moduleRoute.dashboard.module_code} element={<Dashboard />} />}
        />
        <Route path={routesName.agroLeader} element={<GuardModule element={<AgroLeaderPage />} />} />

        <Route path={routesName.disabledAgroLeader} element={<GuardModule element={<DisabledAgroLeaderPage />} />} />

        <Route path={routesName.agroLeaderId} element={<GuardModule element={<ShowAgroLeaderPage />} />} />

        <Route path={routesName.organizationForm} element={<GuardModule element={<OrganizationFormComponent />} />} />
        <Route
          path={routesName.organizationFormEditId}
          element={<GuardModule element={<ShowOrganizationFormComponent />} />}
        />
        <Route
          path={routesName.organizationFormDataId}
          element={<GuardModule element={<DataOrganizationFormComponent />} />}
        />
        <Route
          path={routesName.organizationFormDisabled}
          element={<GuardModule element={<DisabledOrganizationFormComponent />} />}
        />
        <Route
          path={routesName.organizationFormResponse}
          element={<GuardModule element={<ResponseFormComponent />} />}
        />
        <Route path={routesName.credential} element={<GuardModule element={<CredentialPage />} />} />
        <Route path={routesName.credentialId} element={<GuardModule element={<CredentialIdPage />} />} />
        <Route path={routesName.issuedCredentials} element={<GuardModule element={<IssuedCredentialsPage />} />} />
        <Route
          path={routesName.subjectCredentials}
          element={<GuardModule element={<SubjectIssuedCredentialsPage />} />}
        />
        <Route path={routesName.shareCredentials} element={<GuardModule element={<ShareCredentialsPage />} />} />
        <Route
          path={routesName.shareCredentialsSelection}
          element={<GuardModule element={<ShareCredentialsSelectionPage />} />}
        />
        <Route path={routesName.defaultCredentialsId} element={<GuardModule element={<DefaultCredentialPage />} />} />
        <Route
          path={routesName.predeterminedCredentialsId}
          element={<GuardModule element={<PredeterminedCredentialPage />} />}
        />
        <Route path={routesName.formCredentialsId} element={<GuardModule element={<FormCredentialPage />} />} />

        <Route
          path={routesName.organizationProfile}
          element={<GuardModule element={<OrganizationProfileComponent />} />}
        />
        <Route path={routesName.clothes} element={<GuardModule element={<ClothesComponent />} />} />
        <Route path={routesName.panels} element={<GuardModule element={<PanelsComponent />} />} />
        <Route path={routesName.yarns} element={<GuardModule element={<YarnsComponent />} />} />
        <Route path={routesName.compositionView} element={<GuardModule element={<CompositionViewComponent />} />} />
        <Route path={routesName.clothesId} element={<GuardModule element={<ShowClothesComponent />} />} />

        <Route path={routesName.clothesFileListLoaded} element={<GuardModule element={<ClothesFileListLoaded />} />} />
        <Route
          path={routesName.showMassiveLoadClothes}
          element={<GuardModule element={<ClothesMassiveLoadShowComponent />} />}
          // key="show_massive_load_profit"
        />
        <Route
          path={routesName.showMassiveLoadYarns}
          element={<GuardModule element={<YarnsMassiveLoadShowComponent />} />}
          // key="show_massive_load_profit"
        />
        <Route
          path={routesName.showMassiveLoadPanels}
          element={<GuardModule element={<PanelsMassiveLoadShowComponent />} />}
          // key="show_massive_load_profit"
        />

        <Route path="*" element={<GuardModule element={<Navigate to={routesName.dashboard} />} />} />
      </Routes>
    </Suspense>
  </Layout>
);

const Router = () => {
  const { auth }: any = useSelector((state: any) => state);
  return (
    <Root>
      <Routes>
        <Route path="/" element={auth.isLoggedIn ? <Navigate to={routesName.dashboard} /> : <LogIn />} />
        <Route
          path="/terminos_y_condiciones"
          element={auth.isLoggedIn ? <Navigate to={routesName.dashboard} /> : <TermsAndConditionsPage />}
        />
        <Route path="/*" element={<GuardModule element={<WrappedRoutes />} />} />
      </Routes>
    </Root>
  );
};

export default React.memo(Router);
