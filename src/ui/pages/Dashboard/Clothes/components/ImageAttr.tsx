import React from 'react';
import Image from '../pages/Tabs/components/Image';
import { Box } from '@mui/material';
import PanoramaOutlinedIcon from '@mui/icons-material/PanoramaOutlined';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';

type ImageAttrProps = {
  image: string;
};
const ImageAttributeClothe: React.FC<ImageAttrProps> = (props: ImageAttrProps) => {
  const { image } = props;
  return (
    <>
      {image ? (
        <Image image={`${COMMUNITY_BASE_URL_S3}${image}`} />
      ) : (
        <Box width={'50px'}>
          <PanoramaOutlinedIcon style={{ fontSize: '130px' }} />
        </Box>
      )}
    </>
  );
};

export default ImageAttributeClothe;
