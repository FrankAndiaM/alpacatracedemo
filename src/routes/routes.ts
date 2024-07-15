import { HOST_URL } from '~config/environment';

export const moduleRoute = {
  dashboard: {
    path: '/dashboard',
    module_name: 'dashboard',
    module_code: 'dc7161be3dbf2250c8954e560cc35060',
    text: 'Home',
    icon: 'home'
  },
  farmers: {
    path: '/dashboard/farmers',
    module_name: 'farmers',
    module_code: '18fa3b09cc4b1e9819621b16ab9cebeb',
    text: 'Productores',
    icon: 'person',
    submodule: [
      {
        path: '/dashboard/resumen_archivos',
        module_name: '',
        module_code: '',
        text: 'Resumen de archivos',
        icon: ''
      },
      {
        path: '/dashboard/farmer-record',
        module_name: '',
        module_code: '',
        text: 'Resumen de archivos',
        icon: ''
      }
    ]
  },
  flows: {
    path: '/dashboard/flows',
    module_name: 'organization_forms',
    module_code: 'f37bd2f66651e7d46f6d38440f2bc7wa',
    text: 'Panel Flow',
    icon: 'device_hub',
    submodule: [
      {
        path: '/dashboard/flows/event',
        module_name: '',
        module_code: '',
        text: 'Eventos',
        icon: ''
      },
      {
        path: '/dashboard/flows/response',
        module_name: '',
        module_code: '',
        text: 'Respuesta de Formularios',
        icon: ''
      },
      {
        path: '/dashboard/flows/archived',
        module_name: '',
        module_code: '',
        text: 'Formularios archivados',
        icon: ''
      }
    ]
  },
  dividir1: {
    divider: true
  },
  agro_leader: {
    path: '/dashboard/farm_agent',
    module_name: 'agro_leader',
    module_code: '18fa3b09cc4b1e9819621b16ab9ceeee',
    text: 'Agente de Campo',
    icon: 'group'
  },
  digital_identity_credentials_file: {
    path: '/dashboard/digital_identity/credentials/files',
    module_name: 'digital_identity',
    module_code: '18fa3b09cc4b1e9819621b16ab9cebeb',
    text: 'Certificados',
    icon: 'payment'
  },
  verify_credential: {
    path: '/dashboard/verify_credentials',
    module_name: 'verify_credential',
    module_code: '18fa3b09cc4b1e98196',
    text: 'Credenciales por verificar',
    icon: 'payment_sharp'
  },
  organizationForm: {
    path: '/dashboard/organization_form'
  },
  notifications: {
    path: '/dashboard/notifications'
  },
  clothes: {
    path: '/dashboard/clothes'
  },
  panels: {
    path: '/dashboard/panels'
  },
  yarns: {
    path: '/dashboard/yarns'
  }
};

export default {
  // -- Endpoint-- //
  login: HOST_URL + '/',
  recoveryPassword: HOST_URL + '/recovery-password',

  //Dashboard
  dashboard: HOST_URL + moduleRoute.dashboard.path,

  //Farmer
  farmers: HOST_URL + moduleRoute.farmers.path,
  farmerId: HOST_URL + moduleRoute.farmers.path + '/:farmer_id',

  //ficha del productor
  farmerRedcord: HOST_URL + moduleRoute.farmers.submodule[1].path,

  // farmers files loaded
  farmersFileListLoaded: HOST_URL + '/dashboard/file_summary',
  farmersListLoaded: HOST_URL + '/dashboard/file_summary/:file_loaded_id',

  //farmers files loaded profile
  farmersFileListLoadedProfile: HOST_URL + '/dashboard/file_summary_profile',
  farmersListLoadedProfile: HOST_URL + '/dashboard/file_summary_profile/:file_loaded_id',

  //farmers files loaded productive units
  farmersFileListLoadedProductiveUnits: HOST_URL + '/dashboard/file_summary_productive',
  farmersListLoadedProductiveUnits: HOST_URL + '/dashboard/file_summary_productive/:file_loaded_id',

  //Credentials files loaded
  digitalIdentityCredentialsFiles: HOST_URL + moduleRoute.digital_identity_credentials_file.path,
  digitalIdentityCredentialsShowFilesRecords:
    HOST_URL + `${moduleRoute.digital_identity_credentials_file.path}/:file_loaded_id`,

  // Agro Leader
  agroLeader: HOST_URL + moduleRoute.agro_leader.path,
  disabledAgroLeader: HOST_URL + '/dashboard/agentes_eliminados',
  agroLeaderId: HOST_URL + moduleRoute.agro_leader.path + '/:agro_leader_id',

  // verify credentials
  verifyCredential: HOST_URL + moduleRoute.verify_credential.path,
  verifyCredentialId: HOST_URL + moduleRoute.verify_credential.path + '/:credential_id',

  organizationForm: HOST_URL + moduleRoute.organizationForm.path,
  organizationFormDisabled: HOST_URL + '/dashboard/organization_form_delete',
  organizationFormResponse: HOST_URL + '/dashboard/response_form',
  organizationFormEditId: HOST_URL + moduleRoute.organizationForm.path + '/:organization_form_id',
  organizationFormDataId: HOST_URL + moduleRoute.organizationForm.path + '/:organization_form_id/data',
  organizationFormMapSelection: HOST_URL + '/dashboard/map_selection',

  credential: HOST_URL + '/dashboard/certificados',
  credentialId: HOST_URL + '/dashboard/certificados/:credential_id',
  issuedCredentials: HOST_URL + '/dashboard/certificados_emitidos',
  subjectCredentials: HOST_URL + '/dashboard/certificados_recibidos',

  shareCredentials: HOST_URL + '/dashboard/compartir_certificados',
  shareCredentialsSelection: HOST_URL + '/dashboard/compartir_certificados/seleccionar',

  defaultCredentials: HOST_URL + '/dashboard/certificados_atributos_fijos',
  defaultCredentialsId: HOST_URL + '/dashboard/certificados_atributos_fijos/:credential_id',
  predeterminedCredentials: HOST_URL + '/dashboard/certificados_valores_fijos',
  predeterminedCredentialsId: HOST_URL + '/dashboard/certificados_valores_fijos/:credential_id',
  formCredentials: HOST_URL + '/dashboard/certificados_de_formularios',
  formCredentialsId: HOST_URL + '/dashboard/certificados_de_formularios/:credential_id',

  moreServices: HOST_URL + '/dashboard/mis_asesorias',
  organizationProfile: HOST_URL + '/dashboard/organization/profile',

  //Notifiaciones
  notification: HOST_URL + moduleRoute.notifications.path,
  notificationId: HOST_URL + moduleRoute.notifications.path + '/:notification_id',

  directoryReuqests: HOST_URL + '/dashboard/directory_requests',

  //flows
  flow: HOST_URL + moduleRoute.flows.path,
  flowCampaignId: HOST_URL + moduleRoute.flows.path + '/:flowId/campaign',
  flowCampaignIdData: HOST_URL + moduleRoute.flows.path + '/:flowId/campaign/:campaignId',

  flowDraw: HOST_URL + '/flow/draw',
  flowDrawId: HOST_URL + '/flow/draw/:flowId',

  flowResponse: HOST_URL + moduleRoute.flows.path + '/response',
  flowArchived: HOST_URL + moduleRoute.flows.path + '/archived',
  flowEvent: HOST_URL + moduleRoute.flows.path + '/event',

  profit: HOST_URL + '/dashboard/profit',
  producerProfit: HOST_URL + '/dashboard/profit/:producer_id',
  massiveLoadProfit: HOST_URL + '/dashboard/profit_massive_load',
  showMassiveLoadProfit: HOST_URL + '/dashboard/profit_massive_load/:file_loaded_id',

  massiveLoadClothes: HOST_URL + '/dashboard/clothes_massive_load',
  showMassiveLoadClothes: HOST_URL + '/dashboard/clothes_massive_load/:file_loaded_id',
  massiveLoadYarns: HOST_URL + '/dashboard/yarns_massive_load',
  showMassiveLoadYarns: HOST_URL + '/dashboard/yarns_massive_load/:file_loaded_id',
  massiveLoadPanels: HOST_URL + '/dashboard/panels_massive_load',
  showMassiveLoadPanels: HOST_URL + '/dashboard/panels_massive_load/:file_loaded_id',

  //prendas
  clothes: HOST_URL + moduleRoute.clothes.path,
  panels: HOST_URL + moduleRoute.panels.path,
  yarns: HOST_URL + moduleRoute.yarns.path,
  compositionView: HOST_URL + '/dashboard/composition/:id/:type',
  clothesId: HOST_URL + moduleRoute.clothes.path + '/:farmer_id',
  // clothes files loaded
  clothesFileListLoaded: HOST_URL + '/dashboard/clothes_massive_load',
  clothesListLoaded: HOST_URL + '/dashboard/clothes_massive_load/:file_loaded_id',

  //clothes files loaded profile
  clothesFileListLoadedYarns: HOST_URL + '/dashboard/file_summary_yarns',
  clothesListLoadedYarns: HOST_URL + '/dashboard/file_summary_yarns/:file_loaded_id',

  //clothes files loaded productive units
  clothesFileListLoadedPanels: HOST_URL + '/dashboard/file_summary_panels',
  clothesListLoadedPanels: HOST_URL + '/dashboard/file_summary_panels/:file_loaded_id'
};
