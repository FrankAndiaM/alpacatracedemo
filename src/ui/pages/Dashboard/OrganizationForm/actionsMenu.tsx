import React, { useCallback } from 'react';
import { MenuItem, Tooltip, IconButton, Menu, ListItemIcon, Icon, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';

export type MenuListItem = {
  onClick(): void;
  icon: any;
  text: string;
};

type ActionsMenuProps = {
  listItems?: MenuListItem[];
};

const useStyles: any = makeStyles(() => ({
  menu: {
    '& .MuiMenu-paper': {
      border: '1px solid #d3d4d5'
    },
    '& .MuiMenu-list': {
      padding: '0px'
    }
  },
  menuItem: {
    '&:hover': {
      backgroundColor: '#96C262'
    },
    '& .MuiListItemIcon-root': {
      minWidth: '35px'
    },
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: '#0E4535'
    }
  }
}));

const ActionsMenu: React.FC<ActionsMenuProps> = (props: ActionsMenuProps) => {
  const classes = useStyles();
  const { listItems } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOnClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuClick = useCallback((onClick: any): void => {
    setAnchorEl(null);
    onClick();
  }, []);

  return (
    <>
      <Tooltip title="acciones">
        <IconButton size="small" onClick={handleOnClick}>
          <Icon style={{ color: '#0E4535' }}>more_horiz</Icon>
        </IconButton>
      </Tooltip>
      <Menu
        id="menu"
        className={classes.menu}
        elevation={0}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        keepMounted
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        aria-haspopup="true"
      >
        {listItems &&
          listItems.map((item: MenuListItem, index: number) => {
            return (
              <MenuItem
                key={`list_item_${index}`}
                onClick={() => handleMenuClick(item.onClick)}
                className={classes.menuItem}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </MenuItem>
            );
          })}
      </Menu>
    </>
  );
};

export default React.memo(ActionsMenu);
