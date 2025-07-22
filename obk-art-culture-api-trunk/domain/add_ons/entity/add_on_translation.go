package entity

import (
	"time"

	"gorm.io/gorm"
)

type AddOnTranslation struct {
	ID 			uint			`json:"id" gorm:"primaryKey"`
	AddOnID 	uint    		`json:"addOnId" gorm:"type:uint;not null"`
	Locale		string			`json:"locale" gorm:"type:varchar(5);not null"`
	Title 		string  		`json:"title" gorm:"type:varchar(255);not null"`
	Desc 		string  		`json:"desc" gorm:"type:text;not null"`
	Thumbnail	string			`json:"thumbnail" gorm:"type:varchar(255);not null"`
	Banner		string			`json:"banner" gorm:"type:varchar(255);not null"`
	Audio 		string  		`json:"audio" gorm:"type:text"`
	Video 		string  		`json:"video" gorm:"type:text"`
	Tags 		[]string 		`json:"tags" gorm:"serializer:json"`
	CreatedAt	time.Time		`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt	time.Time		`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt	gorm.DeletedAt	`json:"deletedAt"`
}

func (AddOnTranslation) TableName() string {
	return "add_on_translations"
}
