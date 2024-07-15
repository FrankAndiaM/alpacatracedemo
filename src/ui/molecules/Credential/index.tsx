import React, { useCallback } from 'react';
import { Box, Chip } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStatusColorCredentials } from './colorLabelStatus';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { Theme } from '~ui/themes';
import ShowCredentialValue from './ShowCredentialValue';
import IdentiBlueIcon from '~assets/img/identi_small.svg';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

type CredentialProps = {
  issuedCredential: any;
  credentialValues: any;
  organizationTheme: any;
};

const useStyles: any = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0)
    }
  },
  dividerStyle: {
    backgroundColor: 'white',
    border: 'none',
    height: 2,
    margin: 0
  },
  box1: {
    [theme.breakpoints.down('sm')]: {
      margin: '0px',
      padding: '1em'
    }
  },
  box2: {
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  claimsStyle: {
    color: 'white',
    fontWeight: 700,
    fontSize: '15px',
    lineHeight: '150%',
    [theme.breakpoints.down('md')]: {
      fontSize: '11px'
    }
  },
  boxCard: {
    borderRadius: '6.762px 6.762px 5px 5px',
    background: `linear-gradient(79deg, ${theme.palette.primary.main} -1.4%, ${theme.palette.primary.dark} 111.83%);`,
    height: '100%',
    justifyContent: 'space-between',
    flexDirection: 'column',
    display: 'flex'
  },
  boxClaims: {
    height: '180px',
    marginInline: '16px',
    marginBlock: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // overflow: 'auto',
    zIndex: 2,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    /* Track */
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },

    /* Handle */
    '&::-webkit-scrollbar-thumb': {
      background: '#D9D9D9',
      borderRadius: '13px'
    },

    /* Handle on hover */
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#888'
    }
  }
}));

const Credential: React.FC<CredentialProps> = (props: CredentialProps) => {
  const { issuedCredential, credentialValues, organizationTheme } = props;
  const classes = useStyles();
  const theme = useTheme();

  const showStatus = useCallback((status?: string) => {
    const { colorText, ColorBox, labelText } = getStatusColorCredentials(status ?? '');
    return (
      <Chip
        label={labelText}
        sx={{
          color: colorText,
          background: ColorBox,
          fontWeight: 700,
          borderRadius: '22px',
          paddingBlock: '8px',
          paddingInline: '16px'
        }}
      />
    );
  }, []);

  return (
    <>
      <Box height={'100%'} maxHeight={400} position={'relative'}>
        <Box className={classes.boxCard}>
          <Box px={2} pt={2} zIndex={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Box fontWeight={700} fontSize={{ xs: '1.1rem', md: '1.5rem' }} color="white">
                  {issuedCredential?.credential?.name}
                </Box>
              </Box>
              <Box>
                <img
                  src={organizationTheme?.organizationLogo}
                  alt={organizationTheme?.organizationName}
                  style={{
                    height: '60px',
                    width: 'auto',
                    borderRadius: '4px'
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box className={classes.boxClaims} fontSize={{ sm: '11px', md: '15px' }}>
            {Object.keys(credentialValues ?? {})?.map((key: any, index: number) => (
              <Box className={classes.claimsStyle} display="flex" key={`card_attribute_${index}`}>
                <Box component="span">{`${key}: `}</Box>
                <Box component="span" style={{ wordBreak: 'break-all' }}>
                  <ShowCredentialValue credentialValue={credentialValues[key]} />
                </Box>
              </Box>
            ))}
            <Box display={'flex'} alignItems={'center'} mt={1}>
              <Box mt={1}>{showStatus(issuedCredential?.credential_status?.name)}</Box>
              {issuedCredential?.contract_transaction_hash && (
                <Box color="white" display={'flex'} ml={3}>
                  Data respaldada por blockchain&nbsp;
                  <CheckCircleOutlineRoundedIcon />{' '}
                </Box>
              )}
            </Box>
          </Box>
          <Box
            position="relative"
            style={{
              backgroundColor: 'rgb(247, 249, 249)',
              color: theme.palette.primary.main,
              borderRadius: '0px 0px 4.481px 4.481px'
            }}
          >
            <Box px={2} py={1} fontSize={13} overflow={'auto'} zIndex={2}>
              <Box display="flex" justifyContent="space-between" my={1} flexDirection={{ xs: 'column', md: 'row' }}>
                <Box display="flex" alignItems="center">
                  <Box fontWeight={700}>Verificado por:&nbsp;</Box>
                  <Box ml={2}>
                    <img src={IdentiBlueIcon} alt="identi_blue_icon" />
                  </Box>
                </Box>
                <Box style={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                  <Box component="span">Fecha de emisión: </Box>
                  <Box component="span" pl={1}>
                    {issuedCredential?.issuance_at !== undefined &&
                      format(new Date(issuedCredential?.issuance_at), 'dd MMMM yyyy', { locale: es })}
                  </Box>
                </Box>
              </Box>
              {/* {issuedCredential?.contract_transaction_hash && (
                  <Box maxWidth="220px" textAlign={'end'}>
                    <Box
                      style={{
                        wordBreak: 'break-all',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        maxWidth: '180px',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        padding: '5px'
                      }}
                    >
                      {issuedCredential?.contract_transaction_hash ?? ''}
                    </Box>
                  </Box>
                )} */}
            </Box>
          </Box>
          <Box style={{ position: 'absolute', right: '0px', zIndex: 1, opacity: 0.2 }}>
            <Box>
              <svg xmlns="http://www.w3.org/2000/svg" width="174" height="160" viewBox="0 0 174 160" fill="none">
                <path
                  d="M205.328 -38.7764C209.566 -36.9748 212.521 -33.049 213.08 -28.4779L226.21 78.9339C226.769 83.505 224.846 88.027 221.167 90.7964L134.711 155.874C131.032 158.643 126.154 159.239 121.916 157.438L22.3298 115.103C18.0917 113.301 15.1367 109.376 14.5779 104.805L1.44754 -2.6073C0.888759 -7.1784 2.81106 -11.7004 6.49034 -14.4698L92.9465 -79.547C96.6258 -82.3165 101.503 -82.9127 105.741 -81.1111L205.328 -38.7764Z"
                  stroke="white"
                  strokeWidth="1.26786"
                />
              </svg>
            </Box>
            <Box style={{ position: 'absolute', left: '53px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="67" height="72" viewBox="0 0 67 72" fill="none">
                <path
                  d="M59.239 13.1082C61.2445 13.9863 62.6293 15.8676 62.8716 18.0434L66.0792 46.8423C66.3216 49.0182 65.3847 51.1581 63.6215 52.4559L40.2847 69.6332C38.5216 70.931 36.1999 71.1896 34.1944 70.3115L7.65003 58.6899C5.64451 57.8119 4.25976 55.9306 4.01741 53.7547L0.809812 24.9558C0.567463 22.78 1.50434 20.6401 3.26751 19.3423L26.6043 2.16496C28.3675 0.867156 30.6891 0.608573 32.6946 1.48662L59.239 13.1082Z"
                  stroke="white"
                  strokeWidth="1.26786"
                />
              </svg>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Credential;
