import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';

type PredeterminedCredentialTabProps = unknown;

const PredeterminedCredentialTab: React.FC<PredeterminedCredentialTabProps> = () => {
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [items, setItems] = useState<any[]>([]);

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
        text: 'Estado',
        padding: 'none',
        value: 'status'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Fecha de creación',
        padding: 'none',
        value: 'created_at'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Acciones',
        padding: 'none',
        value: 'created_at'
      }
    ];
    setHeaders(_headers);
  }, []);

  return (
    <>
      <Box mt={3}>
        <DataTable headers={headers} items={items} loading={false} />
      </Box>
    </>
  );
};

export default PredeterminedCredentialTab;
