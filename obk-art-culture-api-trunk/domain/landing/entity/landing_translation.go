package entity

import (
	"time"

	"gorm.io/gorm"
)

type LandingTranslation struct {
	ID       		uint			`json:"id" gorm:"primaryKey"`
	LandingPageID   uint			`json:"landingPageId" gorm:"type:uint;not null"`
	Locale			string			`json:"locale" gorm:"type:varchar(5);not null"`
	Content			string			`json:"content" gorm:"serializer:json;not null"`
	CreatedAt 		time.Time		`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt 		time.Time		`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt		gorm.DeletedAt	`json:"deletedAt"`
}

func (LandingTranslation) TableName() string {
	return "landing_page_translations"
}