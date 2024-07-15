import { Box } from '@mui/material';
import React, { useCallback, useState } from 'react';
import TextFieldSearch from '~ui/molecules/TextFieldSearch/TextFieldSearch';
// import { makeStyles } from '@mui/styles';
// // import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
// import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
// import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
// import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import PopoverComponent from './PopoverComponent';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
// import PlantIcon from '~assets/img/plant_icon.png';
// import StatusIcon from '~assets/icons/status_icon.svg';
// // import CropIcon from '~assets/icons/crop_icon.svg';
// import CleaningServicesRoundedIcon from '@mui/icons-material/CleaningServicesRounded';
import { FilterDataForms, FilterForms } from '~models/organizationForm';
// import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
// import FilterType from './filters/FilterType';
import FilterDate from './filters/FilterDate';
// import FilterResponseStatus from './filters/FilterResponseStatus';

// const useStyles: any = makeStyles(() => ({
//   filterStyle: {
//     border: '0.8px solid var(--gray-200, #B9B9B9)',
//     borderRadius: '4px',
//     color: '#2F3336',
//     '&:hover': {
//       border: '0.8px solid var(--gray-200, #B9B9B9)',
//       backgroundColor: 'white',
//       color: '#2F3336'
//     }
//   }
// }));

type FiltersComponentProps = {
  handleApplyFilters: (filters: FilterDataForms) => void;
  handleSearch: (value: string, typeSearch: string) => void;
  organizationId: string;
  handleAllRows: (value: string) => void;
};

const FiltersComponent: React.FC<FiltersComponentProps> = (props: FiltersComponentProps) => {
  const { handleApplyFilters, handleSearch, organizationId } = props;

  const [filters, setFilters] = useState<FilterDataForms>({
    owner_model_id: organizationId,
    form_type: 'ALL',
    search: '',
    status: 'ALL',
    search_type: 'all'
  });
  const [lastType] = useState<string>('all');
  // const classes = useStyles();
  // const [showMore, setShowMore] = useState<boolean>(false);

  //   const handleOnSelectTags = useCallback((name: string, values: any[]) => {
  //     setFilters((prev: FilterForms) => {
  //       return { ...prev, tag_id: values };
  //     });
  //   }, []);

  const handleOnChangeTextFilter = useCallback((nameFilter: any, value: string) => {
    setFilters((prev: FilterForms) => {
      return { ...prev, [nameFilter]: value };
    });
  }, []);
  //   const handleOnChangeNumberFilter = useCallback((nameFilter: any, value: number) => {
  //     setFilters((prev: FilterForms) => {
  //       return { ...prev, [nameFilter]: value };
  //     });
  //   }, []);

  // const handleShowMore = useCallback(() => {
  //   setShowMore((prev: boolean) => !prev);
  // }, []);

  const handleOnChangeSearch = useCallback(
    (value: any) => {
      setFilters((prev: FilterForms) => {
        const newFilters: FilterForms = { ...prev, search: value };
        return newFilters;
      });
      handleSearch(value, lastType);
    },
    [handleSearch, lastType]
  );

  // const handleClearFilters = useCallback(() => {
  //   handleOnChangeSearch('');
  //   setLastType('all');
  //   setFilters({
  //     owner_model_id: organizationId,
  //     form_type: 'ALL',
  //     search: '',
  //     status: 'ALL',
  //     search_type: 'all'
  //   });
  //   handleApplyFilters({
  //     owner_model_id: organizationId,
  //     form_type: 'ALL',
  //     search: '',
  //     status: 'ALL',
  //     search_type: 'all'
  //   });
  // }, [handleApplyFilters, handleOnChangeSearch, organizationId]);

  const handleApply = useCallback(() => {
    handleApplyFilters(filters);
  }, [filters, handleApplyFilters]);

  const handleCancelFilter = useCallback(
    (filter: any[]) => {
      setFilters((prev: FilterForms) => {
        const newVar: FilterForms = Object.assign({}, prev);
        filter.forEach((el: keyof FilterForms) => {
          delete newVar[el];
        });
        handleApplyFilters(newVar);
        return newVar;
      });
    },
    [handleApplyFilters]
  );
  const handleDelFilters = useCallback((filter: any[]) => {
    setFilters((prev: FilterForms) => {
      const newVar: FilterForms = Object.assign({}, prev);
      filter.forEach((el: keyof FilterForms) => {
        delete newVar[el];
      });
      return newVar;
    });
  }, []);

  const handleCancel = useCallback(
    (value: any[]) => {
      handleCancelFilter(value);
    },
    [handleCancelFilter]
  );

  //   useEffect(() => {
  //     setFilters((prev: FilterForms) => {
  //       return { ...prev, archived_at: showTable === 2 };
  //     });
  //   }, [showTable]);
  // const handleChangeType = useCallback(
  //   (e: any) => {
  //     // handleTypeSearch(e.target.value);
  //     // handleOnChangeTextFilter('search_type', e.target.value);
  //     if (e.target.value === 'all') {
  //       setLastType(e.target.value);
  //       handleAllRows('all');
  //     } else {
  //       setLastType(e.target.value);
  //     }
  //   },
  //   [handleAllRows]
  // );

  return (
    <>
      <Box paddingY={'12px'} display={'flex'} flexDirection={'column'} width={'100%'}>
        <Box display="flex" width={'100%'}>
          <Box style={{ marginRight: '16px' }} width={'100%'} display="flex">
            {/* <FormControl sx={{ minWidth: 200, backgroundColor: '#F7F9F9' }} size="small">
              <Select
                labelId="search_type"
                id="search_type"
                name="search_type"
                value={lastType}
                label=""
                onChange={handleChangeType}
              >
                <MenuItem value={'all'}>Todos</MenuItem>
                <MenuItem value={'form'}>Nombre de formulario</MenuItem>
                <MenuItem value={'agent'}>Nombre de agente</MenuItem>
                <MenuItem value={'producer'}>Nombre de productor</MenuItem>
                <MenuItem value={'productive_unit'}>Nombre de unidad productiva</MenuItem>
              </Select>
            </FormControl> */}
            <TextFieldSearch onChange={handleOnChangeSearch} isAnimated={false} fullWidth size="small" />
          </Box>
          {/* <PopoverComponent
            handleApplyFilter={handleApply}
            styles={{ width: '270px' }}
            label="Tipo de formulario"
            startIcon={<DescriptionOutlinedIcon />}
            handleCancel={handleCancel}
            filterName={['form_type']}
          >
            <FilterType handleOnChangeTextFilter={handleOnChangeTextFilter} form_type={filters.form_type || ''} />
          </PopoverComponent> */}
          <PopoverComponent
            handleApplyFilter={handleApply}
            label="Fecha"
            startIcon={<CalendarTodayOutlinedIcon />}
            handleCancel={handleCancel}
            filterName={['date_init', 'date_end', 'date_str']}
          >
            <FilterDate
              dateStr={filters.date_str || ''}
              endDate={filters.date_end || ''}
              initialDate={filters.date_init || ''}
              handleOnChangeTextFilter={handleOnChangeTextFilter}
              handleCancelFilter={handleDelFilters}
            />
          </PopoverComponent>
          {/* <Button
            variant="outlined"
            className={classes.filterStyle}
            startIcon={<FilterAltOutlinedIcon />}
            onClick={handleShowMore}
            size="small"
            style={{ padding: '3px 16px', minWidth: '120px' }}
            endIcon={showMore ? <KeyboardDoubleArrowUpOutlinedIcon /> : <KeyboardDoubleArrowDownOutlinedIcon />}
          >
            Ver&nbsp;{showMore ? 'menos' : 'más'}
          </Button> */}
        </Box>
      </Box>
    </>
  );
};

export default React.memo(FiltersComponent);
