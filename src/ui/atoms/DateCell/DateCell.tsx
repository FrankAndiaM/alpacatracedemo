import React from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { formatToTimeZone } from 'date-fns-timezone';
import { es } from 'date-fns/locale';
import { Box } from '@mui/system';

type DateCellProps = {
  date: any;
};

const DateCell: React.FC<DateCellProps> = (props: DateCellProps) => {
  const { date }: DateCellProps = props;

  try {
    const currentDate = new Date(date);
    return (
      <Box>
        <Box style={{ textTransform: 'capitalize' }}>
          {formatInTimeZone(currentDate, 'America/Lima', 'dd MMM yyyy', {
            locale: es
          })}
        </Box>
        <Box fontSize="12px" color="#9FA2B4">
          {formatToTimeZone(currentDate, 'hh:mm aa', {
            timeZone: 'America/Lima'
          })}
        </Box>
      </Box>
    );
  } catch (error) {
    return <></>;
  }
};

export default React.memo(DateCell);
