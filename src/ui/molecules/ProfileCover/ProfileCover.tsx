import React, { useCallback, useEffect, useRef, useState } from 'react';
// material
import { experimentalStyled as styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import UserLogo from '~assets/img/laundry.svg';
import AgentLogo from '~assets/img/user_logo.svg';
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { makeStyles } from '@mui/styles';
import Image from '../ImageModal/Image';
import { Theme } from '~ui/themes';
import AddImage from '~assets/img/add_image.svg';
import { showMessage, showYesNoQuestion } from '~utils/Messages';
// ----------------------------------------------------------------------

const useStyles: any = makeStyles((theme: Theme) => ({
  imageStyle: {
    height: '100%',
    width: '100%',
    borderRadius: '12px'
  },
  editHoverClass: {
    position: 'absolute',
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
  },
  textOpacity: {
    opacity: 0.72,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  textOpacityDecoration: {
    opacity: 0.72,
    textDecoration: 'underline',
    display: 'flex',
    alignItems: 'center'
    // '&:hover': {
    //   cursor: 'pointer'
    // }
  },
  iconStyle: {
    fontSize: '1.2rem',
    marginLeft: '8px'
  }
}));

const RootStyle = styled('div')(({ theme }: any) => ({
  '&:before': {
    top: 0,
    zIndex: 9,
    width: '100%',
    content: '""',
    height: '100%',
    position: 'absolute',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)', // Fix on Mobile
    backgroundColor: theme.palette.primary.main
  }
}));

const InfoStyle = styled('div')(({ theme }: any) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3)
    // bottom: theme.spacing(8)
  },
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  }
}));

// const CoverImgStyle = styled('img')(() => ({
//   zIndex: 8,
//   width: '100%',
//   height: '100%',
//   objectFit: 'cover',
//   position: 'absolute'
// }));

const BoxLifeProofStyle = styled('div')(({ theme }: any) => ({
  height: '200px',
  width: '200px',
  backgroundColor: '#EFF3F4',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  [theme.breakpoints.down('md')]: {
    height: '120px',
    width: '120px'
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

// ----------------------------------------------------------------------

type ProfileCoverProps = {
  fullName?: string;
  position?: string;
  src: any;
  lifeproof?: string;
  is_biometric_verified?: boolean;
  lifeProofAction?: () => void;
  type?: 'user' | 'agent';
  isEdit?: boolean;
  onEditImage?: (image: any) => void;
};

export default function ProfileCover({
  src,
  isEdit,
  onEditImage,
  fullName,
  position,
  lifeproof,
  type = 'user'
}: ProfileCoverProps) {
  const classes = useStyles();
  const [logoUrl, setLogoURL] = useState<string>(src);
  // const [newLogo, setNewLogo] = useState<any>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <RootStyle>
      <InfoStyle>
        <BoxLifeProofStyle style={{ padding: lifeproof ? '4px' : '32px' }}>
          {isEdit ? (
            <Box className={classes.editHoverClass} onClick={handleOpen}>
              <Box className="box_edit">
                <img src={AddImage} alt="add" style={{ borderRadius: '12px' }} />
              </Box>
              <Image image={logoUrl} />

              <VisuallyHiddenInput type="file" ref={inputRef} onChange={handleDropLogo} />
            </Box>
          ) : (
            <>
              {src ? (
                <Image image={type === 'user' ? (src ? src : UserLogo) : AgentLogo} />
              ) : (
                <img src={type === 'user' ? (src ? src : UserLogo) : AgentLogo} alt="" className={classes.imageStyle} />
              )}
            </>
          )}
        </BoxLifeProofStyle>
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          <Typography className={classes.textOpacity}>{position}</Typography>
          <Typography variant="h4">{fullName}</Typography>
          {/* {is_biometric_verified ? (
            // <Typography className={classes.textOpacityDecoration} onClick={lifeProofAction}>
            <Typography className={classes.textOpacityDecoration}>
              Prueba de vida completada
              <CheckCircleOutlinedIcon className={classes.iconStyle} />
            </Typography>
          ) : (
            <Typography className={classes.textOpacity}>
              Prueba de vida pendiente
              <CancelOutlinedIcon className={classes.iconStyle} />
            </Typography>
          )} */}
        </Box>
      </InfoStyle>
      {/* <CoverImgStyle alt="profile cover" src={src} /> */}
    </RootStyle>
  );
}
