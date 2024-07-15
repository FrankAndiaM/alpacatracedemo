import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Button, CircularProgress, Box, Icon, Switch } from '@mui/material';
import CategorytagDialog from './CategorytagDialog';
import AddTagDialog from './addTagDialog';
import ViewTagDialog from './viewTagDialog';
import { showMessage, showYesNoQuestion, showDeleteQuestion } from '~/utils/Messages';
import { CategoryTag, CategoryTagDefault, Tag, CategoryTagUpdate, TagUpdate } from '~models/categoryTag';
import {
  selectCategory,
  createCategory,
  updateCategory,
  createTag,
  deleteCategory,
  primaryCategory
} from '~services/categoryTag';
import Loading from '~ui/atoms/Loading';
import { capitalizeAllWords, capitalize } from '~utils/Word';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';

const CropsComponent = () => {
  const [categories, setCategories] = useState<CategoryTag[]>([]);
  const [category, setCategory] = useState<CategoryTag>(CategoryTagDefault);
  const [isOpenCategoryDialog, setIsOpenCategoryDialog] = useState<boolean>(false);
  const [isOpenAddTagDialog, setIsOpenAddTagDialog] = useState<boolean>(false);
  const [isOpenViewTagDialog, setIsOpenViewTagDialog] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const _getCategory = useCallback(() => {
    setIsLoading(true);
    selectCategory()
      .then((res: any) => {
        const { data } = res.data;
        setIsLoading(false);
        setCategories(data);
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al cargar las categorias', 'error');
      });
  }, []);

  const _deleteCategory = useCallback(
    async (categoryId: string) => {
      const result: boolean = await showDeleteQuestion(
        '¿Está seguro de eliminar la etiqueta?',
        'Los datos registrados se eliminarán permanentemente'
      );
      if (result) {
        deleteCategory(categoryId)
          .then((res: any) => {
            const { message } = res.data;
            showMessage('', message, 'success');
            _getCategory();
          })
          .catch(() => {
            showMessage('', 'Problemas al eliminar las etiquetas', 'error');
          });
      }
    },
    [_getCategory]
  );

  const _primaryCategory = useCallback(
    async (category: any) => {
      const result: boolean = await showYesNoQuestion(
        `¿Está seguro de convertir la categoría ${category?.display_name ?? ''} en principal?`,
        'La categoría configurada previamente como principal se desactivará'
      );
      if (result) {
        primaryCategory({ ...category, category_id: category.id })
          .then((res: any) => {
            const { message } = res.data;
            showMessage('', message, 'success');
            _getCategory();
          })
          .catch(() => {
            showMessage('', 'Problemas al eliminar las etiquetas', 'error');
          });
      }
    },
    [_getCategory]
  );

  const handleSaveCategory = useCallback((category: CategoryTagUpdate) => {
    if (category?.id === '-1') {
      return createCategory(category);
    }
    return updateCategory(category?.id, category);
  }, []);

  const handleCategoryAddDialog = useCallback(() => {
    setIsOpenCategoryDialog(true);
    setCategory(CategoryTagDefault);
  }, []);

  const handleCloseCategoryDialog = useCallback(
    (isUpdateDatatable?: boolean) => {
      setIsOpenCategoryDialog(false);
      setCategory(CategoryTagDefault);
      if (isUpdateDatatable) {
        _getCategory();
      }
    },
    [_getCategory]
  );

  const handleCategoryUpdateDialog = useCallback((valueCategory: CategoryTag) => {
    setIsOpenCategoryDialog(true);
    setCategory(valueCategory);
  }, []);

  // Tag
  const handleSaveAddTag = useCallback((tag: TagUpdate) => {
    return createTag(tag);
  }, []);

  const handleOpenAddTagDialog = useCallback(() => {
    setIsOpenAddTagDialog(true);
  }, []);

  const handleCloseAddTagDialog = useCallback(
    (isUpdateDatatable?: boolean) => {
      setIsOpenAddTagDialog(false);

      if (isUpdateDatatable) {
        _getCategory();
      }
    },
    [_getCategory]
  );

  const handleOpenViewTagDialog = useCallback(() => {
    setIsOpenViewTagDialog(true);
  }, []);

  const handleCloseViewTagDialog = useCallback(
    (updateTable?: boolean) => {
      setIsOpenViewTagDialog(false);
      updateTable && _getCategory();
    },
    [_getCategory]
  );

  useEffect(() => {
    _getCategory();
  }, [_getCategory]);

  return (
    <>
      <Box display="flex" flexDirection="row-reverse" mb={3}>
        <Button
          onClick={handleCategoryAddDialog}
          variant="contained"
          startIcon={<Icon style={{ fontSize: 15, fontWeight: 500, marginTop: 1 }}>add</Icon>}
        >
          Agregar categoría
        </Button>
      </Box>
      <Loading isLoading={isLoading} isData={categories.length > 0} figureProgress={<LinearProgress loading={true} />}>
        <Grid container={true} spacing={4} flexDirection="row" alignItems="stretch">
          {categories.map((itemCategory: CategoryTag, index: number) => {
            return (
              <Grid key={`cat-${index}`} item={true} xs={12} sm={12} md={6} lg={6} xl={4}>
                <Box border="1px solid #CFD9DE" borderRadius="10px" height="100%" style={{ padding: '20px' }}>
                  {/* Nombre de la categoria */}
                  <Box mb={2} p={2} borderRadius="12px" style={{ background: '#F4F6F8' }}>
                    <Box mb={1} fontWeight="500">
                      Información de categoría
                    </Box>
                    <Box mb={1} fontSize="0.9em" display="flex" flexDirection="row" alignItems="center">
                      <Box mr={1} color="#637381">
                        Nombre:
                      </Box>
                      <Box>{capitalize(itemCategory?.display_name ?? '')}</Box>
                    </Box>
                    <Box mb={1} fontSize="0.9em" display="flex" flexDirection="row" alignItems="center">
                      <Box mr={1} color="#637381">
                        Descripción:
                      </Box>
                      <Box>{capitalize(itemCategory?.description ?? '')}</Box>
                    </Box>

                    <Button
                      onClick={() => {
                        handleCategoryUpdateDialog(itemCategory);
                      }}
                      startIcon={<Icon style={{ fontSize: 15, fontWeight: 500 }}>edit</Icon>}
                    >
                      Editar
                    </Button>
                  </Box>

                  {/* Etiquetas */}
                  <Box mb={2} p={2} borderRadius="12px" style={{ background: '#F4F6F8' }}>
                    <Box fontWeight="500">Etiquetas</Box>
                    <Loading
                      isLoading={false}
                      figureProgress={
                        <Box
                          display="flex"
                          flexDirection="row"
                          justifyContent="center"
                          alignItems="center"
                          height="100%"
                          minHeight={'100px'}
                        >
                          <CircularProgress color="primary" size={25} />
                        </Box>
                      }
                      isData={itemCategory?.tags?.length > 0}
                      infoIsData={
                        <Box
                          height="100px"
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          No hay etiquetas
                        </Box>
                      }
                    >
                      <Box mt={2} minHeight="100px">
                        {itemCategory?.tags?.map((tag: Tag, index: number) => {
                          return (
                            <Box
                              key={`tag-${index}`}
                              display="inline-flex"
                              mx={'4px'}
                              px={1}
                              py={'4px'}
                              borderRadius="15px"
                              color={itemCategory?.color !== '' ? '#fff' : '#2A945F'}
                              style={{ background: itemCategory?.color ?? '#2A945F' }}
                            >
                              {capitalizeAllWords(tag?.display_name ?? 'Sin nombre')}
                            </Box>
                          );
                        })}
                      </Box>
                    </Loading>
                    {itemCategory?.tags?.length > 0 && (
                      <Button
                        onClick={() => {
                          setCategory(itemCategory);
                          handleOpenViewTagDialog();
                        }}
                        style={{ color: '#1c85d3' }}
                        startIcon={<Icon style={{ fontSize: 15, fontWeight: 500, marginTop: 1 }}>visibility</Icon>}
                      >
                        Ver
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        setCategory(itemCategory);
                        handleOpenAddTagDialog();
                      }}
                      startIcon={<Icon style={{ fontSize: 15, fontWeight: 500, marginTop: 1 }}>add</Icon>}
                    >
                      Añadir
                    </Button>
                  </Box>

                  {/* ¿Categoria principal? */}
                  <Box mb={2} display="flex" flexDirection="row" alignItems="center">
                    <Box fontWeight="500">Categoría Principal</Box>
                    <Switch
                      checked={itemCategory?.is_principal ? itemCategory?.is_principal : false}
                      onChange={() => {
                        _primaryCategory(itemCategory);
                      }}
                    />
                  </Box>

                  {/* Acciones */}
                  <Box mt={2}>
                    <Button
                      onClick={() => {
                        _deleteCategory(itemCategory.id);
                      }}
                      color="inherit"
                      style={{ color: '#FF4842' }}
                      startIcon={<Icon style={{ fontSize: 15, fontWeight: 500 }}>delete</Icon>}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Loading>
      {isOpenCategoryDialog && (
        <CategorytagDialog
          open={isOpenCategoryDialog}
          category={category}
          onClose={handleCloseCategoryDialog}
          onSave={handleSaveCategory}
        />
      )}
      {isOpenAddTagDialog && (
        <AddTagDialog
          open={isOpenAddTagDialog}
          category={category}
          onClose={handleCloseAddTagDialog}
          onSave={handleSaveAddTag}
        />
      )}
      {isOpenViewTagDialog && (
        <ViewTagDialog open={isOpenViewTagDialog} category={category} onClose={handleCloseViewTagDialog} />
      )}
    </>
  );
};

export default React.memo(CropsComponent);
