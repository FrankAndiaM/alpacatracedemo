import React, { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, useTheme, experimentalStyled as styled } from '@mui/material/styles';
import {
  Box,
  List,
  ListItem,
  Collapse,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  BoxProps,
  Badge
} from '@mui/material';
import MaterialIcon from '@mui/material/Icon';
// theme
import typography from '~theme/typography';
import { useSelector } from 'react-redux';
// ----------------------------------------------------------------------

const ListSubheaderStyle = styled((props: any) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }: any) => ({
    ...typography.overline,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    color: theme.palette.text.primary
  })
);

const ListItemStyle: any = styled(ListItem)(({ theme }: any) => ({
  ...typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'inherit',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  '&:before': {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: '""',
    display: 'none',
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main
  }
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

// ----------------------------------------------------------------------

type NavItemProps = {
  title: string;
  path: string;
  icon?: string;
  info?: JSX.Element;
  count?: any;
  title_header?: string;
  children?: {
    title: string;
    title_header?: string;
    path: string;
  }[];
};

function NavItem({ item, setTitulo }: { item: NavItemProps; setTitulo?: any }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { title, path, icon, info, children, count, title_header } = item;
  const isActiveRoot = path ? !!matchPath(path, pathname) : false;
  const [open, setOpen] = useState(isActiveRoot);
  const is_flow = pathname.includes('/dashboard/flows');
  const handleOpen = () => {
    setOpen(!open);
  };

  const handleOnClick = useCallback(
    (title_header) => {
      isActiveRoot && setTitulo(title_header ?? '');
    },
    [isActiveRoot, setTitulo]
  );

  useEffect(() => {
    if (children) {
      children.forEach((item: any) => {
        if (item.path ? !!matchPath(item.path, pathname) : false) {
          setTitulo && setTitulo(item?.title_header ?? '');
          setOpen(true);
        }
      });
    } else {
      isActiveRoot && setTitulo && setTitulo(title_header ?? '');
    }
  }, [isActiveRoot, pathname, children, title_header, setTitulo]);
  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium'
  };

  useEffect(() => {
    if (is_flow) {
      setTitulo && setTitulo('Whatsapp - Formularios');
    } else {
      setTitulo && setTitulo('');
    }
  }, [is_flow, setTitulo]);

  if (children) {
    return (
      <>
        <ListItemStyle
          button
          disableGutters
          onClick={() => {
            handleOpen();
            handleOnClick(title_header);
          }}
          sx={{
            ...(isActiveRoot && activeRootStyle)
          }}
          // eslint-disable-next-line
          // @ts-ignore
          component={RouterLink}
          to={path}
        >
          <ListItemIconStyle>{<MaterialIcon>{icon}</MaterialIcon>}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {count && (
            <Badge
              badgeContent={count}
              color="warning"
              sx={{ '& .MuiBadge-colorWarning': { backgroundColor: '#D6B602', color: '#ffffff' } }}
            />
          )}
          {info && info}
          <Box
            component={Icon}
            icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item: any) => {
              const { title, path } = item;
              const isActiveSub = path ? !!matchPath(path, pathname) : false;

              return (
                <ListItemStyle
                  button
                  disableGutters
                  key={title}
                  // eslint-disable-next-line
                  // @ts-ignore
                  component={RouterLink}
                  to={path}
                  sx={{
                    ...(isActiveSub && activeSubStyle)
                  }}
                  onClick={() => handleOnClick(title_header)}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'text.disabled',
                        transition: (theme: any) => theme.transitions.create('transform'),
                        ...(isActiveSub && {
                          transform: 'scale(2)',
                          bgcolor: 'primary.main'
                        })
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={title} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      button
      disableGutters
      // eslint-disable-next-line
      // @ts-ignore
      component={RouterLink}
      to={path}
      sx={{
        ...(isActiveRoot && activeRootStyle)
      }}
      onClick={() => handleOnClick(title_header)}
    >
      <ListItemIconStyle>{<MaterialIcon>{icon}</MaterialIcon>}</ListItemIconStyle>
      <ListItemText disableTypography primary={item.title} />
      {count && (
        <Badge
          badgeContent={count}
          color="warning"
          sx={{ marginRight: 3, '& .MuiBadge-colorWarning': { backgroundColor: '#D6B602', color: '#ffffff' } }}
        />
      )}
      {info && info}
    </ListItemStyle>
  );
}

type NavSectionProps = {
  navConfig: {
    subheader: string;
    items: NavItemProps[];
  }[];
  setTitulo?: any;
} & BoxProps;

export default function NavSection({ navConfig, setTitulo, ...other }: NavSectionProps) {
  const {
    auth: { countsSidebar }
  }: any = useSelector((state: any) => state);
  return (
    <Box {...other}>
      {navConfig.map((list: any, index: number) => {
        if (list) {
          const { subheader, items } = list;
          return (
            <List key={`list_${subheader}_${index}`} disablePadding>
              <ListSubheaderStyle>{subheader}</ListSubheaderStyle>
              {items.map((item: NavItemProps, idx: number) => {
                if (item) {
                  if (countsSidebar.hasOwnProperty(`${item.title}`)) {
                    item = { ...item, count: countsSidebar[`${item.title}`] };
                  }
                  return <NavItem key={`nav_item_${item.title}_${idx}`} item={item} setTitulo={setTitulo} />;
                }
                return <></>;
              })}
            </List>
          );
        }
        return <></>;
      })}
    </Box>
  );
}
