import React from 'react';
import { Box, Paper } from '@mui/material';

type ServiceRegulationTabProps = unknown;

const ServiceRegulationTab: React.FC<ServiceRegulationTabProps> = () => {
  return (
    <>
      <Box mt={5}>
        <Paper sx={{ px: 5, py: 1 }} elevation={5}>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Registro y creación de la cuenta
          </Box>
          <Box pl={2} textAlign="justify">
            A fin de acceder a los servicios que Agros pone a su disposición a través de la Plataforma, los usuarios
            deberán aceptar expresamente los presentes Términos y Condiciones, así como crear una cuenta en la
            Plataforma. El usuario deberá facilitar, para ello, los datos e información que esta le requiera. En ese
            sentido, los usuarios son los únicos responsables por la veracidad de los datos e información proporcionada.
            En caso Agros verifique que se ha proporcionado información falsa o inexacta, notificará al usuario para su
            aclaración o rectificación, reservándose el derecho a dar de baja la cuenta afectada por la información
            falsa o inexacta.
            <br />
            <br />
            Una vez creada la cuenta, el usuario deberá seleccionar una contraseña de acceso conforme a los
            requerimientos de seguridad que la Plataforma indique. Esta contraseña tendrá carácter personal, debiendo
            facilitar el acceso únicamente al usuario titular de la cuenta. En caso se verifique que un usuario,
            distinto al titular registrado, ha accedido a la Plataforma, Agros podrá dar de baja la cuenta afectada.
          </Box>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Solicitud de herramientas y/o soluciones
          </Box>

          <Box pl={2} textAlign="justify">
            Cuando se encuentre creada la cuenta y validada la contraseña, el usuario podrá acceder a mayor información
            sobre las herramientas y soluciones que Agros ofrece; además, podrá solicitar su uso.
            <br />
            <br />
            Una vez efectuada la solicitud, el equipo de Agros se pondrá en contacto con el usuario, a fin de absolver
            cualquier duda y guiar al usuario a lo largo del proceso hasta obtener la herramienta y/o solución
            requerida.
            <br />
            <br />
            Durante este proceso de acceso a las herramientas y/o soluciones, el usuario deberá compartir con Agros la
            información y datos que se le solicitan. En caso el usuario no entregue esta información, Agros podrá
            entender que el usuario ya no tiene interés en acceder a las herramientas y/o soluciones, sin que por ello
            el usuario pueda exigir responsabilidad alguna a Agros.
            <br />
            <br />
            Finalmente, para acceder a una herramienta y/o solución, el usuario deberá previamente aceptar las
            condiciones específicas a cada una de ellas.
          </Box>
          {/* <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            {'A) Registro y creación de la cuenta'}
          </Box>

          <Box pl={2} textAlign="justify">
            A fin de acceder a los servicios que Identi pone a su disposición a través de la Plataforma, los Usuarios
            deberán aceptar expresamente los presentes Términos y Condiciones así como crear una cuenta en la
            Plataforma, debiendo facilitar para ello los datos e información que ésta le requiera. En ese sentido, los
            Usuarios son los únicos responsables por la veracidad de los datos e información proporcionada. En caso
            Identi verifique que se ha proporcionado información falsa o inexacta notificará al Usuario para su
            aclaración o rectificación, reservándose el derecho a dar de baja la cuenta afectada por la información
            falsa o inexacta.
            <br />
            <br />
            Una vez creada la cuenta, el Usuario deberá seleccionar una contraseña de acceso conforme a los
            requerimientos de seguridad que la Plataforma indique. Esta contraseña tendrá carácter personal, debiendo
            facilitar el acceso únicamente al Usuario titular de la cuenta. En caso se verifique que un Usuario distinto
            al titular registrado ha accedido a la Plataforma, Identi podrá dar de baja la cuenta afectada.
          </Box>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            {'B) Solicitud de herramientas y/o soluciones'}
          </Box>

          <Box pl={2} textAlign="justify">
            Cuando se encuentre creada la cuenta y validada la contraseña, el Usuario podrá acceder a mayor información
            sobre las Herramientas y Soluciones que Identi ofrece, pudiendo el Usuario solicitar el acceso a uno o
            varios de ellos.
            <br />
            <br />
            Una vez efectuada la solicitud, el equipo de Identi se pondrá en contacto con el Usuario a fin de absolver
            cualquier duda y guiar al Usuario a lo largo del proceso hasta obtener la Herramienta y/o Solución
            solicitada.
            <br />
            <br />
            Durante este proceso de acceso a las Herramientas y/o Soluciones que sean de interés del Usuario, éste
            deberá facilitar a Identi la información y datos que le sean requeridos. En caso el Usuario no entregue esta
            información, Identi podrá entender que el usuario ya no tiene interés sin acceder a las Herramientas y/o
            Soluciones, sin que por ello el Usuario pueda exigir responsabilidad alguna a Identi.
            <br />
            <br />
            Finalmente, para acceder a una Herramienta y/o Solución el Usuario deberá previamente aceptar las
            condiciones específicas a cada una de ellas.
          </Box> */}

          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            {'Utilización de las herramientas y/o servicios'}
          </Box>

          <Box pl={2} textAlign="justify">
            Una vez el usuario obtenga el acceso a la herramienta y/o servicio solicitado, se le obliga expresamente a
            utilizarlo de acuerdo a las finalidades y condiciones establecidas tanto en este documento, como en las
            condiciones específicas de cada herramienta y/o servicio.
            <br />
            <br />
            El incumplimiento de cualquiera de estas condiciones, por parte del usuario, autorizará a Agros a suspender
            y dar por finalizado el acceso a la herramienta y/o servicio afectado; sin perjuicio de la responsabilidad
            por los daños que el usuario deberá asumir por el incumplimiento.
          </Box>
          <br />
        </Paper>
        <br />
        <br />
      </Box>
    </>
  );
};

export default ServiceRegulationTab;
