import React, { useEffect, useState, useCallback } from 'react';
import { Box, Icon, Paper } from '@mui/material';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import Button from '~ui/atoms/Button/Button';
import IconButton from '~atoms/IconButton/IconButton';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import { listMassiveIssuanceCredential } from '~services/digital_identity/credential/massive_credential';
import MassiveIssuanceRecords from './MassiveIssuanceRecords';
import DateCell from '~ui/atoms/DateCell/DateCell';

type MassiveIssuanceTabProps = {
  credentialId: string;
  credentialSchema: CredentialSchemaModel | undefined;
};

const MassiveIssuanceTab: React.FC<MassiveIssuanceTabProps> = (props: MassiveIssuanceTabProps) => {
  const { credentialId, credentialSchema } = props;
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isRefresh, setIsRefresh] = useState<boolean>(true);
  const [massiveCredentialSelected, setMassiveCredentialSelected] = useState<any>(undefined);
  const [view, setView] = useState<'massive_credentials' | 'show_records'>('massive_credentials');

  const _paginateMassiveIssuanceCredential = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return listMassiveIssuanceCredential(credentialId, page, per_page, sort_by, order, search);
    },
    [credentialId]
  );

  const showMassiveIssuanceCredentialRecords = useCallback((issuedCredential: any) => {
    setView('show_records');
    setMassiveCredentialSelected(issuedCredential);
  }, []);

  const handleBack = useCallback(() => {
    setView('massive_credentials');
  }, []);

  useEffect(() => {
    const _headers: TableHeadColumn[] = [
      {
        sorteable: true,
        align: 'left',
        text: 'Subido por',
        padding: 'none',
        value: 'user',
        render: (row: any) => `${row?.user?.first_name ?? '-'} ${row?.user?.last_name ?? '-'}`
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Archivo',
        padding: 'none',
        value: 'file_name'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Fecha de registro',
        padding: 'none',
        value: 'created_at',
        render: (row: any) => <DateCell date={row?.created_at} />
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
            onClick={() => showMassiveIssuanceCredentialRecords(row)}
            tooltipText="Ver registros"
          />
        )
      }
    ];
    setHeaders(_headers);
  }, [showMassiveIssuanceCredentialRecords]);

  return (
    <>
      <Paper>
        <Box mt={2} pt={2}>
          <Box display={view === 'massive_credentials' ? 'inherit' : 'none'}>
            <DataTable
              headers={headers}
              stickyHeader={false}
              onLoad={_paginateMassiveIssuanceCredential}
              refresh={isRefresh}
              headRightComponent={
                <Button
                  text="Actualizar"
                  variant="contained"
                  startIcon={<Icon>loop</Icon>}
                  onClick={() => {
                    setIsRefresh((prevValue: boolean) => !prevValue);
                  }}
                />
              }
            />
          </Box>
          {view === 'show_records' && (
            <>
              <MassiveIssuanceRecords
                onHandleBack={handleBack}
                massiveCredentialSelected={massiveCredentialSelected}
                credentialId={credentialId}
                credentialSchema={credentialSchema}
              />
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default MassiveIssuanceTab;
