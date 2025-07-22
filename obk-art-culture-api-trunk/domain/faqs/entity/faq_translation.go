package entity

import (
	"time"

	"gorm.io/gorm"
)

type FaqTranslation struct {
	ID        	uint				`json:"id" gorm:"primaryKey"`
	FaqID		uint				`json:"faqId" gorm:"type:uint;not null"`
	Locale		string				`json:"locale" gorm:"type:varchar(5);not null"`
	Question  	string				`json:"question" gorm:"type:varchar(255);not null"`
	Answer    	string				`json:"answer" gorm:"type:text;not null"`
	CreatedAt	time.Time			`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt	time.Time			`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt	gorm.DeletedAt		`json:"deletedAt"`
	Faq			Faq					`json:"faq" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

func (FaqTranslation) TableName() string {
	return "faq_translations"
}
