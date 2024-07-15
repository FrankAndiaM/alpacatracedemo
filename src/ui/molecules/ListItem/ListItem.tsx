import React, { useState, useCallback } from 'react';
import useStyles from './ListItem.css';
import { ListItem, ListItemIcon, Icon, ListItemText, Collapse, List } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type ListItemProps = {
  item: any;
  onClick?(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
};

const ComponentListItem: React.FC<ListItemProps> = (props: ListItemProps) => {
  const themes = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const classes = useStyles();
  const { item, onClick } = props;
  const isActiveDesktop = useMediaQuery(themes.breakpoints.up('md'));

  const handleShowChildren = () => {
    setOpen((prevValue: boolean) => !prevValue);
  };

  const handleOnClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!isActiveDesktop) {
        onClick && onClick(event);
      }
    },
    [onClick, isActiveDesktop]
  );

  // const getActiveLink = useCallback((route: string, currentRoute: string): boolean => {
  //   if (route.toLocaleLowerCase() === currentRoute.toLocaleLowerCase()) {
  //     return true;
  //   }
  //   return false;
  // }, []);

  return (
    <div style={{ fontSize: '2em' }}>
      {item.children && item.children.length > 0 ? (
        <>
          <ListItem
            button
            onClick={handleShowChildren}
            component={React.forwardRef((props: any, ref: any) => (
              <NavLink
                // eslint-disable-next-line react/prop-types
                to={item.path}
                {...props}
                ref={ref}
                exact
                activeClassName={classes.ItemOfListActive}
              />
            ))}
            className={classes.ItemOfListHover}
          >
            <ListItemIcon style={{ minWidth: '35px' }}>
              <Icon> {item.icon} </Icon>
            </ListItemIcon>
            <ListItemText primary={item.text} style={{ color: '#FFF' }} />
            {open ? <ExpandLess style={{ color: '#FFFFFF' }} /> : <ExpandMore style={{ color: '#FFFFFF' }} />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child: any, index: number) => {
                return (
                  // <ListItem button className={classes.nested} >
                  //   <ListItemIcon>
                  //     <Icon style={{ color: themes.sidebar.iconColor }}>{child.icon}</Icon>
                  //   </ListItemIcon>
                  //   <ListItemText primary={child.text} />
                  // </ListItem>
                  <ListItem
                    button
                    onClick={handleOnClick}
                    key={`list_item_child${item.text}_${index}`}
                    component={React.forwardRef((props: any, ref: any) => (
                      <NavLink
                        // eslint-disable-next-line react/prop-types
                        to={child.path}
                        {...props}
                        ref={ref}
                        exact
                        activeClassName={classes.ItemOfListActive}
                      />
                    ))}
                    className={classes.nested}
                  >
                    <ListItemIcon>
                      <Icon>{child.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={child.text} />
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </>
      ) : (
        <ListItem
          button
          onClick={handleOnClick}
          component={React.forwardRef((props: any, ref: any) => (
            <NavLink
              // eslint-disable-next-line react/prop-types
              to={item.path}
              {...props}
              ref={ref}
              exact
              activeClassName={classes.ItemOfListActive}
            />
          ))}
          className={classes.ItemOfListHover}
        >
          <ListItemIcon>
            <Icon>{item.icon} </Icon>
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      )}
    </div>
  );
};

export default React.memo(ComponentListItem);
