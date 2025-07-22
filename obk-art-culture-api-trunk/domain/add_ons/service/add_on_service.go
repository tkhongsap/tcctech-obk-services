package service

import (
	"example.com/art-culture-api/domain/add_ons/entity"
	"example.com/art-culture-api/domain/add_ons/model"
	"example.com/art-culture-api/domain/add_ons/repository"
	partnerEntity "example.com/art-culture-api/domain/partners/entity"
)

type AddOnService interface {
	FindAll(locale string) ([]entity.AddOn, error)
	FindByID(id uint, locale string) (entity.AddOn, error)
	SaveOrUpdate(addOn entity.AddOn, addOnTranslation entity.AddOnTranslation, locale string) (entity.AddOn, error)
	DeleteByID(id uint) error
	FindPartners(partners []partnerEntity.Partner) ([]partnerEntity.Partner, error)
	ClearAddOnPartners(addOn entity.AddOn) (entity.AddOn, error)
	PageContent(programId uint, id uint, locale string) (model.AddOnPageContent, error)
}

type addOnService struct {
	addOnRepository repository.AddOnRepository
}

func NewAddOnService(addOnRepository repository.AddOnRepository) AddOnService {
	return &addOnService{
		addOnRepository: addOnRepository,
	}
}

func (service *addOnService) FindAll(locale string) ([]entity.AddOn, error) {
	return service.addOnRepository.FindAll(locale)
}

func (service *addOnService) FindByID(id uint, locale string) (entity.AddOn, error) {
	return service.addOnRepository.FindByID(id, locale)
}

func (service *addOnService) SaveOrUpdate(addOn entity.AddOn, addOnTranslation entity.AddOnTranslation, locale string) (entity.AddOn, error) {
	return service.addOnRepository.SaveOrUpdate(addOn, addOnTranslation, locale)
}

func (service *addOnService) DeleteByID(id uint) error {
	return service.addOnRepository.DeleteByID(id)
}

func (service *addOnService) FindPartners(partners []partnerEntity.Partner) ([]partnerEntity.Partner, error) {
	return service.addOnRepository.FindPartners(partners)
}

func (service *addOnService) ClearAddOnPartners(addOn entity.AddOn) (entity.AddOn, error) {
	return service.addOnRepository.ClearAddOnPartners(addOn)
}

func (service *addOnService) PageContent(programId uint, id uint, locale string) (model.AddOnPageContent, error) {
	return service.addOnRepository.PageContent(programId, id, locale)
}
