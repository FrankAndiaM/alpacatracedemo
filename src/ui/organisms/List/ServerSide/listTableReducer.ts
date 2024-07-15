import { TableHeadProps } from '~molecules/TableHead/TableHead';

export type InitialValuesType = {
  items: any[];
  totalItems: number;
  search: string;
  orderBy: string;
  order: TableHeadProps['order'];
  page: number;
  totalPages: number;
  auxPage: number;
  perPage: number;
  isLoading: boolean;
};

export const initialState: InitialValuesType = {
  items: [],
  isLoading: false,
  totalItems: 0,
  search: '',
  orderBy: '',
  order: undefined,
  page: 1,
  totalPages: 1,
  auxPage: 0,
  perPage: 1500
};

export const listReducer = (state: InitialValuesType, action: any): InitialValuesType => {
  const { type, payload } = action;
  switch (type) {
    case 'setItems': {
      return { ...state, items: [...payload.items], totalItems: payload.total, totalPages: payload.totalPages };
    }
    case 'setSearch': {
      return { ...state, search: payload.search };
    }
    case 'setPage': {
      return { ...state, page: payload.page, auxPage: payload.auxPage };
    }
    case 'setOrder': {
      return { ...state, orderBy: payload.orderBy, order: payload.order };
    }
    case 'setPerPage': {
      return { ...state, perPage: payload.perPage };
    }
    case 'setIsLoading': {
      return { ...state, isLoading: payload.isLoading };
    }
    default:
      return state;
  }
};
