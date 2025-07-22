package entity

import (
	"time"

	"gorm.io/gorm"
)

type ProgramTranslation struct {
	ID          	uint						`json:"id" gorm:"primaryKey"`
	ProgramID		uint						`json:"programId" gorm:"type:uint;not null"`
	Locale			string						`json:"locale" gorm:"type:varchar(5);not null"`
	Title       	string						`json:"title" gorm:"type:varchar(255);not null"`
	ShortDesc		string						`json:"shortDesc" gorm:"type:varchar(255)"`
	Desc 			string						`json:"desc" gorm:"type:text;not null"`
	Author 			string						`json:"author" gorm:"type:varchar(255)"`
	Thumbnail   	string						`json:"thumbnail" gorm:"type:varchar(255);not null"`
	Banner		  	string						`json:"banner" gorm:"type:varchar(255);not null"`
	OpeningHours 	[]string					`json:"openingHours" gorm:"serializer:json"`
	Locations    	[]string					`json:"locations" gorm:"serializer:json"`
	EnterFee    	float64						`json:"enterFee" gorm:"type:decimal(8,2)"`
	ExternalLink 	string 						`json:"externalLink" gorm:"type:varchar(255)"`
	InfoItems		[]IProgramInfoItem			`json:"infoItems" gorm:"serializer:json"`
	Audio 			string  					`json:"audio" gorm:"type:text"`
	Video 			string  					`json:"video" gorm:"type:text"`
	Tags 			[]string					`json:"tags" gorm:"serializer:json"`
	CreatedAt   	time.Time					`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt   	time.Time					`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt		gorm.DeletedAt				`json:"deletedAt"`
}

type IProgramInfoItem struct {
	Title		string		`json:"title"`
	Content		string		`json:"content"`
}

func (ProgramTranslation) TableName() string {
	return "program_translations"
}
