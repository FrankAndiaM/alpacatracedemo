const inputClearNumber = (value: string = '') => {
  return value.replace(/\D+/g, '');
};

const inputPermiteASCII = (value: any) => {
  //Reemplaza todos los caracteres a excepcion de a-z, A-Z y 0-9
  //Simbolo: ^ -> diferente de ....
  // value = value.toLowerCase();
  value = value.replace(new RegExp(/ñ/g), 'n');
  value = value.replace(new RegExp(/[àáâãäå]/g), 'a');
  value = value.replace(new RegExp(/[èéêë]/g), 'e');
  value = value.replace(new RegExp(/[ìíîï]/g), 'i');
  value = value.replace(new RegExp(/[òóôõö]/g), 'o');
  value = value.replace(new RegExp(/[ùúûü]/g), 'u');
  // value = value.replace(new RegExp(/[^\w\s]/gi), '');
  return value;
};

const inputRemoveAllASCII = (value: any) => {
  //Reemplaza todos los caracteres a excepcion de a-z, A-Z y 0-9
  //Simbolo: ^ -> diferente de ....
  // value = value.toLowerCase();
  value = value.replace(new RegExp(/ñ/g), 'n');
  value = value.replace(new RegExp(/[àáâãäå]/g), 'a');
  value = value.replace(new RegExp(/[èéêë]/g), 'e');
  value = value.replace(new RegExp(/[ìíîï]/g), 'i');
  value = value.replace(new RegExp(/[òóôõö]/g), 'o');
  value = value.replace(new RegExp(/[ùúûü]/g), 'u');
  value = value.replace(new RegExp(/ /g), '_');
  value = value.replace(new RegExp(/[^\w\s]/gi), '');
  return value;
};

export { inputClearNumber, inputRemoveAllASCII, inputPermiteASCII };
