package entity

import (
	"time"

	"gorm.io/gorm"
)

type PlaylistTranslation struct {
	ID			uint				`json:"id" gorm:"primaryKey"`
	PlaylistID 	uint				`json:"playlistId" gorm:"type:uint;not null"`
	Locale		string				`json:"locale" gorm:"type:varchar(5);not null"`
	Title		string				`json:"title" gorm:"type:varchar(255);not null"`
	Desc		string				`json:"desc" gorm:"type:varchar(255);not null"`
	Author 		string				`json:"author" gorm:"type:varchar(255)"`
	Thumbnail	string				`json:"thumbnail" gorm:"type:varchar(255);not null"`
	Durations	uint				`json:"durations" gorm:"type:uint;default:0"`
	Link		string				`json:"link" gorm:"type:varchar(255);not null"`
	CreatedAt	time.Time			`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt	time.Time			`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt	gorm.DeletedAt		`json:"deletedAt"`
}

func (PlaylistTranslation) TableName() string {
	return "playlist_translations"
}
