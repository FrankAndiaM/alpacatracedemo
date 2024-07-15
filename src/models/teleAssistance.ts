import { SystemTableDefault } from './systemTable';

export type Channel = {
  id?: string;
  name?: string;
  description?: string;
};

export type TeleAssistanceStatus = {
  id?: string;
  name?: string;
  description?: string;
};

export type NotificationStatus = {
  id: string;
  display_name: string;
  description?: string;
};

export type SubFlow = {
  id: string;
  name: string;
  description?: string;
  emoji: string;
};

export type InstructionFlowNow = {
  id: string;
  subflow?: SubFlow;
};

export type Person = {
  id: string;
  full_name: string;
  phone: string;
  whatsapp_number: string;
  dni: string;
};

export type TeleAssistance = {
  id: string;
  phone?: string;
  tele_assistance_status: TeleAssistanceStatus;
  channel: Channel;
  person: Person;
  person_type: string;
  advisor_person: Person;
  advisor_person_type: string;
  instruction_flow_now: InstructionFlowNow;
  direction?: string;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type MessageInteraction = {
  id: string;
  type_message?: string;
  type_value?: string;
  value?: string;
  is_recommendation: boolean;
  is_visible: boolean;
  module?: string;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type InputEvent = {
  value: string;
  type_event: string;
};

export type VoiceInteraction = {
  id: string;
  input_event: InputEvent[];
  type_event?: string;
  duration: number;
  is_recommendation: boolean;
  is_visible: boolean;
  direction_event?: string;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type CommunicationInteraction = {
  id: string;
  channel?: Channel;
  voice_interaction?: VoiceInteraction[];
  message_interaction?: MessageInteraction[];
  notification_status?: NotificationStatus;
  user?: Person;
  direction: string;
  from_phone: string;
  to_phone: string;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type TeleAssistanceShow = {
  id: string;
  type_flow: string;
  direction: string;
  qualification: number;
  channel: Channel;
  person: Person;
  person_type: string;
  tele_assistance_status: TeleAssistanceStatus;
  advisor_person?: Person;
  advisor_person_type?: string;
  instruction_flow_now: InstructionFlowNow;
  communication_interaction: CommunicationInteraction[];
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

// -------------------------------------------------------

export const InstructionFlowNowDefault: InstructionFlowNow = {
  id: '-1'
};

export const PersonDfault: Person = {
  id: '-1',
  full_name: '',
  phone: '',
  whatsapp_number: '',
  dni: ''
};

export const TeleAssistanceDefault: TeleAssistanceShow = {
  id: '-1',
  type_flow: '',
  direction: '',
  qualification: 0,
  channel: SystemTableDefault,
  person: PersonDfault,
  person_type: '',
  tele_assistance_status: SystemTableDefault,
  instruction_flow_now: InstructionFlowNowDefault,
  communication_interaction: [],
  created_at: '',
  updated_at: '',
  disabled_at: ''
};

//INTERACTIONS

export type Components = {
  body?: string;
  url?: any;
  mime_type?: any;
  latitude?: any;
  longitude?: any;
  location_addres?: any;
  location_name?: any;
  template_name?: string;
  language?: string;
  components?: Component[];
  buttons?: any;
  type_header?: any;
  footer?: any;
  header?: any;
  sections?: any;
  button?: any;
  title?: any;
  description?: any;
  id?: any;
};

export type Component = {
  type?: string;
  parameters?: any[];
};

export type CommunicationMessageFlow = {
  id: string;
  duration: string;
  direction: string;
  type_value: string;
  value: string;
  components?: Components;
  created_at: string;
};

export type CommunicationInteractionFlow = {
  id: string;
  channel_name: string;
  communication_messages: CommunicationMessageFlow[];
  direction: string;
  from_number: string;
  to_number: string;
  created_at: string;
  updated_at: string;
};

export type InteractionSessionStatus = {
  id: string;
  name: string;
  description: string;
};

type Flow = {
  id: string;
  name?: string;
  description?: string;
  channel_name: string;
  created_at: string;
  updated_at: string;
};


export type Interaction = {
  id: string;
  direction: string;
  flow?: Flow;
  channel_name: string;
  person: Person;
  person_type: string;
  interaction_session_status: InteractionSessionStatus;
  communication_interactions: CommunicationInteractionFlow[];
  created_at: string;
  updated_at: string;
  disabled_at: string;
  phone: string;
};

export const interactionDefault: Interaction = {
  id: '-1',
  direction: '',
  channel_name: '',
  person: PersonDfault,
  person_type: '',
  interaction_session_status: {
    id: '',
    name: '',
    description: ''
  },
  communication_interactions: [],
  created_at: '',
  updated_at: '',
  disabled_at: '',
  phone: ''
};
