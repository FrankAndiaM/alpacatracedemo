import { Box, Button } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import TextFieldSearch from '~ui/molecules/TextFieldSearch/TextFieldSearch';
import { makeStyles } from '@mui/styles';
// import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import PopoverComponent from './PopoverComponent';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
// import PlantIcon from '~assets/img/plant_icon.png';
import StatusIcon from '~assets/icons/status_icon.svg';
// import CropIcon from '~assets/icons/crop_icon.svg';
import CleaningServicesRoundedIcon from '@mui/icons-material/CleaningServicesRounded';
import FilterStatus from './filters/FilterStatus';
import { FilterForms } from '~models/organizationForm';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FilterType from './filters/FilterType';
import FilterDate from './filters/FilterDate';

const useStyles: any = makeStyles(() => ({
  filterStyle: {
    border: '0.8px solid var(--gray-200, #B9B9B9)',
    borderRadius: '4px',
    color: '#2F3336',
    '&:hover': {
      border: '0.8px solid var(--gray-200, #B9B9B9)',
      backgroundColor: 'white',
      color: '#2F3336'
    }
  }
}));

type FiltersComponentProps = {
  handleApplyFilters: (filters: FilterForms) => void;
  handleSearch: (value: string) => void;
  organizationId: string;
  showTable: number;
};

const FiltersComponent: React.FC<FiltersComponentProps> = (props: FiltersComponentProps) => {
  const { handleApplyFilters, handleSearch, showTable, organizationId } = props;

  const [filters, setFilters] = useState<FilterForms>({
    owner_model_id: organizationId,
    is_active: true,
    archived_at: showTable === 2,
    form_type: 'ALL',
    search: '',
    status: 'all'
  });

  const classes = useStyles();
  const [showMore, setShowMore] = useState<boolean>(false);

  //   const handleOnSelectTags = useCallback((name: string, values: any[]) => {
  //     setFilters((prev: FilterForms) => {
  //       return { ...prev, tag_id: values };
  //     });
  //   }, []);

  const handleOnChangeTextFilter = useCallback((nameFilter: any, value: string) => {
    // console.log(nameFilter);
    // console.log(value);
    setFilters((prev: FilterForms) => {
      return { ...prev, [nameFilter]: value };
    });
  }, []);
  //   const handleOnChangeNumberFilter = useCallback((nameFilter: any, value: number) => {
  //     setFilters((prev: FilterForms) => {
  //       return { ...prev, [nameFilter]: value };
  //     });
  //   }, []);

  const handleShowMore = useCallback(() => {
    setShowMore((prev: boolean) => !prev);
  }, []);

  const handleOnChangeSearch = useCallback(
    (value: any) => {
      handleSearch(value);
      setFilters((prev: FilterForms) => {
        return { ...prev, search: value };
      });
    },
    [handleSearch]
  );

  const handleClearFilters = useCallback(() => {
    handleOnChangeSearch('');
    setFilters({
      owner_model_id: organizationId,
      is_active: true,
      archived_at: showTable === 2,
      form_type: 'ALL',
      search: '',
      status: 'all'
    });
    handleApplyFilters({
      owner_model_id: organizationId,
      is_active: true,
      archived_at: showTable === 2,
      form_type: 'ALL',
      search: '',
      status: 'all'
    });
  }, [handleApplyFilters, handleOnChangeSearch, organizationId, showTable]);

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

  useEffect(() => {
    setFilters((prev: FilterForms) => {
      return { ...prev, archived_at: showTable === 2 };
    });
  }, [showTable]);

  return (
    <>
      <Box paddingY={'12px'} display={'flex'} flexDirection={'column'} width={'100%'}>
        <Box display="flex" width={'100%'}>
          <Box style={{ marginRight: '16px' }} width={'100%'}>
            <TextFieldSearch onChange={handleOnChangeSearch} isAnimated={false} fullWidth size="small" />
          </Box>
          <PopoverComponent
            handleApplyFilter={handleApply}
            styles={{ width: '270px' }}
            label="Tipo de formulario"
            startIcon={<DescriptionOutlinedIcon />}
            handleCancel={handleCancel}
            filterName={['form_type']}
          >
            <FilterType handleOnChangeTextFilter={handleOnChangeTextFilter} form_type={filters.form_type || ''} />
          </PopoverComponent>
          <Button
            variant="outlined"
            className={classes.filterStyle}
            startIcon={<FilterAltOutlinedIcon />}
            onClick={handleShowMore}
            size="small"
            style={{ padding: '3px 16px', minWidth: '120px' }}
            endIcon={showMore ? <KeyboardDoubleArrowUpOutlinedIcon /> : <KeyboardDoubleArrowDownOutlinedIcon />}
          >
            Ver&nbsp;{showMore ? 'menos' : 'más'}
          </Button>
        </Box>
        {showMore && (
          <Box display={'flex'} mt={2} justifyContent={'space-between'}>
            <Box display={'flex'}>
              <PopoverComponent
                handleApplyFilter={handleApply}
                label="Fecha de creación"
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
              <PopoverComponent
                handleApplyFilter={handleApply}
                label="Estado"
                startIcon={<img src={StatusIcon} alt="area ic" />}
                handleCancel={handleCancel}
                filterName={['status']}
              >
                <FilterStatus handleOnChangeTextFilter={handleOnChangeTextFilter} status={filters.status || ''} />
              </PopoverComponent>
            </Box>
            <Box>
              <Button
                variant="contained"
                startIcon={<CleaningServicesRoundedIcon />}
                onClick={handleClearFilters}
                size="small"
                color="error"
                style={{ padding: '3px 16px' }}
              >
                Limpiar filtros
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default React.memo(FiltersComponent);
