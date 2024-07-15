import React, { ReactNode } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { Theme, experimentalStyled as styled } from '@mui/material/styles';
import { SxProps } from '@mui/system';

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

type UploadMultiFileProps = DropzoneOptions & {
  error?: boolean;
  icon: ReactNode;
  caption: ReactNode;
  sx?: SxProps<Theme>;
};

export default function UploadMultiFile({ error, icon, caption, sx, ...other }: UploadMultiFileProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    ...other
  });

  return (
    <DropZoneStyle
      {...getRootProps()}
      sx={{
        ...sx,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        ...(isDragActive && { opacity: 0.72 }),
        ...((isDragReject || error) && {})
      }}
    >
      <input {...getInputProps()} />

      {icon}

      {caption}
    </DropZoneStyle>
  );
}
