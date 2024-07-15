import { Grid, IconButton, Icon, Typography } from '@mui/material';
import React from 'react';
import { capitalize } from '~utils/Word';

type IconKeyValueProps = {
  nameIcon: string;
  description: string;
  values: string;
};

const IconKeyValue: React.FC<IconKeyValueProps> = (props: IconKeyValueProps) => {
  const { nameIcon, description, values } = props;

  return (
    <Grid
      container
      item
      alignItems="center"
      direction="column"
      style={{ width: 'min-content' }}
      xs={5}
      sm={5}
      md={'auto'}
      lg={'auto'}
      xl={'auto'}
    >
      <Grid item>
        <IconButton size="small">
          <Icon style={{ color: '#446125' }}>{nameIcon}</Icon>
        </IconButton>
      </Grid>

      <Grid item>
        <Typography align="center" style={{ color: '#b0d189' }}>
          {capitalize(description)}
        </Typography>
        <Typography align="center" style={{ color: '#667356' }}>
          {capitalize(values)}
        </Typography>
      </Grid>
    </Grid>
  );
};

IconKeyValue.defaultProps = {
  // disableClearable: false
  nameIcon: '',
  description: '',
  values: ''
};

export default React.memo(IconKeyValue);
