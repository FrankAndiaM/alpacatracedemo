import React from 'react';
import { OrganizationFormAttributeType } from '~models/organizationFormAttribute';
import { Box, Icon } from '@mui/material';
import CoursesIcon from '~assets/icons/courses.svg';
import MatSimpleIcon from '~assets/icons/mat_simple.svg';
import ConditionalIcon from '~assets/icons/conditional_icon.svg';

type TypeItemProps = {
  type?: OrganizationFormAttributeType;
};

const TypeItem: React.FC<TypeItemProps> = (props: TypeItemProps) => {
  const { type }: TypeItemProps = props;

  switch (type) {
    case 'number':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">category</Icon>
          <Box>Números</Box>
        </Box>
      );
    case 'string':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">text_fields</Icon>
          <Box>Campo de texto</Box>
        </Box>
      );
    case 'date':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">calendar_today</Icon>
          <Box>Fecha</Box>
        </Box>
      );
    case 'photo':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">add_a_photo</Icon>
          <Box>Fotografía</Box>
        </Box>
      );
    case 'signature':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">edit</Icon>
          <Box>Firma</Box>
        </Box>
      );
    case 'gps_point':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">room</Icon>
          <Box>Ubicación</Box>
        </Box>
      );
    case 'georeference':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">map</Icon>
          <Box>Polígono</Box>
        </Box>
      );
    case 'list_options':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">list</Icon>
          <Box>Opción única</Box>
        </Box>
      );
    case 'boolean':
      return <>Text</>;
    case 'audio':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">audio_file</Icon>
          <Box>Audio</Box>
        </Box>
      );
    case 'multiple_selection':
      return (
        <Box display="flex" alignItems="center">
          <img src={CoursesIcon} alt="Opción múltiple" />
          <Box>Opción múltiple</Box>
        </Box>
      );
    case 'altitude':
      return (
        <Box display="flex" alignItems="center" justifyContent={'center'}>
          <Icon fontSize="small">landscape</Icon>
          <Box>Altitud</Box>
        </Box>
      );
    case 'title':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">dehaze</Icon>
          <Box>Sección</Box>
        </Box>
      );
    case 'formula':
      return (
        <Box display="flex" alignItems="center">
          <img src={MatSimpleIcon} alt="Matemática simple" style={{ width: '1.5em' }} />
          &nbsp;
          <Box>Formula</Box>
        </Box>
      );
    case 'conditional':
      return (
        <Box display="flex" alignItems="center">
          <img src={ConditionalIcon} alt="Pregunta condicional" style={{ width: '1.5em' }} />
          &nbsp;
          <Box>Pregunta condicional</Box>
        </Box>
      );
    case 'model':
      return (
        <Box display="flex" alignItems="center">
          <img src={ConditionalIcon} alt="Pregunta condicional" style={{ width: '1.5em' }} />
          &nbsp;
          <Box>Formulario</Box>
        </Box>
      );
    default:
      return <>Text</>;
  }
};

export default TypeItem;
