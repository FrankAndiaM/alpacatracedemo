import moment from 'moment';

import { TIME_ZONE } from '~config/environment';

const currentDate = (timeZone: string = TIME_ZONE) => {
  const date = moment(moment(), timeZone).format('YYYY-MM-DD');
  return date;
};

export { currentDate };
