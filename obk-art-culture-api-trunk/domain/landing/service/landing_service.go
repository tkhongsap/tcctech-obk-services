package service

import (
	"example.com/art-culture-api/domain/landing/entity"
	"example.com/art-culture-api/domain/landing/model"
	"example.com/art-culture-api/domain/landing/repository"
)

type LandingService interface {
	Content(locale string) (model.LandingPageResponse, error)
	Find(locale string) (entity.LandingPage, error)
	CreateOrUpdate(landingPage entity.LandingPage, landingPageTranslation entity.LandingTranslation, artCTypesId []uint) (entity.LandingPage, error)
	PageContent(locale string) (model.LandingPageContent, error)
}

type landingService struct {
	landingRepository repository.LandingPageRepository
}

func NewLandingService(landingRepository repository.LandingPageRepository) LandingService {
	return &landingService{
		landingRepository: landingRepository,
	}
}

func (service *landingService) Content(locale string) (model.LandingPageResponse, error) {
	return service.landingRepository.Content(locale)
}

func (service *landingService) Find(locale string) (entity.LandingPage, error) {
	return service.landingRepository.Find(locale)
}

func (service *landingService) CreateOrUpdate(landingPage entity.LandingPage, landingPageTranslation entity.LandingTranslation, artCTypesId []uint) (entity.LandingPage, error) {
	return service.landingRepository.SaveOrUpdate(landingPage, landingPageTranslation, artCTypesId)
}

func (service *landingService) PageContent(locale string) (model.LandingPageContent, error) {
	return service.landingRepository.PageContent(locale)
}
