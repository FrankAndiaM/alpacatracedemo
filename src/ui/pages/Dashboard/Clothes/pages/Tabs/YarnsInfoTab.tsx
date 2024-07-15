import React, { useCallback, useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Clothe, CompositionClothe } from '~models/clothes';
import CompositionClotheComponent from './components/CompositionClotheComponent';

type ClothesInfoTabProps = {
  clothe?: Clothe;
};

const ClothesInfoTab: React.FC<ClothesInfoTabProps> = (props: ClothesInfoTabProps) => {
  const { clothe } = props;
  const [compositionSelected, setCompositionSelected] = useState<CompositionClothe | undefined>(undefined);

  const handleSelect = useCallback((composition: CompositionClothe | undefined) => {
    setCompositionSelected(composition);
  }, []);

  return (
    <>
      {clothe && clothe?.yarns && clothe?.yarns?.length > 0 ? (
        // <Card sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="flex-start">
          {/* <Box display="flex" justifyContent={'space-between'} width={'100%'}>
              <Box>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  INFORMACIÓN DE HILOS
                </Typography>
              </Box>
            </Box> */}
          <Grid container spacing={2}>
            {compositionSelected && (
              <Grid item xs={12} sm={12} lg={12} xl={12}>
                <CompositionClotheComponent
                  data={compositionSelected}
                  type="hilo"
                  handleSelect={handleSelect}
                  showAll={true}
                />
              </Grid>
            )}

            {clothe?.yarns?.map((element: CompositionClothe, index: number) => {
              if (compositionSelected && element.code === compositionSelected?.code) {
                return <></>;
              }
              return (
                <CompositionClotheComponent
                  key={`panels_item_${index}`}
                  data={element}
                  type="hilo"
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

export default ClothesInfoTab;
