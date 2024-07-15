export type Tag = {
  id: string;
  display_name: string;
  description?: string;
};

export type TagUpdate = {
  tags: Tag[];
  category_tag_id: string;
};

export type CategoryTag = {
  id: string;
  display_name: string;
  description: string;
  color: string;
  is_principal?: boolean;
  tags: Tag[];
};

export type CategoryTagUpdate = {
  id: string;
  display_name: string;
  description: string;
  color: string;
};

// ---- Default ----------
export const TagDefault: Tag = {
  id: '-1',
  display_name: '',
  description: ''
};

export const CategoryTagDefault: CategoryTag = {
  id: '-1',
  display_name: '',
  description: '',
  color: '',
  is_principal: false,
  tags: []
};

export const CategoryTagUpdateDefault: CategoryTagUpdate = {
  id: '-1',
  display_name: '',
  description: '',
  color: ''
};

export const TagUpdateDefault: TagUpdate = {
  tags: [],
  category_tag_id: '-1'
};
