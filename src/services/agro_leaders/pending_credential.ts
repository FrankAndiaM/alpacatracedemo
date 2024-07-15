import apiClient from '../digitalIdentityApi';

function listAllPendingCredentials() {
  return apiClient.get('/organizations/digital_identity/agro_leader/credentials');
}

function getPendingCredential(id: string) {
  return apiClient.get(`/organizations/digital_identity/agro_leader/credentials/${id}`);
}

function issuePendingCredential(id: string) {
  return apiClient.post(`/organizations/digital_identity/agro_leader/credentials/${id}/issue_credential`, {});
}

function rejectPendingCredential(id: string, data: any) {
  return apiClient.post(`/organizations/digital_identity/agro_leader/credentials/${id}/reject_credential`, data);
}

export { listAllPendingCredentials, getPendingCredential, issuePendingCredential, rejectPendingCredential };
