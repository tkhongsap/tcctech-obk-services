package validator

import (
	"example.com/art-culture-api/domain/booking/errs"
	"github.com/google/uuid"
)

func IsValidLocale(locale string) error {
	if locale == "" {
		return errs.BuildCommonErrorIsRequiredMsg("locale")
	}

	localeConfigMap := map[string]bool{
		"en": true,
		"th": true,
		"zh": true,
	}

	if !localeConfigMap[locale] {
		return errs.BuildCommonErrorInvalidMsg("locale")
	}

	return nil
}

func IsValidUUID(u string) error {
	_, err := uuid.Parse(u)
	if err != nil {
		return errs.BuildCommonErrorInvalidMsg("uuid")
	}

	return nil
}
