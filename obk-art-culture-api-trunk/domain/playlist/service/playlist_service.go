package service

import (
	"example.com/art-culture-api/domain/playlist/entity"
	"example.com/art-culture-api/domain/playlist/repository"
)



type PlaylistService interface {
	FindAll(locale string) ([]entity.Playlist, error)
	FindByID(id uint, locale string) (entity.Playlist, error)
	SaveOrUpdate(faq entity.Playlist, faqTranslation entity.PlaylistTranslation, locale string) (entity.Playlist, error)
	DeleteByID(id uint) error
}

type playlistService struct {
	playlistRepository repository.PlaylistRepository
}

func NewPlaylistService(playlistRepository repository.PlaylistRepository) PlaylistService {
	return &playlistService{
		playlistRepository: playlistRepository,
	}
}

func (service *playlistService) FindAll(locale string) ([]entity.Playlist, error) {
	return service.playlistRepository.FindAll(locale)
}

func (service *playlistService) FindByID(id uint, locale string) (entity.Playlist, error) {
	return service.playlistRepository.FindByID(id, locale)
}

func (service *playlistService) SaveOrUpdate(faq entity.Playlist, faqTranslation entity.PlaylistTranslation, locale string) (entity.Playlist, error) {
	return service.playlistRepository.SaveOrUpdate(faq, faqTranslation, locale)
}

func (service *playlistService) DeleteByID(id uint) error {
	return service.playlistRepository.DeleteByID(id)
}