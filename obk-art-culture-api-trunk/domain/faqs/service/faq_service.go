package service

import (
	"example.com/art-culture-api/domain/faqs/entity"
	"example.com/art-culture-api/domain/faqs/repository"
)

type FaqService interface {
	FindAll(locale string) ([]entity.Faq, error)
	FindByID(id uint, locale string) (entity.Faq, error)
	SaveOrUpdate(faq entity.Faq, faqTranslation entity.FaqTranslation, locale string) (entity.Faq, error)
	DeleteByID(id uint) error
	OrderItems(ids []uint) error
	PageContent(locale string) ([]entity.Faq, error)
}

type faqService struct {
	faqRepository repository.FaqRepository
}

func NewFaqService(faqRepository repository.FaqRepository) FaqService {
	return &faqService{
		faqRepository: faqRepository,
	}
}

func (service *faqService) FindAll(locale string) ([]entity.Faq, error) {
	return service.faqRepository.FindAll(locale)
}

func (service *faqService) FindByID(id uint, locale string) (entity.Faq, error) {
	return service.faqRepository.FindByID(id, locale)
}

func (service *faqService) SaveOrUpdate(faq entity.Faq, faqTranslation entity.FaqTranslation, locale string) (entity.Faq, error) {
	return service.faqRepository.SaveOrUpdate(faq, faqTranslation, locale)
}

func (service *faqService) DeleteByID(id uint) error {
	return service.faqRepository.DeleteByID(id)
}

func (service *faqService) OrderItems(ids []uint) error {
	return service.faqRepository.OrderItems(ids)
}

func (service *faqService) PageContent(locale string) ([]entity.Faq, error) {
	return service.faqRepository.PageContent(locale)
}
