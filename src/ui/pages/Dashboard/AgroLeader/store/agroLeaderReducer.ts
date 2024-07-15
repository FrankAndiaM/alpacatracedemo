import { AgroLeader } from '~models/agroLeader';
import { Farmer } from '~models/farmer';
import { SET_AGRO_LEADER, SET_ASSIGN_FARMERS } from './agroLeaderConstants';

export type agroLeaderStoreType = { agroLeader?: AgroLeader; assignedFarmers: Farmer[] };

const initialStore: agroLeaderStoreType = {
  agroLeader: undefined,
  assignedFarmers: []
};

export default function (state: agroLeaderStoreType = initialStore, action: any) {
  switch (action.type) {
    case SET_AGRO_LEADER: {
      return {
        ...state,
        agroLeader: { ...action.payload }
      };
    }
    case SET_ASSIGN_FARMERS: {
      return {
        ...state,
        assignedFarmers: action.payload
      };
    }
    default:
      return state;
  }
}

export { initialStore };
