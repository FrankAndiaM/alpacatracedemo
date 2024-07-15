export type Interaction = {
  id?: string;
  id_message_service?: string;
  media_communication_type?: string;
  communication_flow_id?: string;
  communication_flow_type?: string;
  direction?: string;
  duration?: string;
  error_code?: string;
  error_description?: string;
  from_phone?: string;
  from_user_type?: string;
  from_user_names?: string;
  from_user_id?: string;
  measurement_unit?: string;
  message?: string;
  notification_status?: string;
  notification_status_name?: string;
  price?: string;
  url_content?: string;
  service?: string;
  to_phone?: string;
  to_user_type?: string;
  to_user_names?: string;
  to_user_id?: string;
  to_user_data?: any;
  from_user_data?: any;
  created_at?: string;
  instructions?: any;
};

export const InteractionDefault: Interaction = {
  id: '',
  id_message_service: '',
  media_communication_type: '',
  communication_flow_id: '',
  communication_flow_type: '',
  direction: '',
  duration: '',
  error_code: '',
  error_description: '',
  from_phone: '',
  from_user_type: '',
  from_user_names: '',
  from_user_id: '',
  measurement_unit: '',
  message: '',
  notification_status: '',
  notification_status_name: '',
  price: '',
  url_content: '',
  service: '',
  to_phone: '',
  to_user_type: '',
  to_user_names: '',
  to_user_id: '',
  to_user_data: null,
  from_user_data: null,
  created_at: '',
  instructions: null
};
