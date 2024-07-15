import React, { useCallback, useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Clothe, CompositionClothe } from '~models/clothes';
import CompositionClotheComponent from './components/CompositionClotheComponent';
import { useSelector } from 'react-redux';

type PanelsInfoTabProps = {
  clothe?: Clothe;
};

const PanelsInfoTab: React.FC<PanelsInfoTabProps> = (props: PanelsInfoTabProps) => {
  const { clothe } = props;
  const { auth }: any = useSelector((state: any) => state);
  const [compositionSelected, setCompositionSelected] = useState<CompositionClothe | undefined>(undefined);

  const handleSelect = useCallback((composition: CompositionClothe | undefined) => {
    setCompositionSelected(composition);
  }, []);

  return (
    <>
      {clothe && clothe?.fabric_inventories && clothe?.fabric_inventories?.length > 0 ? (
        // <Card sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="flex-start">
          {/* <Box display="flex" justifyContent={'space-between'} width={'100%'}>
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                INFORMACIÓN DE PANELES
              </Typography>
            </Box>
          </Box> */}
          {compositionSelected && (
            <Grid container spacing={2} paddingRight={2}>
              <CompositionClotheComponent
                data={compositionSelected}
                type={`${auth?.organizationTheme?.name_product ?? ''}`.toLowerCase()}
                handleSelect={handleSelect}
                showAll={true}
              />
            </Grid>
          )}
          <Grid container spacing={2}>
            {clothe?.fabric_inventories?.map((element: CompositionClothe, index: number) => {
              if (compositionSelected && element.code === compositionSelected?.code) {
                return <></>;
              }
              return (
                <CompositionClotheComponent
                  key={`panels_item_${index}`}
                  data={element}
                  type={`${auth?.organizationTheme?.name_product ?? ''}`.toLowerCase()}
                  handleSelect={handleSelect}
                  showAll={false}
                />
              );
            })}
          </Grid>
        </Stack>
      ) : (
        // </Card>
        <Box display="flex" mt={4} justifyContent="center" alignItems="center" width="100%">
          <Typography fontSize="1.7em" color="#CFD9DE" align="center">
            ¡Vaya! Al parecer, aún no tiene información, por favor súbalo, desde un formulario.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default PanelsInfoTab;
