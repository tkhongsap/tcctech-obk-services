package model

import (
	"time"

	artCEntity "example.com/art-culture-api/domain/act_c/entity"
	programEntity "example.com/art-culture-api/domain/programs/entity"
)

type LandingContentTranslation struct {
	Locale string `json:"locale"`
	Content LandingContentModel `json:"content"`
}

type LandingPageResponse struct {
	HighlightPrograms 	[]programEntity.Program 	`json:"highlightPrograms"`
	HighlightAutoPlay 	uint					 	`json:"highlightAutoPlay"`
	SectionOrder 		[]string 					`json:"sectionOrder"`
	ArtCTypes			[]artCEntity.ArtCType		`json:"artCTypes"`
	Translation 		[]LandingContentTranslation	`json:"translation"`
	CreatedAt 			time.Time 					`json:"createdAt"`
	UpdatedAt 			time.Time 					`json:"updatedAt"`
}