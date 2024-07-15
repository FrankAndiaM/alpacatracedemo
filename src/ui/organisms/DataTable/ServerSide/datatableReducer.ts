import { TableHeadProps } from '~molecules/TableHead/TableHead';

export type InitialValuesType = {
  items: any[];
  totalItems: number;
  search: string;
  orderBy: string;
  order: TableHeadProps['order'];
  page: number;
  auxPage: number;
  perPage: number;
  rowsPerPage: number;
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
  auxPage: 0,
  perPage: 10,
  rowsPerPage: 10
};

export const dataTableReducer = (state: InitialValuesType, action: any): InitialValuesType => {
  const { type, payload } = action;
  switch (type) {
    case 'setItems': {
      return { ...state, items: [...payload.items], totalItems: payload.total };
    }
    case 'setSearch': {
      return { ...state, page: 1, auxPage: 0, search: payload.search };
    }
    case 'setPage': {
      return { ...state, page: payload.page, auxPage: payload.auxPage };
    }
    case 'setOrder': {
      return { ...state, orderBy: payload.orderBy, order: payload.order };
    }
    case 'setPerPage': {
      return { ...state, perPage: payload.perPage, rowsPerPage: payload.perPage };
    }
    case 'setIsLoading': {
      return { ...state, isLoading: payload.isLoading };
    }
    default:
      return state;
  }
};
