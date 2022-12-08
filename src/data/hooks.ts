import { formatDistance } from 'date-fns';
import { endOfToday } from 'date-fns';

const startedWorking = new Date('01-01-2016');

export const useExperience = () => formatDistance(endOfToday(), startedWorking);
