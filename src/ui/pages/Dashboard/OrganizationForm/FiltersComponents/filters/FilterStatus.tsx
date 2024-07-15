import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';

type FilterStatusProps = {
  handleOnChangeTextFilter: (nameFilter: any, value: string) => void;
  status: string;
};

const FilterStatus: React.FC<FilterStatusProps> = (props: FilterStatusProps) => {
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
        <FormControlLabel value="all" control={<Radio />} label="Todos" />
        <FormControlLabel value="edit" control={<Radio />} label="Editable" />
        <FormControlLabel value="not_edit" control={<Radio />} label="No Editable" />
      </RadioGroup>
    </Box>
  );
};

export default FilterStatus;
