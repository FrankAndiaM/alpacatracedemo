import { Farmer, FarmerDefault } from './farmer';
import { SystemTable, SystemTableDefault } from './systemTable';

export type NotificationFarmers = {
  id: string;
  notification_status: SystemTable;
  farmer: Farmer;
  duration_recording_call?: number;
  price?: number;
  sent_at?: string;
  readed_at?: string;
  created_at: string;
  updated_at: string;
  disabled_at: string;
};

export const NotificationFarmersDefault: NotificationFarmers = {
  id: '-1',
  notification_status: SystemTableDefault,
  farmer: FarmerDefault,
  duration_recording_call: -1,
  price: -1,
  sent_at: '',
  readed_at: '',
  updated_at: '',
  disabled_at: '',
  created_at: ''
};
