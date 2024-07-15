import React from 'react';
import { Popover, Box } from '@mui/material';
// import { Icon } from '@iconify/react';
// import infoCircleFilled from '@iconify/icons-ant-design/info-circle-filled';
import MaterialIcon from '@mui/material/Icon';

function SimplePopover() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-Popover' : undefined;

  return (
    <div>
      <Box fontSize="1.4em" display="flex" flexDirection="row" justifyContent="center" alignItems="center" mt={2}>
        <Box display="flex" alignItems="center">
          <MaterialIcon style={{ color: '#3f860c' }}>room</MaterialIcon>
        </Box>
        <Box mr={1}>Ubicación de Parcelas</Box>
        {/* <Box onClick={handleClick} display="flex" alignItems="center">
          <Icon icon={infoCircleFilled} color="red" />
        </Box> */}
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper', borderRadius: '10px' }} fontSize="1.2em">
          Para mostrar las parcelas de sus productores
          <br /> envíe sus archivos KMZ a hola@agros.tech
        </Box>
      </Popover>
    </div>
  );
}

export default React.memo(SimplePopover);
