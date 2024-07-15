import apiSuiteClient from '../apiSuite';

function paginateFarmers(page: number, per_page: number, sort_by: string, order: string, search: string) {
  return apiSuiteClient.get(
    `/digital_identity/producers?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

/**
 * * Pagina los certificados emitidos por una organización
 */
function paginateCredentials(
  producers_id: string[],
  credential_status_id: string[],
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  return apiSuiteClient.get(
    `/digital_identity/credentials?producers_id=${producers_id}&credential_status_id=${credential_status_id}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

/**
 * * Pagina los certificados en estado emitido por una organización
 */
function paginateIssuedCredentials(
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string,
  producers_id?: string
) {
  return apiSuiteClient.get(
    `/digital_identity/credentials/issued?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}${producers_id}`
  );
}

/**
 * * Pagina los certificados en estado emitido por una organización
 */
function paginateReceivedCredentials(
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search?: string,
  model_id?: string,
  model_type?: string
) {
  let url = `/digital_identity/credentials/received?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}`;
  if (search) {
    url += `&search=${search}`;
  }
  if (model_id) {
    url += `&model_id=${model_id}`;
  }
  if (model_type) {
    url += `&model_type=${model_type}`;
  }
  return apiSuiteClient.get(url);
}

/**
 * * Pagina los grupos de certificados compartidos
 */
function paginateShareDids(page: number, per_page: number, sort_by: string, order: string, search: string) {
  return apiSuiteClient.get(
    `/digital_identity/share_did?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

/**
 * * comparte los certificados de los productores
 */

function shareDid(data: any) {
  return apiSuiteClient.post('/digital_identity/share_did/share', data);
}

// /**
//  * * register de productores
//  */

// function updateIndividualRegisterProducer(individualRegisterProducerId: string, data: any) {
//   return apiSuiteClient.patch(`/massive_load_producers/load_producers/${individualRegisterProducerId}`, data);
// }

export {
  paginateFarmers,
  paginateCredentials,
  paginateIssuedCredentials,
  shareDid,
  paginateShareDids,
  paginateReceivedCredentials
};
