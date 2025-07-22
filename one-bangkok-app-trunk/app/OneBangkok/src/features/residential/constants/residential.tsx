import getTheme from '~/utils/themes/themeUtils';

export const classNameStatus: {[key: string]: string} = {
  submitted: getTheme('border-[1px] border-dark-orange bg-pale-yellow'),
  delivered: getTheme('border-[1px] border-dark-orange bg-pale-yellow'),
  'pick up': getTheme('border-[1px] border-dark-orange bg-pale-yellow'),
  'picked up': getTheme('border-[1px] border-dark-orange bg-pale-yellow'),
  in_progress: getTheme('border-[1px] border-vibrant-blue bg-light-blue'),
  done: getTheme('border-[1px] border-dark-green bg-light-green'),
  approved: getTheme('border-[1px] border-dark-green bg-light-green'),
  received: getTheme('border-[1px] border-dark-green bg-light-green'),
  rejected: getTheme('border-[1px] border-danger bg-light-pink'),
  returned: getTheme('border-[1px] border-danger bg-light-pink'),
  return: getTheme('border-[1px] border-danger bg-light-pink'),
};

export const statusText = (text: string) =>
  (text.charAt(0).toUpperCase() + text.slice(1)).replace('_', ' ');
