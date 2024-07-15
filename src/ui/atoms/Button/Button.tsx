import React from 'react';
import { CircularProgress } from '@mui/material';
import MaterialButton from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

const useStyles: any = makeStyles(() => ({
  wrapper: {
    margin: '8px',
    position: 'relative'
  },
  progress: {
    // color: '#00695c',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

type ButtonProps = {
  text: string;
  color?: 'inherit' | 'primary' | 'secondary';
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  progressColor?: 'primary' | 'secondary' | 'inherit' | undefined;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?(): any;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: any;
};

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const classes = useStyles();
  const { text, color, variant, progressColor, isLoading, sx, ...rest } = props;

  return (
    <div className={classes.wrapper}>
      <MaterialButton variant={variant} color={color} {...rest} sx={{ ...sx, textTransform: 'inherit' }}>
        {text}
      </MaterialButton>
      {isLoading && <CircularProgress color={progressColor} size={24} className={classes.progress} />}
    </div>
  );
};

Button.defaultProps = {
  progressColor: 'primary'
};
export default React.memo(Button);
