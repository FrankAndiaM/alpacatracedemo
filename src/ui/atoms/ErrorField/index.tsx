import React, { useEffect, useState } from 'react';

type ErrorsFieldProps = {
  errors: any;
  fields?: Array<string>;
};
const ErrorsField: React.FC<ErrorsFieldProps> = (props: ErrorsFieldProps) => {
  const { errors, fields } = props;
  const [object, setObject] = useState<any>({});

  useEffect(() => {
    if (fields && fields?.length >= 0) {
      for (const [key, value] of Object.entries(errors)) {
        if (fields.includes(key)) {
          setObject((prev: any) => {
            // if(prev && key && value){
            return { ...prev, key: value };
            // }
          });
        }
      }
    } else {
      setObject(errors);
    }
  }, [errors, fields]);

  return (
    <>
      {
        <ul>
          {object &&
            Object.values(object).length > 0 &&
            Object.values(object).map((value: any, index: number) => {
              return <li key={`error_${index}`}>{value ?? ''}</li>;
            })}
        </ul>
      }
    </>
  );
};

export default ErrorsField;
