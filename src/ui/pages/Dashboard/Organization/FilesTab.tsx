import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Box, Paper, Tooltip, Icon, Button } from '@mui/material';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { deleteOrganizationFile, listOrganizationFiles } from '~services/organization/profile';
import { showMessage, showYesNoQuestion } from '~utils/Messages';
import LoadCertificateDialog from './LoadCertificateDialog';
// import CustomButton from '~ui/atoms/Button/Button';
import { format } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import { es } from 'date-fns/locale';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';

type FilesTabProps = unknown;

const FilesTab: React.FC<FilesTabProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const listAllOrganizationFiles = useCallback(() => {
    listOrganizationFiles()
      .then((res: any) => {
        const data = res.data.data;
        setItems(data ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al cargar los archivos', 'error', true);
      });
  }, []);

  const handleDeleteFile = useCallback(
    (organizationFile: any) => {
      showYesNoQuestion('', '¿Está seguro que desea eliminar el archivo?', 'warning').then((res: any) => {
        if (res) {
          deleteOrganizationFile(organizationFile.id)
            .then((res: any) => {
              const data = res.data.data;
              showMessage('', data.message ?? 'Archivo eliminado correctamente.', 'success');
              listAllOrganizationFiles();
            })
            .catch(() => {
              showMessage('', 'Problemas al eliminar el archivo.', 'error', true);
            });
        }
      });
    },
    [listAllOrganizationFiles]
  );

  useEffect(() => {
    listAllOrganizationFiles();
  }, [listAllOrganizationFiles]);

  useEffect(() => {
    const _setheaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Nombre del documento',
        padding: 'none',
        value: 'name'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Archivo',
        padding: 'none',
        render: (row: any) => {
          return (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={COMMUNITY_BASE_URL_S3 + row.file_path}
              style={{ fontSize: '0.8rem' }}
            >
              Archivo
            </a>
          );
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Categoría',
        padding: 'none',
        render: (row: any) => {
          switch (row.category) {
            case 'personal':
              return 'Personal';
            case 'productive':
              return 'Productivo';
            case 'economic':
              return 'Financiero';
            default:
              return '';
          }
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Fecha de actualización',
        padding: 'none',
        render: (row: any) => {
          if (row?.updated_at !== undefined) {
            return (
              <Box>
                {format(new Date(row?.updated_at), 'dd MMM yyyy', { locale: es })}
                <Box fontSize="12px" color="#9FA2B4">
                  {formatToTimeZone(row?.updated_at, 'hh:mm aa', {
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
        align: 'center',
        text: 'Acción',
        value: '',
        render: (row: any) => {
          return (
            <Box display="flex" flexDirection="row" justifyContent="space-around">
              <Tooltip title="Eliminar" arrow style={{ cursor: 'pointer' }}>
                <Icon onClick={() => handleDeleteFile(row)}>delete</Icon>
              </Tooltip>
            </Box>
          );
        }
      }
    ];
    setHeaders(_setheaders ? _setheaders : []);
  }, [handleDeleteFile]);

  const handleOnDialog = useCallback(
    (isUpdated?: boolean) => {
      if (isUpdated !== undefined && isUpdated) {
        listAllOrganizationFiles();
      }
      setIsDialogOpen((prevValue: boolean) => !prevValue);
    },
    [listAllOrganizationFiles]
  );

  return (
    <>
      <Box mt={2}>
        <Box my={1}>{/* <LinearProgress loading={isLoading} /> */}</Box>
        <Grid container spacing={2}>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Paper data-testid="Paper" elevation={2} style={{ padding: '20px' }}>
              <DataTable
                headComponent={(searchComponent: React.ReactNode) => (
                  <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between">
                    {searchComponent}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        width: '230px',
                        margin: 0,
                        marginLeft: { xs: 0, md: '16px' },
                        marginTop: { xs: '8px', md: 0 }
                      }}
                      endIcon={<Icon>cloud_upload</Icon>}
                      onClick={() => handleOnDialog()}
                    >
                      Subir certificación
                    </Button>
                  </Box>
                )}
                searchFullWidth
                searchSize="small"
                headers={headers}
                items={items}
                loading={isLoading}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {isDialogOpen && <LoadCertificateDialog onClose={handleOnDialog} />}
    </>
  );
};

export default FilesTab;
