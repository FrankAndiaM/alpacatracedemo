import apiClient from '../api_communication';
// eslint-disable-next-line

function callFarmer(data: { agro_adviser_id: string; farmer_id: string; tele_assistance_id?: string }) {
  return apiClient.post('/interactive/call/outgoing/initializer/user/advisor/connect', data);
}

export { callFarmer };
