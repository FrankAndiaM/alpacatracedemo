import React from 'react';
import { Box, Paper } from '@mui/material';

type GeneralDescriptionTabProps = unknown;

const GeneralDescriptionTab: React.FC<GeneralDescriptionTabProps> = () => {
  return (
    <>
      <Box mt={5}>
        <Paper sx={{ px: 5, py: 1 }} elevation={5}>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Objetivo
          </Box>

          <Box pl={2} textAlign="justify">
            El objeto de los presentes términos y condiciones (en adelante, los “Términos y Condiciones”) consiste en
            definir las condiciones de utilización de la plataforma digital (en adelante, la “Plataforma”) a la que se
            accede a través de la siguiente dirección web id-panel.agros.tech (en adelante, la “Web”) y del siguiente
            aplicativo móvil APP Agros Connect (en adelante, el “Aplicativo”).
            <br />
            <br />
            La Plataforma, la Web y el Aplicativo son de titularidad exclusiva de la sociedad SINERGIA CENTRO DE
            INNOVACIÓN Y NEGOCIOS S.A.C., identificada con RUC 20530309712 y con domicilio en Av. las Esmeraldas, Mz.
            A3, Lote. 5 Bello Horizonte 2 Etapa, Distrito, Provincia y Departamento de Piura (en adelante, “AGROS”).
            <br />
            <br />
            Los presente Términos y Condiciones estarán accesibles para todos los usuarios en la parte inferior del menú
            principal de la Web y en la pantalla de acceso al Aplicativo, siendo imprescindible aceptar expresamente los
            presentes Términos y Condiciones con carácter previo a su registro en la Plataforma.
          </Box>

          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Condiciones de uso de la plataforma
          </Box>
          <Box pl={2} textAlign="justify">
            La Plataforma ha sido desarrollada por Agros con la finalidad de poner a disposición de los usuarios el
            acceso a las herramientas, oportunidades de colaboración y soluciones. En ese sentido, los usuarios podrán
            utilizar la plataforma para consultar los servicios que Agros ofrece, solicitar mayor información y/o
            acceder a cualquiera de ellos. Cualquier otro uso de la Plataforma por parte de los usuarios se encuentra
            totalmente prohibido, quedando Agros eximida de cualquier responsabilidad derivada del mal uso de la
            Plataforma, así como de su utilización para fines distintos a los señalados en los presentes Términos y
            Condiciones.
            <br />
            <br />
            Asimismo, los usuarios aceptan que, en caso de cometerse alguna actividad ilícita, deberán responder ante
            Agros y/o cualquier tercero por los daños causados por la actividad ilícita realizada.
            <br />
            <br />
            Por otro lado, el usuario puede acceder y navegar por la Web libremente sin necesidad de registrarse. Sin
            embargo, el acceso a la Plataforma requerirá inexcusablemente el registro del usuario, previa aprobación de
            los presentes Términos y Condiciones.
            <br />
            <br />
            Asimismo, el acceso y navegación por el sitio web por parte del usuario implica la aceptación sin reservas
            de todas las disposiciones incluidas en los presentes Términos y Condiciones.
          </Box>

          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Actualización y/o modificación de la plataforma
          </Box>
          <Box pl={2} textAlign="justify">
            Agros se reserva, en todo momento, el derecho a actualizar y/o modificar, a su único criterio y sin
            comunicación previa, la Plataforma, la Web y/o el Aplicativo.
          </Box>
          <br />
        </Paper>
        <br />
        <br />
      </Box>
    </>
  );
};

export default GeneralDescriptionTab;
