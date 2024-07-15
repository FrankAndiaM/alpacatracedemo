import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

type IsCredentialChipProps = {
  is_credential_issued: boolean;
};

const IsCredentialChip: React.FC<IsCredentialChipProps> = (props: IsCredentialChipProps) => {
  const { is_credential_issued } = props;
  const themes = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-around"
      borderRadius={'24px'}
      minWidth={'170px'}
      pb={'5px'}
      textAlign={'center'}
      style={
        is_credential_issued
          ? { backgroundColor: themes.palette.secondary.lighter, color: themes.palette.secondary.darker }
          : { backgroundColor: themes.palette.warning.lighter, color: themes.palette.warning.darker }
      }
    >
      <Typography>{is_credential_issued ? 'Emitido' : 'Pendiente de emisión'}</Typography>
    </Box>
  );
};

export default IsCredentialChip;
