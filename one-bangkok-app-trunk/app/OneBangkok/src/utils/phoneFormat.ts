export const formatPhoneNumber = (phoneNumber: string) => {
  let cleaned = phoneNumber.replace(/[^0-9]/g, '');

  if (cleaned.startsWith('66')) {
    cleaned = '0' + cleaned.slice(2);
  }
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};
