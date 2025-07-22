package entity

import (
	"time"

	addOnEntity "example.com/art-culture-api/domain/add_ons/entity"
	partnersEntity "example.com/art-culture-api/domain/partners/entity"
	"gorm.io/gorm"
)

type Program struct {
	ID          		uint  						`json:"id" gorm:"primaryKey"`
	ArtCTypeID			uint						`json:"artCTypeId" gorm:"type:uint"`
	ArtCCategoryID		*uint						`json:"artCCategoryId" gorm:"type:uint"`
	Type				[]string					`json:"type" gorm:"serializer:json"`
	IsPublished			bool						`json:"isPublished" gorm:"type:bool;default:false"`
	IsProduct			bool						`json:"isProduct" gorm:"type:bool;default:false"`
	ProductPrice		float64						`json:"productPrice" gorm:"type:decimal(8,2);default:0.00"`
	DisplayFreeLabel	bool						`json:"displayFreeLabel" gorm:"type:boolean;default:false"`
	RelateProgramIds	[]uint						`json:"relateProgramIds" gorm:"serializer:json;"`
	RelateProductIds	[]uint						`json:"relateProductIds" gorm:"serializer:json;"`
	PublishedAt   		*time.Time					`json:"publishedAt"`
	PeriodAt			*time.Time					`json:"periodAt"`
	PeriodEnd			*time.Time					`json:"periodEnd"`
	CreatedAt   		time.Time					`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt   		time.Time					`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt			gorm.DeletedAt				`json:"deletedAt"`
	ProgramTranslation 	[]ProgramTranslation 		`json:"programTranslation" gorm:"foreignKey:ProgramID"`
	AddOns 				[]addOnEntity.AddOn			`json:"addOns" gorm:"many2many:programs_add_ons;"`
	Partners 			[]partnersEntity.Partner	`json:"partners" gorm:"many2many:programs_partners;"`
}

func (Program) TableName() string {
	return "programs"
}
