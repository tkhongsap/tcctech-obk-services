package entity

import (
	"time"

	"gorm.io/gorm"
)

type Playlist struct {
	ID						uint						`json:"id" gorm:"primaryKey"`
	IsPublished				bool						`json:"isPublished" gorm:"type:bool;default:false"`
	PublishedAt				*time.Time					`json:"publishedAt"`
	CreatedAt				time.Time					`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt				time.Time					`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt 				gorm.DeletedAt				`json:"deletedAt"`
	PlaylistTranslation		[]PlaylistTranslation		`json:"playlistTranslation" gorm:"foreignKey:PlaylistID"`
}

func (Playlist) TableName() string {
	return "playlists"
}
