import apiClient from '../api';
import apiSuiteClient from '../apiSuite';
import apiSuiteClientForm from '../apiSuiteForm';

/**
 * * get path to download records with errors
 */
function downloadMassiveLoadProducerErrorRecords(data: any) {
  return apiSuiteClient.post('massive_load_producers/download_records_errors', data);
}

/**
 * * register de productores
 */

function updateIndividualRegisterProducer(individualRegisterProducerId: string, data: any) {
  return apiSuiteClient.patch(
    `/massive_load_producers/individual_register_producers/${individualRegisterProducerId}`,
    data
  );
}

/**
 * * upload massive load producer
 */

function uploadMassiveLoadProducer(data: any) {
  return apiSuiteClientForm.post('/massive_load_producers/upload_file', data);
}

/**
 * * Pagina todos los archivos cargados
 */
function paginateMassiveLoadProducer(page: number, perPage: number, sortBy: string, order: string, search: string) {
  return apiClient.get(
    `/massive_load_producers?page=${page}&per_page=${perPage}&sort_by=${sortBy}&order=${order}&search=${search}`
  );
}
//=====carga masiva de información personal del productor
/**
 * * Pagina todos los archivos cargados de perfil de productor
 */
function paginateMassiveLoadProducerProfiles(
  type: string,
  page: number,
  perPage: number,
  sortBy: string,
  order: string,
  search: string
) {
  return apiSuiteClient.get(
    `/massive_load_producers_profiles/producers_profiles?record_status=${type}&page=${page}&per_page=${perPage}&sort_by=${sortBy}&order=${order}&search=${search}`
  );
}

/**
 * * Pagina todos los registros que se cargaron en el archivo - perfil del productor
 */
function paginateIndividualRegisterProfileProducer(
  massiveLoadProfileProducerId: string,
  page: number,
  perPage: number,
  sortBy: string,
  order: string,
  search: string,
  status: string
) {
  return apiSuiteClient.get(
    `massive_load_producers_profiles/producers_profiles/${massiveLoadProfileProducerId}/records?page=${page}&per_page=${perPage}&sort_by=${sortBy}&order=${order}&search=${search}&record_status=${status}`
  );
}

/**
 * * get path to download records with errors
 */
function downloadErrorRecords(data: any) {
  return apiSuiteClient.post('massive_load_producers_profiles/download_records_errors', data);
}

// ==============================

/**
 * * Pagina todos los registros que se cargaron en el archivo
 */
function paginateIndividualRegisterProducer(
  massiveLoadProducerId: string,
  page: number,
  perPage: number,
  sortBy: string,
  order: string,
  search: string,
  status: string
) {
  return apiClient.get(
    `/massive_load_producers/${massiveLoadProducerId}/records/?page=${page}&per_page=${perPage}&sort_by=${sortBy}&order=${order}&search=${search}&status=${status}`
  );
}

/**
 * Registro masivo del perfil de productor
 * @param data load data from register
 * @returns request api
 */
function registerMassiveLoadProducerProfiles(data: any) {
  return apiSuiteClient.post('/massive_load_producers_profiles/massive_load_producers_profiles', data);
}

export {
  updateIndividualRegisterProducer,
  paginateMassiveLoadProducer,
  paginateIndividualRegisterProducer,
  registerMassiveLoadProducerProfiles,
  paginateMassiveLoadProducerProfiles,
  paginateIndividualRegisterProfileProducer,
  downloadErrorRecords,
  downloadMassiveLoadProducerErrorRecords,
  uploadMassiveLoadProducer
};
