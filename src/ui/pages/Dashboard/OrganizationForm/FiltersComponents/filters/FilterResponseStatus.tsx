import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';

type FilterResponseStatusProps = {
  handleOnChangeTextFilter: (nameFilter: any, value: string) => void;
  status: string;
};

const FilterResponseStatus: React.FC<FilterResponseStatusProps> = (props: FilterResponseStatusProps) => {
  const { handleOnChangeTextFilter, status } = props;

  return (
    <Box>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={status}
        onChange={(e: any) => {
          handleOnChangeTextFilter('status', e.target.value);
        }}
      >
        <FormControlLabel value="ALL" control={<Radio />} label="Todos" />
        <FormControlLabel value="PENDING" control={<Radio />} label="Pendiente" />
        <FormControlLabel value="COMPLETED" control={<Radio />} label="Completo" />
        <FormControlLabel value="UNFINISHED" control={<Radio />} label="Incompleto" />
      </RadioGroup>
    </Box>
  );
};

export default FilterResponseStatus;
