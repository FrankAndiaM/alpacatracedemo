import React from 'react';
import { Box, Paper } from '@mui/material';

type DefinitionTabProps = unknown;

const DefinitionTab: React.FC<DefinitionTabProps> = () => {
  return (
    <>
      <Box mt={5}>
        <Paper sx={{ px: 5, py: 1 }} elevation={5}>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Agros
          </Box>

          <Box pl={2} textAlign="justify">
            Es una startup social que usa los beneficios de la tecnología y los negocios con el propósito de darle
            capacidad a los agricultores locales de demostrar mundialmente su trabajo para hacerlos protagonistas de su
            desarrollo; a través de una Identidad Digital Económica-Funcional, Auto-Soberana y confiable que los conecta
            con las oportunidades de la economía digital del mundo.
          </Box>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Herramientas:
          </Box>

          <Box pl={3} textAlign="justify">
            <ul>
              <li>
                <Box component="span" fontWeight={500}>
                  Kit de identidad digital:{' '}
                </Box>
                a través de este servicio, Agros otorga al productor rural una identidad digital verificada, que le
                permite el acceso a un catálogo de servicios digitales, sin necesidad de conexión a internet.
              </li>
              <li>
                <Box component="span" fontWeight={500}>
                  Panel Web:{' '}
                </Box>
                plataforma que permite a las organizaciones de productores administrar toda su información de manera
                segura y confiable.
              </li>
              <li>
                <Box component="span" fontWeight={500}>
                  Agros Connect:{' '}
                </Box>
                servicio prestado a través del Aplicativo, que le permite al agricultor rural recoger información en
                campo a través de formularios personalizados y almacenarla de manera digital, sin necesidad de conexión
                a internet.
              </li>
            </ul>
          </Box>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Oportunidades de colaboración:{' '}
          </Box>

          <Box pl={3} textAlign="justify">
            <ul>
              <li>
                <Box component="span" fontWeight={500}>
                  Voluntariado:{' '}
                </Box>
                permite a terceros registrarse en la Plataforma, a fin de brindar apoyo y soluciones a los agricultores
                familiares de manera externa.
              </li>
              <li>
                <Box component="span" fontWeight={500}>
                  Teleasesoría:{' '}
                </Box>
                permite a los profesionales de actividades concretas registrarse en la Plataforma, a fin de poner su
                conocimiento y experiencia a disposición de los agricultores familiares.
              </li>
            </ul>
          </Box>
          <Box color="#637381" fontWeight={700} mt={2} mb={3} fontSize="1.5rem">
            Soluciones
          </Box>

          <Box pl={3} textAlign="justify">
            <ul>
              <li>
                <Box component="span" fontWeight={500}>
                  Organizaciones digitales:{' '}
                </Box>
                solución que permite digitalizar toda la información de las organizaciones de agricultores familiares, a
                fin de conectarse con sistemas de trazabilidad, seguros y servicios financieros.
              </li>
              <li>
                <Box component="span" fontWeight={500}>
                  Productor rural digital:{' '}
                </Box>
                solución que permite a los agricultores familiares construir su identidad digital y utilizarla para
                acceder a un catálogo de servicios digitales, sin necesidad de conexión a internet.
              </li>
              <li>
                <Box component="span" fontWeight={500}>
                  Usuario:{' '}
                </Box>
                cualquier persona natural residente en la República del Perú, mayor de 18 años y que desee solicitar un
                servicio o participar en una oportunidad de colaboración ofrecida por Agros, a través de la Plataforma.
              </li>
            </ul>
          </Box>
          <br />
        </Paper>
        <br />
        <br />
      </Box>
    </>
  );
};

export default DefinitionTab;
