package adapter

import (
	"example.com/art-culture-api/domain/bookmark/entity"
	"gorm.io/gorm"
)

type OrmBookmarkRepository struct {
	db *gorm.DB
}

func NewBookmarkRepository(db *gorm.DB) *OrmBookmarkRepository {
	return &OrmBookmarkRepository{
		db: db,
	}
}

func (repo *OrmBookmarkRepository) FindAccountBookmarks(accountId string) ([]entity.Bookmark, error) {
	var bookmarks []entity.Bookmark

	result := repo.db.Where("account_id = ?", accountId).Order("created_at desc").Find(&bookmarks)
	if result.Error != nil {
		return []entity.Bookmark{}, result.Error
	}

	return bookmarks, nil
}

func (repo *OrmBookmarkRepository) FindAccountBookmarksByType(accountId string, contentType string) ([]entity.Bookmark, error) {
	var bookmarks []entity.Bookmark

	result := repo.db.Where("account_id = ? AND content_type = ?", accountId, contentType).Order("created_at desc").Find(&bookmarks)
	if result.Error != nil {
		return []entity.Bookmark{}, result.Error
	}

	return bookmarks, nil
}

func (repo *OrmBookmarkRepository) CreateAccountBookmark(bookmark entity.Bookmark) (entity.Bookmark, error) {
	var bookmarks []entity.Bookmark
	findBookMarkResult := repo.db.Where("account_id = ? AND content_type = ? AND content_id = ?", bookmark.AccountId, bookmark.ContentType, bookmark.ContentId).Order("created_at desc").Find(&bookmarks)
	if findBookMarkResult.Error != nil {
		return entity.Bookmark{}, findBookMarkResult.Error
	}

	if len(bookmarks) > 0 {
		return entity.Bookmark{}, nil
	}

	result := repo.db.Create(&bookmark)
	if result.Error != nil {
		return entity.Bookmark{}, result.Error
	}

	return bookmark, nil
}

func (repo *OrmBookmarkRepository) DeleteAccountBookmark(accountId string, contentType string, contentId string) error {
	result := repo.db.Where("account_id = ? AND content_type = ? AND content_id = ?", accountId, contentType, contentId).Delete(&entity.Bookmark{})
	if result.Error != nil {
		return result.Error
	}

	return nil
}