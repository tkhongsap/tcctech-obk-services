package model

import (
	artCEntity "example.com/art-culture-api/domain/act_c/entity"
	programEntity "example.com/art-culture-api/domain/programs/entity"
)

type LandingCreateOrUpdateModel struct {
	ArtCTypesId 			[]uint			`json:"artCTypesId" validate:"required"`
	HighlightAutoPlay		uint			`json:"highlightAutoPlay" validate:"required"`
	ProgramsId 				[]uint			`json:"programsId" validate:"required"`
	SectionOrder 			[]string		`json:"sectionOrder" validate:"required"`
	Content					string			`json:"content" validate:"required"`
}

type LandingPageContent struct {
	HighlightPrograms 	[]programEntity.Program		`json:"highlightPrograms"`
	HighlightAutoPlay	uint						`json:"highlightAutoPlay"`
	SectionOrder 		[]string					`json:"sectionOrder"`
	ArtCTypes 			[]artCEntity.ArtCType		`json:"artCTypes"`
	Translation 		[]LandingContentTranslation	`json:"translation"`
	Programs 			[]programEntity.Program		`json:"programs"`
}