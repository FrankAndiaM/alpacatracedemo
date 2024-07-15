import { Box, Grid, LinearProgress, Stack } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import routes from '~routes/routes';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { Icon } from '@iconify/react';
import homeFilled from '@iconify/icons-ant-design/home-filled';
import { useParams, useNavigate } from 'react-router-dom';
import { getFabricInventory, getYarn } from '~services/clothes';
import { useSelector } from 'react-redux';
import { showMessage } from '~utils/Messages';
import CompositionComponent from './components/compositionComponent';

type ShowCompositionProps = unknown;

const ShowComposition: React.FC<ShowCompositionProps> = () => {
  const history = useNavigate();
  const { auth }: any = useSelector((state: any) => state);
  const NameProduct: string = auth?.organizationTheme?.name_product;
  const organizationId: string = auth?.organizationTheme?.organizationId;
  //   const ShowProduct: boolean = auth?.organizationTheme?.show_product;
  // eslint-disable-next-line
  // @ts-ignore
  const { id, type } = useParams();

  const [idSelected] = useState(id || '');
  const [compositionSelected, setCompositionSelected] = useState<any>(undefined);
  const [compositionAdditional, setCompositionAdditional] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!id) {
    if (type === 'YARN') {
      history(routes.yarns);
    } else {
      history(routes.panels);
    }
  }

  useEffect(() => {
    if (type === 'YARN') {
      getYarn(idSelected, organizationId)
        .then((resp: any) => {
          const { yarn, complementary_yarns } = resp?.data?.data;
          if (yarn) {
            setCompositionSelected(yarn);
          }
          if (complementary_yarns) {
            setCompositionAdditional([...complementary_yarns, yarn]);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          showMessage('', 'No se pudo obtener la información del hilo', 'error', true);
          history(routes.yarns);
        });
    } else {
      getFabricInventory(idSelected, organizationId)
        .then((resp: any) => {
          const { fabric_inventory, complementary_fabric_inventory } = resp?.data?.data;
          if (fabric_inventory) setCompositionSelected(fabric_inventory);
          if (complementary_fabric_inventory)
            setCompositionAdditional([...complementary_fabric_inventory, fabric_inventory]);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          showMessage('', 'No se pudo obtener la información del producto intermedio', 'error', true);
          history(routes.panels);
        });
    }
  }, [organizationId, history, idSelected, type]);

  const handleSelect = useCallback((composition: any) => {
    setCompositionSelected(undefined);
    setCompositionSelected(composition);
  }, []);

  return (
    <>
      <Box mb="25px">
        <Breadcrumbs
          breadcrumbs={[
            {
              path: '/dashboard',
              component: <Icon icon={homeFilled} width={20} height={20} />
            },
            {
              path: type === 'YARN' ? '/dashboard/yarns' : '/dashboard/panels',
              component: type === 'YARN' ? 'Hilos' : NameProduct
            },
            {
              component: `${compositionSelected?.code ?? ''}`
            }
          ]}
        />
      </Box>
      <Box mt={1}>{isLoading && <LinearProgress />}</Box>
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
              <CompositionComponent
                data={compositionSelected}
                type={type === 'YARN' ? 'hilo' : NameProduct}
                isSelect={true}
                handleSelect={handleSelect}
                showAll={true}
              />
            </Grid>
          )}

          {compositionAdditional &&
            compositionAdditional.length > 0 &&
            compositionAdditional.map((element: any, index: number) => {
              if (compositionSelected && element.code === compositionSelected?.code) {
                return <></>;
              }
              return (
                <Grid key={`panels_item_${index}`} item xs={12} sm={4} lg={3} xl={3}>
                  <CompositionComponent
                    data={element}
                    type={type === 'YARN' ? 'hilo' : NameProduct}
                    isSelect={true}
                    handleSelect={handleSelect}
                    showAll={false}
                  />
                </Grid>
              );
            })}
        </Grid>
      </Stack>
    </>
  );
};

export default React.memo(ShowComposition);
