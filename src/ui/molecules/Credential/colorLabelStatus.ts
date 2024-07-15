export const GetTextColorForStatusFarmer = (text: number) => {
  let color = '#56A60A';
  if (text < 40) {
    color = '#D52E0A';
  } else if (text < 90) {
    color = '#FFCB0A';
  }
  return color;
};

export const GetTextColorForStatusTabGeneral = (text: string) => {
  let colorText = '#9E2A2A';
  let ColorBox = '#FFE0E0';
  const labelText = '';
  switch (text) {
    case 'verified':
      colorText = '#007F00';
      ColorBox = '#CDFFCD';
      break;
    case 'waiting_verification_minagri':
      colorText = '#BD9500';
      ColorBox = '#FFF4CD';
      break;
    case 'waiting_verification_agros':
      colorText = '#BD9500';
      ColorBox = '#FFF4CD';
      break;
    case 'pending':
      colorText = '#BD9500';
      ColorBox = '#FFF4CD';
      break;
    default:
      break;
  }
  return { colorText, ColorBox, labelText };
};

export const getStatusColorCredentials = (value: string) => {
  let colorText = 'white';
  let ColorBox = '#FFFFFF';
  let labelText = '';
  switch (value) {
    case 'Offered':
      colorText = 'white';
      ColorBox = '#2D9CDB';
      labelText = 'Emitiendo';
      break;
    case 'Requested':
      ColorBox = '#D0F9F1';
      labelText = 'Solicitado';
      break;
    case 'Issued':
      ColorBox = 'white';
      colorText = '#09304F';
      labelText = 'Emitido';
      break;
    case 'Rejected':
      ColorBox = '#828282';
      labelText = 'Rechazado';
      break;
    case 'Revoked':
      colorText = 'white';
      ColorBox = '#EB5757';
      labelText = 'Revocado';
      break;
    default:
      ColorBox = '';
      colorText = '#FFFFFF';
      labelText = '-';
      break;
  }
  return { colorText, ColorBox, labelText };
};

export const getStatusColorFarmer = (value: string) => {
  let colorText = '#FFFFFF';
  let colorBox = '#FFFFFF';
  let labelText = '';
  switch (value) {
    case 'unregistered':
      colorBox = '#828282';
      labelText = 'No registrado';
      break;
    case 'unverified':
      colorBox = '#92C1E3';
      labelText = 'Sin verificar';
      break;
    case 'verified':
      colorBox = '#6FCF97';
      labelText = 'Verificado';
      break;
    default:
      colorBox = '';
      colorText = '#FFFFFF';
      break;
  }
  return { colorText, colorBox, labelText };
};

export const getStatusFarmerFileRecord = (value: string) => {
  let colorText = '#FFFFFF';
  let colorBox = '#FFFFFF';
  let labelText = '';
  switch (value) {
    case 'processing':
      colorBox = '#828282';
      labelText = 'procesando';
      break;
    case 'error':
      colorBox = '#F68F6E';
      labelText = 'error';
      break;
    case 'registered':
      colorBox = '#6FCF97';
      labelText = 'registrado';
      break;
    default:
      colorBox = '';
      colorText = '#FFFFFF';
      break;
  }
  return { colorText, colorBox, labelText };
};

export const getStatusIssueCredential = (value: string) => {
  let colorText = '#FFFFFF';
  let colorBox = '#FFFFFF';
  let labelText = '';
  switch (value) {
    case 'pending':
      colorBox = '#828282';
      labelText = 'En espera';
      break;
    case 'error':
      colorBox = '#F68F6E';
      labelText = 'Problemas al emitir';
      break;
    case 'registered':
      colorBox = '#6FCF97';
      labelText = 'Emitido';
      break;
    default:
      colorBox = '';
      colorText = '#FFFFFF';
      break;
  }
  return { colorText, colorBox, labelText };
};

export const getStatusCredentialSchema = (value: string) => {
  let colorText = '#FFFFFF';
  let colorBox = '#FFFFFF';
  let labelText = '';
  switch (value) {
    case 'pending':
      colorBox = '#828282';
      labelText = 'Por confirmar';
      break;
    case 'registered':
      colorBox = '#6FCF97';
      labelText = 'Activo';
      break;
    default:
      colorBox = '';
      colorText = '#FFFFFF';
      break;
  }
  return { colorText, colorBox, labelText };
};