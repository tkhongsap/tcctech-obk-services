package entity

import (
	"time"
)

type Bookmark struct {
	ID        		uint				`json:"id" gorm:"primaryKey"`
	AccountId	    string				`json:"accountId" gorm:"type:varchar(255);not null"`
	ContentType	    string				`json:"contentType" gorm:"type:varchar(255);not null"`
	ContentId	    string				`json:"contentId" gorm:"type:varchar(255);not null"`
	CreatedAt		time.Time			`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt		time.Time			`json:"updatedAt" gorm:"autoUpdateTime;not null"`
}

func (Bookmark) TableName() string {
	return "bookmarks"
}
