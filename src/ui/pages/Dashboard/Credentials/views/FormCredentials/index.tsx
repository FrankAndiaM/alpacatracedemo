import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Icon, Chip, Tooltip, Paper, Tabs, Tab } from '@mui/material';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import routes from '~routes/routes';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import Button from '~ui/atoms/Button/Button';
import {
  getCredentialSchema,
  listIssueCredentialsByCredentialId
} from '~services/digital_identity/credential/credential';
import { showMessage } from '~utils/Messages';
import { getStatusIssueCredential } from '../../colorLabelStatus';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import IconButton from '~atoms/IconButton/IconButton';
import ShowIssuedCredentialDialog from '../../components/ShowIssuedCredentialDialog';
// import CredentialHeader from '../../components/CredentialHeader';
import OfferFormCredentialDialog from './OfferFormCredentialDialog';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { useTheme } from '@mui/material/styles';

type FormCredentialsPageProps = unknown;

const FormCredentialsPage: React.FC<FormCredentialsPageProps> = () => {
  const history = useNavigate();
  const theme = useTheme();
  const isCompMounted = useRef(null);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShowIssuedCredentialDialog, setIsShowIssuedCredentialDialog] = useState<boolean>(false);
  const [issuedCredentialId, setIssuedCredentialId] = useState<string>('');
  // const [isCredentialLoading, setIsCredentialLoading] = useState<boolean>(true);
  const [isOfferCredentialDialogOpen, setIsOfferCredentialDialogOpen] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]);
  const [credentialSchema, setCredentialSchema] = useState<any | undefined>(undefined);

  // eslint-disable-next-line
  // @ts-ignore
  const { credential_id } = useParams();
  if (!credential_id) history(routes.agroLeader);

  const credentialId: string = credential_id !== undefined ? credential_id : '';

  const _listProducersIssuedCredential = useCallback(() => {
    setIsLoading(true);
    listIssueCredentialsByCredentialId(credential_id ?? '')
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
  }, [credential_id]);

  const showIssuedCredential = useCallback((issuedCredentialId?: string) => {
    if (issuedCredentialId !== undefined) setIssuedCredentialId(issuedCredentialId);
    setIsShowIssuedCredentialDialog((prevState: boolean) => !prevState);
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
        sorteable: true,
        align: 'left',
        text: 'Nombre del productor',
        padding: 'none',
        value: 'producer',
        render: (row: any) => row?.producer?.full_name
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
          const status = row?.status;
          const { labelText, colorBox, colorText } = getStatusIssueCredential(status, theme);
          if (status === 'pending') {
            return (
              <Box display="flex" alignItems="center">
                <Chip label={labelText} sx={{ background: colorBox, color: colorText }} />
                <Tooltip title="Se emitirá en un plazo max 24h">
                  <Icon sx={{ color: '#687782' }}>watch_later</Icon>
                </Tooltip>
              </Box>
            );
          }
          return <Chip label={labelText} sx={{ background: colorBox, color: colorText }} />;
        }
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Acciones',
        padding: 'none',
        value: '',
        render: (row: any) => {
          if (row?.status === 'registered') {
            return (
              <IconButton
                icon="visibility"
                onClick={() => showIssuedCredential(row?.issued_credential_id)}
                tooltipText="Ver certificado emitido"
              />
            );
          }
        }
      }
    ];
    setHeaders(_headers);
  }, [showIssuedCredential, theme]);

  const handleOnClose = useCallback(
    (isRefresh?: boolean) => {
      if (isRefresh !== undefined && isRefresh) {
        _listProducersIssuedCredential();
      }
      setIsOfferCredentialDialogOpen((prevState: boolean) => !prevState);
    },
    [_listProducersIssuedCredential]
  );

  return (
    <Box ref={isCompMounted}>
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
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          text="Actualizar"
          variant="outlined"
          startIcon={<Icon>loop</Icon>}
          onClick={_listProducersIssuedCredential}
        />
        <Button
          text="Emitir certificado"
          variant="contained"
          startIcon={<Icon>add</Icon>}
          onClick={() => handleOnClose()}
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
        <Box px={2} pt={2} pb={2} minHeight={130} sx={{ backgroundColor: 'rgba(0, 82, 73, 1)', borderRadius: '16px' }}>
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
        <DataTable
          headers={headers}
          items={items}
          loading={isLoading}
          headComponent={(searchComponent: React.ReactNode) => (
            <Box display="flex" justifyContent="space-between">
              {searchComponent}
            </Box>
          )}
        />
        B
      </Box>
      {isOfferCredentialDialogOpen && <OfferFormCredentialDialog credentialId={credentialId} onClose={handleOnClose} />}
      {isShowIssuedCredentialDialog && (
        <ShowIssuedCredentialDialog
          credentialSchema={credentialSchema}
          issuedCredentialId={issuedCredentialId}
          onClose={showIssuedCredential}
        />
      )}
    </Box>
  );
};

export default FormCredentialsPage;
