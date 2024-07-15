import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Box, Typography, useMediaQuery } from '@mui/material';
import LogIn from './LogIn';
import ForgotPassword from '../ForgotPassword';
// import LogoAgros from '~assets/img/Agros.png';
// import LogoAlpacaTrace from '~assets/img/alpaca_trace.png';
import { ReactComponent as AlpacaTrace } from '~assets/img/alpaca_trace.svg';
import IconBackground from '~assets/icons/logo_vector.svg';
import './Login.scss';

const Login = () => {
  const matches = useMediaQuery('(min-width:960px)');
  const [isActiveVerifyCode, setIsActiveVerifyCode] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  const handleVerifyCode = useCallback((userName?: string) => {
    setUserName(userName ?? '');
    setIsActiveVerifyCode((prevValue: boolean) => !prevValue);
  }, []);

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <>
      <Grid container style={{ height: '100%' }}>
        {matches && (
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="account">
              <div className="account__photo">
                <div className="account_Photo_img">
                  <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
                    <Box color="white" fontSize={30} p={15}>
                      <Typography
                        align="justify"
                        style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '20px' }}
                      >
                        &ldquo;Sistema de trazabilidad de productos textiles basada en tecnología blockchain para
                        impulsar su promoción comercial.&rdquo;
                      </Typography>
                      <Typography gutterBottom style={{ fontSize: '25px', fontWeight: 'bold' }}>
                        <li>Alpaca trace</li>
                      </Typography>
                      <Box display="flex" justifyContent="flex-end">
                        <img src={IconBackground} alt="IconBackground" />
                      </Box>
                    </Box>
                  </Box>
                </div>
              </div>
            </div>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="account">
            <div className="account__card">
              <div className="account__head">
                {/* <img src={LogoAlpacaTrace} className="account__logo__img" alt="logo" /> */}
                <Box width={{ xs: 264, md: 350 }} height={{ xs: 180, md: 248 }}>
                  <AlpacaTrace height={'auto'} width={'100%'} />
                </Box>
              </div>
              {!isActiveVerifyCode && <LogIn onVerifyCode={handleVerifyCode} />}
              {isActiveVerifyCode && <ForgotPassword onVerifyCode={handleVerifyCode} userName={userName} />}
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(Login);
