package repository

import (
	"example.com/art-culture-api/domain/landing/entity"
	"example.com/art-culture-api/domain/landing/model"
)

type LandingPageRepository interface {
	Content(locale string) (model.LandingPageResponse, error)
	Find(locale string) (entity.LandingPage, error)
	SaveOrUpdate(landingPage entity.LandingPage, landingPageTranslation entity.LandingTranslation, artCTypesId []uint) (entity.LandingPage, error)
	PageContent(locale string) (model.LandingPageContent, error)
}