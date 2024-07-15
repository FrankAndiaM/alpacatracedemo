import React from 'react';
import { isString } from 'lodash';
import { Icon } from '@iconify/react';
import sharpFilePresent from '@iconify/icons-ic/sharp-file-present';
import outlineCloudUpload from '@iconify/icons-ic/outline-cloud-upload';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import fileFill from '@iconify/icons-eva/file-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { motion, AnimatePresence } from 'framer-motion';
// material
import { alpha, Theme, experimentalStyled as styled } from '@mui/material/styles';
import {
  Box,
  List,
  Stack,
  Paper,
  Button,
  ListItem,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { SxProps } from '@mui/system';
import { useTheme } from '@mui/material';

//
import MIconButton from './MIconButton';
import { varFadeInRight } from '../animate';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }: any) => ({
  outline: 'none',
  height: '150px',
  color: '#6B767F',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  px: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#F2F2F2',
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ----------------------------------------------------------------------

type CustomFile = File & {
  path?: string;
  preview?: string;
};

type UploadMultiFileProps = DropzoneOptions & {
  error?: boolean;
  files: (File | undefined)[];
  showPreview: boolean;
  onRemove: (file: File | undefined) => void;
  onRemoveAll: VoidFunction;
  sx?: SxProps<Theme>;
};

const getFileData = (file: CustomFile | string) => {
  if (typeof file === 'string') {
    return {
      key: file
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview
  };
};
export default function UploadMultiFile({
  error,
  showPreview = false,
  files,
  onRemove,
  onRemoveAll,
  sx,
  ...other
}: UploadMultiFileProps) {
  const theme = useTheme();
  const hasFile = files.length > 0;

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    ...other
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter'
          })
        }}
      >
        <input {...getInputProps()} />

        <Icon icon={outlineCloudUpload} color={theme.palette.primary.main} width={56} height={56} />

        <Box sx={{ p: 2, ml: { md: 2 } }}>
          <Typography variant="body2" sx={{ color: theme.palette.primary.main }}>
            Subir archivos&nbsp;(25 MB max)
          </Typography>
        </Box>
      </DropZoneStyle>

      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        <AnimatePresence>
          {files.map((file: any) => {
            const { key, name, size, preview } = getFileData(file as CustomFile);

            if (showPreview) {
              return (
                <ListItem
                  key={key}
                  component={motion.div}
                  {...varFadeInRight}
                  sx={{
                    p: 0,
                    m: 0.5,
                    width: 80,
                    height: 80,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'inline-flex',
                    color: 'black'
                  }}
                >
                  {name?.includes('pdf') ? (
                    <Icon icon={sharpFilePresent} width={80} height={80} />
                  ) : (
                    <Paper
                      variant="outlined"
                      component="img"
                      src={isString(file) ? file : preview}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
                    />
                  )}
                  <Box sx={{ top: 6, right: 6, position: 'absolute' }}>
                    <MIconButton
                      size="small"
                      onClick={() => onRemove(file)}
                      sx={{
                        p: '2px',
                        color: 'common.white',
                        bgcolor: (theme: any) => alpha(theme.palette.grey[900], 0.72),
                        '&:hover': {
                          bgcolor: (theme: any) => alpha(theme.palette.grey[900], 0.48)
                        }
                      }}
                    >
                      <Icon icon={closeFill} />
                    </MIconButton>
                  </Box>
                </ListItem>
              );
            }

            return (
              <ListItem
                key={key}
                component={motion.div}
                {...varFadeInRight}
                sx={{
                  my: 1,
                  py: 0.75,
                  px: 2,
                  borderRadius: 1,
                  border: (theme: any) => `solid 1px ${theme.palette.divider}`,
                  bgcolor: 'background.paper'
                }}
              >
                <ListItemIcon>
                  <Icon icon={fileFill} width={28} height={28} />
                </ListItemIcon>
                <ListItemText
                  primary={isString(file) ? file : name}
                  secondary={isString(file) ? '' : size}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <ListItemSecondaryAction>
                  <MIconButton edge="end" size="small" onClick={() => onRemove(file)}>
                    <Icon icon={closeFill} />
                  </MIconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </AnimatePresence>
      </List>

      {hasFile && (
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="outlined" onClick={onRemoveAll} sx={{ mr: 1.5 }}>
            Quitar todo
          </Button>
        </Stack>
      )}
    </Box>
  );
}
