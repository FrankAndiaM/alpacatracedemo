import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Icon } from '@mui/material';
import Button from '~ui/atoms/Button/Button';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import { listCredentialSchemas } from '~services/digital_identity/credential/credential';
import { showMessage } from '~utils/Messages';
import DateCell from '~ui/atoms/DateCell/DateCell';
import { getStatusCredentialSchema } from './colorLabelStatus';
import { useTheme } from '@mui/material/styles';
import routes from '~routes/routes';
// import ActionsMenu from '~ui/molecules/ActionsMenu';
import CreateFormCredentialSchemaDialog from './views/FormCredentials/CreateSchema';
import CreateDefaultCredentialSchemaDialog from './views/DefaultCredentials/CreateSchema';
import CreatePredeterminedCredencialSchemaDialog from './views/PredeterminedCredentials/CreateSchema';

type OwnCredentialsTabProps = unknown;

const OwnCredentialsTab: React.FC<OwnCredentialsTabProps> = () => {
  const isCompMounted = useRef(null);
  const theme = useTheme();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState<CredentialSchemaModel[]>([]);
  // Flags to create credentials
  const [showCreateCredentialDialog, setShowCreateCredentialDialog] = useState<
    undefined | 'default' | 'predetermined' | 'form'
  >(undefined);

  const history = useNavigate();

  const handleShowCredentialSchema = useCallback(
    (credentialSchema: CredentialSchemaModel) => {
      switch (credentialSchema.credential_schema_type) {
        case 'default':
          history(`${routes.defaultCredentials}/${credentialSchema.id}`);
          break;
        case 'predetermined':
          history(`${routes.predeterminedCredentials}/${credentialSchema.id}`);
          break;
        case 'form':
          history(`${routes.formCredentials}/${credentialSchema.id}`);
          break;
        default:
          break;
      }
    },
    [history]
  );

  useEffect(() => {
    const _headers: TableHeadColumn[] = [
      {
        sorteable: false,
        align: 'left',
        text: 'Nombre del certificado',
        padding: 'none',
        value: 'name'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Descripción',
        padding: 'none',
        value: 'description'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Tipo',
        padding: 'none',
        value: 'version',
        render: (row: CredentialSchemaModel) => {
          let credentialType = '';
          switch (row.credential_schema_type) {
            case 'default':
              credentialType = 'De atributos fijos';
              break;
            case 'predetermined':
              credentialType = 'De valores fijos';
              break;
            case 'form':
              credentialType = 'De un formulario';
              break;
            default:
              break;
          }
          return <Chip label={credentialType} sx={{ background: '#F4F6F8' }} />;
        }
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Versión',
        padding: 'none',
        value: 'version',
        render: (row: CredentialSchemaModel) => <Chip label={row.version} sx={{ background: '#F4F6F8' }} />
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Estado',
        padding: 'none',
        value: 'status',
        render: (row: any) => {
          const status = row?.status;
          const { labelText, colorBox, colorText } = getStatusCredentialSchema(status, theme);
          return <Chip label={labelText} sx={{ background: colorBox, color: colorText }} />;
        }
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Fecha de creación',
        padding: 'none',
        value: 'created_at',
        minWidth: '136px',
        render: (row: CredentialSchemaModel) => <DateCell date={row?.created_at} />
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Acciones',
        padding: 'none',
        value: 'created_at',
        render: (row: CredentialSchemaModel) =>
          row?.status === 'registered' && (
            <Button
              variant="contained"
              text="Emitir"
              sx={{ borderRadius: '20px 20px', width: '114px' }}
              startIcon={<Icon>arrow_forward</Icon>}
              onClick={() => handleShowCredentialSchema(row)}
            />
          )
      }
    ];
    setHeaders(_headers);
  }, [handleShowCredentialSchema, theme]);

  const _listCredentialSchemas = useCallback(() => {
    setIsLoading(true);
    listCredentialSchemas('schema_type[]=default&schema_type[]=predetermined&schema_type[]=form')
      .then((res: any) => {
        if (!isCompMounted.current) return;
        const data = res.data.data;
        setItems(data);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isCompMounted.current) return;
        setIsLoading(false);
        showMessage('', 'Problemas al cargar los certificados', 'error');
        setIsLoading(false);
      });
  }, []);

  const handleOnClose = useCallback(
    (isRefresh?: boolean) => {
      if (isRefresh !== undefined && isRefresh) {
        _listCredentialSchemas();
      }
      // setIsCreateCredentialDialogOpen((prevState: boolean) => !prevState);
      setShowCreateCredentialDialog(undefined);
    },
    [_listCredentialSchemas]
  );

  useEffect(() => {
    _listCredentialSchemas();
  }, [_listCredentialSchemas]);

  return (
    <>
      <Box mt={3} ref={isCompMounted}>
        <DataTable
          // headComponent={(searchComponent: React.ReactNode) => (
          //   <Box display="flex" justifyContent="space-between">
          //     {searchComponent}
          //     <ActionsMenu
          //       button={<Button text=" Nuevo certificado" variant="contained" startIcon={<Icon>add</Icon>} />}
          //       listItems={[
          //         {
          //           onClick: () => {
          //             setShowCreateCredentialDialog('form');
          //           },
          //           icon: '',
          //           text: 'Desde un formulario'
          //         },
          //         {
          //           onClick: () => {
          //             setShowCreateCredentialDialog('default');
          //           },
          //           icon: '',
          //           text: 'Con atributos fijos'
          //         },
          //         {
          //           onClick: () => {
          //             setShowCreateCredentialDialog('predetermined');
          //           },
          //           icon: '',
          //           text: 'Con valores fijos'
          //         }
          //       ]}
          //     />
          //   </Box>
          // )}
          headers={headers}
          items={items}
          loading={isLoading}
          isSearch={false}
        />
      </Box>
      {showCreateCredentialDialog === 'form' && <CreateFormCredentialSchemaDialog onClose={handleOnClose} />}
      {showCreateCredentialDialog === 'default' && <CreateDefaultCredentialSchemaDialog onClose={handleOnClose} />}
      {showCreateCredentialDialog === 'predetermined' && (
        <CreatePredeterminedCredencialSchemaDialog onClose={handleOnClose} />
      )}
    </>
  );
};

export default OwnCredentialsTab;
