package service

import (
	"example.com/art-culture-api/domain/act_c/entity"
	"example.com/art-culture-api/domain/act_c/model"
	"example.com/art-culture-api/domain/act_c/repository"
)

type ArtCTypeService interface {
	FindAll(locale string) ([]entity.ArtCType, error)
	Find(id uint, locale string) (entity.ArtCType, error)
	CreateOrUpdate(artCType entity.ArtCType, artCTranslation entity.ArtCTranslation) (entity.ArtCType, error)
	DeleteByID(id uint) error
	OrderItems(ids []uint) error
	PageContent(locale string, id uint) (model.ArtCTypePageContent, error)
}

type artCTypeService struct {
	artCTypeRepository repository.ArtCTypeRepository
}

func NewArtCTypeService(artCTypeRepository repository.ArtCTypeRepository) ArtCTypeService {
	return &artCTypeService{
		artCTypeRepository: artCTypeRepository,
	}
}

func (service *artCTypeService) FindAll(locale string) ([]entity.ArtCType, error) {
	return service.artCTypeRepository.FindAll(locale)
}

func (service *artCTypeService) Find(id uint, locale string) (entity.ArtCType, error) {
	return service.artCTypeRepository.Find(id, locale)
}

func (service *artCTypeService) CreateOrUpdate(artCType entity.ArtCType, artCTranslation entity.ArtCTranslation) (entity.ArtCType, error) {
	return service.artCTypeRepository.CreateOrUpdate(artCType, artCTranslation)
}

func (service *artCTypeService) DeleteByID(id uint) error {
	return service.artCTypeRepository.DeleteByID(id)
}

func (service *artCTypeService) OrderItems(ids []uint) error {
	return service.artCTypeRepository.OrderItems(ids)
}

func (service *artCTypeService) PageContent(locale string, id uint) (model.ArtCTypePageContent, error) {
	return service.artCTypeRepository.PageContent(locale, id)
}
