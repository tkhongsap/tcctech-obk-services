package repository

import (
	"context"

	addOnEntity "example.com/art-culture-api/domain/add_ons/entity"
	partnerEntity "example.com/art-culture-api/domain/partners/entity"
	"example.com/art-culture-api/domain/programs/entity"
	"example.com/art-culture-api/domain/programs/model"
)

type ProgramRepository interface {
	FindAll(locale string) ([]entity.Program, error)
	FindOneByID(ctx context.Context, id uint, locale string) (entity.Program, error)
	FindByID(id uint, locale string) (entity.Program, error)
	SaveOrUpdate(program entity.Program, programTranslation entity.ProgramTranslation, locale string) (entity.Program, error)
	DeleteByID(id uint) error
	FindPartners(partners []partnerEntity.Partner) ([]partnerEntity.Partner, error)
	ClearProgramPartners(program entity.Program) (entity.Program, error)
	FindAddOns(addOns []addOnEntity.AddOn) ([]addOnEntity.AddOn, error)
	ClearProgramAddOns(program entity.Program) (entity.Program, error)
	PageListContent(locale string) (model.ProgramPageListContent, error)
	PageContent(id uint, locale string) (model.ProgramPageContent, error)
	PageTagContent(locale string, tag string) (model.ProgramPageTagContent, error)
}
