import { format } from 'date-fns';

export const dateFormat = (
  date: Date,
  formating: string | undefined = 'Y-MM-dd'
) => {
  if(date.toString() === 'Invalid Date') date = new Date();
  date = new Date(date);
  return format(date.getTime && date.getTime(), formating);
};

export const stringToDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return new Date(Number(year), parseInt(month) - 1, Number(day));
};
