import apiClientMain from '../../api';
import apiSuite from '../../apiSuite';

/**
 * * Lista todos los archivos cargados de una credencial para su emisión
 */
function listMassiveIssuanceCredential(
  credentialSchemaId: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  return apiClientMain.get(
    `/massive_load_credentials/${credentialSchemaId}?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

/**
 * * Lista todas las rows que tenia un excel cargado
 */
function getMassiveIssuanceCredential(
  credentialSchemaId: string,
  massiveIssuanceCredentialId: string,
  page: number,
  per_page: number,
  sort_by: string,
  order: string,
  search: string
) {
  return apiClientMain.get(
    `/massive_load_credentials/${credentialSchemaId}/records/${massiveIssuanceCredentialId}?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

/**
 * * Lista todas las rows que tenia un excel cargado con errores
 */
function listIssuanceCredentialErrors(credentialSchemaId: string, massiveIssuanceCredentialId: string) {
  return apiClientMain.get(
    `/massive_load_credentials/${credentialSchemaId}/records/${massiveIssuanceCredentialId}/errors`
  );
}

function massiveIssuanceCredential(data: any) {
  return apiSuite.post('massive_load_credentials/load_credentials', data);
}

export {
  listMassiveIssuanceCredential,
  getMassiveIssuanceCredential,
  massiveIssuanceCredential,
  listIssuanceCredentialErrors
};
