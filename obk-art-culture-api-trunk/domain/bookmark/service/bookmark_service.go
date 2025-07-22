package service

import (
	"example.com/art-culture-api/domain/bookmark/entity"
	"example.com/art-culture-api/domain/bookmark/repository"
)

type BookmarkService interface {
	FindAccountBookmarks(accountId string) ([]entity.Bookmark, error)
    FindAccountBookmarksByType(accountId string, contentType string) ([]entity.Bookmark, error)
	CreateAccountBookmark(bookmark entity.Bookmark) (entity.Bookmark, error)
	DeleteAccountBookmark(accountId string, contentType string, contentId string) error
}

type bookmarkService struct {
	bookmarkRepository repository.BookmarkRepository
}

func NewBookmarkService(bookmarkRepository repository.BookmarkRepository) BookmarkService {
	return &bookmarkService{
		bookmarkRepository: bookmarkRepository,
	}
}

func (service *bookmarkService) FindAccountBookmarks(accountId string) ([]entity.Bookmark, error) {
	return service.bookmarkRepository.FindAccountBookmarks(accountId)
}

func (service *bookmarkService) FindAccountBookmarksByType(accountId string, contentType string) ([]entity.Bookmark, error) {
	return service.bookmarkRepository.FindAccountBookmarksByType(accountId, contentType)
}

func (service *bookmarkService) CreateAccountBookmark(bookmark entity.Bookmark) (entity.Bookmark, error) {
	return service.bookmarkRepository.CreateAccountBookmark(bookmark)
}

func (service *bookmarkService) DeleteAccountBookmark(accountId string, contentType string, contentId string) error {
	return service.bookmarkRepository.DeleteAccountBookmark(accountId, contentType, contentId)
}