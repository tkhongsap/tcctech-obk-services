package entity

import (
	"time"

	programEntity "example.com/art-culture-api/domain/programs/entity"
	"gorm.io/gorm"
)

type ArtCType struct {
	ID					uint						`json:"id" gorm:"primaryKey"`
	OrderType	    	uint						`json:"orderType" gorm:"type:uint"`
	ModifyStrict		bool						`json:"modifyStrict" gorm:"type:boolean;default:false"`
	DisplayList			bool						`json:"displayList" gorm:"type:boolean;default:false"`
	DisplayFreeLabel	bool						`json:"displayFreeLabel" gorm:"type:boolean;default:false"`
	Playlist			[]uint						`json:"playlist" gorm:"serializer:json"`
	RelateProgramIds	[]uint						`json:"relateProgramIds" gorm:"serializer:json;"`
	CreatedAt			time.Time					`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt			time.Time					`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt			gorm.DeletedAt				`json:"deletedAt"`
	ArtCCategory		[]ArtCCategory				`json:"artCCategory" gorm:"foreignKey:ArtCTypeID"`
	ArtCTranslation		[]ArtCTranslation			`json:"artCTranslation" gorm:"foreignKey:ArtCTypeID"`
	Program				[]programEntity.Program		`json:"program" gorm:"foreignKey:ArtCTypeID"`
}

func (ArtCType) TableName() string {
	return "art_c_types"
}