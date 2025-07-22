package model

import (
	"time"

	artCEntity "example.com/art-culture-api/domain/act_c/entity"
	addOnEntity "example.com/art-culture-api/domain/add_ons/entity"
	partnersEntity "example.com/art-culture-api/domain/partners/entity"
	"example.com/art-culture-api/domain/programs/entity"
)

type ProgramCreateOrUpdateModel struct {
	ArtCTypeID			uint 						`json:"artCTypeId" validate:"required"`
	ArtCCategoryID		uint 						`json:"artCCategoryId"`
	IsPublished 		bool 						`json:"isPublished" validate:"required"`
	PublishedAt 		time.Time					`json:"publishedAt"`
	PeriodAt 			time.Time					`json:"periodAt"`
	PeriodEnd 			time.Time					`json:"periodEnd"`
	IsProduct			bool						`json:"isProduct"`
	ProductPrice		float64						`json:"productPrice"`
	Type	       		[]string 					`json:"type" validate:"required"`
	Title       		string 						`json:"title" validate:"required"`
	ShortDesc			string						`json:"shortDesc"`
	Desc		 		string 						`json:"desc" validate:"required"`
	Author				string						`json:"author"`
	Thumbnail   		string 						`json:"thumbnail" validate:"required"`
	Banner		  		string 						`json:"banner" validate:"required"`
	OpeningHours 		[]string					`json:"openingHours"`
	Locations    		[]string 					`json:"locations" validate:"required"`
	EnterFee    		float64						`json:"enterFee"`
	DisplayFreeLabel	bool						`json:"displayFreeLabel" validate:"required"`
	ExternalLink 		string 						`json:"externalLink"`
	InfoItems			[]entity.IProgramInfoItem	`json:"infoItems"`
	Audio 				string						`json:"audio"`
	Video 				string						`json:"video"`
	Tags 				[]string					`json:"tags"`
	Partners 			[]partnersEntity.Partner	`json:"partners"`
	AddOns	 			[]addOnEntity.AddOn			`json:"addOns"`
	RelateProgramIds	[]uint						`json:"relateProgramIds"`
	RelateProductIds 	[]uint						`json:"relateProductIds"`
}

type ProgramPageListContent struct {
	ArtCTypes			[]artCEntity.ArtCType		`json:"artCTypes"`
	Programs			[]entity.Program			`json:"programs"`
}

type ProgramPageContent struct {
	ArtCType				artCEntity.ArtCType			`json:"artCType"`
	ArtCCategory			*artCEntity.ArtCCategory	`json:"artCCategory"`
	Program					entity.Program				`json:"program"`
	RelatePrograms			[]entity.Program			`json:"relatePrograms"`
	RelateProducts			[]entity.Program			`json:"relateProducts"`
}

type ProgramPageTagContent struct {
	ArtCTypes			[]artCEntity.ArtCType		`json:"artCTypes"`
	Programs			[]entity.Program			`json:"programs"`
	AddOns 				[]addOnEntity.AddOn			`json:"addOns"`
}