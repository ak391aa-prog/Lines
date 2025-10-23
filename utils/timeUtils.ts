import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import parseISO from 'date-fns/parseISO';

export const formatTimeAgo = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNowStrict(date, { addSuffix: true });
  } catch (error) {
    console.error("Invalid date string for formatTimeAgo:", dateString);
    return dateString; // fallback to original string
  }
};