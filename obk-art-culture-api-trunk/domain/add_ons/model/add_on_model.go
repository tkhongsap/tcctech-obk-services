package model

import (
	"time"

	"example.com/art-culture-api/domain/add_ons/entity"
	partnersEntity "example.com/art-culture-api/domain/partners/entity"
	programEntity "example.com/art-culture-api/domain/programs/entity"
)

type AddOnCreateOrUpdateModel struct {
	Type 			string 						`json:"type" validate:"required"`
	IsPublished 	bool 						`json:"isPublished" validate:"required"`
	PublishedAt 	time.Time					`json:"publishedAt"`
	Title 			string 						`json:"title" validate:"required"`
	Desc 			string 						`json:"desc" validate:"required"`
	Thumbnail		string						`json:"thumbnail" validate:"required"`
	Banner			string						`json:"banner" validate:"required"`
	Audio	 		string 						`json:"audio"`
	Video	 		string 						`json:"video"`
	Tags 			[]string 					`json:"tags"`
	Partners		[]partnersEntity.Partner	`json:"partners"`
}

type AddOnPageContent struct {
	AddOn 			entity.AddOn	 			`json:"addOn"`
	RelateAddOns 	[]entity.AddOn				`json:"relateAddOns"`
	RelatePrograms 	[]programEntity.Program		`json:"relatePrograms"`
}