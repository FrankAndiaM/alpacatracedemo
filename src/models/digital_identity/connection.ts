import { Farmer } from '../farmer';

export type Connection = {
  state: string;
  name: string;
  created_at?: string;
  farmer: Farmer;
};
