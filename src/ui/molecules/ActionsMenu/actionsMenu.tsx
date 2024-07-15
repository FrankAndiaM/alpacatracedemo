import React, { useCallback, ReactNode } from 'react';
import { MenuItem, IconButton, ListItemIcon, Icon, ListItemText } from '@mui/material';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import MenuPopover from '~ui/atoms/MenuPopover/MenuPopover';

export type MenuListItem = {
  onClick(): void;
  icon: string;
  text: string;
};

type ActionsMenuProps = {
  listItems?: MenuListItem[];
  icon?: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles: any = makeStyles((theme: Theme) => ({
  menuItem: {
    padding: '15px',
    '&:hover': {
      backgroundColor: '#919EAB25'
    },
    '& .MuiListItemIcon-root': {
      minWidth: '35px'
    }
  }
}));

/**
 * @deprecated
 */
const ActionsMenu: React.FC<ActionsMenuProps> = (props: ActionsMenuProps) => {
  const classes = useStyles();
  const { listItems, icon } = props;
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
      <IconButton size="small" onClick={handleOnClick}>
        {icon ? icon : <Icon style={{ color: '#446125' }}>more_horiz</Icon>}
      </IconButton>
      <MenuPopover sx={{ paddingTop: '7px' }} open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
        {listItems &&
          listItems.map((item: MenuListItem, index: number) => {
            return (
              <MenuItem
                key={`list_item_${index}`}
                onClick={() => handleMenuClick(item.onClick)}
                className={classes.menuItem}
              >
                {item.icon && (
                  <ListItemIcon>
                    <Icon>{item.icon}</Icon>
                  </ListItemIcon>
                )}
                <ListItemText primary={item.text} />
              </MenuItem>
            );
          })}
      </MenuPopover>
    </>
  );
};

export default React.memo(ActionsMenu);
