import { Box, Paper } from '@mui/material';
import React from 'react';

type AboutTermsTabProps = unknown;

const AboutTermsTab: React.FC<AboutTermsTabProps> = () => {
  return (
    <Box mt={5}>
      <Paper sx={{ px: 5, py: 1 }} elevation={5}>
        <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
          Competencia territorial
        </Box>
        <Box pl={2} textAlign="justify">
          Para efectos de cualquier controversia que se genere con motivo de la utilización de la Plataforma, Agros y
          los usuarios se someten a la competencia territorial de los jueces y tribunales del cercado de Lima.
        </Box>
        <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
          Modificación de los términos y condiciones
        </Box>

        <Box pl={2} textAlign="justify">
          Agros se reserva el derecho a modificar unilateralmente los presentes Términos y Condiciones. Agros notificará
          a los usuarios del cambio en los Términos y Condiciones, a fin de que puedan acceder a la nueva versión a
          través de la Web o la Plataforma.
        </Box>
        <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
          Aplicación supletoria de la ley
        </Box>

        <Box pl={2} textAlign="justify">
          En lo no previsto en estos términos y condiciones, Agros y los usuarios se someten a lo establecido por las
          normas del Código Civil y demás del sistema jurídico que resulten aplicables.
        </Box>
        <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
          Exoneración de responsabilidad
        </Box>
        <Box pl={2} textAlign="justify">
          Los usuarios no podrán derivar responsabilidad alguna a Agros por las siguientes cuestiones:
          <br />
        </Box>
        <Box pl={3} textAlign="justify">
          <ul>
            <li>Por fallas de cualquier tipo en el funcionamiento de la Web y/o la Plataforma.</li>
            <li>El uso de la Plataforma en dispositivos móviles que no cumplan los requerimientos técnicos.</li>
            <li>El uso de la Plataforma por un Usuario que no tenga la capacidad legal necesaria.</li>
          </ul>
        </Box>
        <br />
      </Paper>
      <br />
      <br />
    </Box>
  );
};

export default AboutTermsTab;
