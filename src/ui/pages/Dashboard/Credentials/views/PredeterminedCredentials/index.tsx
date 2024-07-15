import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Icon, Chip, Tooltip, Paper, Tabs, Tab } from '@mui/material';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import routes from '~routes/routes';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import Button from '~ui/atoms/Button/Button';
import { getCredentialSchema, listDefaultIssuedCredentials } from '~services/digital_identity/credential/credential';
import { getStatusColorCredentials } from '../../colorLabelStatus';
import { showMessage } from '~utils/Messages';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import IconButton from '~atoms/IconButton/IconButton';
// import CredentialHeader from '../../components/CredentialHeader';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import ShowIssuedCredentialDialog from '../../components/ShowIssuedCredentialDialog';
import OfferPredeterminedCredentialView from './OfferCredential';
// import SelectField from '~ui/atoms/SelectField/SelectField';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { useSelector } from 'react-redux';
import { AttributesRelation, AttributesRelationDefault } from '~models/clothes';
import { useTheme } from '@mui/material/styles';

type PredeterminedCredentialsPageProps = unknown;

const PredeterminedCredentialsPage: React.FC<PredeterminedCredentialsPageProps> = () => {
  const history = useNavigate();
  const theme = useTheme();
  const isCompMounted = useRef(null);
  const { auth }: any = useSelector((state: any) => state);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShowIssuedCredentialDialog, setIsShowIssuedCredentialDialog] = useState<boolean>(false);
  const [issuedCredential, setIssuedCredential] = useState<any | undefined>(undefined);
  // const [isCredentialLoading, setIsCredentialLoading] = useState<boolean>(true);
  const [isIssueCredentialDialogOpen, setIsIssueCredentialDialogOpen] = useState<boolean>(false);
  // const [modelType, setModelType] = useState<'Farmers' | 'Organizations' | 'all'>('all');
  const [items, setItems] = useState<any[]>([]);
  const [credentialSchema, setCredentialSchema] = useState<CredentialSchemaModel | undefined>(undefined);
  // eslint-disable-next-line
  // @ts-ignore
  const { credential_id } = useParams();
  if (!credential_id) history(routes.agroLeader);

  const [attributesRelation, setAttributesRelation] = useState<AttributesRelation>(AttributesRelationDefault);

  useEffect(() => {
    if (auth?.organizationTheme?.attributes_relation && Array.isArray(auth?.organizationTheme?.attributes_relation)) {
      const relation = auth?.organizationTheme?.attributes_relation.find(
        (element: any) => element?.entity_model_type === 'Clothes'
      );
      if (relation) {
        setAttributesRelation(relation);
      }
    }
  }, [auth?.organizationTheme?.attributes_relation]);

  const credentialId: string = credential_id !== undefined ? credential_id : '';

  const _listProducersIssuedCredential = useCallback(() => {
    setIsLoading(true);
    listDefaultIssuedCredentials(credentialId, 'all')
      .then((res: any) => {
        if (!isCompMounted.current) return;
        const data = res.data.data;
        setItems(data);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isCompMounted.current) return;
        setIsLoading(false);
        showMessage('', 'Problemas al cargar los certificados emitidos', 'error');
      });
  }, [credentialId]);

  const showIssuedCredential = useCallback(
    (issuedCredential: any) => {
      setIsShowIssuedCredentialDialog(true);
      const obj = { ...issuedCredential, credential: credentialSchema };
      setIssuedCredential(obj);
    },
    [credentialSchema]
  );

  const handleCloseIssuedCredential = useCallback(() => {
    setIsShowIssuedCredentialDialog(false);
    setIssuedCredential(undefined);
  }, []);

  const _getCredentialSchema = useCallback(() => {
    getCredentialSchema(credentialId)
      .then((res: any) => {
        if (!isCompMounted.current) return;
        const data = res.data.data;
        setCredentialSchema(data);
        // setIsCredentialLoading(false);
        _listProducersIssuedCredential();
      })
      .catch(() => {
        if (!isCompMounted.current) return;
        showMessage('', 'Problemas al cargar el certificado', 'error');
      });
  }, [credentialId, _listProducersIssuedCredential]);

  useEffect(() => {
    _getCredentialSchema();
  }, [_getCredentialSchema]);

  useEffect(() => {
    const _headers: TableHeadColumn[] = [
      {
        sorteable: false,
        align: 'left',
        text: 'Nombre',
        padding: 'none',
        // eslint-disable-next-line quotes
        value: "credential_values?.claims['Nombre de la prenda']",
        render: (row: any) => {
          return (
            <>
              {row?.credential_values?.claims['Nombre de la prenda'] && (
                <>{row?.credential_values?.claims['Nombre de la prenda']}</>
              )}
            </>
          );
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Fecha de registro',
        padding: 'none',
        value: 'created_at',
        render: (row: any) => {
          if (row?.created_at !== undefined) {
            const created_at = new Date(row?.created_at);
            return (
              <Box>
                {format(new Date(created_at), 'dd MMM yyyy', { locale: es })}
                <Box fontSize="12px" color="#9FA2B4">
                  {formatToTimeZone(created_at, 'hh:mm aa', {
                    timeZone: 'America/Lima'
                  })}
                </Box>
              </Box>
            );
          }
        }
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Estado',
        padding: 'none',
        value: 'status',
        render: (row: any) => {
          const status = row?.credential_status?.name;
          const { labelText, ColorBox, colorText } = getStatusColorCredentials(status, theme);
          if (status === 'Offered') {
            return (
              <Box display="flex" alignItems="center">
                <Chip
                  label={labelText}
                  style={{ borderRadius: '22px' }}
                  sx={{ background: ColorBox, color: colorText }}
                />
                <Tooltip title="Se emitirá en un plazo max 24h">
                  <Icon sx={{ color: '#687782' }}>watch_later</Icon>
                </Tooltip>
              </Box>
            );
          }
          return (
            <Chip label={labelText} style={{ borderRadius: '22px' }} sx={{ background: ColorBox, color: colorText }} />
          );
        }
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Acciones',
        padding: 'none',
        value: '',
        render: (row: any) => (
          <IconButton
            icon="visibility"
            onClick={() => showIssuedCredential(row)}
            tooltipText="Ver certificado emitido"
          />
        )
      }
    ];
    setHeaders(_headers);
  }, [showIssuedCredential, theme]);

  const handleOnClose = useCallback(
    (isRefresh?: boolean) => {
      if (isRefresh !== undefined && isRefresh) {
        _listProducersIssuedCredential();
      }
      setIsIssueCredentialDialogOpen((prevState: boolean) => !prevState);
    },
    [_listProducersIssuedCredential]
  );

  // const handleModelTypeOnChange = useCallback((_: any, value: any) => {
  //   setModelType(value);
  // }, []);

  return (
    <Box ref={isCompMounted}>
      {!isIssueCredentialDialogOpen && (
        <>
          <Box>
            <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color={theme.palette.primary.main}>
              Emisión de certificados blockchain
            </Box>
            <Breadcrumbs
              breadcrumbs={[
                {
                  path: routes.dashboard,
                  component: <Icon fontSize="small">home</Icon>
                },
                {
                  path: routes.credential,
                  component: 'Certificados blockchain'
                },
                {
                  component: 'Emisión de certificados blockchain'
                }
              ]}
            />
          </Box>
          <Box mt={3} display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="flex-end">
            <Button
              text="Emitir certificado"
              variant="contained"
              fullWidth
              startIcon={<Icon>add</Icon>}
              onClick={() => handleOnClose()}
            />
            <Button
              text="Actualizar"
              variant="outlined"
              fullWidth
              startIcon={<Icon>loop</Icon>}
              onClick={_listProducersIssuedCredential}
            />
          </Box>
          <LinearProgress loading={isLoading} />
          <Paper
            elevation={1}
            sx={{
              mt: 2,
              minHeight: 130,
              position: 'relative',
              borderRadius: '20px'
            }}
          >
            <Box
              px={2}
              pt={2}
              pb={2}
              minHeight={130}
              sx={{ backgroundColor: theme.palette.primary.main, borderRadius: '16px' }}
            >
              <Box fontWeight={700} color="white" fontSize="1.5rem" sx={{ wordBreak: 'break-word' }}>
                {credentialSchema?.name ?? '-'}
              </Box>
              <Box color="white" sx={{ wordBreak: 'break-word' }}>
                {credentialSchema?.description ?? '-'}
              </Box>
            </Box>
          </Paper>

          <Box>
            <Tabs value={0} aria-label="disabled tabs example">
              <Tab label="Certificados emitidos" />
            </Tabs>
          </Box>

          <Box mt={2}>
            {/*  */}
            <DataTable
              headers={headers}
              items={items}
              loading={isLoading}
              searchFullWidth={true}
              searchSize="small"
              isSearch={true}
            />
          </Box>
        </>
      )}
      {isIssueCredentialDialogOpen && credentialSchema !== undefined && (
        <OfferPredeterminedCredentialView
          credentialSchema={credentialSchema}
          onClose={handleOnClose}
          attributesRelation={attributesRelation}
        />
      )}
      {isShowIssuedCredentialDialog && (
        <ShowIssuedCredentialDialog
          credentialSchema={credentialSchema}
          issuedCredential={issuedCredential}
          onClose={handleCloseIssuedCredential}
        />
      )}
    </Box>
  );
};

export default PredeterminedCredentialsPage;
