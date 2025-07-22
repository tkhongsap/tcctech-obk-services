package service

import (
	addOnEntity "example.com/art-culture-api/domain/add_ons/entity"
	partnerEntity "example.com/art-culture-api/domain/partners/entity"
	"example.com/art-culture-api/domain/programs/entity"
	"example.com/art-culture-api/domain/programs/model"
	"example.com/art-culture-api/domain/programs/repository"
)

type ProgramService interface {
	FindAll(locale string) ([]entity.Program, error)
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

type programService struct {
	programRepository repository.ProgramRepository
}

func NewProgramService(programRepository repository.ProgramRepository) ProgramService {
	return &programService{
		programRepository: programRepository,
	}
}

func (service *programService) FindAll(locale string) ([]entity.Program, error) {
	return service.programRepository.FindAll(locale)
}

func (service *programService) FindByID(id uint, locale string) (entity.Program, error) {
	return service.programRepository.FindByID(id, locale)
}

func (service *programService) SaveOrUpdate(program entity.Program, programTranslation entity.ProgramTranslation, locale string) (entity.Program, error) {
	return service.programRepository.SaveOrUpdate(program, programTranslation, locale)
}

func (service *programService) DeleteByID(id uint) error {
	return service.programRepository.DeleteByID(id)
}

func (service *programService) FindPartners(partners []partnerEntity.Partner) ([]partnerEntity.Partner, error) {
	return service.programRepository.FindPartners(partners)
}

func (service *programService) ClearProgramPartners(program entity.Program) (entity.Program, error) {
	return service.programRepository.ClearProgramPartners(program)
}

func (service *programService) FindAddOns(addOns []addOnEntity.AddOn) ([]addOnEntity.AddOn, error) {
	return service.programRepository.FindAddOns(addOns)
}

func (service *programService) ClearProgramAddOns(program entity.Program) (entity.Program, error) {
	return service.programRepository.ClearProgramAddOns(program)
}

func (service *programService) PageListContent(locale string) (model.ProgramPageListContent, error) {
	return service.programRepository.PageListContent(locale)
}

func (service *programService) PageContent(id uint, locale string) (model.ProgramPageContent, error) {
	return service.programRepository.PageContent(id, locale)
}

func (service *programService) PageTagContent(locale string, tag string) (model.ProgramPageTagContent, error) {
	return service.programRepository.PageTagContent(locale, tag)
}
