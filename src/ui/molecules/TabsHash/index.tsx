import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Tabs } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate, useLocation } from 'react-router-dom';

type TabsHashProps = {
  value: number;
  children?: ReactNode;
  'aria-label'?: string | undefined;
  onChange?: (event: any, newValue: number) => void;
  position?: number; //posición en los hashtags por defecto empieza en 1
  scrollButtons?: boolean | 'auto' | undefined;
  variant?: 'standard' | 'scrollable' | 'fullWidth' | undefined;
  allowScrollButtonsMobile?: boolean | undefined;
};
const useStyles: any = makeStyles(() => ({
  indicator: {
    fontWeight: 'bold',
    marginY: '12px'
    // '& .MuiTabs-indicator': {
    //   background: 'white',
    //   borderBottom: '2px solid #00AB55'
    // }
  }
}));

const TabsHash: React.FC<TabsHashProps> = (props: TabsHashProps) => {
  const classes = useStyles();
  const history = useNavigate();
  const location = useLocation();
  const { children, value, onChange, position, scrollButtons, variant, allowScrollButtonsMobile } = props;
  const [val, setVal] = useState<number>(value);
  const [pos] = useState(position ?? 1);

  //   const addHash = useCallback(
  //     (cad: string) => {
  //       const arr = cad.split('#');
  //       arr.splice(pos, 1, `${value}`);
  //       const shash = `${arr.join('#')}`;
  //       return shash;
  //     },
  //     [pos, value]
  //   );

  const handleOnChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setVal(newValue);
      if (pos === 1) {
        history(`${location.pathname}#${newValue}`, { replace: true });
      }
      //   else if (pos > 1) {
      //     const shash = addHash(history.location.hash);
      //     history.replace(`${history.location.pathname}${shash}`);
      //   }
      onChange && onChange(event, newValue);
    },
    [history, onChange, pos, location]
  );

  useEffect(() => {
    // console.log(history.location.hash);
    const hash = location.hash;

    if (hash === '' && pos === 1) {
      history(`${location.pathname}#${value}`);
    }
    // else {
    //   if (pos > 1) {
    //     const shash = addHash(hash);
    //     history.replace(`${history.location.pathname}${shash}`);
    //   }
    // }
    if (hash !== '') {
      const lval = hash.split('#')[pos];
      if (lval) {
        setVal(+lval);
        onChange && onChange({}, +lval);
      }
    }
  }, [history, onChange, pos, value, location]);

  return (
    <Tabs
      {...props}
      onChange={handleOnChange}
      value={val}
      className={classes.indicator}
      scrollButtons={scrollButtons}
      variant={variant}
      allowScrollButtonsMobile={allowScrollButtonsMobile}
    >
      {children}
    </Tabs>
  );
};

export default TabsHash;
