import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';

type FilterTypeProps = {
  handleOnChangeTextFilter: (nameFilter: any, value: string) => void;
  form_type: string;
};

const FilterType: React.FC<FilterTypeProps> = (props: FilterTypeProps) => {
  const { handleOnChangeTextFilter, form_type } = props;

  return (
    <Box>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={form_type}
        onChange={(e: any) => {
          handleOnChangeTextFilter('form_type', e.target.value);
        }}
      >
        <FormControlLabel value="ALL" control={<Radio />} label="Todos" />
        <FormControlLabel value="PRODUCER" control={<Radio />} label="Formulario de información general" />
        <FormControlLabel value="PRODUCTIVE_UNIT" control={<Radio />} label="Formulario de unidad productiva" />
        <FormControlLabel value="FREE" control={<Radio />} label="Formulario de organización" />
      </RadioGroup>
    </Box>
  );
};

export default FilterType;
