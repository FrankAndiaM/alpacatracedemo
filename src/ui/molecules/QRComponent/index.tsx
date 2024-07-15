import React from 'react';
import { Box } from '@mui/material';
import QRCode from 'react-qr-code';

type QRComponentProps = {
  value: string;
};

const QRComponent: React.FC<QRComponentProps> = (props: QRComponentProps) => {
  const { value } = props;
  return (
    <Box style={{ height: 'auto', margin: '0 auto', width: '100%' }}>
      <QRCode
        size={256}
        style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
        value={value}
        viewBox={'0 0 256 256'}
      />
    </Box>
  );
};

export default QRComponent;
