import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Icon, Chip, Tooltip, Grid } from '@mui/material';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import Button from '~ui/atoms/Button/Button';
import { listDefaultIssuedCredentials } from '~services/digital_identity/credential/credential';
import { getStatusColorCredentials } from '../../../../colorLabelStatus';
import { showMessage } from '~utils/Messages';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import IconButton from '~atoms/IconButton/IconButton';
import IndividualOfferCredentialDialog from './OfferDefaultCredential/IndividualIssuanceDialog';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import ShowIssuedCredentialDialog from '../../../../components/ShowIssuedCredentialDialog';
import MassiveIssuanceCredentialDialog from './OfferDefaultCredential/MassiveIssuanceDialog';
import SelectField from '~ui/atoms/SelectField/SelectField';
import { useTheme } from '@mui/material/styles';

type IssuanceTabProps = {
  credentialId: string;
  credentialSchema: CredentialSchemaModel | undefined;
};

const IssuanceTab: React.FC<IssuanceTabProps> = (props: IssuanceTabProps) => {
  const { credentialId, credentialSchema } = props;
  const theme = useTheme();
  const isCompMounted = useRef(null);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShowIssuedCredentialDialog, setIsShowIssuedCredentialDialog] = useState<boolean>(false);
  const [issuedCredential, setIssuedCredential] = useState<any | undefined>(undefined);
  const [items, setItems] = useState<any[]>([]);
  const [modelType, setModelType] = useState<'Farmers' | 'Organizations' | 'all'>('all');
  const [issueCredentialDialogOpen, setIssueCredentialDialogOpen] = useState<'individual' | 'massive' | undefined>(
    undefined
  );

  const _listProducersIssuedCredential = useCallback(
    (modelType: 'Farmers' | 'Organizations' | 'all') => {
      setIsLoading(true);
      listDefaultIssuedCredentials(credentialId, modelType)
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
    },
    [credentialId]
  );

  const showIssuedCredential = useCallback((issuedCredential: any) => {
    setIsShowIssuedCredentialDialog(true);
    setIssuedCredential(issuedCredential);
  }, []);

  const handleCloseIssuedCredential = useCallback(() => {
    setIsShowIssuedCredentialDialog(false);
    setIssuedCredential(undefined);
  }, []);

  const handleToggleIssueCredentialDialog = useCallback(
    (typeUseCredential: 'individual' | 'massive' | undefined, isUpdateTable?: boolean) => {
      if (isUpdateTable !== undefined && isUpdateTable) {
        _listProducersIssuedCredential(modelType);
      }
      setIssueCredentialDialogOpen(typeUseCredential);
    },
    [_listProducersIssuedCredential, modelType]
  );

  useEffect(() => {
    if (!credentialSchema !== undefined) {
      _listProducersIssuedCredential(modelType);
    }
  }, [credentialSchema, _listProducersIssuedCredential, modelType]);

  useEffect(() => {
    const _headers: TableHeadColumn[] = [
      {
        sorteable: true,
        align: 'left',
        text: 'Nombre',
        padding: 'none',
        value: 'entity',
        render: (row: any) => row?.entity?.full_name ?? row?.entity?.name
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Tipo',
        padding: 'none',
        value: 'type',
        render: (row: any) => {
          switch (row?.wallet?.model_type) {
            case 'Organizations':
              return 'Organización';
            default:
              return 'Productor';
          }
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
                <Chip label={labelText} sx={{ background: ColorBox, color: colorText }} />
                <Tooltip title="Se emitirá en un plazo max 24h">
                  <Icon sx={{ color: '#687782' }}>watch_later</Icon>
                </Tooltip>
              </Box>
            );
          }
          return <Chip label={labelText} sx={{ background: ColorBox, color: colorText }} />;
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

  const handleModelTypeOnChange = useCallback((_: any, value: any) => {
    setModelType(value);
  }, []);

  return (
    <>
      <Box mt={3} display="flex" justifyContent="flex-end" ref={isCompMounted}>
        <Button
          text="Emitir certificado"
          variant="contained"
          startIcon={<Icon>add</Icon>}
          onClick={() => handleToggleIssueCredentialDialog('individual')}
        />
      </Box>
      <Box mt={1}>
        <DataTable
          headers={headers}
          items={items}
          loading={isLoading}
          headComponent={(searchComponent: React.ReactChild) => {
            return (
              <>
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <SelectField
                          id="subject_model_type"
                          name="subject_model_type"
                          label="Seleccione un tipo"
                          fullWidth
                          items={[
                            {
                              id: 'all',
                              name: 'Todos'
                            },
                            {
                              id: 'Farmers',
                              name: 'Productores'
                            },
                            {
                              id: 'Organizations',
                              name: 'Organizaciones'
                            }
                          ]}
                          itemText="name"
                          itemValue="id"
                          value={modelType}
                          onChange={handleModelTypeOnChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                        {searchComponent}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    xl={6}
                    sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                  >
                    <Button
                      text="Actualizar"
                      variant="contained"
                      startIcon={<Icon>loop</Icon>}
                      onClick={() => {
                        _listProducersIssuedCredential(modelType);
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            );
          }}
        />
      </Box>

      {issueCredentialDialogOpen === 'individual' && credentialSchema !== undefined && (
        <IndividualOfferCredentialDialog
          credentialSchema={credentialSchema}
          onClose={handleToggleIssueCredentialDialog}
        />
      )}

      {issueCredentialDialogOpen === 'massive' && credentialSchema !== undefined && (
        <MassiveIssuanceCredentialDialog
          credentialSchema={credentialSchema}
          onClose={handleToggleIssueCredentialDialog}
        />
      )}

      {isShowIssuedCredentialDialog && (
        <ShowIssuedCredentialDialog
          credentialSchema={credentialSchema}
          issuedCredential={issuedCredential}
          onClose={handleCloseIssuedCredential}
        />
      )}
    </>
  );
};

export default IssuanceTab;
