import { formatDistance } from 'date-fns';
import { endOfToday } from 'date-fns';
import { startedWorking } from './constants';

export const useExperience = () => formatDistance(endOfToday(), startedWorking);
