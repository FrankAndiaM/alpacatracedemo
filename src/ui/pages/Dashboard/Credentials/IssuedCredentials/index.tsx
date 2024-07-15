import React, { useCallback, useState, useRef } from 'react';
import { Box, Icon, Grid, List, Divider, Checkbox, Typography, Button as MatButton } from '@mui/material';
import { FormControlLabel, RadioGroup, Radio, IconButton } from '@mui/material';
import { Drawer } from '@mui/material';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';
// import IssuedCredentialCard from './IssuedCredentialCard';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { showMessage } from '~utils/Messages';
import { listIssueCredentials } from '~services/digital_identity/credential/credential';
import InfiniteScroll from 'react-infinite-scroller';
import { shareDid } from '~services/share_credentials';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
// import { listCredentialSchemaCategories } from '~services/digital_identity/credential/credential';
// import Button from '~ui/atoms/Button/Button';
import Credential from '~molecules/Credential';
import { useSelector } from 'react-redux';
import GenerateLinkDialog from '../ShareCredentials/components/GenerateLinkDialog';
import { ShareDidResponse } from '../ShareCredentials/CredentialsSelection';
import ShareOptionsDialog from '../ShareCredentials/components/ShareOptionsDialog';
import { useTheme } from '@mui/material/styles';

type IssuedCredentialsPageProps = unknown;

const IssuedCredentialsPage: React.FC<IssuedCredentialsPageProps> = () => {
  const isCompMounted = useRef(null);
  const theme = useTheme();
  const [isSelectCredential, setIsSelectCredential] = useState<boolean>(false);
  const [isShareIssuedCredentialLoading, setIsShareIssuedCredentialLoading] = useState<boolean>(false);
  const [isOpenShareOptionsDialog, setIsOpenShareOptionsDialog] = useState<boolean>(false);
  const [isShowGenerateLinkDialog, setIsShowGenerateLinkDialog] = useState<boolean>(false);
  const [credentialsToShare, setCredentialsToShare] = useState<any[]>([]);
  const [didResponse, setDidResponse] = useState<ShareDidResponse | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [issuedCredentials, setIssuedCredentials] = useState<any[]>([]);
  // const [credentialCategories, setCredentialCategories] = useState<any[]>([]);
  // const [credentialCategoriesLoading, setCredentialCategoriesLoading] = useState<boolean>(true);
  const [selectedCategories, _setSelectedCategories] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<any[]>([]);
  const [issuanceAt, setIssuanceAt] = useState<string>('');
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);

  const _listIssueCredentials = useCallback(async () => {
    await listIssueCredentials(page, 12, selectedCategories, selectedStatus, issuanceAt)
      .then((res: any) => {
        if (!isCompMounted.current) return;
        const data = res?.data?.data;
        if (data.current_page >= data.total_pages - 1) {
          setHasMore(false);
        }
        setIssuedCredentials((prevValues: any[]) => [...prevValues, ...(data.items ?? [])]);
        setPage((prevPage: number) => ++prevPage);
      })
      .catch(() => {
        if (!isCompMounted.current) return;
        showMessage('', 'Problemas al cargar los certificados emitidos.', 'error', true);
      });
  }, [page, selectedCategories, selectedStatus, issuanceAt]);

  const loadIssuedCredentials = useCallback(
    async (_page: number) => {
      await _listIssueCredentials();
    },
    [_listIssueCredentials]
  );

  const handleOnSelectIssuedCredential = useCallback((issuedCredential: any) => {
    setCredentialsToShare((prevValues: any[]) => {
      if (prevValues.includes(issuedCredential.id)) {
        return prevValues.filter((item: any) => item !== issuedCredential.id);
      }
      return [...prevValues, issuedCredential.id];
    });
  }, []);

  const handleOnSelectStatus = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedStatus((prevValues: any[]) => {
      if (checked) {
        return [...prevValues, value];
      }
      return prevValues.filter((item: any) => item !== value);
    });
    setIssuedCredentials([]);
    setHasMore(true);
    setPage(0);
  }, []);

  const handleClickRadio = useCallback((event: any) => {
    const { value } = event.target;
    setIssuanceAt((prevValue: string) => {
      if (value === prevValue) {
        return '';
      }
      return value;
    });
    setIssuedCredentials([]);
    setHasMore(true);
    setPage(0);
  }, []);

  const handleActiveDrawer = useCallback(() => {
    setIsOpenDrawer((prevValue: boolean) => !prevValue);
  }, []);

  const handleIsStatusChecked = useCallback(
    (status: any): boolean => selectedStatus.includes(status),
    [selectedStatus]
  );

  const handleSaveSelection = useCallback(
    (name: string, description: string) => {
      const data = {
        name: name,
        description: description,
        role: 'ISSUER',
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
                component: 'Certificados emitidos'
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
                <MatButton
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    setIsSelectCredential(true);
                  }}
                >
                  Seleccionar certificados
                </MatButton>
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
                <MatButton
                  variant="contained"
                  fullWidth
                  sx={{ minWidth: '164px' }}
                  onClick={() => {
                    setCredentialsToShare([]);
                    setIsSelectCredential(false);
                  }}
                >
                  Quitar selección
                </MatButton>
                <MatButton
                  variant="contained"
                  fullWidth
                  endIcon={<Icon fontSize="small">share</Icon>}
                  sx={{ marginLeft: { xs: 0, md: 1 }, marginTop: { xs: 1, md: 0 } }}
                  onClick={() => {
                    setIsShowGenerateLinkDialog(true);
                  }}
                >
                  Compartir
                </MatButton>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Box my={2}>
        <MatButton
          color="inherit"
          variant="contained"
          sx={{ width: { xs: '100%', md: '164px' } }}
          onClick={handleActiveDrawer}
          endIcon={<Icon fontSize="small">filter_list</Icon>}
        >
          Filtros
        </MatButton>
      </Box>
      <Box mt={2}>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadIssuedCredentials}
          hasMore={hasMore}
          loader={
            <Box my={3} key="loading">
              <LinearProgress loading={true} />
            </Box>
          }
        >
          <Grid container spacing={4}>
            {!hasMore && issuedCredentials?.length === 0 ? (
              // <Box px={2}>No se encontraron certificados emitidos.</Box>
              <Box display="flex" mt={4} justifyContent="center" alignItems="center" width="100%">
                <Typography fontSize="1.7em" color="#CFD9DE" align="center">
                  No se encontraron certificados emitidos.
                </Typography>
              </Box>
            ) : (
              issuedCredentials.map((issuedCredential: any, index: number) => (
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
                      credentialValues={issuedCredential?.credential_values?.claims}
                      organizationTheme={organizationTheme}
                    />
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </InfiniteScroll>
      </Box>
      <Drawer
        // variant="persistent"
        anchor="right"
        onClose={handleActiveDrawer}
        open={isOpenDrawer}
        PaperProps={{
          sx: { width: 300, bgcolor: 'background.default' }
        }}
      >
        <Scrollbar
          sx={{
            height: '100%',
            '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
          }}
        >
          <List disablePadding>
            <Box display="flex" justifyContent="space-between" p={2}>
              <Box fontWeight={500}>Filtros</Box>
              <Box>
                <IconButton size="small" onClick={handleActiveDrawer}>
                  <Icon fontSize="small">close</Icon>
                </IconButton>
              </Box>
            </Box>
            <Divider />
            <Box p={2} fontWeight={500}>
              ESTADOS
            </Box>
            <Box pl={3} pr={2}>
              <Box>
                <FormControlLabel
                  label="Emitiendo"
                  control={
                    <Checkbox
                      id="category"
                      name="category"
                      onChange={handleOnSelectStatus}
                      value="Offered"
                      defaultChecked={handleIsStatusChecked('Offered')}
                    />
                  }
                />
              </Box>
              <Box>
                <FormControlLabel
                  label="Emitido"
                  control={
                    <Checkbox
                      id="category"
                      name="category"
                      onChange={handleOnSelectStatus}
                      value="Issued"
                      defaultChecked={handleIsStatusChecked('Issued')}
                    />
                  }
                />
              </Box>
            </Box>
            <Box p={2} fontWeight={500}>
              FECHA DE EMISIÓN
            </Box>
            <Box pl={3} pr={2}>
              <RadioGroup value={issuanceAt}>
                <FormControlLabel value={1} label="Hace 1 mes" control={<Radio onClick={handleClickRadio} />} />
                <FormControlLabel value={2} label="Hace 2 meses" control={<Radio onClick={handleClickRadio} />} />
                <FormControlLabel value={3} label="Hace 3 meses" control={<Radio onClick={handleClickRadio} />} />
              </RadioGroup>
            </Box>
          </List>
        </Scrollbar>
      </Drawer>
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

export default IssuedCredentialsPage;
