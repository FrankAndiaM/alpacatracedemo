import { SystemTable, SystemTableDefault } from './systemTable';

export type Notification = {
  id: string;
  message: string;
  quantity_failed: number;
  quantity_realized: number;
  path_archive?: string;
  media_comunication_type: SystemTable;
  zones: SystemTable[];
  crops: SystemTable[];
  associations: SystemTable[];
  packing_facilities: SystemTable[];
  organizations?: any[];
  send_at?: string;
  template_wsp_id?: string;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export const NotificationDefault: Notification = {
  id: '',
  message: '',
  quantity_failed: 0,
  quantity_realized: 0,
  path_archive: '',
  media_comunication_type: SystemTableDefault,
  zones: [],
  crops: [],
  associations: [],
  packing_facilities: [],
  created_at: '',
  updated_at: '',
  disabled_at: ''
};
