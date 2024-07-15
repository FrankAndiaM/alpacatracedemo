import React, { useCallback, useEffect, useState } from 'react';
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import DateField from '~ui/atoms/DateField/DateField';
import moment from 'moment';
import * as yup from 'yup';
import { useFormik } from 'formik';

type FilterUpdateProps = {
  dateStr: string;
  initialDate: string;
  endDate: string;
  handleOnChangeTextFilter: (nameFilter: any, value: string) => void;
  handleCancelFilter: (filters: any[]) => void;
};

const FilterUpdate: React.FC<FilterUpdateProps> = (props: FilterUpdateProps) => {
  const { dateStr, endDate, initialDate, handleOnChangeTextFilter, handleCancelFilter } = props;
  const [hideDates, setHideDates] = useState<boolean>(false);

  const newDownload: any = {
    download_value: '',
    date_init: null,
    date_end: null
  };

  const validationSchema = yup.object().shape({
    download_value: yup.string().required('Campo requerido.')
  });

  const formik = useFormik({
    initialValues: newDownload,
    onSubmit: (value: any) => {
      // eslint-disable-next-line no-console
      console.log(value);
    },
    validate(values: any) {
      const errors: any = {};
      if (values.download_value === 'range') {
        if (!values.date_init) {
          errors['date_init'] = 'Campo requerido';
        }
        if (!values.date_end) {
          errors['date_end'] = 'Campo requerido';
        }
      }
      return errors;
    },
    validationSchema
  });

  const changeFilter = useCallback(
    (nameFilter: any, value: string) => {
      handleCancelFilter(['date_init', 'date_end']);
      if (value !== 'all') {
        setHideDates(true);
      } else {
        setHideDates(false);
      }
      handleOnChangeTextFilter(nameFilter, value);
    },
    [handleCancelFilter, handleOnChangeTextFilter]
  );

  const handleOnChangeSelectPhoneInput = useCallback(
    (value: any, name: string) => {
      const val = moment(value).format('DD/MM/YY');
      if (val !== 'Invalid date') {
        handleOnChangeTextFilter(name, moment(value).format('DD/MM/YY'));
      } else {
        handleOnChangeTextFilter(name, '');
      }
      // formik.setFieldValue(name, value);
    },
    [handleOnChangeTextFilter]
  );

  useEffect(() => {
    formik.setFieldValue('download_value', dateStr || '');
    if (initialDate !== '') {
      formik.setFieldValue('date_init', moment(initialDate, 'DD/MM/YY'));
    } else {
      formik.setFieldValue('date_init', null);
    }
    if (endDate !== '') {
      formik.setFieldValue('date_end', moment(endDate, 'DD/MM/YY'));
    } else {
      formik.setFieldValue('date_end', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateStr, endDate, initialDate]);

  return (
    <Box mt={1}>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        value={formik.values.download_value || 'all'}
        name="radio-buttons-group"
        onChange={(e: any) => {
          changeFilter('date_str', e.target.value);
        }}
      >
        <FormControlLabel value="all" control={<Radio />} label="Cualquier momento" />
        <FormControlLabel value="day_last" control={<Radio />} label="Actualizado en las últimas 24 horas" />
        <FormControlLabel value="week_last" control={<Radio />} label="Actualizado la semana pasada" />
        <FormControlLabel value="month_last" control={<Radio />} label="Actualizado el mes pasado" />
      </RadioGroup>
      <Box>
        <Box display={'flex'} mt={1} mb={1}>
          <Box mr={1}>
            <Typography>Fecha inicial</Typography>
            <DateField
              id="date_init"
              name="date_init"
              label=""
              value={formik.values.date_init}
              onChange={(value: any, _keyboardInputValue?: string | undefined) =>
                handleOnChangeSelectPhoneInput(value, 'date_init')
              }
              disabled={formik.isSubmitting || hideDates}
              errors={formik.errors}
              touched={formik.touched}
              variant={'outlined'}
              maxDate={moment(formik.values.date_end, 'DD/MM/YY')}
            />
          </Box>
          <Box ml={1}>
            <Typography>Fecha final</Typography>
            <DateField
              id="date_end"
              name="date_end"
              label=""
              value={formik.values.date_end}
              onChange={(value: any, _keyboardInputValue?: string | undefined) =>
                handleOnChangeSelectPhoneInput(value, 'date_end')
              }
              disabled={formik.isSubmitting || hideDates}
              errors={formik.errors}
              touched={formik.touched}
              variant={'outlined'}
              minDate={moment(formik.values.date_init, 'DD/MM/YY')}
              maxDate={moment()}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FilterUpdate;
