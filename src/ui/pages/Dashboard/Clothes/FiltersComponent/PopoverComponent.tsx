import React, { useCallback } from 'react';
import { Box, Button, Divider, IconButton, Popover } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
// import { FilterFarmer } from '~models/farmer';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const useStyles: any = makeStyles(() => ({
  filterStyle: {
    border: '0.8px solid var(--gray-200, #B9B9B9)',
    borderRadius: '4px',
    color: '#2F3336',
    '&:hover': {
      border: '0.8px solid var(--gray-200, #B9B9B9)',
      backgroundColor: 'white',
      color: '#2F3336'
    }
  }
}));

type PopoverComponentProps = {
  label: string;
  startIcon: React.ReactNode;
  handleApplyFilter: () => void;
  handleCancel: (filter: any[]) => void;
  children: React.ReactNode;
  styles?: React.CSSProperties;
  filterName: any[];
};

const PopoverComponent: React.FC<PopoverComponentProps> = (props: PopoverComponentProps) => {
  const { label, startIcon, children, styles, handleApplyFilter, handleCancel, filterName } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilters = useCallback(() => {
    handleApplyFilter();
  }, [handleApplyFilter]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancelButton = useCallback(() => {
    handleCancel(filterName);
    handleClose();
  }, [filterName, handleCancel]);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Button
        variant="outlined"
        className={classes.filterStyle}
        style={{ ...styles }}
        startIcon={startIcon}
        aria-describedby={id}
        onClick={handleClick}
        // onClick={handleShowMore}
        size="small"
        endIcon={open ? <ArrowDropUpOutlinedIcon /> : <ArrowDropDownOutlinedIcon />}
      >
        {label}
      </Button>
      {/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        {label}
      </Button> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        PaperProps={{ style: { minWidth: '270px', padding: '16px' } }}
      >
        <Box
          style={{
            position: 'absolute',
            right: '12px',
            top: '8px'
          }}
        >
          <IconButton onClick={handleClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        {children}
        <Divider />
        <Box display={'flex'} justifyContent={'flex-end'} paddingY={2}>
          <Button variant="text" onClick={handleCancelButton}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" style={{ marginLeft: '16px' }} onClick={handleFilters}>
            Ver resultados
          </Button>
        </Box>
        {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography> */}
      </Popover>
    </>
  );
};

export default React.memo(PopoverComponent);
