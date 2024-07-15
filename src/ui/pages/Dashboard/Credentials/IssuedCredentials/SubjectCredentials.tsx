import React, { useCallback, useState, useRef } from 'react';
import { Box, Icon, Grid, Typography, Checkbox, Button } from '@mui/material';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';
// import IssuedCredentialCard from './IssuedCredentialCard';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { showMessage } from '~utils/Messages';
import Credential from '~molecules/Credential';
import { useSelector } from 'react-redux';
// import Button from '~ui/atoms/Button/Button';
import InfiniteScroll from 'react-infinite-scroller';
import { paginateReceivedCredentials } from '~services/share_credentials';
import GenerateLinkDialog from '../ShareCredentials/components/GenerateLinkDialog';
import ShareOptionsDialog from '../ShareCredentials/components/ShareOptionsDialog';
import { shareDid } from '~services/share_credentials';
import { ShareDidResponse } from '../ShareCredentials/CredentialsSelection';
import { useTheme } from '@mui/material/styles';

type SubjectCredentialsProps = unknown;

const SubjectCredentials: React.FC<SubjectCredentialsProps> = () => {
  const isCompMounted = useRef(null);
  const theme = useTheme();
  const [issuedCredentials, setIssuedCredentials] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isOpenShareOptionsDialog, setIsOpenShareOptionsDialog] = useState<boolean>(false);
  const [isSelectCredential, setIsSelectCredential] = useState<boolean>(false);
  const [credentialsToShare, setCredentialsToShare] = useState<any[]>([]);
  const [isShareIssuedCredentialLoading, setIsShareIssuedCredentialLoading] = useState<boolean>(false);
  const [isShowGenerateLinkDialog, setIsShowGenerateLinkDialog] = useState<boolean>(false);
  const [didResponse, setDidResponse] = useState<ShareDidResponse | undefined>(undefined);

  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);

  const _listReceivedCredentials = useCallback(
    (page: number) => {
      paginateReceivedCredentials(
        page,
        12,
        'created_at',
        'desc',
        undefined,
        organizationTheme.organizationId,
        'Organizations'
      )
        .then((res: any) => {
          if (!isCompMounted.current) return;
          const { items, page, total_pages } = res?.data?.data;
          setIssuedCredentials((prevValues: any[]) => [...prevValues, ...(items ?? [])]);
          if (page >= total_pages) setHasMore(false);
        })
        .catch(() => {
          if (!isCompMounted.current) return;
          showMessage('', 'Problemas al cargar los certificados emitidos.', 'error', true);
        });
    },
    [organizationTheme]
  );

  const loadReceivedCredentials = useCallback(
    async (_page: number) => {
      await _listReceivedCredentials(_page);
    },
    [_listReceivedCredentials]
  );

  const handleOnSelectIssuedCredential = useCallback((issuedCredential: any) => {
    setCredentialsToShare((prevValues: any[]) => {
      if (prevValues.includes(issuedCredential.id)) {
        return prevValues.filter((item: any) => item !== issuedCredential.id);
      }
      return [...prevValues, issuedCredential.id];
    });
  }, []);

  const handleSaveSelection = useCallback(
    (name: string, description: string) => {
      const data = {
        name: name,
        description: description,
        role: 'SUBJECT',
        issued_credentials_id: credentialsToShare
      };
      setIsShareIssuedCredentialLoading(true);
      shareDid(data)
        .then((resp: any) => {
          setIsShareIssuedCredentialLoading(false);
          setIsShowGenerateLinkDialog(false);
          setIsSelectCredential(false);
          setCredentialsToShare([]);
          const { code, full_path, path } = resp?.data?.data;
          const obj: ShareDidResponse = {
            code,
            full_path,
            path
          };
          setDidResponse(obj);
          setIsOpenShareOptionsDialog(true);
          // handleIsOpenShareOptionsDialog();
          // history(routes.shareCredentials);
        })
        .catch(() => {
          setIsShareIssuedCredentialLoading(false);
          showMessage('', 'Problemas al compartir los certificados.', 'error', true);
        });
    },
    [credentialsToShare]
  );

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xs: 'column', md: 'row' }}
        ref={isCompMounted}
        mb={1}
      >
        <Box>
          <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
            Certificados
          </Box>
          <Breadcrumbs
            breadcrumbs={[
              {
                path: routes.dashboard,
                component: <Icon fontSize="small">home</Icon>
              },
              { path: routes.credential, component: 'Certificados' },
              {
                component: 'Certificados recibidos'
              }
            ]}
          />
        </Box>
        <Box display="flex">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={'100%'}
            mt={{ xs: 1, md: 0 }}
            sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
          >
            {!isSelectCredential ? (
              <>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    setIsSelectCredential(true);
                  }}
                >
                  Seleccionar certificados
                </Button>
                {/* <Button
                  variant="outlined"
                  text=" Seleccionar todos"
                  onClick={() => {
                    setIsSelectCredential(true);
                  }}
                /> */}
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ minWidth: '164px' }}
                  onClick={() => {
                    setCredentialsToShare([]);
                    setIsSelectCredential(false);
                  }}
                >
                  Quitar selección
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<Icon fontSize="small">share</Icon>}
                  sx={{ marginLeft: { xs: 0, md: 1 }, marginTop: { xs: 1, md: 0 } }}
                  onClick={() => {
                    setIsShowGenerateLinkDialog(true);
                  }}
                >
                  Compartir
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
      {/* <Box my={2}>
        <Button
          color="inherit"
          variant="contained"
          text="Filtros"
          onClick={handleActiveDrawer}
          endIcon={<Icon fontSize="small">filter_list</Icon>}
        />
      </Box> */}
      <Box mt={4}>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadReceivedCredentials}
          hasMore={hasMore}
          loader={
            <Box my={1} mt={3} key="loading">
              <LinearProgress loading={true} />
            </Box>
          }
        >
          {!hasMore && issuedCredentials?.length === 0 ? (
            // <Box px={2}>No se encontraron certificados emitidos.</Box>
            <Box display="flex" mt={4} justifyContent="center" alignItems="center" width="100%">
              <Typography fontSize="1.7em" color="#CFD9DE" align="center">
                No se encontraron certificados recibidos.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {issuedCredentials.map((issuedCredential: any, index: number) => (
                <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={`issued_credential_${index}`}>
                  <Box position="relative">
                    {isSelectCredential && (
                      <>
                        <Box
                          position="absolute"
                          width="100%"
                          height="100%"
                          zIndex={10}
                          sx={{
                            borderRadius: '8px',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                          }}
                        />
                        <Checkbox
                          id="category"
                          name="category"
                          icon={<Icon sx={{ fontSize: '35px !important' }}>panorama_fish_eye</Icon>}
                          checkedIcon={<Icon sx={{ fontSize: '35px !important' }}>check_circle</Icon>}
                          onChange={() => handleOnSelectIssuedCredential(issuedCredential)}
                          value={issuedCredential.id}
                          defaultChecked={credentialsToShare.includes(issuedCredential.id)}
                          sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            zIndex: 20,
                            color: 'white',
                            '&.Mui-checked': {
                              color: 'white'
                            }
                          }}
                        />
                      </>
                    )}
                    <Credential
                      issuedCredential={issuedCredential}
                      credentialValues={issuedCredential?.credential_values}
                      organizationTheme={organizationTheme}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </InfiniteScroll>
      </Box>

      {isShowGenerateLinkDialog && (
        <GenerateLinkDialog
          isLoading={isShareIssuedCredentialLoading}
          open={isShowGenerateLinkDialog}
          onClose={() => {
            setIsShowGenerateLinkDialog(false);
          }}
          onSaveAction={handleSaveSelection}
        />
      )}
      {isOpenShareOptionsDialog && (
        <ShareOptionsDialog
          open={isOpenShareOptionsDialog}
          didOptions={didResponse}
          onClose={() => {
            setIsOpenShareOptionsDialog(false);
          }}
        />
      )}
    </>
  );
};

export default SubjectCredentials;
