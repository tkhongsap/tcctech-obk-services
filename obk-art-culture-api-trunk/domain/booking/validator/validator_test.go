package validator_test

import (
	"testing"

	"example.com/art-culture-api/domain/booking/errs"
	"example.com/art-culture-api/domain/booking/validator"
	"github.com/stretchr/testify/assert"
)

func TestIsValidLocale(t *testing.T) {
	type testCase struct {
		Name   string
		Locale string
		Err    error
	}

	testCases := []testCase{
		{"Valid locale using 'en' as value", "en", nil},
		{"Valid locale using 'th' as value", "th", nil},
		{"Valid locale using 'zh' as value", "zh", nil},
		{"Required locale value", "", errs.BuildCommonErrorIsRequiredMsg("locale")},
		{"Invalid locale value", "invalid", errs.BuildCommonErrorInvalidMsg("locale")},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			err := validator.IsValidLocale(tc.Locale)
			if err != nil && tc.Err != nil && err.Error() != tc.Err.Error() {
				t.Errorf("expected %v, got %v", tc.Err.Error(), err.Error())
			}
		})
	}
}

func BenchmarkIsValidLocale(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_ = validator.IsValidLocale("en")
	}
}

func TestIsValidUUID(t *testing.T) {
	type testCase struct {
		Name          string
		Input         string
		ExpectedError error
	}

	validate := func(t *testing.T, tc *testCase) {
		t.Run(tc.Name, func(t *testing.T) {
			actualError := validator.IsValidUUID(tc.Input)

			assert.Equal(t, tc.ExpectedError, actualError)
		})
	}

	testCases := []testCase{
		{"Valid UUID value", "d6512829-0e90-48bd-b299-6d2151e940b8", nil},
		{"Invalid UUID value", "string", errs.BuildCommonErrorInvalidMsg("uuid")},
	}

	for _, tc := range testCases {
		validate(t, &tc)
	}
}
