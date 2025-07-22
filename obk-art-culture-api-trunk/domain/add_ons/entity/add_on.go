package entity

import (
	"time"

	partnersEntity "example.com/art-culture-api/domain/partners/entity"
	"gorm.io/gorm"
)

type AddOn struct {
	ID 					uint						`json:"id" gorm:"primaryKey"`
	Type 				string  					`json:"type" gorm:"type:varchar(255);not null"`
	IsPublished			bool						`json:"isPublished" gorm:"type:bool;default:false"`
	PublishedAt   		*time.Time					`json:"publishedAt"`
	CreatedAt			time.Time					`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt			time.Time					`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt			gorm.DeletedAt				`json:"deletedAt"`
	Partners			[]partnersEntity.Partner	`json:"partners" gorm:"many2many:add_on_partner;"`
	AddOnTranslation 	[]AddOnTranslation			`json:"addOnTranslation" gorm:"foreignKey:AddOnID"`
}

func (AddOn) TableName() string {
	return "add_ons"
}
