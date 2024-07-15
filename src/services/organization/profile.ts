import apiClient from '../api';
import apiFormClient from '../apiform';

/**
 * * get a Organization profile
 */
function updateOrganizationProfile(data: any) {
  return apiFormClient.put('/organizations/profile', data);
}

/**
 * * patch a Organization visor config
 */
function updateOrganizationVisorTheme(data: any) {
  return apiFormClient.patch('/organizations/profile/theme/visor', data);
}

/**
 * * get a Organization profile
 */
function updateOrganizationTheme(display_name: string, is_enable: boolean) {
  const data = {
    theme: {
      global_names: {
        fabric_inventories: {
          display_name: display_name || 'Panel',
          is_enable: is_enable
        }
      }
    }
  };
  return apiClient.patch('/organizations/profile/theme', data);
}

/**
 * * Update Organization profile
 */
function getOrganizationProfile() {
  return apiClient.get('/organizations/profile');
}

/**
 * * Upload Organization files
 * @param {any} data
 */
function uploadOrganizationFiles(data: any) {
  return apiFormClient.post('/organizations/profile/files', data);
}

/**
 * * List all Organization files
 */
function listOrganizationFiles() {
  return apiClient.get('/organizations/profile/files');
}

/**
 * * Delete Organization files
 * @param {string} organizationFileId
 */
function deleteOrganizationFile(organizationFileId: string) {
  return apiFormClient.delete(`/organizations/profile/files/${organizationFileId}`);
}

export {
  getOrganizationProfile,
  updateOrganizationProfile,
  updateOrganizationTheme,
  updateOrganizationVisorTheme,
  uploadOrganizationFiles,
  listOrganizationFiles,
  deleteOrganizationFile
};
