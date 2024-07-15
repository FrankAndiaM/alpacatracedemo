import React, { useCallback, useEffect, useRef, useState } from 'react';
import AddImage from '~assets/img/add_image.svg';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Image from '../Tabs/components/Image';
import { showMessage, showYesNoQuestion } from '~utils/Messages';
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles(() => ({
  imageStyle: {
    height: '100%',
    width: '100%',
    borderRadius: '12px'
  },
  editHoverClass: {
    position: 'relative',
    borderRadius: '12px',
    '& .box_edit': {
      display: 'none'
    },
    '&:hover .box_edit': {
      position: 'absolute',
      display: 'flex',
      visibility: 'visible',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
      opacity: 0.8,
      cursor: 'pointer'
    }
  }
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

type ImageUploadComponentProps = {
  src: any;
  onEditImage?: (image: any) => void;
};

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = (props: ImageUploadComponentProps) => {
  const { src, onEditImage } = props;
  //   console.log(src);
  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoURL] = useState<string>(src);
  //   console.log(logoUrl);
  const handleOpen = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const handleDropLogo = useCallback(
    (acceptedFiles: any) => {
      // console.log(acceptedFiles.target.files);
      const file = acceptedFiles.target.files[0];
      if (file) {
        if (file.size >= 3000000) {
          showMessage('', 'El archivo es muy pesado.', 'error', true);
          return;
        }
        const newFile = {
          file: file,
          file_name: file.name,
          file_type: file.type
        };
        showYesNoQuestion('', 'Se actualizara la imagen del productor, ¿Esta seguro de continuar?', 'info', false, [
          'Cancelar',
          'Guardar'
        ]).then((val: any) => {
          if (val) {
            onEditImage && onEditImage(newFile);
            // setNewLogo(newFile);
            setLogoURL(URL.createObjectURL(file));
          }
        });
      }
    },
    [onEditImage]
  );

  useEffect(() => {
    setLogoURL(src);
  }, [src]);

  return (
    <Box className={classes.editHoverClass} onClick={handleOpen}>
      <Box className="box_edit">
        <img src={AddImage} alt="add" style={{ borderRadius: '12px' }} />
      </Box>
      <Image image={logoUrl} large={true} />

      <VisuallyHiddenInput type="file" ref={inputRef} onChange={handleDropLogo} />
    </Box>
  );
};

export default ImageUploadComponent;
