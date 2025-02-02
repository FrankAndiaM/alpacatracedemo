import React from 'react';
import { Icon } from '@iconify/react';
import plusSquareOutline from '@iconify/icons-eva/plus-square-outline';
import minusSquareOutline from '@iconify/icons-eva/minus-square-outline';
// import closeSquareOutline from '@iconify/icons-eva/close-square-outline';
import { Theme } from '@mui/material/styles';
// import { Box } from '@material-ui/core';

// ----------------------------------------------------------------------

const ICON_SIZE = { width: 20, height: 20 };

export default function TreeView(theme: Theme) {
  return {
    MuiTreeView: {
      defaultProps: {
        defaultCollapseIcon: <Icon icon={minusSquareOutline} {...ICON_SIZE} />,
        defaultExpandIcon: <Icon icon={plusSquareOutline} {...ICON_SIZE} />
        // defaultEndIcon: (
        //   <Box component={Icon} icon={closeSquareOutline} {...ICON_SIZE} sx={{ color: 'text.secondary' }} />
        // )
      }
    },
    MuiTreeItem: {
      styleOverrides: {
        label: { ...theme.typography.body2 },
        iconContainer: { width: 'auto' }
      }
    }
  };
}
