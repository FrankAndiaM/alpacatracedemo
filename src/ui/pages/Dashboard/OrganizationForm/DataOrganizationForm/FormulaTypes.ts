type OperationType = 'operator' | 'field' | 'number';

type Operation = {
  [key: string]: {
    id: number;
    display_name: string;
    type: OperationType;
  };
};

type ObjFormula = {
  value: string;
  type: OperationType;
  id?: string;
};

export type { Operation, OperationType, ObjFormula };
