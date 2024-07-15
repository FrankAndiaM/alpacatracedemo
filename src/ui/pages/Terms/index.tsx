import React, { useState, useCallback } from 'react';
import { Container, Tab, Box, Tabs, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import CheckCircleIcon from '@iconify/icons-ic/check-circle';
import ShieldIcon from '@iconify/icons-ic/round-shield';
import ReceiptIcon from '@iconify/icons-ic/receipt';
import PanToolIcon from '@mui/icons-material/PanTool';
import { makeStyles } from '@mui/styles';
import ThemeConfig from '~ui/themes';
import { useNavigate } from 'react-router-dom';
import DefinitionTab from './DefinitionTab';
import AboutTermsTab from './AboutTermsTab';
import PrivacyPolicyTab from './PrivacyPolicyTab';
import ServiceRegulationTab from './ServiceRegulationTab';
import GeneralDescriptionTab from './GeneralDescriptionTab';
import AlertIcon from '@mui/icons-material/Error';

type TermsComponentProps = unknown;

const useStyles: any = makeStyles((): any => ({
  wrapper: {
    flexDirection: 'row !important',
    display: 'flex !important',
    alignItems: 'center !important'
  },
  labelIcon: {
    marginRight: '5px',
    marginLeft: '5px'
  }
}));

const TermsComponent: React.FC<TermsComponentProps> = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const history = useNavigate();

  const handleOnClick = useCallback(() => {
    history('/');
  }, [history]);

  return (
    <ThemeConfig>
      <Container maxWidth="lg" sx={{ mt: '50px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" my={3}>
          <Box fontWeight={700} fontSize="24px" lineHeight="36px">
            Términos de condiciones y privacidad
          </Box>
          <Box>
            <Button variant="contained" onClick={handleOnClick}>
              Iniciar Sesión
            </Button>
          </Box>
        </Box>
        <Box>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={(_e: any, value: any) => setCurrentTab(value)}
          >
            <Tab
              disableRipple
              label="Descripción general"
              icon={<Icon icon={CheckCircleIcon} width={20} height={20} className={classes.labelIcon} />}
              value={0}
              iconPosition="start"
            />
            <Tab
              disableRipple
              label="Definiciones"
              icon={<Icon icon={ReceiptIcon} width={20} height={20} className={classes.labelIcon} />}
              value={1}
              iconPosition="start"
            />
            <Tab
              disableRipple
              label="Regulaciones del servicio"
              icon={<AlertIcon className={classes.labelIcon} />}
              value={2}
              iconPosition="start"
            />
            <Tab
              disableRipple
              label="Política de privacidad"
              icon={<Icon icon={ShieldIcon} width={20} height={20} className={classes.labelIcon} />}
              value={3}
              iconPosition="start"
            />
            <Tab
              disableRipple
              label="Sobre los términos"
              icon={<PanToolIcon className={classes.labelIcon} />}
              value={4}
              iconPosition="start"
            />
          </Tabs>
          {currentTab === 0 && <GeneralDescriptionTab />}
          {currentTab === 1 && <DefinitionTab />}
          {currentTab === 2 && <ServiceRegulationTab />}
          {currentTab === 3 && <PrivacyPolicyTab />}
          {currentTab === 4 && <AboutTermsTab />}
        </Box>
      </Container>
    </ThemeConfig>
  );
};

export default TermsComponent;
