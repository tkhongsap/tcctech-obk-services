package repository

import "example.com/art-culture-api/domain/partners/entity"

type PartnerRepository interface {
	FindAll(locale string) ([]entity.Partner, error)
	FindByID(id uint, locale string) (entity.Partner, error)
	SaveOrUpdate(partner entity.Partner, partnerTranslation entity.PartnerTranslation, locale string) (entity.Partner, error)
	DeleteByID(id uint) error
}
