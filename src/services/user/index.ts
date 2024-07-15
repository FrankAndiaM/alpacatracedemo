import apiClient from '../apiSuite';

function getUserData() {
  return apiClient.get('/users/me');
}

export { getUserData };
