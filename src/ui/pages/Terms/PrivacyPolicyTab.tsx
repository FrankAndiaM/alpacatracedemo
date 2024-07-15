import React from 'react';
import { Paper, Box } from '@mui/material';

type PrivacyPolicyTabProps = unknown;

const PrivacyPolicyTab: React.FC<PrivacyPolicyTabProps> = () => {
  return (
    <>
      <Box mt={5}>
        <Paper sx={{ px: 5, py: 1 }} elevation={5}>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Confidencialidad
          </Box>
          <Box pl={2} textAlign="justify">
            Agros garantiza al usuario que toda la información personal que facilite en la Plataforma, así como los
            datos obtenidos de sus actividades, serán tratadas por Agros como información estrictamente confidencial,
            obligándose a no divulgarla, revelarla, comunicarla, transmitirla, ni usarla en beneficio propio, de
            terceros o con fines distintos a los establecidos en la política de privacidad, a no ser que exista
            autorización previa y por escrito otorgada por el usuario, sus representantes o tutores.
          </Box>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Privacidad y protección de datos
          </Box>

          <Box pl={2} textAlign="justify">
            En cumplimiento de lo dispuesto en la normativa vigente en materia de protección de datos personales, todo
            usuario de la Plataforma, previamente a su registro, deberá aprobar expresamente la política de privacidad
            de Agros.
          </Box>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Uso de cookies
          </Box>

          <Box pl={2} textAlign="justify">
            Agros proporciona información clara y completa sobre la utilización y funcionamiento de las cookies alojadas
            en su Web, a través de la política de privacidad de Agros.
          </Box>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Propiedad intelectual e industrial
          </Box>

          <Box pl={2} textAlign="justify">
            La marca Agros, la Plataforma, la Web y todos los contenidos alojados en ellos constituyen propiedad
            intelectual y/o industrial de Agros; incluyendo, a modo enunciativo, logos, textos gráficos, imágenes,
            vídeos, descargas, bases de datos, recopilaciones, etc.
            <br />
            <br />
            Todos los derechos sobre dichos contenidos se encuentran reservados, por lo tanto, no pueden copiarse o
            imitarse total o parcialmente. Tampoco pueden usarse en beneficio de terceros. Ante el incumplimiento
            parcial o total del presente párrafo, se procederá a tomar las medidas legales correspondientes.{' '}
          </Box>
          <br />
        </Paper>
        <br />
        <br />
      </Box>
    </>
  );
};

export default PrivacyPolicyTab;
