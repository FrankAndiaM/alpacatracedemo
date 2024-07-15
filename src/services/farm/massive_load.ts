import apiFormClient from '../apiSuite';

/**
 * * Create farm
 * @param data
 * @returns
 */
function downloadProductiveUnits(data: any) {
  return apiFormClient.post('/massive_load_productive_units/download_productive_units', data);
}

export { downloadProductiveUnits };
