import React, { useState } from 'react';
import { Box, InputAdornment, OutlinedInput } from '@mui/material';
import searchFill from '@iconify/icons-eva/search-fill';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';

type TextFieldSearchProps = {
  label?: string;
  isAnimated?: boolean;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  size?: 'medium' | 'small';
  maxLengthValue?: number;
};

const SearchStyle = styled(OutlinedInput)(({ theme }: any) => ({
  // width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: '1px !important',
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

const CompTextFieldSearch: React.FC<TextFieldSearchProps> = (props: TextFieldSearchProps) => {
  const { label, onChange, isAnimated, fullWidth, size, maxLengthValue } = props;
  const [textValue, setTextValue] = useState<string>('');
  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (maxLengthValue === undefined) {
      setTextValue(value);
      onChange(value);
    } else {
      if (value.length <= maxLengthValue) {
        setTextValue(value);
        onChange(value);
      }
    }
  }

  if (!isAnimated) {
    return (
      <>
        <OutlinedInput
          value={textValue}
          onChange={handleOnChange}
          placeholder={label}
          fullWidth={fullWidth}
          size={size || 'medium'}
          endAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      </>
    );
  }

  return (
    <>
      <SearchStyle
        value={textValue}
        onChange={handleOnChange}
        placeholder={label}
        size={size || 'medium'}
        style={{ width: fullWidth ? '100%' : 240 }}
        endAdornment={
          <InputAdornment position="start">
            <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
      />
    </>
  );
};
CompTextFieldSearch.defaultProps = {
  label: 'Buscar',
  isAnimated: true,
  onChange: () => null
};

export default React.memo(CompTextFieldSearch);
