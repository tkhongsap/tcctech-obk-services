package entity

import (
	"time"

	"gorm.io/gorm"
)

type Faq struct {
	ID        		uint				`json:"id" gorm:"primaryKey"`
	OrderNo	    	uint				`json:"orderNo" gorm:"type:uint"`
	IsPublished		bool				`json:"isPublished" gorm:"type:bool;default:false"`
	PublishedAt		*time.Time			`json:"publishedAt"`
	CreatedAt		time.Time			`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt		time.Time			`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt		gorm.DeletedAt		`json:"deletedAt"`
	FaqTranslation 	[]FaqTranslation	`json:"faqTranslation" gorm:"foreignKey:FaqID"`
}

func (Faq) TableName() string {
	return "faqs"
}
