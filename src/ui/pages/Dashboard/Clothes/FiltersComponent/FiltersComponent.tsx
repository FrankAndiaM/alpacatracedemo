import { Box } from '@mui/material';
import React, { useCallback, useState } from 'react';
import TextFieldSearch from '~ui/molecules/TextFieldSearch/TextFieldSearch';
import PopoverComponent from './PopoverComponent';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import FilterUpdate from './filters/FilterUpdate';
import { FilterFarmer } from '~models/farmer';

type FiltersComponentProps = {
  handleApplyFilters: (filters: FilterFarmer) => void;
  handleSearch: (value: string) => void;
};

const FiltersComponent: React.FC<FiltersComponentProps> = (props: FiltersComponentProps) => {
  const { handleApplyFilters, handleSearch } = props;
  const [filters, setFilters] = useState<FilterFarmer>({});

  // const classes = useStyles();
  // const [showMore, setShowMore] = useState<boolean>(false);

  const handleOnChangeTextFilter = useCallback((nameFilter: any, value: string) => {
    setFilters((prev: FilterFarmer) => {
      return { ...prev, [nameFilter]: value };
    });
  }, []);
  // const handleOnChangeNumberFilter = useCallback((nameFilter: any, value: number) => {
  //   setFilters((prev: FilterFarmer) => {
  //     return { ...prev, [nameFilter]: value };
  //   });
  // }, []);

  // const handleShowMore = useCallback(() => {
  //   setShowMore((prev: boolean) => !prev);
  // }, []);

  const handleOnChangeSearch = useCallback(
    (value: any) => {
      handleSearch(value);
    },
    [handleSearch]
  );

  // const handleClearFilters = useCallback(() => {
  //   handleOnChangeSearch('');
  //   setFilters({});
  //   handleApplyFilters({});
  // }, [handleApplyFilters, handleOnChangeSearch]);

  const handleApply = useCallback(() => {
    handleApplyFilters(filters);
  }, [filters, handleApplyFilters]);

  const handleCancelFilter = useCallback(
    (filter: any[]) => {
      setFilters((prev: FilterFarmer) => {
        const newVar: FilterFarmer = Object.assign({}, prev);
        filter.forEach((el: keyof FilterFarmer) => {
          delete newVar[el];
        });
        handleApplyFilters(newVar);
        return newVar;
      });
    },
    [handleApplyFilters]
  );
  const handleDelFilters = useCallback((filter: any[]) => {
    setFilters((prev: FilterFarmer) => {
      const newVar: FilterFarmer = Object.assign({}, prev);
      filter.forEach((el: keyof FilterFarmer) => {
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

  return (
    <>
      <Box paddingY={'12px'} display={'flex'} flexDirection={'column'} width={'100%'}>
        <Box display="flex" width={'100%'}>
          <Box style={{ marginRight: '16px', backgroundColor: 'white' }} width={'100%'}>
            <TextFieldSearch onChange={handleOnChangeSearch} isAnimated={false} fullWidth size="small" />
          </Box>
          <PopoverComponent
            handleApplyFilter={handleApply}
            label="Fecha"
            styles={{ minWidth: '100px', backgroundColor: 'white' }}
            startIcon={<CalendarTodayOutlinedIcon />}
            handleCancel={handleCancel}
            filterName={['date_init', 'date_end', 'date_str']}
          >
            <FilterUpdate
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
