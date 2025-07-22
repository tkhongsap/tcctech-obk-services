package repository

import "example.com/art-culture-api/domain/faqs/entity"

type FaqRepository interface {
	FindAll(locale string) ([]entity.Faq, error)
	FindByID(id uint, locale string) (entity.Faq, error)
	SaveOrUpdate(faq entity.Faq, faqTranslation entity.FaqTranslation, locale string) (entity.Faq, error)
	DeleteByID(id uint) error
	OrderItems(ids []uint) error
	PageContent(locale string) ([]entity.Faq, error)
}