import React, { useCallback, useState, useEffect } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Icon, Box } from '@mui/material';
import Button from '~atoms/Button/Button';
import EditTagDialog from './editTagDialog';
import { showMessage, showDeleteQuestion } from '~/utils/Messages';
import { CategoryTag, Tag, TagDefault } from '~models/categoryTag';
import { capitalize, capitalizeAllWords } from '~utils/Word';
import { updateTag, deleteTag } from '~services/categoryTag';
import Loading from '~ui/atoms/Loading';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';

type ViewTagDialogProps = {
  open: boolean;
  category: CategoryTag;
  onClose(updateTable?: boolean): void;
};

const ViewTagDialog: React.FC<ViewTagDialogProps> = (props: ViewTagDialogProps) => {
  const { open, category, onClose }: ViewTagDialogProps = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tag, setTag] = useState<Tag>(TagDefault);
  const [isOpenEditTagDialog, setIsOpenEditTagDialog] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const _deleteTag = useCallback(
    async (tagId: string) => {
      const result: boolean = await showDeleteQuestion(
        '¿Está seguro de eliminar la etiqueta?',
        'Los datos registrados se eliminarán permanentemente'
      );
      if (result) {
        setIsLoading(true);
        deleteTag(tagId)
          .then((res: any) => {
            setIsLoading(false);
            setIsUpdate(true);
            const { message } = res.data;
            setTags(tags.filter((tag: Tag) => tag.id !== tagId));
            showMessage('', message, 'success');
          })
          .catch(() => {
            setIsLoading(false);
            showMessage('', 'Problemas al eliminar las etiquetas', 'error');
          });
      }
    },
    [tags]
  );

  const _updateTag = useCallback((data: any) => {
    setIsUpdate(true);
    return updateTag(data.id, data);
  }, []);

  const handleOpenEditTagDialog = useCallback(() => {
    setIsOpenEditTagDialog(true);
  }, []);

  const handlecloseEditTagDialog = useCallback(() => {
    setIsOpenEditTagDialog(false);
  }, []);

  useEffect(() => {
    setTags(category.tags);
  }, [category.tags]);

  return (
    <Dialog
      open={open}
      title={`Categoría: ${capitalize(category.display_name)}`}
      onClose={() => onClose(isUpdate)}
      actions={
        <>
          <Button
            text="Salir"
            onClick={() => {
              onClose(isUpdate);
            }}
            variant="outlined"
          />
        </>
      }
    >
      <Loading isLoading={isLoading} isData={true} figureProgress={<LinearProgress loading={true} />}>
        <Grid container={true} spacing={3}>
          {tags.map((tag: Tag, index: number) => (
            <Grid
              key={`tag-${index}`}
              item={true}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
            >
              <Box width="430px">
                <Box
                  display="inline-flex"
                  mx={'4px'}
                  px={1}
                  py={'4px'}
                  borderRadius="15px"
                  color="#fff"
                  style={{ background: category?.color ?? '#2A945F' }}
                >
                  {capitalizeAllWords(tag?.display_name ?? 'Sin nombre')}
                </Box>
              </Box>
              <Box width="35px" display="flex" justifyContent="center" alignItems="center">
                <Icon
                  onClick={() => {
                    handleOpenEditTagDialog();
                    setTag(tag);
                  }}
                  style={{ fontSize: 24, fontWeight: 500, color: '#429560', cursor: 'pointer' }}
                >
                  edit
                </Icon>
              </Box>
              <Box width="35px" display="flex" justifyContent="center" alignItems="center">
                <Icon
                  onClick={() => {
                    _deleteTag(tag.id);
                  }}
                  style={{ fontSize: 24, fontWeight: 500, color: '#FF4842', cursor: 'pointer' }}
                >
                  delete
                </Icon>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Loading>
      {isOpenEditTagDialog && (
        <EditTagDialog
          open={isOpenEditTagDialog}
          tag={tag}
          onClose={handlecloseEditTagDialog}
          onSave={_updateTag}
          setTags={setTags}
        />
      )}
    </Dialog>
  );
};

export default React.memo(ViewTagDialog);
