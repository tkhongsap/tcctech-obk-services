package repository

import (
	"example.com/art-culture-api/domain/act_c/entity"
	"example.com/art-culture-api/domain/act_c/model"
)

type ArtCTypeRepository interface {
	FindAll(locale string) ([]entity.ArtCType, error)
	Find(id uint, locale string) (entity.ArtCType, error)
	CreateOrUpdate(artCType entity.ArtCType, artCTranslation entity.ArtCTranslation) (entity.ArtCType, error)
	DeleteByID(id uint) error
	OrderItems(ids []uint) error
	PageContent(locale string, id uint) (model.ArtCTypePageContent, error)
}
