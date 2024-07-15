import React, { useEffect } from 'react';
// import LightBox from 'react-image-lightbox';
// eslint-disable-next-line
// @ts-ignore
import LightBox from 'rhino-react-image-lightbox-rotate';
// material
import { alpha, Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import './LightBoxModal.scss';

// ----------------------------------------------------------------------

const useStyles: any = makeStyles((theme: Theme) => {
  const isRTL = theme.direction === 'rtl';

  const backgroundIcon = (iconName: string) => ({
    backgroundSize: '24px 24px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: alpha(theme.palette.grey[900], 0.8),
    backgroundImage: `url("/static/icons/controls/${iconName}.svg")`
  });

  return {
    root: {
      backdropFilter: 'blur(8px)',
      backgroundColor: alpha(theme.palette.grey[900], 0.88),

      // Toolbar
      '& .ril__toolbar': {
        height: 'auto !important',
        padding: theme.spacing(2, 3),
        backgroundColor: 'transparent'
      },
      '& .ril__toolbarLeftSide': { display: 'none' },
      '& .ril__toolbarRightSide': {
        height: 'auto !important',
        padding: 0,
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        '& li': {
          display: 'flex',
          alignItems: 'center'
        },
        '& li:first-of-type': {
          flexGrow: 1
        },
        '& li:not(:first-of-type)': {
          width: theme.spacing(5),
          height: theme.spacing(5),
          justifyContent: 'center',
          marginLeft: theme.spacing(1),
          borderRadius: theme.shape.borderRadius
        }
      },

      // Button
      '& button:focus': { outline: 'none' },
      '& .ril__toolbarRightSide button': {
        width: '100%',
        height: '100%',
        '&.ril__zoomInButton': backgroundIcon('maximize-outline'),
        '&.ril__zoomOutButton': backgroundIcon('minimize-outline'),
        '&.ril__closeButton': backgroundIcon('close')
      },
      '& .ril__navButtons': {
        padding: theme.spacing(3),
        borderRadius: '12px',
        '&.ril__navButtonPrev': {
          left: theme.spacing(2),
          right: 'auto',
          ...backgroundIcon(isRTL ? 'arrow-ios-forward' : 'arrow-ios-back')
        },
        '&.ril__navButtonNext': {
          right: theme.spacing(2),
          left: 'auto',
          ...backgroundIcon(isRTL ? 'arrow-ios-back' : 'arrow-ios-forward')
        }
      }
    }
  };
});

// ----------------------------------------------------------------------

type ModalLightBoxProps = {
  images: string[];
  photoIndex: number;
  setPhotoIndex: (index: number) => void;
  isOpen: boolean;
  onClose: VoidFunction;
};

function LightboxModal({ images, photoIndex, setPhotoIndex, isOpen, onClose, ...other }: ModalLightBoxProps) {
  const classes = useStyles();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const showIndex = <Typography variant="subtitle2">{`${photoIndex + 1} / ${images.length}`}</Typography>;

  const toolbarButtons = [showIndex];
  const customStyles = {
    overlay: {
      zIndex: 9999
    }
  };

  return (
    <>
      {isOpen && (
        <LightBox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={onClose}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
          toolbarButtons={toolbarButtons}
          reactModalStyle={customStyles}
          wrapperClassName={classes.root}
          {...other}
        />
      )}
    </>
  );
}

export default LightboxModal;