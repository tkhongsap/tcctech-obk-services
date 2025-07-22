package entity

import (
	"time"

	"gorm.io/gorm"
)

type Partner struct {
	ID						uint						`json:"id" gorm:"primaryKey"`
	CreatedAt				time.Time					`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt				time.Time					`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt 				gorm.DeletedAt				`json:"deletedAt"`
	PartnerTranslation		[]PartnerTranslation		`json:"partnerTranslation" gorm:"foreignKey:PartnerID"`
}

func (Partner) TableName() string {
	return "partners"
}
