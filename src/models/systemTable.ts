export type SystemTable = {
  id?: string;
  name: string;
  display_name: string;
  description: string;
  category?: string;
};

export const SystemTableDefault: SystemTable = {
  id: '-1',
  name: '',
  display_name: '',
  description: ''
};
