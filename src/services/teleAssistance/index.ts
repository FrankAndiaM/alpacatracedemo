import apiClient from '../api_tele_assistance';
import apiClientF from '../api_tele_assistance_form';

/**
 * * Obtiene todas las tele asistencias
 */

function paginateTeleAssistancesByStatus(
  status_name: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  return apiClient.get(
    `/tele_assistances/status/${status_name}?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

function paginateTeleAssistanceFromProducer(
  person_id: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  return apiClient.get(
    `/tele_assistances/producer/${person_id}?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

function paginateTeleAssistanceFromAdvisor(
  person_id: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  return apiClient.get(
    `/tele_assistances/advisor/${person_id}?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

function getTeleAssistanceStatus() {
  return apiClient.get('/tele_assistances/status');
}

function getTeleAssistanceTemplate(channel: string) {
  return apiClient.get(`/tele_assistances/templates?channel_name=${channel}`);
}

//funciona para wssp
function createTeleAssistanceOutgoing(data: any) {
  return apiClientF.post('/tele_assistances/outgoing/wsp', data);
}

function createTeleAssistanceOutgoingCall(data: any) {
  return apiClientF.post('/tele_assistances/outgoing/call', data);
}

function updateTeleAssistanceStatus(teleAssistanceId: string, data: any) {
  return apiClient.patch(`/tele_assistances/${teleAssistanceId}/status`, data);
}

function assignedAdvisorTeleAssistance(teleAssistanceId: string, data: any) {
  return apiClient.put(`/tele_assistances/${teleAssistanceId}`, data);
}

function getTeleAssistance(teleAssistanceId: string) {
  return apiClient.get(`/tele_assistances/${teleAssistanceId}`);
}

// Interaction
function createInteraction(data: any) {
  return apiClient.post('/tele_assistances/interactions', data);
}

function createInteractionMessageIntermediary(data: any) {
  return apiClientF.post('/tele_assistances/interactions/messages/community/intermediary', data);
}
export {
  paginateTeleAssistanceFromAdvisor,
  paginateTeleAssistanceFromProducer,
  getTeleAssistance,
  paginateTeleAssistancesByStatus,
  assignedAdvisorTeleAssistance,
  updateTeleAssistanceStatus,
  getTeleAssistanceStatus,
  createInteraction,
  createInteractionMessageIntermediary,
  getTeleAssistanceTemplate,
  createTeleAssistanceOutgoing,
  createTeleAssistanceOutgoingCall
};
