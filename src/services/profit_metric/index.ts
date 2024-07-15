import apiClient from '../apiSuite';

function paginateProducers(
  organization_id: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  const path = `/ms_profit_metrics/producers?organization_id=${organization_id}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`;

  return apiClient.get(path);
}

function getProfitMetricsFull(
  organization_id: string,
  typeDateFilter: 'YEARLY' | 'MONTHLY' | 'UP_TO_DATE',
  producer_id?: string
) {
  let path = `/ms_profit_metrics/profit_metrics/full?organization_id=${organization_id}&type_date_filter=${typeDateFilter}`;
  if (producer_id) {
    path += `&producer_id=${producer_id}`;
  }
  return apiClient.get(path);
}

function getProfitMetrics(
  organization_id: string,
  typeDateFilter: 'YEARLY' | 'MONTHLY' | 'UP_TO_DATE',
  producer_id?: string
) {
  let path = `/ms_profit_metrics/profit_metrics?organization_id=${organization_id}&type_date_filter=${typeDateFilter}`;
  if (producer_id) {
    path += `&producer_id=${producer_id}`;
  }
  return apiClient.get(path);
}

function getInternalProfitMetrics(
  organization_id: string,
  typeDateFilter: 'YEARLY' | 'MONTHLY' | 'UP_TO_DATE',
  producer_id?: string
) {
  let path = `/ms_profit_metrics/profit_metrics/internal_profit?organization_id=${organization_id}&type_date_filter=${typeDateFilter}`;
  if (producer_id) {
    path += `&producer_id=${producer_id}`;
  }
  return apiClient.get(path);
}

function getExternalProfitMetrics(
  organization_id: string,
  typeDateFilter: 'YEARLY' | 'MONTHLY' | 'UP_TO_DATE',
  producer_id?: string
) {
  let path = `/ms_profit_metrics/profit_metrics/external_profit?organization_id=${organization_id}&type_date_filter=${typeDateFilter}`;
  if (producer_id) {
    path += `&producer_id=${producer_id}`;
  }
  return apiClient.get(path);
}

function getProfitMetricsTrend(
  organization_id: string,
  type_trend: 'POSITIVE' | 'NEGATIVE',
  typeDateFilter: 'YEARLY' | 'MONTHLY' | 'UP_TO_DATE'
) {
  const path = `/ms_profit_metrics/profit_metrics/profit_trend?organization_id=${organization_id}&type_trend=${type_trend}&type_date_filter=${typeDateFilter}`;

  return apiClient.get(path);
}
export {
  paginateProducers,
  getProfitMetrics,
  getInternalProfitMetrics,
  getExternalProfitMetrics,
  getProfitMetricsTrend,
  getProfitMetricsFull
};
