package utils

import "example.com/art-culture-api/domain/programs/entity"

func GetProgramTitleByLocale(program entity.Program, locale string) string {
	for _, pt := range program.ProgramTranslation {
		if pt.Locale == locale {
			return pt.Title
		}
	}
	return ""
}
