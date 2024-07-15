export type DataRequestTemplate = {
  message: string;
};

export type InstructionFlowInitTemplate = {
  id: string;
  data_request: DataRequestTemplate;
};

export type FlowTemplate = {
  id: string;
  description?: string;
};

export type FlowChannelTemplate = {
  id: string;
  flows: FlowTemplate;
  instructions: InstructionFlowInitTemplate;
  message_body?: any;
};

export type FormSubResponse = {
  name: string;
  value: string;
};

export type FormResponse = {
  updated_at: Date;
  person_full_name?: string | null;
  person_dni?: string | null;
  status: string;
  response: FormSubResponse[];
};

export type FormsCampaignResponse = {
  labels: string[];
  forms: FormResponse[];
};

// -------------------------------------------------------

export const DataRequestTemplateDefault: DataRequestTemplate = {
  message: ''
};

export const InstructionFlowInitTemplateDefault: InstructionFlowInitTemplate = {
  id: '-1',
  data_request: DataRequestTemplateDefault
};

export const FlowTemplateDfault: FlowTemplate = {
  id: '-1',
  description: ''
};

export const FlowChannelTemplateDefault: FlowChannelTemplate = {
  id: '-1',
  flows: FlowTemplateDfault,
  instructions: InstructionFlowInitTemplateDefault
};
