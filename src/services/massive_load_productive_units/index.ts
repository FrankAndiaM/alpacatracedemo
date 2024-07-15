import apiSuiteClient from '../apiSuite';

class MassiveLoadProductiveUnitsService {
  /**
   * * Pagina todos los registros que se cargaron en el archivo
   */
  static paginate(type: string, page: number, perPage: number, sortBy: string, order: string, search: string) {
    return apiSuiteClient.get(
      `/massive_load_productive_units/productive_units?record_status=${type}&page=${page}&per_page=${perPage}&sort_by=${sortBy}&order=${order}&search=${search}`
    );
  }

  /**
   * * Pagina todos los registros que se cargaron en el archivo
   */
  static getMassiveLoad(massiveLoadId: string) {
    return apiSuiteClient.get(`/massive_load_productive_units/productive_units/${massiveLoadId}`);
  }

  /**
   * * Pagina todos los registros que se cargaron en el archivo
   */
  static paginateIndividualRegister(
    massiveLoadId: string,
    page: number,
    perPage: number,
    sortBy: string,
    order: string,
    search: string,
    record_status: string
  ) {
    return apiSuiteClient.get(
      `/massive_load_productive_units/productive_units/${massiveLoadId}/records/?page=${page}&per_page=${perPage}&sort_by=${sortBy}&order=${order}&search=${search}&record_status=${record_status}`
    );
  }

  /**
   * * get path to download records with errors
   */
  static downloadErrorRecords(data: any) {
    return apiSuiteClient.post('massive_load_productive_units/download_records_errors', data);
  }
}

export default MassiveLoadProductiveUnitsService;
