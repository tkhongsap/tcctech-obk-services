package service

import (
	"example.com/art-culture-api/domain/partners/entity"
	"example.com/art-culture-api/domain/partners/repository"
)

type PartnerService interface {
	FindAll(locale string) ([]entity.Partner, error)
	FindByID(id uint, locale string) (entity.Partner, error)
	SaveOrUpdate(partner entity.Partner, partnerTranslation entity.PartnerTranslation, locale string) (entity.Partner, error)
	DeleteByID(id uint) error
}

type partnerService struct {
	partnerRepository repository.PartnerRepository
}

func NewPartnerService(partnerRepository repository.PartnerRepository) PartnerService {
	return &partnerService{
		partnerRepository: partnerRepository,
	}
}

func (service *partnerService) FindAll(locale string) ([]entity.Partner, error) {
	return service.partnerRepository.FindAll(locale)
}

func (service *partnerService) FindByID(id uint, locale string) (entity.Partner, error) {
	return service.partnerRepository.FindByID(id, locale)
}

func (service *partnerService) SaveOrUpdate(partner entity.Partner, partnerTranslation entity.PartnerTranslation, locale string) (entity.Partner, error) {
	return service.partnerRepository.SaveOrUpdate(partner, partnerTranslation, locale)
}

func (service *partnerService) DeleteByID(id uint) error {
	return service.partnerRepository.DeleteByID(id)
}
