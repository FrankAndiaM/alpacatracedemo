import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export type BreadcrumbItem = {
  component: string | React.ReactNode;
  path?: string;
  onClick?: () => void; // solo funcionara en caso path este undefined
};

type BreadcrumbsComponentProps = {
  breadcrumbs?: BreadcrumbItem[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles: any = makeStyles((theme: Theme) => ({
  textActive: {
    display: 'flex',
    alignItems: 'center',
    // color: '#0E4535',
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '14px'
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    // color: '#0E4535',
    color: theme.palette.primary.main,
    fontSize: '14px',
    fontWeight: 400,
    textDecoration: 'none !important'
  }
}));

type prevNavigation = {
  module: string;
};

const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = (props: BreadcrumbsComponentProps) => {
  const history = useNavigate();
  const { state }: { state: prevNavigation } = useLocation();
  const theme = useTheme();
  const classes = useStyles();
  const { breadcrumbs } = props;

  const handleOnClick = useCallback(
    (event: React.SyntheticEvent, path?: string) => {
      event.preventDefault();
      if (path !== undefined) history(path);
    },
    [history]
  );

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" style={{ color: `${theme.palette.primary.main}` }} />}
      >
        {breadcrumbs?.map((breadcrumbItem: BreadcrumbItem, index: number) => {
          if (index === 1 && state && state.module) {
            return (
              <Link
                color="inherit"
                key={`${state.module}_breadcrumb`}
                href="#"
                className={classes.textActive}
                onClick={() => {
                  history(-1);
                }}
              >
                {state.module}
              </Link>
            );
          }

          if (breadcrumbItem.path !== undefined) {
            return (
              <Link
                key={`${index}_breadcrumb`}
                color="inherit"
                href="#"
                className={classes.textActive}
                onClick={(event: React.SyntheticEvent) => handleOnClick(event, breadcrumbItem.path)}
              >
                {breadcrumbItem.component}
              </Link>
            );
          }
          if (breadcrumbItem.onClick !== undefined) {
            return (
              <Link
                key={`${index}_breadcrumb`}
                color="inherit"
                href="#"
                className={classes.textActive}
                onClick={breadcrumbItem.onClick}
              >
                {breadcrumbItem.component}
              </Link>
            );
          }
          return (
            <Link color="inherit" key={`${index}_breadcrumb`} className={classes.text} variant="inherit">
              {breadcrumbItem.component}
            </Link>
          );
        })}
      </Breadcrumbs>
    </>
  );
};

// onClick={breadcrumbItem.onClick}

export default React.memo(BreadcrumbsComponent);
