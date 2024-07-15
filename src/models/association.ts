export type Association = {
  id?: string;
  name: string;
  description: string;
  bucket_s3?: string;
  process_status_message_audio_path?: string;
  process_status_message_sms?: string;
};

export const AssociationDefault: Association = {
  id: '',
  name: '',
  description: '',
  bucket_s3: '',
  process_status_message_audio_path: '',
  process_status_message_sms: ''
};
