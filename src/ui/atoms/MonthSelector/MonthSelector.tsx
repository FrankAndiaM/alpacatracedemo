import React from 'react';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { Box, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';

type MonthSelectorProps = {
  value: Date;
  onChange: (date: Date) => void;
  dateFormatter?: (date: Date) => string;
  bgTransp?: boolean;
  arrowColor?: string;
  textColor?: string;
};

const MONTHS: any = {
  0: 'Enero',
  1: 'Febrero',
  2: 'Marzo',
  3: 'Abril',
  4: 'Mayo',
  5: 'Junio',
  6: 'Julio',
  7: 'Agosto',
  8: 'Septiembre',
  9: 'Octubre',
  10: 'Noviembre',
  11: 'Diciembre'
};

const useStyles = makeStyles({
  boxDate: {
    padding: '6px 30px',
    borderRadius: '24px',
    marginInline: '8px',
    fontSize: '15px',
    fontWeight: 500
    // color: '#161C24'
  }
});

const MonthSelector: React.FC<MonthSelectorProps> = (props: MonthSelectorProps) => {
  const classes = useStyles();
  const { value, onChange, dateFormatter, bgTransp, arrowColor, textColor } = props;

  const handleRight = () => {
    const resultDate = new Date(value);
    resultDate.setMonth(resultDate.getMonth() + 1);
    onChange(resultDate);
  };

  const handleLeft = () => {
    const resultDate = new Date(value);
    resultDate.setMonth(resultDate.getMonth() - 1);
    onChange(resultDate);
  };

  return (
    <Box display={'flex'} alignItems="center">
      <IconButton onClick={handleLeft}>
        <ArrowBackIosRoundedIcon style={{ color: arrowColor }} />
      </IconButton>
      <Box
        className={classes.boxDate}
        style={{ color: textColor ?? '#161C24', backgroundColor: bgTransp ? 'transparent' : '#F9FAFB' }}
      >
        {dateFormatter && dateFormatter(value)}
      </Box>
      <IconButton onClick={handleRight}>
        <ArrowForwardIosRoundedIcon style={{ color: arrowColor }} />
      </IconButton>
    </Box>
  );
};

MonthSelector.defaultProps = {
  dateFormatter: (date: Date) => {
    return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
};

export default React.memo(MonthSelector);
