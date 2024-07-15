import React, { useCallback } from 'react';
import { Icon, Box } from '@mui/material';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';

type CredentialValueProps = {
  credentialValue: any;
};

const ShowDefaultValue: React.FC<CredentialValueProps> = (props: CredentialValueProps) => {
  const { credentialValue } = props;
  return (
    <Box
      sx={{
        padding: '0px 8px'
      }}
    >
      {credentialValue}
    </Box>
  );
};

type ShowMultimediaValueProps = {
  filePath: any;
};

const ShowMultimediaValue: React.FC<ShowMultimediaValueProps> = (props: ShowMultimediaValueProps) => {
  const { filePath } = props;
  return (
    <a
      target="_blank"
      href={COMMUNITY_BASE_URL_S3 + filePath}
      rel="noopener noreferrer"
      style={{
        marginTop: '0',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        color: '#7676c5',
        backgroundColor: 'white',
        padding: '0px 2px',
        borderRadius: '10px',
        width: '115px',
        justifyContent: 'center'
      }}
    >
      <Icon>visibility</Icon>
      Ver archivo
    </a>
  );
};

const ShowCredentialValue: React.FC<CredentialValueProps> = (props: CredentialValueProps) => {
  const { credentialValue } = props;

  const parseJSON = useCallback((value: string) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }, []);

  const renderAttribute = useCallback(
    (attributeValue: any): any => {
      if (attributeValue === true || attributeValue === 'true') {
        return <ShowDefaultValue credentialValue="Si" />;
      }
      if (attributeValue === false || attributeValue === 'false') {
        return <ShowDefaultValue credentialValue="No" />;
      }

      const parsedValue = parseJSON(attributeValue);
      switch (typeof parsedValue) {
        case 'string':
        case 'number':
          return <ShowDefaultValue credentialValue={attributeValue} />;
        case 'object':
          if (parsedValue?.hasOwnProperty('path')) {
            return <ShowMultimediaValue filePath={parsedValue?.path} />;
          }
          return attributeValue;
        default:
          return attributeValue;
      }
    },
    [parseJSON]
  );

  return <>{renderAttribute(credentialValue)}</>;
};

export default ShowCredentialValue;
