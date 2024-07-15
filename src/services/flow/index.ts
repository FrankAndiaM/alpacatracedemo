import apiClient from '../apiSuite';
import apiClientOutgoing from '../api_flow_outgoing';
import apiTemplate from '../api_template_flow';

// const relativeRoute = '/communication';
//flows
function getPaginateFlows(
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  status: string,
  channel_name: string,
  filters?: any
) {
  let url = `/communication/flow?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}&status=${status}&channel_name=${channel_name}`;

  if (filters?.date_init) {
    url = url.concat(`&date_init=${filters.date_init}`);
  }
  if (filters?.date_end) {
    url = url.concat(`&date_end=${filters.date_end}`);
  }
  if (filters?.date_str) {
    url = url.concat(`&date_str=${filters.date_str}`);
  }

  return apiClient.get(url);
}

function createFlow(data: any) {
  return apiClient.post('/communication/flow', data);
}

function updateFlow(id: string, data: any) {
  return apiClient.put(`/communication/flow/${id}`, data);
}

function duplicateFlow(id: string) {
  return apiClient.post(`/communication/flow/duplicate/${id}`, {});
}

function archivedFlow(id: string, status: 'archived' | 'unarchived') {
  return apiClient.put(`/communication/flow/is_archived/${id}?status=${status}`, {});
}

function getFlowById(id: string) {
  return apiClient.get(`/communication/flow/${id}`);
}

function deleteFlow(id: string) {
  return apiClient.delete(`/communication/flow/${id}`);
}

function saveChangesFlow(id: string, data: any) {
  return apiClient.patch(`/communication/flow/${id}`, data);
}

function getFlowTemplatesWsp() {
  return apiClient.get('/communication/flow/template_wsp/select?service_api=tele_assistance');
}

//action tools
function getActionToolsByCategory(channel_name: string) {
  let channel = 'wsp';
  if (channel_name === 'channel_call') channel = 'call';

  return apiClient.get(`/communication/flow/action_tool/category?channel=${channel}`);
}

//media
function getMedias() {
  return apiClient.get('/communication/flow/medias');
}

function registerMedia(data: any) {
  return apiClient.post('/communication/flow/medias', data);
}

//activators
function getPaginateActivators(page: number, per_page: number, sort_by: string, order: string, search: string) {
  return apiClient.get(
    `/communication/flow/activators?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}
function createActivator(data: any) {
  return apiClient.post('/communication/flow/activators', data);
}
function getActivatorsSelect(channel_name: string) {
  return apiClient.get(`/communication/flow/activators/select/${channel_name}`);
}
function getActivatorsSelect2(channel_name: string) {
  return apiClient.get(`/communication/flow/activators/${channel_name}/select`);
}

function assignFlowActivator(activatorId: string, data: any) {
  return apiClient.patch(`/communication/flow/activators/${activatorId}/flow`, data);
}
function updateFlowActivator(activatorId: string, data: any) {
  return apiClient.put(`/communication/flow/activators/${activatorId}`, data);
}

function deleteActivator(id: string) {
  return apiClient.delete(`/communication/flow/activators/${id}`);
}

//operators
function getOperatorsSelect() {
  return apiClient.get('/communication/flow/operators/select');
}

function createCallOutgoing(data: any) {
  return apiClientOutgoing.post('/call/outgoing', data);
}
function createWspOutgoing(data: any) {
  return apiClientOutgoing.post('/wsp/outgoing', data);
}

//interactions
/**
 * * Obtiene todas las tele asistencias
 */

function paginateInteractionsByStatus(
  status_name: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  campaign_id?: string,
  filters?: any
) {
  let url = `/communication/flow/interaction/by_status/${status_name}?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`;
  if (filters?.date_init) {
    url = url.concat(`&date_init=${filters.date_init}`);
  }
  if (filters?.date_end) {
    url = url.concat(`&date_end=${filters.date_end}`);
  }
  if (filters?.date_str) {
    url = url.concat(`&date_str=${filters.date_str}`);
  }
  if (campaign_id) {
    url = url.concat(`&campaign_id=${campaign_id}`);
  }

  return apiClient.get(url);
}

function getInteraction(teleAssistanceId: string) {
  return apiClient.get(`/communication/flow/interaction/${teleAssistanceId}`);
}

function getInteractionStatus() {
  return apiClient.get('/communication/flow/interaction/status');
}

function getCampaigns(flow_id: string, page: number, per_page: number, sort_by: string, order: string, search: string) {
  return apiClient.get(
    `/communication/flow/interaction/campaign?flow_id=${flow_id}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

function downloadCampaignFlow(campaign_id: string) {
  return apiClient.get(`/communication/flow/interaction/campaign/${campaign_id}`);
}

function updateInteractionStatus(teleAssistanceId: string, data: any) {
  return apiClient.patch(`/communication/flow/interaction/${teleAssistanceId}`, data);
}

//templates
function getApiTemplateData(route: string) {
  return apiTemplate.get(`${route}`);
}

function getApiTemplateSchema(route: string, value_id: string) {
  return apiTemplate.post(`${route}`, { value_id: value_id });
}

export {
  updateFlow,
  downloadCampaignFlow,
  getCampaigns,
  archivedFlow,
  duplicateFlow,
  createCallOutgoing,
  getActivatorsSelect,
  getPaginateFlows,
  createFlow,
  getFlowById,
  deleteFlow,
  getActionToolsByCategory,
  getMedias,
  registerMedia,
  getPaginateActivators,
  getOperatorsSelect,
  saveChangesFlow,
  assignFlowActivator,
  paginateInteractionsByStatus,
  getInteraction,
  getInteractionStatus,
  updateInteractionStatus,
  getActivatorsSelect2,
  getFlowTemplatesWsp,
  createWspOutgoing,
  createActivator,
  updateFlowActivator,
  deleteActivator,
  getApiTemplateData,
  getApiTemplateSchema
};
