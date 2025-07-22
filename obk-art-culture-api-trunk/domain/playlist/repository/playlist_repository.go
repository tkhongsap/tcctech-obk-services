package repository

import "example.com/art-culture-api/domain/playlist/entity"


type PlaylistRepository interface {
	FindAll(locale string) ([]entity.Playlist, error)
	FindByID(id uint, locale string) (entity.Playlist, error)
	SaveOrUpdate(faq entity.Playlist, faqTranslation entity.PlaylistTranslation, locale string) (entity.Playlist, error)
	DeleteByID(id uint) error
}