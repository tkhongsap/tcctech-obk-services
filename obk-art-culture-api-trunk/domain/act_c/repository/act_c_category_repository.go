package repository

import (
	"example.com/art-culture-api/domain/act_c/entity"
	"example.com/art-culture-api/domain/act_c/model"
)

type ArtCCategoryRepository interface {
	FindAll(typeId uint, locale string) ([]entity.ArtCCategory, error)
	Find(typeId uint, id uint, locale string) (entity.ArtCCategory, error)
	CreateOrUpdate(artCCategory entity.ArtCCategory, artCTranslation entity.ArtCTranslation) (entity.ArtCCategory, error)
	DeleteByID(typeId uint, id uint) error
	OrderItems(ids []uint) error
	PageContent(typeId uint, id uint, locale string) (model.ArtCCategoryPageContent, error)
}