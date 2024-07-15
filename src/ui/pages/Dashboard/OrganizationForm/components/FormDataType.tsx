import React from 'react';
import { OrganizationFormAttributeType } from '~models/organizationFormAttribute';
import { Box } from '@mui/material';
import Image from './Image';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import { renderModelValue } from '~utils/composition';

type FormDataTypeProps = {
  type?: OrganizationFormAttributeType;
  attribute: any;
};

const FormDataType: React.FC<FormDataTypeProps> = (props: FormDataTypeProps) => {
  const { type, attribute }: FormDataTypeProps = props;

  switch (type) {
    case 'number':
      return <Box>{attribute || ''}</Box>;
    case 'string':
      return <Box>{attribute || ''}</Box>;
    case 'formula':
      return <Box>{attribute || ''}</Box>;
    case 'date':
      return <Box>{attribute || ''}</Box>;
    case 'photo':
      if (attribute?.image === undefined || attribute === '') return <></>;
      return <Image image={`${COMMUNITY_BASE_URL_S3}${attribute?.image}`} />;
    case 'signature':
      if (attribute === undefined || attribute === '') return <></>;
      return <Image image={`${COMMUNITY_BASE_URL_S3}${attribute}`} />;
    case 'gps_point':
      return (
        <Box display="flex" alignItems="center">
          {attribute || ''}
        </Box>
      );
    case 'georeference':
      return (
        <Box display="flex" alignItems="center">
          {attribute}
        </Box>
      );
    case 'list_options':
      return (
        <Box display="flex" alignItems="center">
          {attribute}
        </Box>
      );
    case 'multiple_selection':
      if (Array.isArray(attribute)) {
        return (
          <Box display="flex" alignItems="center">
            {attribute.join(', ')}
          </Box>
        );
      }
      return (
        <Box display="flex" alignItems="center">
          {attribute}
        </Box>
      );
    case 'audio':
      if (attribute === undefined || attribute === '') return <></>;
      return (
        <Box display="flex" alignItems="center">
          <Box>
            <audio controls style={{ maxWidth: '280px' }}>
              <source src={`${COMMUNITY_BASE_URL_S3}${attribute}`} type="audio/mpeg" />
            </audio>
          </Box>
        </Box>
      );
    case 'model':
      if (attribute) {
        return <Box>{renderModelValue(attribute) || ''}</Box>;
      }
      return <></>;
    case 'boolean':
      return <>Text</>;
    case 'altitude':
      return (
        <Box>
          {attribute || ''}{' '}
          <Box display="inline" whiteSpace="pre">
            m.s.n.m.
          </Box>
        </Box>
      );
    default:
      return <></>;
  }
};

export default React.memo(FormDataType);
