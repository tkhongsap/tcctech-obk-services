export const sanitizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.startsWith('0')
    ? phoneNumber.replace(/^0+/, '')
    : phoneNumber;
};
