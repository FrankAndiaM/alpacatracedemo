import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import routes from '~routes/routes';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '~ui/atoms/Loading';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
// import { showMessage } from '~utils/Messages';
import { listCredentialsFromClothes } from '~services/credentials';
import Credential from '~molecules/Credential';
import { useSelector } from 'react-redux';

type CredentialsTabProps = unknown;

const CredentialsTab: React.FC<CredentialsTabProps> = () => {
  const history = useNavigate();
  // eslint-disable-next-line
  // @ts-ignore
  const { farmer_id } = useParams();
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);
  if (!farmer_id) history(routes.farmers);
  const farmerId: string = farmer_id !== undefined ? farmer_id : '';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [credentials, setCredentials] = useState<Array<any>>([]);
  // const [credential, setCredential] = useState<Array<any>>([]);

  const _getCredentialsDataFromFarmer = useCallback(() => {
    listCredentialsFromClothes(farmerId)
      .then((res: any) => {
        const data = res?.data?.data;
        // console.log(data);
        setCredentials(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        // showMessage('', 'Problemas al cargar los datos del formulario del productor.', 'error', true);
        // history(routes.farmers);
      });
  }, [farmerId]);

  useEffect(() => {
    _getCredentialsDataFromFarmer();
  }, [_getCredentialsDataFromFarmer]);

  return (
    <>
      <Loading
        isLoading={isLoading}
        figureProgress={<LinearProgress loading={true} />}
        // isData={dataAdditionals?.length > 0}
        isData={true}
      >
        <Grid container spacing={2}>
          {credentials.length > 0 ? (
            credentials.map((credentialCard: any, index: number) => {
              return (
                <Grid item xs={12} sm={6} key={`${credentialCard.id}_${index}`}>
                  <Credential
                    issuedCredential={credentialCard}
                    credentialValues={credentialCard?.credential_values?.claims}
                    organizationTheme={organizationTheme}
                  />
                </Grid>
              );
            })
          ) : (
            <Box display="flex" mt={4} justifyContent="center" alignItems="center" width="100%">
              <Typography fontSize="1.7em" color="#CFD9DE" align="center">
                No se han registrado certificados
              </Typography>
            </Box>
          )}
        </Grid>
      </Loading>
    </>
  );
};

export default CredentialsTab;
