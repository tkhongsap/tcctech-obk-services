package entity

import (
	"time"

	programEntity "example.com/art-culture-api/domain/programs/entity"
	"gorm.io/gorm"
)

type ArtCCategory struct {
	ID						uint						`json:"id" gorm:"primaryKey"`
	ArtCTypeID				uint						`json:"artCTypeId" gorm:"type:uint"`
	OrderCategory	    	uint						`json:"orderCategory" gorm:"type:uint"`
	DisplayList				bool						`json:"displayList" gorm:"type:boolean;default:false"`
	DisplayFreeLabel		bool						`json:"displayFreeLabel" gorm:"type:boolean;default:false"`
	RelateProgramIds		[]uint						`json:"relateProgramIds" gorm:"serializer:json;"`
	CreatedAt				time.Time					`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt				time.Time					`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt 				gorm.DeletedAt				`json:"deletedAt"`
	ArtCTranslation			[]ArtCTranslation			`json:"artCTranslation" gorm:"foreignKey:ArtCCategoryID"`
	Program					[]programEntity.Program		`json:"program" gorm:"foreignKey:ArtCCategoryID"`
}

func (ArtCCategory) TableName() string {
	return "art_c_categories"
}