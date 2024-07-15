import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Checkbox, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import IssuedCredentialDialog from './CredentialCardDialog';
import { makeStyles } from '@mui/styles';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { capitalizeAllWords } from '~utils/Word';

const useStyles: any = makeStyles(() => ({
  title: {
    wordBreak: 'break-all'
  },
  subTitle: {
    fontSize: '0.68rem',
    opacity: '0.72'
  }
}));

type IssuedCredentialCardProps = {
  issuedCredential: any;
  isSelected: boolean;
  isExclude: boolean;
  handleSelectCredential: (id: string) => void;
};

const RootStyle = styled('div')(({ theme }: any) => ({
  position: 'relative',
  height: '100%',
  // minHeight: 306,
  '& .slick-list': {
    borderRadius: Number(theme.shape.borderRadius) * 2
  }
}));

const CardItemStyle = styled('div')(({ theme }: any) => ({
  position: 'relative',
  // minHeight: 306 - 16,
  // backgroundSize: 'cover',
  height: 'inherit',
  padding: theme.spacing(2),
  // backgroundRepeat: 'no-repeat',
  color: theme.palette.common.white,
  background: '#00822B',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '12px'
  // backgroundBlendMode: 'overlay'
}));

// const shadowStyle = {
//   mx: 'auto',
//   width: 'calc(100% - 16px)',
//   borderRadius: 2,
//   position: 'absolute',
//   height: 230,
//   zIndex: 8,
//   bottom: 8,
//   left: 0,
//   right: 0,
//   bgcolor: 'grey.500',
//   opacity: 0.32
// } as const;

const IssuedCredentialCard: React.FC<IssuedCredentialCardProps> = (props: IssuedCredentialCardProps) => {
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);
  const classes = useStyles();
  const { issuedCredential, isSelected, isExclude, handleSelectCredential }: IssuedCredentialCardProps = props;
  const [credentialValues, setCredentialValues] = useState<any>({});
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  // const [nameOrganization, setNameOrganization] = useState<string>('');

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

  const _handleSelectCredential = useCallback(() => {
    handleSelectCredential(issuedCredential?.id ?? '');
  }, [handleSelectCredential, issuedCredential]);

  useEffect(() => {
    if (isExclude) {
      setChecked(false);
    } else {
      setChecked(isSelected);
    }
  }, [isExclude, isSelected]);

  // useEffect(() => {
  //OBTIENE Y VALIDA EL NOMBRE DE LA ORGANIZACIÓN
  // if (issuedCredential.hasOwnProperty('organization')) {
  //   setNameOrganization(issuedCredential?.organization?.name ?? '');
  // } else if (issuedCredential.hasOwnProperty('credential')) {
  //   if (issuedCredential.credential.hasOwnProperty('organization')) {
  //     setNameOrganization(issuedCredential?.credential?.organization?.name ?? '');
  //   }
  // }
  // }, [issuedCredential]);

  return (
    <>
      <Box sx={{ cursor: 'pointer', height: '100%' }}>
        <RootStyle>
          <Box height="100%" sx={{ position: 'relative', zIndex: 9 }}>
            <CardItemStyle>
              <Box height="100%" display="flex" justifyContent="space-between" flexDirection="column">
                <Box display="flex" justifyContent={'space-between'} alignItems="center">
                  <Box className={classes.subTitle}>CERTIFICADO BLOCKCHAIN</Box>
                  <Box>
                    <Checkbox
                      inputProps={{ 'aria-label': 'Checkbox demo' }}
                      checked={checked}
                      sx={{
                        color: 'white',
                        '&.Mui-checked': {
                          color: 'white'
                        }
                      }}
                      onClick={_handleSelectCredential}
                    />
                  </Box>
                </Box>
                <Box fontWeight={700} fontSize="1.68rem" color="white">
                  {issuedCredential?.credential?.name}
                </Box>
                <Divider style={{ color: 'white' }} />
                <Box my={1} display="flex" flexDirection={'column'}>
                  <Box className={classes.subTitle}>EMITIDO A:</Box>
                  <Box className={classes.title}>{issuedCredential?.producer?.full_name ?? ''}</Box>
                </Box>
                <Box my={1} display="flex" flexDirection={'column'}>
                  <Box className={classes.subTitle}>FECHA DE EMISIÓN:</Box>
                  <Box className={classes.title}>
                    {issuedCredential?.issuance_at
                      ? capitalizeAllWords(
                          format(new Date(issuedCredential?.issuance_at), 'dd MMMM yyyy', { locale: es })
                        )
                      : ''}
                  </Box>
                </Box>
                <Box my={1} display="flex" flexDirection={'column'}>
                  <Box className={classes.subTitle}>ID BLOCKCHAIN:</Box>
                  <Box className={classes.title}>{issuedCredential?.contract_transaction_hash ?? ''}</Box>
                </Box>
                <Box mt={2} className="title" display="flex" justifyContent={'flex-end'}>
                  <Box display={'flex'} alignItems="flex-start" onClick={handleOpenDialog} className="button-complete">
                    Ver certificado completo&nbsp;&nbsp;&nbsp;
                    <ArrowForwardRoundedIcon />
                  </Box>
                </Box>
                {/* <Box position="absolute" bottom="0" left="0" right="0" mr={3}>
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
                </Box> */}
              </Box>
            </CardItemStyle>
          </Box>
          {/* <Box sx={{ ...shadowStyle }} />
          <Box
            sx={{
              ...shadowStyle,
              opacity: 0.16,
              bottom: 0,
              zIndex: 7,
              width: 'calc(100% - 40px)'
            }}
          /> */}
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
