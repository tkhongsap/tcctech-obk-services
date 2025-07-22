package seeder

import (
	"encoding/json"

	landingEntity "example.com/art-culture-api/domain/landing/entity"
	"example.com/art-culture-api/domain/landing/model"
	"gorm.io/gorm"
)

func LandingSeeder(db *gorm.DB) {
	var searchContent landingEntity.LandingPage
	db.First(&searchContent)

	if(searchContent.ID == 0) {
		content := model.LandingContentModel{
			ArtCTitle: "Art Culture",
			ArtCDesc: "5 Art spaces and 5 experiences curated by One Bangkok Art and Culture team",
			ArtMapTitle: "Map",
			ArtMapDesc: "Explore more art spaces and activities around One Bangkok",
			ProgramTitle: "Programs",
			ProgramDesc: "All of the events and activities happen around One Bangkok",
		}
		encodedContent, _ := json.Marshal(content)

		landing := landingEntity.LandingPage{
			ProgramIds: []uint{},
			SectionOrder: []string{"art+c", "map", "programs"},
			LandingTranslation: []landingEntity.LandingTranslation{
				{
					Locale: "en",
					Content: string(encodedContent),
				},
				{
					Locale: "th",
					Content: string(encodedContent),
				},
				{
					Locale: "zh",
					Content: string(encodedContent),
				},
			},
		}

		db.Create(&landing)
	}
}