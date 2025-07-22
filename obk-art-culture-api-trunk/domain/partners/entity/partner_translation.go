package entity

import (
	"time"

	"gorm.io/gorm"
)

type PartnerTranslation struct {
	ID			uint				`json:"id" gorm:"primaryKey"`
	PartnerID 	uint				`json:"partnerId" gorm:"type:uint;not null"`
	Locale		string				`json:"locale" gorm:"type:varchar(5);not null"`
	Title		string				`json:"title" gorm:"type:varchar(255);not null"`
	Thumbnail	string				`json:"thumbnail" gorm:"type:varchar(255);not null"`
	Link		string				`json:"link" gorm:"type:varchar(255);"`
	CreatedAt	time.Time			`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt	time.Time			`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt	gorm.DeletedAt		`json:"deletedAt"`
}

func (PartnerTranslation) TableName() string {
	return "partner_translations"
}
