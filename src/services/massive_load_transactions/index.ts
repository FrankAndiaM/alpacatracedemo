import apiSuiteClient from '../apiSuite';
import apiSuiteClientForm from '../apiSuiteForm';

/**
 * * get path to download records with errors
 */
function downloadMassiveLoadTransactionErrorRecords(data: any) {
  return apiSuiteClient.post('massive_load_transactions/download_records_errors', data);
}

/**
 * * upload massive load producer
 */

function uploadMassiveLoadTransaction(data: any) {
  return apiSuiteClientForm.post('/massive_load_transactions/upload_file', data);
}

//=====carga masiva de información personal del productor
/**
 * * Pagina todos los archivos cargados de perfil de productor
 */
function paginateMassiveLoadTransaction(
  type: string,
  page: number,
  perPage: number,
  sortBy: string,
  order: string,
  search: string,
  organization_id: string
) {
  let url = `/massive_load_transactions/transactions?record_status=${type}&page=${page}&per_page=${perPage}&sort_by=${sortBy}`;
  url += `&order=${order}&search=${search}&organization_id=${organization_id}`;
  return apiSuiteClient.get(url);
}

/**
 * * Pagina todos los registros que se cargaron en el archivo - perfil del productor
 */
function paginateIndividualRegisterTransaction(
  massiveLoadProfileProducerId: string,
  page: number,
  perPage: number,
  sortBy: string,
  order: string,
  search: string,
  status: string,
  organization_id: string
) {
  let url = `massive_load_transactions/transactions/${massiveLoadProfileProducerId}/records?page=${page}&per_page=${perPage}`;
  url += `&sort_by=${sortBy}&order=${order}&search=${search}&record_status=${status}&organization_id=${organization_id}`;
  return apiSuiteClient.get(url);
}

/**
 * * get path to download records with errors
 */
function downloadErrorRecords(data: any) {
  return apiSuiteClient.post('massive_load_transactions/download_records_errors', data);
}

export {
  paginateMassiveLoadTransaction,
  uploadMassiveLoadTransaction,
  paginateIndividualRegisterTransaction,
  downloadMassiveLoadTransactionErrorRecords,
  downloadErrorRecords
};
