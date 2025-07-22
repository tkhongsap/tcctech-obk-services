package entity

import (
	"time"

	"gorm.io/gorm"
)

type LandingPage struct {
	ID       			uint					`json:"id" gorm:"primaryKey"`
	ProgramIds	    	[]uint					`json:"programIds" gorm:"serializer:json;not null"`
	HighlightAutoPlay	uint					`json:"highlightAutoPlay" gorm:"default:5;not null"`
	SectionOrder    	[]string				`json:"sectionOrder" gorm:"serializer:json;not null"`
	CreatedAt 			time.Time				`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt 			time.Time				`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt			gorm.DeletedAt			`json:"deletedAt"`
	LandingTranslation	[]LandingTranslation	`json:"landingTranslation" gorm:"foreignKey:LandingPageID"`
}

func (LandingPage) TableName() string {
	return "landing_pages"
}