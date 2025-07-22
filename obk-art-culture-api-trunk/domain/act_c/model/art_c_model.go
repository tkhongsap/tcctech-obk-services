package model

import (
	"example.com/art-culture-api/domain/act_c/entity"
	playlistEntity "example.com/art-culture-api/domain/playlist/entity"
	programEntity "example.com/art-culture-api/domain/programs/entity"
)

type ArtCCreateOrUpdateModel struct {
	Title 					string 			`json:"title" validate:"required"`
	ShortDesc 				string 			`json:"shortDesc"`
	Desc 					string 			`json:"desc" validate:"required"`
	Thumbnail 				string 			`json:"thumbnail" validate:"required"`
	Banner 					string 			`json:"banner"`
	CategorySectionTitle 	string 			`json:"categorySectionTitle"`
	PlaylistSectionTitle 	string 			`json:"playlistSectionTitle"`
	ProgramSectionTitle		string 			`json:"programSectionTitle"`
	OpeningHours 			[]string 		`json:"openingHours"`
	Locations 				[]string 		`json:"locations"`
	EnterFee 				float64 		`json:"enterFee"`
	DisplayFreeLabel		bool			`json:"displayFreeLabel" validate:"required"`
	ExternalLink 			string 			`json:"externalLink"`
	DisplayList 			bool 			`json:"displayList"`
	Playlist 				[]uint 			`json:"playlist"`
	Tags 					[]string 		`json:"tags"`
	RelateProgramIds		[]uint			`json:"relateProgramIds"`
}

type ArtCTypePageContent struct {
	ArtCTypes 		[]entity.ArtCType 			`json:"artCTypes"`
	ArtCType 		entity.ArtCType 			`json:"artCType"`
	Programs  		[]programEntity.Program 	`json:"programs"`
	Products  		[]programEntity.Program 	`json:"products"`
	Playlist 		[]playlistEntity.Playlist	`json:"playlist"`
}

type ArtCCategoryPageContent struct {
	ArtCType 			entity.ArtCType 			`json:"artCType"`
	ArtCCategory 		entity.ArtCCategory			`json:"ArtCCategory"`
	Programs  			[]programEntity.Program 	`json:"programs"`
	Products  			[]programEntity.Program 	`json:"products"`
}