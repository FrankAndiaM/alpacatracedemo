import apiSuiteClient from '../apiSuite';

/**
 * * register de productores
 */

function downloadProducersData(data: any) {
  return apiSuiteClient.post('/massive_download/producers_data', data);
}

export { downloadProducersData };
