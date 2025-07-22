package utils_test

import (
	"testing"

	"example.com/art-culture-api/domain/booking/utils"
	"example.com/art-culture-api/domain/programs/entity"
	"github.com/stretchr/testify/assert"
)

func TestGetProgramTitleByLocale(t *testing.T) {
	program := entity.Program{
		ProgramTranslation: []entity.ProgramTranslation{
			{
				Locale: "en",
				Title:  "[EN] Title",
			},
			{
				Locale: "th",
				Title:  "[TH] Title",
			},
		},
	}

	tests := []struct {
		Name     string
		Program  entity.Program
		Locale   string
		Expected string
	}{
		{"en", program, "en", "[EN] Title"},
		{"th", program, "th", "[TH] Title"},
		{"not_exist", program, "cn", ""},
	}

	for _, test := range tests {
		t.Run(test.Name, func(t *testing.T) {
			actual := utils.GetProgramTitleByLocale(test.Program, test.Locale)
			if actual != test.Expected {
				assert.Equal(t, test.Expected, actual)
			}
		})
	}
}
