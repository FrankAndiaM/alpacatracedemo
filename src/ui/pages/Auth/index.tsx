import React, { useState, useCallback, useEffect } from 'react';
import { Box, Grid, Tabs, Tab } from '@mui/material';
import LogoAgros from '~assets/img/LogoAgros.png';
import ThemeConfig from '~ui/themes';
import './Login.scss';
import LogIn from './LogIn';

const Auth = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleOnChangeTab = useCallback((event: React.ChangeEvent<any>, value: any) => {
    setTabIndex(value);
  }, []);

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <>
      <ThemeConfig>
        <Grid container>
          <Grid item xs={4} sm={6} md={8} lg={8} xl={8}>
            <div className="account account__photo">
              <div className="account__wrapper"></div>
            </div>
          </Grid>
          <Grid item xs={8} sm={6} md={4} lg={4} xl={4} style={{ background: 'white' }}>
            <Box my={3} mx={5}>
              <Tabs value={tabIndex} onChange={handleOnChangeTab} indicatorColor="primary" textColor="primary" centered>
                <Tab label="Ingresar" />
                <Tab label="Registrar" />
              </Tabs>
              <Box mt={2} mx={2}>
                <div className="account__card">
                  <img src={LogoAgros} className="account__logo__img" alt="logo" />
                  <h3 className="account__title">
                    <span className="account__logo__text">AGROS</span>
                  </h3>
                </div>
              </Box>
              {tabIndex === 0 && <LogIn />}
            </Box>
          </Grid>
        </Grid>
      </ThemeConfig>
    </>
  );
};

export default React.memo(Auth);
