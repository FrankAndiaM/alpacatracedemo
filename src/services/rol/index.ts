import apiClient from '../api';

function getRolMe() {
  return apiClient.get('/agro_admins/me/roles');
}

export { getRolMe };
