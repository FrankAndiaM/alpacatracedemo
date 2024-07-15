export type InitialValuesType = {
  items: any[];
  totalItems: number;
  totalPages: number;
  search: string;
  page: number;
  isLoading: boolean;
};

export const initialState: InitialValuesType = {
  items: [],
  isLoading: false,
  totalPages: 0,
  totalItems: 0,
  search: '',
  page: 1
};

export const dataReducer = (state: InitialValuesType, action: any): InitialValuesType => {
  const { type, payload } = action;
  switch (type) {
    case 'setItems': {
      return {
        ...state,
        items: [...state.items, ...payload.items],
        totalItems: payload.total,
        totalPages: payload.totalPages
      };
    }
    case 'setSearch': {
      return { ...state, page: 1, search: payload.search, items: [], totalItems: 0, totalPages: 0, isLoading: true };
    }
    case 'setPage': {
      if (payload.page > state.totalPages) return state;
      return { ...state, page: payload.page };
    }
    case 'setIsLoading': {
      return { ...state, isLoading: payload.isLoading };
    }
    default:
      return state;
  }
};
