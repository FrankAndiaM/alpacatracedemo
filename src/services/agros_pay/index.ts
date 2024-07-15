import apiClient from '../apiSuite';

function paginateTransactions(
  tenant_id: string,
  entity_model_id: string,
  entity_model_type: string,
  transaction_type: 'INCOME' | 'EXPENDITURES',
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  let path = `/ms_agros_pay/transactions?tenant_id=${tenant_id}&entity_model_id=${entity_model_id}&entity_model_type=${entity_model_type}&transaction_type=${transaction_type}`;
  path += `&page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`;

  return apiClient.get(path);
}

function getLastCurrentTransaction(
  tenant_id: string,
  entity_model_id: string,
  entity_model_type: string,
  transaction_type: 'INCOME' | 'EXPENDITURES',
  current_date: string
) {
  let path = `/ms_agros_pay/transactions/last_current_transaction?tenant_id=${tenant_id}&entity_model_id=${entity_model_id}`;
  path += `&entity_model_type=${entity_model_type}&transaction_type=${transaction_type}&current_date=${current_date}`;

  return apiClient.get(path);
}

export { paginateTransactions, getLastCurrentTransaction };
