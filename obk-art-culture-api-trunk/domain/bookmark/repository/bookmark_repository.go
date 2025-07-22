package repository

import "example.com/art-culture-api/domain/bookmark/entity"

type BookmarkRepository interface {
	FindAccountBookmarks(accountId string) ([]entity.Bookmark, error)
	FindAccountBookmarksByType(accountId string, contentType string) ([]entity.Bookmark, error)
	CreateAccountBookmark(bookmark entity.Bookmark) (entity.Bookmark, error)
	DeleteAccountBookmark(accountId string, contentType string, contentId string) error
}