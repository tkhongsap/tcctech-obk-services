package entity

import (
	"time"

	"gorm.io/gorm"
)

type ArtCTranslation struct {
	ID						uint			`json:"id" gorm:"primaryKey"`
	ArtCTypeID				*uint			`json:"artCTypeId" gorm:"type:uint"`
	ArtCCategoryID			*uint			`json:"artCCategoryId" gorm:"type:uint"`
	Locale					string			`json:"locale" gorm:"type:varchar(5);not null"`
	Title  					string			`json:"title" gorm:"type:varchar(255);not null"`
	ShortDesc  				string			`json:"shortDesc" gorm:"type:varchar(255)"`
	Desc					string			`json:"desc" gorm:"type=text;not null"`
	Thumbnail				string			`json:"thumbnail" gorm:"type:varchar(255);not null"`
	Banner					string			`json:"banner" gorm:"type:varchar(255)"`
	CategorySectionTitle	string			`json:"categorySectionTitle" gorm:"type:varchar(255)"`
	PlaylistSectionTitle	string			`json:"playlistSectionTitle" gorm:"type:varchar(255)"`
	ProgramSectionTitle		string			`json:"programSectionTitle" gorm:"type:varchar(255)"`
	OpeningHours			[]string		`json:"openingHours" gorm:"serializer:json"`
	Locations				[]string		`json:"locations" gorm:"serializer:json"`
	EnterFee				float64			`json:"enterFee" gorm:"type:decimal(8,2)"`
	ExternalLink			string			`json:"externalLink" gorm:"type:varchar(255)"`
	Tags 					[]string		`json:"tags" gorm:"serializer:json"`
	CreatedAt				time.Time		`json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt				time.Time		`json:"updatedAt" gorm:"autoUpdateTime;not null"`
	DeletedAt				gorm.DeletedAt	`json:"deletedAt"`
}

func (ArtCTranslation) TableName() string {
	return "art_c_translations"
}