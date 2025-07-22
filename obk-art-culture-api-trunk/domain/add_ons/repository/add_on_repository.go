package repository

import (
	"example.com/art-culture-api/domain/add_ons/entity"
	"example.com/art-culture-api/domain/add_ons/model"
	partnerEntity "example.com/art-culture-api/domain/partners/entity"
)

type AddOnRepository interface {
	FindAll(locale string) ([]entity.AddOn, error)
	FindByID(id uint, locale string) (entity.AddOn, error)
	SaveOrUpdate(addOn entity.AddOn, addOnTranslation entity.AddOnTranslation, locale string) (entity.AddOn, error)
	DeleteByID(id uint) error
	FindPartners(partners []partnerEntity.Partner) ([]partnerEntity.Partner, error)
	ClearAddOnPartners(addOn entity.AddOn) (entity.AddOn, error)
	PageContent(programId uint, id uint, locale string) (model.AddOnPageContent, error)
}