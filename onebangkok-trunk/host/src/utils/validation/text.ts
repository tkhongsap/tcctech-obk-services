const SPECIAL_CHARACTER = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

export const TextValidation = {
  isEmpty: (text: string | undefined | null) => {
    return !text || text.trim().length === 0;
  },
  hasSpecialCharacter: (text: string | undefined | null) => {
    return SPECIAL_CHARACTER.test(text || '');
  },
  hasEmoji: (text: string | undefined | null) => {
    var emojiRegex = /\p{Extended_Pictographic}/u;
    return emojiRegex.test(text || '');
  },
  validateSpecialCharactersWithDigit: (text: string | undefined | null) => {
    // Allow specified special characters and require exactly one digit
    var regex =
      /^(?!.*\+\+)(?!^\+|.*\+$)[^@\$#&=*();:]*([^\d][\d][^\d])?[^@\$#&=*();:]*$/;

    return regex.test(text || '');
  },
  isEngAndThaiLanguage: (text: string | undefined | null) => {
    const regex = /^[\u0E00-\u0E7Fa-zA-Z0-9 .\-/\\\[\]{}~€£¥•,'"!?\s]*$/;
    return !regex.test(text || '');
  },
  isImageUrl: (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  },
};

export function TextValidations(text: string | undefined | null) {
  if (!text) return false;

  if (/^\d+$/.test(text)) {
    return true;
  } else {
    const validateEmoji = TextValidation.hasEmoji(text);
    if (validateEmoji) return true;

    const validateSpecialCharactersWithDigit =
      TextValidation.validateSpecialCharactersWithDigit(text);

    if (validateSpecialCharactersWithDigit) {
      let digitCount = 0;
      for (var i = 0; i < text.length; i++) {
        if (/\d/.test(text[i])) {
          digitCount++;
        }
      }
      return digitCount > 1 ? true : false;
    }

    return !validateSpecialCharactersWithDigit;
  }
}
