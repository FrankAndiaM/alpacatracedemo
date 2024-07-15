import React, { useEffect, useState, useCallback } from 'react';
import { Box, Icon, Chip, Tooltip } from '@mui/material';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import Button from '~ui/atoms/Button/Button';
import {
  getMassiveIssuanceCredential,
  listIssuanceCredentialErrors
} from '~services/digital_identity/credential/massive_credential';
import DateCell from '~ui/atoms/DateCell/DateCell';
import { CredentialSchemaModel } from '~models/digital_identity/credential';
import { showMessage } from '~utils/Messages';
import { downloadExcel } from '~utils/downloadExcel';

type MassiveIssuanceRecordsProps = {
  massiveCredentialSelected: any;
  credentialSchema: CredentialSchemaModel | undefined;
  credentialId: string;
  onHandleBack: () => void;
};

const MassiveIssuanceRecords: React.FC<MassiveIssuanceRecordsProps> = (props: MassiveIssuanceRecordsProps) => {
  const { massiveCredentialSelected, credentialId, credentialSchema, onHandleBack } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);

  const _paginateMassiveIssuanceCredentialRecords = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return getMassiveIssuanceCredential(
        credentialId,
        massiveCredentialSelected?.id,
        page,
        per_page,
        sort_by,
        order,
        search
      );
    },
    [credentialId, massiveCredentialSelected]
  );

  const handleDownloadErrors = useCallback(() => {
    setIsLoading(true);
    listIssuanceCredentialErrors(credentialId, massiveCredentialSelected?.id)
      .then((res: any) => {
        const data = res.data.data;
        setIsLoading(false);
        if (data?.length === 0) {
          showMessage('', 'No se encontraron registros con errores', 'warning', true);
          return;
        }

        const colsWch: any[] = [{ wch: 18 }];

        const headers: any[] =
          credentialSchema?.credential_attributes?.map((element: any) => {
            colsWch.push({ wch: element.name.toString().length });
            return element.name;
          }) ?? [];

        headers.unshift('DNI');

        const excelData: any[][] = data?.map((values: any) => {
          const currentValues: any[] = [values.dni];
          headers.forEach((header: string, index: number) => {
            if (index !== 0) {
              currentValues.push(values?.credential_data[header] ?? '');
            }
          });
          return currentValues;
        });

        downloadExcel(
          credentialSchema?.name ?? 'Archivo excel',
          `${credentialSchema?.name}.xlsx`,
          [headers, ...excelData],
          colsWch
        );
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al descargar los registros con errores', 'error', true);
      });
  }, [credentialId, massiveCredentialSelected, credentialSchema]);

  useEffect(() => {
    const _headers: TableHeadColumn[] = [
      {
        sorteable: true,
        align: 'left',
        text: 'DNI',
        padding: 'none',
        value: 'dni'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Productor',
        padding: 'none',
        value: 'producer',
        render: (row: any) => row?.producer?.full_name ?? '-'
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
        sorteable: true,
        align: 'left',
        text: 'Estado',
        padding: 'none',
        value: 'status',
        render: (value: any) => {
          switch (value.status) {
            case 'error':
              return (
                <Chip
                  label="Contiene error"
                  style={{ background: '#EB7923', color: 'white' }}
                  onDelete={() => 0}
                  deleteIcon={
                    <Tooltip title={value?.error_message ?? 'Problemas al emitir el certificado'}>
                      <Icon sx={{ color: 'white !important' }}>info_outlined</Icon>
                    </Tooltip>
                  }
                />
              );
            case 'successfully':
              return <Chip label="En emisión" style={{ background: '#00822B', color: 'white' }} />;

            default:
              return <Chip label="Procesando" style={{ background: 'gray', color: 'white' }} />;
          }
        }
      }
    ];
    setHeaders(_headers);
  }, []);

  return (
    <>
      <DataTable
        headers={headers}
        stickyHeader={false}
        onLoad={_paginateMassiveIssuanceCredentialRecords}
        headLeftComponent={
          <Box display="flex">
            <Button text="Regresar" variant="outlined" startIcon={<Icon>arrow_back</Icon>} onClick={onHandleBack} />
            <Button
              text="Productores no procesados"
              variant="contained"
              startIcon={<Icon>get_app</Icon>}
              isLoading={isLoading}
              disabled={isLoading}
              onClick={handleDownloadErrors}
              sx={{
                mr: 2,
                background: '#D84D44',
                '&:hover': {
                  bgcolor: '#D84D44'
                }
              }}
            />
          </Box>
        }
      />
    </>
  );
};

export default MassiveIssuanceRecords;
