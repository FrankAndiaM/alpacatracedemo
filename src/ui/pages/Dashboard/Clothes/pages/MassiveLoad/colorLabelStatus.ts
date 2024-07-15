export const getMassiveLoadStatus = (value: string) => {
  let colorText = '#FFFFFF';
  let colorBox = '#FFFFFF';
  let labelText = '';
  switch (value) {
    case 'PROCESSING':
      colorBox = '#FEF3C7';
      labelText = 'Procesando';
      colorText = '#B45309';
      break;
    case 'SUCCESSFUL':
      colorBox = '#DCFCE7';
      labelText = 'Éxito';
      colorText = '#15803D';
      break;
    case 'ERROR':
      colorBox = '#FEE2E2';
      labelText = 'Error';
      colorText = '#B91C1C';
      break;
    default:
      colorBox = '';
      colorText = '#FFFFFF';
      break;
  }
  return { colorText, colorBox, labelText };
};
