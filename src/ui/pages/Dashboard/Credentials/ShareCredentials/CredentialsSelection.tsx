import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Checkbox, Grid, Icon, Paper } from '@mui/material';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';
import Button from '~atoms/Button/Button';
// import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import IconStroke from '~assets/img/icon_stroke.png';
import { makeStyles } from '@mui/styles';
import InfiniteScroll from 'react-infinite-scroller';
// import IssuedCredentialCard from './components/CredentialCard';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { showMessage } from '~utils/Messages';
// import MultipleSelectCheckmark from './components/MultipleSelectCheckmarks';
import GenerateLinkDialog from './components/GenerateLinkDialog';
import ShareOptionsDialog from './components/ShareOptionsDialog';
// import { paginateFarmers } from '~services/farmer';
// import useDebounce from '~hooks/use_debounce';
import { paginateIssuedCredentials, shareDid } from '~services/share_credentials';
import TextFieldSearch from '~ui/molecules/TextFieldSearch/TextFieldSearch';
// import TextField from '~ui/atoms/TextField/TextField';
import Credential from '~molecules/Credential';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
// import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const useStyles: any = makeStyles(() => ({
  numberStyle: {
    fontSize: '16px',
    color: '#00822B',
    fontWeight: 700
  },
  checkboxAll: {
    width: '178px',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  selectionCheck: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: '3px solid rgba(0, 82, 73, 1)',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  selectionSelected: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    color: 'white',
    backgroundColor: 'rgba(0, 82, 73, 1)',
    border: '3px solid rgba(0, 82, 73, 1)',
    '&:hover': {
      cursor: 'pointer'
    }
  }
}));

export type ShareDidResponse = {
  code: string;
  full_path: string;
  path: string;
};

type CredentialsSelectionPageProps = unknown;

const CredentialsSelectionPage: React.FC<CredentialsSelectionPageProps> = () => {
  const isCompMounted = useRef(null);
  // const history = useNavigate();
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);
  const classes = useStyles();
  const theme = useTheme();
  const [selectAll] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [issuedCredentials, setIssuedCredentials] = useState<any[]>([]);
  const [prevIssuedCredentials, setPrevIssuedCredentials] = useState<any[]>([]);
  const [producersStrSelected] = useState<string>('');
  const [producersSelected] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [lengthSelectedCredentials, setLengthSelectedCredentials] = useState<string>('0');
  const [isOpenGenerateLinkDialog, setIsOpenGenerateLinkDialog] = useState<boolean>(false);
  const [isOpenShareOptionsDialog, setIsOpenShareOptionsDialog] = useState<boolean>(false);
  // const [isLoadingProducers, setIsLoadingProducers] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCredentials, setSelectedCredentials] = useState<any[]>([]);
  // const [selectedCredentialsObj, setSelectedCredentialsObj] = useState<any[]>([]);
  const [excludes] = useState<string[]>([]);
  const [didResponse, setDidResponse] = useState<ShareDidResponse | undefined>(undefined);
  const [shareInfo, setShareInfo] = useState<{
    credentials_quantity: any;
    producers_quantity: number;
    excludes_quantity: string;
  }>({
    credentials_quantity: 0,
    producers_quantity: 0,
    excludes_quantity: ''
  });
  // const [searchValue, setSearchValue] = useState<string>('');
  // const debouncedSearch = useDebounce(searchValue, 1000);

  // const _paginateFarmers = useCallback(
  //   (page: number, per_page: number, sort_by: string, order: string, search: string) => {
  //     return paginateFarmers(page, per_page, sort_by, order, search);
  //   },
  //   []
  // );

  const handleIsOpenGenerateLinkDialog = useCallback(() => {
    if (!selectAll && selectedCredentials.length <= 0) {
      showMessage('', 'Debes seleccionar al menos un certificado.', 'info', false);
      return;
    }
    setIsOpenGenerateLinkDialog((prev: boolean) => !prev);
  }, [selectAll, selectedCredentials]);

  const handleIsOpenShareOptionsDialog = useCallback(() => {
    setIsOpenShareOptionsDialog((prev: boolean) => !prev);
  }, []);

  const handleSelectCredential = useCallback(
    (credential: any) => {
      if (credential && credential?.id) {
        const { id } = credential;
        let idx = undefined;
        idx = selectedCredentials.findIndex((value: any) => value?.id === id);
        if (idx === -1) {
          setSelectedCredentials((prev: any[]) => [...prev, credential]);
        } else {
          let arr: string[] = [];
          arr = Object.assign([], selectedCredentials);
          arr.splice(idx, 1);
          setSelectedCredentials(arr);
        }
      }
    },
    [selectedCredentials]
  );

  // const handleChangeSelectAll = useCallback(() => {
  //   setSelectAll((prev: boolean) => {
  //     if (prev) {
  //       setSelectedCredentials([]);
  //       setExcludes([]);
  //       return false;
  //     }
  //     setSelectedCredentials(['all']);
  //     return true;
  //   });
  // }, []);

  const _listIssueCredentials = useCallback(async () => {
    // if (hasMore) {
    await paginateIssuedCredentials(page, 12, '', '', '', producersStrSelected)
      .then((res: any) => {
        if (!isCompMounted.current) return;
        const data = res?.data?.data;
        // console.log(data);
        setIssuedCredentials((prevValues: any[]) => {
          return [...prevValues, ...(data.items ?? [])];
        });
        if (data.page >= data.total_pages) {
          setHasMore(false);
        } else {
          setPage((prevPage: number) => ++prevPage);
        }
        // setIssuedCredentials(data.items ?? []);
      })
      .catch(() => {
        if (!isCompMounted.current) return;
        showMessage('', 'Problemas al cargar los certificados emitidos.', 'error', true);
      });
    // }
  }, [page, producersStrSelected]);

  const loadIssuedCredentials = useCallback(
    (_page: number) => {
      hasMore && _listIssueCredentials();
    },
    [_listIssueCredentials, hasMore]
  );

  // useEffect(() => {
  //   const rows: Array<MultipleSelectOption> = [
  //     { display_name: 'Oliver Hansen', id: '1' },
  //     { display_name: 'Van Henry', id: '2' },
  //     { display_name: 'April Tucker', id: '3' },
  //     { display_name: 'Ralph Hubbard', id: '4' },
  //     { display_name: 'Omar Alexander', id: '5' },
  //     { display_name: 'Carlos Abbott', id: '6' },
  //     { display_name: 'Miriam Wagner', id: '7' },
  //     { display_name: 'Bradley Wilkerson', id: '8' },
  //     { display_name: 'Virginia Andrews', id: '9' },
  //     { display_name: 'Kelly Snyder', id: '10' }
  //   ];
  //   setProducers(rows);
  // }, []);

  const handleSaveSelection = useCallback(
    (name: string, description: string) => {
      setIsLoading(true);
      const excludes_str: string = excludes.length > 0 ? ` excluyendo ${excludes.length}` : '';
      let credentialsAll: any[] = [];
      let credentials_str: any = selectedCredentials.length;
      if (selectedCredentials[0] !== 'all') {
        credentialsAll = selectedCredentials.map((element: any) => element?.id);
      } else {
        credentials_str = 'Todos los';
      }
      setShareInfo({
        credentials_quantity: credentials_str,
        producers_quantity: producersSelected.length,
        excludes_quantity: excludes_str
      });

      const obj = {
        name: name,
        description: description,
        producers: producersSelected.map((element: any) => element.id),
        credential_name: '',
        credentials_all: selectAll,
        issued_credentials_id: credentialsAll,
        issued_credentials_excludes_id: excludes
      };

      shareDid(obj)
        .then((resp: any) => {
          // showMessage('', 'Se compartieron correctamente.', 'success', true);
          setIsLoading(false);
          const { code, full_path, path } = resp?.data?.data;
          // console.log(resp.data.data);
          const obj: ShareDidResponse = {
            code,
            full_path,
            path
          };
          setDidResponse(obj);
          handleIsOpenGenerateLinkDialog();
          handleIsOpenShareOptionsDialog();
          // history(routes.shareCredentials);
        })
        .catch(() => {
          setIsLoading(false);
          showMessage('', 'Problemas al compartir los certificados.', 'error', true);
        });
    },
    [
      selectedCredentials,
      producersSelected,
      selectAll,
      excludes,
      handleIsOpenGenerateLinkDialog,
      handleIsOpenShareOptionsDialog
    ]
  );

  // const clearFields = useCallback(() => {
  //   setPage(0);
  //   setExcludes([]);
  //   setSelectedCredentials([]);
  //   setIssuedCredentials([]);
  //   setHasMore(true);
  // }, []);

  // const handleSetItems = useCallback(
  //   (items: any[]) => {
  //     if (items.length > 0) {
  //       const ids = items.map((e: any) => e.id ?? '');
  //       setProducersSelected(ids);
  //     }
  //     let strProducers = '';
  //     items.forEach((e: any) => {
  //       strProducers += `&producers_id=${e.id ?? ''}`;
  //     });
  //     // const ids = items.map((e: any) => `&producers_id=${e.id}` ?? '');
  //     if (strProducers !== '') {
  //       // console.log(items);
  //       clearFields();
  //       setProducersStrSelected(strProducers);
  //     }
  //   },
  //   [clearFields]
  // );
  // useEffect(() => {
  //   console.log(producersSelected);
  // }, [producersSelected]);

  // const renderItem = useCallback((row: any) => {
  //   return (
  //     <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} pl={1}>
  //       <Typography>{row.full_name ?? ''}</Typography>
  //       <Typography color={'#536471'} fontWeight={700} fontSize={12}>
  //         {row.credentials_quantity ?? 0} - Certificados
  //       </Typography>
  //       {/* <Typography color={'#637381'} fontWeight={400} fontSize={14}></Typography> */}
  //     </Box>
  //   );
  // }, []);

  // const handleGetOptionDisabled = useCallback((option: any): boolean => {
  //   if (option.hasOwnProperty('credentials_quantity') && option.credentials_quantity <= 0) {
  //     return true;
  //   }
  //   return false;
  // }, []);

  const handleChange = useCallback(
    (value: string) => {
      // console.log(value);
      if (value === '') {
        setIssuedCredentials([...selectedCredentials, ...prevIssuedCredentials]);
      } else {
        setIssuedCredentials((prev: any) => {
          setPrevIssuedCredentials(prev);
          setPage(1);
          return [];
        });
        // setSearchValue(value);
      }
    },
    [prevIssuedCredentials, selectedCredentials]
  );

  // useEffect(() => {
  //   async function getSearch() {
  //     console.log('heer');
  //     setIssuedCredentials((prev: any[]) => {
  //       setPrevIssuedCredentials(prev);
  //       return [];
  //     });
  //     const data = await paginateIssuedCredentials(1, 12, '', '', debouncedSearch, '').then(
  //       (res: any) => res?.data?.data
  //     );
  //     if (data && data.items.length > 0) {
  //       setIssuedCredentials([...selectedCredentials, ...(data.items ?? [])]);
  //     }
  //   }
  //   if (debouncedSearch) {
  //     getSearch();
  //   }
  //   // else {
  //   //   setIssuedCredentials(prevIssuedCredentials);
  //   // }
  // }, [debouncedSearch, page, selectedCredentials]);

  useEffect(() => {
    if (selectedCredentials[0] === 'all') {
      if (excludes.length > 0) {
        setLengthSelectedCredentials(`Todos, -${excludes.length}`);
      } else {
        setLengthSelectedCredentials('Todos');
      }
    } else {
      setLengthSelectedCredentials(`${selectedCredentials.length}`);
    }
  }, [selectedCredentials, excludes]);

  return (
    <>
      <Grid container={true} spacing={1} ref={isCompMounted}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box mb="20px">
            <Grid container>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
                  Certificados
                </Box>
                <Box>
                  <Breadcrumbs
                    breadcrumbs={[
                      {
                        path: routes.dashboard,
                        component: <Icon fontSize="small">home</Icon>
                      },
                      {
                        path: routes.formCredentials,
                        component: 'Certificados blockchain'
                      },
                      {
                        path: routes.shareCredentials,
                        component: 'Compartir certificados'
                      },
                      {
                        component: 'Seleccionar certificados'
                      }
                    ]}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography fontWeight={700} mb={2} fontSize={18}>
            Selecciona los certificados que deseas compartir
          </Typography>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper data-testid="Paper" elevation={3} style={{ padding: '20px' }}>
            <Box display="flex" alignItems={'center'} width={'100%'}>
              {/* <MultipleSelectCheckmark
                labelText="Certificados"
                handleSetItems={handleSetItems}
                paginate={_paginateFarmers}
              /> */}
              {/* <TextField
                id={'text-filter'}
                label={'Certificado'}
                onChange={handleOnChangeSearch}
                name={'text-filter'}
                value={searchValue}
              /> */}
              {/* <MultipleSelectCheckmark
                labelText="Productor"
                handleSetItems={handleSetItems}
                paginate={_paginateFarmers}
                noItemsText={'Buscar productor'}
                renderItem={renderItem}
                getOptionDisabled={handleGetOptionDisabled}
              /> */}
              <Box width={'100%'}>
                <TextFieldSearch fullWidth isAnimated={false} size="small" onChange={handleChange} />
              </Box>
              <Button
                variant="contained"
                text="Generar link o QR"
                sx={{ marginLeft: '16px', borderRadius: '8px', padding: '12px 24px', width: 225, height: 40 }}
                startIcon={<img src={IconStroke} alt="stroke" />}
                onClick={handleIsOpenGenerateLinkDialog}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography my={2}>
            Total de certificados: <span className={classes.numberStyle}>{issuedCredentials.length}</span>
          </Typography>
          <Typography mt={2} mb={4}>
            Certificados seleccionados: <span className={classes.numberStyle}>{lengthSelectedCredentials}</span>
          </Typography>
          {/* <Box my={2} className={classes.checkboxAll} onClick={handleChangeSelectAll}>
            <Checkbox checked={selectAll} inputProps={{ 'aria-label': 'Checkbox all selection' }} />
            Seleccionar todos
          </Box> */}

          <Box mt={2}>
            <InfiniteScroll
              pageStart={1}
              loadMore={loadIssuedCredentials}
              hasMore={hasMore}
              loader={
                <Box my={1} key="loading">
                  <LinearProgress loading={true} />
                </Box>
              }
            >
              <Grid container spacing={4}>
                {!hasMore && issuedCredentials?.length === 0 ? (
                  <Box px={2}>No se encontraron certificados emitidos.</Box>
                ) : (
                  issuedCredentials.map((issuedCredential: any, index: number) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={`issued_credential_${index}`}>
                      {/* <IssuedCredentialCard
                        isSelected={
                          selectAll || selectedCredentials.findIndex((value: any) => value === issuedCredential.id) >= 0
                        }
                        isExclude={selectAll && excludes.findIndex((value: any) => value === issuedCredential.id) >= 0}
                        issuedCredential={issuedCredential}
                        handleSelectCredential={handleSelectCredential}
                      /> */}
                      <Box position="relative">
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
                          onChange={() => handleSelectCredential(issuedCredential)}
                          value={issuedCredential.id}
                          defaultChecked={selectedCredentials.includes(issuedCredential.id)}
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
                        <Credential
                          issuedCredential={issuedCredential}
                          credentialValues={issuedCredential?.credential_values}
                          organizationTheme={organizationTheme}
                        />
                      </Box>
                    </Grid>
                  ))
                )}
              </Grid>
            </InfiniteScroll>
          </Box>
        </Grid>
      </Grid>
      {
        <GenerateLinkDialog
          isLoading={isLoading}
          open={isOpenGenerateLinkDialog}
          onClose={handleIsOpenGenerateLinkDialog}
          onSaveAction={handleSaveSelection}
        />
      }
      {
        <ShareOptionsDialog
          open={isOpenShareOptionsDialog}
          didOptions={didResponse}
          onClose={handleIsOpenShareOptionsDialog}
          shareInfo={shareInfo}
        />
      }
    </>
  );
};

export default CredentialsSelectionPage;
