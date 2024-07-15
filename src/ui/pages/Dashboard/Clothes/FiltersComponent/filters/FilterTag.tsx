import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

type FilterTagProps = {
  tags: any[];
  selected: any[];
  onSelectTags: (name: string, values: any[]) => void;
};

const FilterTag: React.FC<FilterTagProps> = (props: FilterTagProps) => {
  const { tags, onSelectTags, selected } = props;
  const [tagsSelected, setTagsSelected] = useState<string[]>(selected || []);

  const handleChange = useCallback((e: any, checked: boolean) => {
    const id = e.target.value;
    if (checked) {
      setTagsSelected((prev: string[]) => [...prev, id]);
    } else {
      setTagsSelected((prev: string[]) => {
        const arr = Object.assign([], prev);
        const f = arr.findIndex((element: string) => element === id);
        if (f >= 0) {
          arr.splice(f, 1);
          return arr;
        }
        return arr;
      });
    }
  }, []);

  useEffect(() => {
    onSelectTags('tag_id', tagsSelected);
  }, [onSelectTags, tagsSelected]);

  return (
    <Box>
      <Typography fontSize={14} fontWeight={700}>
        Información general
      </Typography>
      <FormGroup>
        {/* <FormControlLabel control={<Checkbox onChange={handleChange} 
        value={'all'} name={'all'} />} label={'Todos'} /> */}
        {tags.map((element: any) => {
          const check = tagsSelected.findIndex((val: string) => element.id === val);
          let checked = false;
          if (check >= 0) {
            checked = true;
          }
          return (
            <FormControlLabel
              key={element.id}
              control={<Checkbox onChange={handleChange} checked={checked} value={element.id} name={element.id} />}
              label={element.display_name}
            />
          );
        })}
      </FormGroup>
    </Box>
  );
};

export default React.memo(FilterTag);
