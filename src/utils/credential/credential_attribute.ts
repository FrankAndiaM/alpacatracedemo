class CredentialAttributeUtils {
  public static verify_attributes(credential_attributes: any, attrib: string, value: any) {
    let currentValue = value;
    let validation = undefined;

    // Verify if is required
    if (
      credential_attributes?.required &&
      (currentValue.toString().trim() === '' || currentValue.toString().trim() === 'None')
    ) {
      validation = `${attrib} el atributo es obligatorio`;
      return { validation: validation, value: currentValue };
    }

    // Verify if is boolean
    if (credential_attributes?.attribute_type === 'boolean') {
      currentValue = currentValue.toString().trim();
      if (!(currentValue in ['Si', 'No'])) {
        validation = `${attrib} debe ser Si o No`;
        return { validation: validation, value: currentValue };
      }
    }

    // Verify if is number
    if (credential_attributes?.attribute_type === 'number') {
      try {
        if (currentValue.toString().trim() === '' || currentValue.toString().trim() === 'None') {
          currentValue = '';
        } else {
          currentValue = currentValue.toString().trim();
          Number(currentValue);
        }
      } catch (Exception) {
        validation = `${attrib} el atributo debe ser un número`;
        return { validation: validation, value: currentValue };
      }
    }

    //Verify if is enum
    if (credential_attributes?.attribute_type === 'enum') {
      if (!(currentValue in credential_attributes?.possible_values)) {
        validation = attrib + ' el atributo debe ser ' + credential_attributes?.possible_values?.join(' o ');
        return { validation: validation, value: currentValue };
      }
    }

    // Verify if is date
    if (credential_attributes.attribute_type === 'date') {
      currentValue = currentValue.toString().trim();
      const match_result = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/.test(currentValue);
      if (match_result === false) {
        validation = `${attrib} el atributo debe tener el siguiente formato yyyy-mm-dd`;
        return { validation: validation, value: currentValue };
      }
    }
    //Verify if is string
    if (credential_attributes.attribute_type === 'string') {
      currentValue = currentValue.toString().trim();
    }

    return { validation: validation, value: currentValue };
  }
}

export default CredentialAttributeUtils;
