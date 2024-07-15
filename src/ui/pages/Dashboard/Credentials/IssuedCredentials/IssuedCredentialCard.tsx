import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStatusColorCredentials } from '../colorLabelStatus';
import IssuedCredentialDialog from './IssuedCredentialDialog';
import { useTheme } from '@mui/material/styles';

type IssuedCredentialCardProps = {
  issuedCredential: any;
};

const RootStyle = styled('div')(({ theme }: any) => ({
  position: 'relative',
  minHeight: 306,
  '& .slick-list': {
    borderRadius: Number(theme.shape.borderRadius) * 2
  }
}));

const CardItemStyle = styled('div')(({ theme }: any) => ({
  position: 'relative',
  minHeight: 306 - 16,
  backgroundSize: 'cover',
  padding: theme.spacing(2),
  backgroundRepeat: 'no-repeat',
  color: theme.palette.common.white,
  background: 'url("https://minimal-assets-api.vercel.app/assets/bg_card.png") #045c28cc',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '5%',
  backgroundBlendMode: 'overlay'
}));

const shadowStyle = {
  mx: 'auto',
  width: 'calc(100% - 16px)',
  borderRadius: 2,
  position: 'absolute',
  height: 230,
  zIndex: 8,
  bottom: 8,
  left: 0,
  right: 0,
  bgcolor: 'grey.500',
  opacity: 0.32
} as const;

const IssuedCredentialCard: React.FC<IssuedCredentialCardProps> = (props: IssuedCredentialCardProps) => {
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);
  const theme = useTheme();
  const { issuedCredential }: IssuedCredentialCardProps = props;
  const [credentialValues, setCredentialValues] = useState<any>({});
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const showStatus = useCallback(
    (status?: string) => {
      const { colorText, ColorBox, labelText } = getStatusColorCredentials(status ?? '', theme);
      return <Chip label={labelText} sx={{ color: colorText, background: ColorBox, fontWeight: 700 }} />;
    },
    [theme]
  );

  useEffect(() => {
    if (issuedCredential?.credential_values?.hasOwnProperty('claims')) {
      setCredentialValues(issuedCredential?.credential_values?.claims);
      return;
    }
    const newCredentialValues = Object.assign({}, issuedCredential?.credential_values);
    delete newCredentialValues?.id;
    delete newCredentialValues?.general_id;
    setCredentialValues(newCredentialValues);
  }, [issuedCredential]);

  const handleOpenDialog = useCallback(() => {
    setIsOpenDialog((prevState: boolean) => !prevState);
  }, []);

  return (
    <>
      <Box sx={{ cursor: 'pointer' }} onClick={handleOpenDialog}>
        <RootStyle>
          <Box height="100%" sx={{ position: 'relative', zIndex: 9 }}>
            <CardItemStyle>
              <Box height="100%" display="flex" justifyContent="space-between" flexDirection="column">
                <Box sx={{ opacity: '0.72' }}>Certificado</Box>
                <Box fontWeight={700} fontSize="1.84rem" color="white" marginBottom="96px">
                  {issuedCredential?.credential?.name}
                </Box>
                <Box position="absolute" bottom="0" left="0" right="0" mr={3}>
                  <Box display="flex" justifyContent="flex-end">
                    {showStatus(issuedCredential?.credential_status?.name)}
                  </Box>
                  <Box display="flex">
                    <Box m={1}>
                      <Box component="span" fontWeight={700} sx={{ opacity: '0.72' }}>
                        Categoría
                      </Box>
                      <Box>{issuedCredential?.credential?.credential_category?.description}</Box>
                    </Box>
                    <Box m={1}>
                      <Box component="span" fontWeight={700} sx={{ opacity: '0.72' }}>
                        Emisión:
                      </Box>
                      <Box>
                        <Box component="span">
                          {issuedCredential?.issuance_at !== undefined &&
                            format(new Date(issuedCredential?.issuance_at), 'dd MMM yyyy', { locale: es })}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardItemStyle>
          </Box>
          <Box sx={{ ...shadowStyle }} />
          <Box
            sx={{
              ...shadowStyle,
              opacity: 0.16,
              bottom: 0,
              zIndex: 7,
              width: 'calc(100% - 40px)'
            }}
          />
        </RootStyle>
      </Box>
      {isOpenDialog && (
        <IssuedCredentialDialog
          issuedCredential={issuedCredential}
          credentialValues={credentialValues}
          organizationTheme={organizationTheme}
          onClose={handleOpenDialog}
        />
      )}
    </>
  );
};

export default React.memo(IssuedCredentialCard);
