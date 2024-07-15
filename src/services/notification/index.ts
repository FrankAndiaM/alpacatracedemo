import apiClient from '../api_communication_form';

/**
 * * Notification sms
 * @returns
 */
function getPaginateNotification(page: number, per_page: number, sort_by: string, order: string, search: string) {
  return apiClient.get(
    `/notificative?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

/**
 * * Notification sms
 * @returns
 */
function getPaginateNotificationFarmers(
  notificationId: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  return apiClient.get(
    `/notificative/${notificationId}/farmers?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

/**
 * * Notification status
 * @returns
 */
function geNotificationStatusById(notificationId: string) {
  return apiClient.get(`/notificative/${notificationId}/status`);
}

/**
 * * Notification sms
 * @returns
 */
function geNotificationById(notificationId: string) {
  return apiClient.get(`/notificative/${notificationId}`);
}

/**
 * * Notification sms
 * @param data
 * @returns
 */
function notificationSms(data: any) {
  return apiClient.post('/notificative/action/sms', data);
}

/**
 * * Notification templates
 * @returns
 */
function getTemplates() {
  return apiClient.get('/notificative/templates');
}

/**
 * * Notification sms
 * @param data
 * @returns
 */
function notificationWsp(data: any) {
  return apiClient.post('/notificative/action/wsp', data);
}

/**
 * * Notification sms
 * @param data
 * @returns
 */
function notificationCall(data: any) {
  return apiClient.post('/notificative/action/call', data);
}
/**
 * * Notification wsp
 * @param data
 * @returns
 */
function updateNotificationWsp(notification_id: string, data: any) {
  return apiClient.put(`/notificative/action/wsp/${notification_id}`, data);
}

/**
 * * Notification sms
 * @param data
 * @returns
 */
function updateNotificationSms(notification_id: string, data: any) {
  return apiClient.put(`/notificative/action/sms/${notification_id}`, data);
}

function getFarmersNotification(notification_id: string) {
  return apiClient.get(`/notificative/${notification_id}/select_farmers`);
}

export {
  notificationSms,
  notificationWsp,
  notificationCall,
  getPaginateNotification,
  getPaginateNotificationFarmers,
  geNotificationById,
  geNotificationStatusById,
  getTemplates,
  getFarmersNotification,
  updateNotificationWsp,
  updateNotificationSms
};
