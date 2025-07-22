package service

import (
	"example.com/art-culture-api/domain/act_c/entity"
	"example.com/art-culture-api/domain/act_c/model"
	"example.com/art-culture-api/domain/act_c/repository"
)

type ArtCCategoryService interface {
	FindAll(typeId uint, locale string) ([]entity.ArtCCategory, error)
	Find(typeId uint, id uint, locale string) (entity.ArtCCategory, error)
	CreateOrUpdate(artCCategory entity.ArtCCategory, artCTranslation entity.ArtCTranslation) (entity.ArtCCategory, error)
	DeleteByID(typeId uint, id uint) error
	OrderItems(ids []uint) error
	PageContent(typeId uint, id uint, locale string) (model.ArtCCategoryPageContent, error)
}

type artCCategoryService struct {
	artCCategoryRepository repository.ArtCCategoryRepository
}

func NewArtCCategoryService(artCCategoryRepository repository.ArtCCategoryRepository) ArtCCategoryService {
	return &artCCategoryService{
		artCCategoryRepository: artCCategoryRepository,
	}
}

func (service *artCCategoryService) FindAll(typeId uint, locale string) ([]entity.ArtCCategory, error) {
	return service.artCCategoryRepository.FindAll(typeId, locale)
}

func (service *artCCategoryService) Find(typeId uint, id uint, locale string) (entity.ArtCCategory, error) {
	return service.artCCategoryRepository.Find(typeId, id, locale)
}

func (service *artCCategoryService) CreateOrUpdate(artCType entity.ArtCCategory, artCTranslation entity.ArtCTranslation) (entity.ArtCCategory, error) {
	return service.artCCategoryRepository.CreateOrUpdate(artCType, artCTranslation)
}

func (service *artCCategoryService) DeleteByID(typeId uint, id uint) error {
	return service.artCCategoryRepository.DeleteByID(typeId, id)
}

func (service *artCCategoryService) OrderItems(ids []uint) error {
	return service.artCCategoryRepository.OrderItems(ids)
}

func (service *artCCategoryService) PageContent(typeId uint, id uint, locale string) (model.ArtCCategoryPageContent, error) {
	return service.artCCategoryRepository.PageContent(typeId, id, locale)
}
