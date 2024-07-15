import { OrganizationFormAttribute } from './organizationFormAttribute';
import { OrganizationFormData } from './organizationFormData';

export type FilterForms = {
  form_type?: string; //str = Body("all", enum=["all", "completed", "incompleted"]),
  status?: string; //str = Body("all", enum=["all", "completed", "incompleted"]),
  owner_model_id?: string; //Optional[List[str]] = Body([]),
  archived_at?: boolean; //Optional[str] = Body(None),
  is_active?: boolean; //Optional[str] = Body(None),
  date_init?: string; //Optional[str] = Body(None),
  date_end?: string; //Optional[str] = Body(None),
  date_str?: string; //str = Body("all", enum=["all", "day_last", "week_last", "month_last"]),
  search?: string;
};
export type FilterDataForms = {
  //  search_type : Literal["all", "form", "agent", "producer"] = Query("all"),
  //                form_type: Literal["PRODUCER", "PRODUCTIVE_UNIT", "FREE", "ALL"] = Query("ALL"),
  //                date_init : Optional[str] = Query(None),
  //                gather_form_id: UUID4 = None,
  //                date_end : Optional[str] = Query(None),
  //                date_str : Literal["all", "day_last", "week_last", "month_last"] = Query("all"),
  //                status : Literal["ALL", "COMPLETED", "PENDING", "UNFINISHED"] = Query("ALL")):
  search_type?: string;
  form_type?: string;
  date_init?: string;
  date_end?: string;
  date_str?: string;
  status?: string;
  owner_model_id?: string;
  search?: string;
};

export type OrganizationForm = {
  id?: string;
  name: string;
  // display_name: string;
  description?: string;
  // form_type?: string;
  category?: string;
  entry_entity_type?: 'PRODUCER' | 'PRODUCTIVE_UNIT' | 'FREE';
  is_editable?: boolean;
  gather_form_category_id?: string;
  schema?: {
    data: OrganizationFormAttribute[];
  };
  schema_version?: number;
  owner_model_id?: string;
  owner_model_type?: string;
  organization_form_attributes?: OrganizationFormAttribute[];
  organization_forms_data?: OrganizationFormData[];
  gather_forms_data?: OrganizationFormData[];
  created_at?: Date;
  updated_at?: Date;
  disabled_at?: Date;
  archived_at?: Date;
};
