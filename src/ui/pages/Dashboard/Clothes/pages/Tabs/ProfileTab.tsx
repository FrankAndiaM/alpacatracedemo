import React, { useState } from 'react';
import {
  Grid,
  // Card,
  Box,
  // Button,
  Tabs,
  Tab
} from '@mui/material';
import routes from '~routes/routes';
// import SaveAltRoundedIcon from '@mui/icons-material/SaveAltRounded';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clothe
  // CompositionClothe
} from '~models/clothes';
import { Icon } from '@iconify/react';
// import * as XLSX from 'xlsx';
// import { downloadExcel } from '~utils/downloadExcel';
import ClothesInfoTab from './ClotheInfoTab';
import PanelsInfoTab from './PanelsInfoTab';
import YarnsInfoTab from './YarnsInfoTab';
import { useSelector } from 'react-redux';

// type defaultVal = {
//   display_name: string;
//   value: keyof Clothe;
//   type?: string;
// };

// const defaultValues: defaultVal[] = [
//   {
//     display_name: 'Nombre',
//     value: 'name'
//   },
//   {
//     display_name: 'Código',
//     value: 'code'
//   },
//   {
//     display_name: 'Fecha de producción',
//     value: 'production_at',
//     type: 'date'
//   },
//   {
//     display_name: 'Hilos conformados',
//     value: 'yarns',
//     type: 'array'
//   },
//   {
//     display_name: 'Paneles conformados',
//     value: 'fabric_inventories',
//     type: 'array'
//   }
// ];

type TabProfileProps = { clothe?: Clothe; onHandle?: any; onCreateFarm(): void; organizationId: string };

const TabProfile: React.FC<TabProfileProps> = ({ clothe, onHandle, organizationId }: TabProfileProps) => {
  const history = useNavigate();
  const { auth }: any = useSelector((state: any) => state);
  const NameProduct = auth?.organizationTheme?.name_product;
  const ShowProduct = auth?.organizationTheme?.show_product;
  // eslint-disable-next-line
  // @ts-ignore
  const { farmer_id } = useParams();
  if (!farmer_id) history(routes.farmers);
  const farmerId: string = farmer_id !== undefined ? farmer_id : '';
  const [tabSelected, setTabSelected] = useState<number>(0);

  // const renderArray = useCallback((value: CompositionClothe[], sep: string): string => {
  //   let str = '';
  //   value.forEach((element: CompositionClothe, index: number) => {
  //     str += `${element.code ?? ''}`;
  //     if (index < value.length - 1) {
  //       str += `${sep} `;
  //     }
  //   });

  //   return str;
  // }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabSelected(newValue);
  };

  // const handleDownloadRecord = useCallback(() => {
  //   if (!clothe) {
  //     return;
  //   }

  //   const defaultHeaders = defaultValues.map((element: defaultVal) => element.display_name);

  //   const defaultRow = defaultValues.map((element: defaultVal) => {
  //     // if (element.type === 'gender') {
  //     //   return genders[farmer && farmer[element.value]];
  //     // }
  //     // if (element.type === 'phone_type') {
  //     //   return phoneTypes[farmer && farmer[element.value]];
  //     // }
  //     // if (element.type === 'department') {
  //     //   return (farmer && farmer?.department?.description) ?? '-';
  //     // }
  //     // if (element.type === 'district') {
  //     //   return (farmer && farmer?.district?.description) ?? '-';
  //     // }
  //     // if (element.type === 'province') {
  //     //   return (farmer && farmer?.province?.description) ?? '-';
  //     // }
  //     // if (element.type === 'date') {
  //     //   return parseDate(farmer?.birthday_at);
  //     // }
  //     if (element.type === 'array') {
  //       const arr = element.value === 'yarns' ? clothe?.yarns : clothe.fabric_inventories;
  //       return clothe && renderArray(arr ?? [], ' - ');
  //     }
  //     return (clothe && clothe[element.value]) ?? '-';
  //   });

  //   const arrHeaders = [...defaultHeaders];
  //   const arrRows = [...defaultRow];
  //   const configArray = new Array(arrHeaders.length).fill({ wch: 18 });
  //   // const wb = XLSX.utils.book_new();
  //   // wb.Props = {
  //   //   Title: 'Ficha de productor',
  //   //   Subject: ''
  //   // };
  //   // wb.SheetNames.push('Productor');
  //   // // const colsWch: any[] = [];
  //   // const ws = XLSX.utils.aoa_to_sheet([arrHeaders, arrRows]);
  //   // ws['!cols'] = configArray;
  //   // // ws['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, ...colsWch];
  //   // wb.Sheets['Productor'] = ws;
  //   // const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  //   // saveAs(new Blob([downloadExcel(wbout)],
  //      { type: 'application/octet-stream' }), 'Información del productor.xlsx');
  //   downloadExcel('Prenda', 'prenda.xlsx', [arrHeaders, arrRows], configArray);
  // }, [clothe, renderArray]);
  return (
    <>
      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={12} md={12}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Box display={'contents'}>
              <Tabs
                value={tabSelected}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab
                  label={<>Información de prenda</>}
                  icon={<Icon fontSize={24} icon="material-symbols:laundry-outline" />}
                  iconPosition="start"
                  value={0}
                />
                {ShowProduct && (
                  <Tab
                    label={`Información de ${NameProduct}`}
                    icon={<Icon fontSize={24} icon="material-symbols:stack-outline" />}
                    iconPosition="start"
                    value={1}
                  />
                )}
                <Tab
                  label="Información de hilos"
                  icon={<Icon fontSize={24} icon="material-symbols:water" />}
                  iconPosition="start"
                  value={2}
                />
              </Tabs>
            </Box>
            {/* <Box>
              <Button variant="contained" startIcon={<SaveAltRoundedIcon />} onClick={handleDownloadRecord}>
                Descargar
              </Button>
            </Box> */}
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          {tabSelected === 0 && (
            <ClothesInfoTab clothe={clothe} organizationId={organizationId} farmerId={farmerId} onHandle={onHandle} />
          )}

          {tabSelected === 1 && ShowProduct && <PanelsInfoTab clothe={clothe} />}
          {tabSelected === 2 && <YarnsInfoTab clothe={clothe} />}
        </Grid>
      </Grid>
    </>
  );
};

export default TabProfile;
