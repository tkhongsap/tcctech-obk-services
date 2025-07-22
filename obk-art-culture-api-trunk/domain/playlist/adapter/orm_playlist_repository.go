package adapter

import (
	"example.com/art-culture-api/domain/playlist/entity"
	"gorm.io/gorm"
)

type OrmPlaylistRepository struct {
	db *gorm.DB
}

func NewOrmPlaylistRepository(db *gorm.DB) *OrmPlaylistRepository {
	return &OrmPlaylistRepository{
		db: db,
	}
}

func (repo *OrmPlaylistRepository) FindAll(locale string) ([]entity.Playlist, error) {
	var playlists []entity.Playlist

	var result *gorm.DB
	if(locale == "all") {
		result = repo.db.Preload("PlaylistTranslation").Find(&playlists)	
	} else {
		result = repo.db.Preload("PlaylistTranslation", "locale = ?", locale).Find(&playlists)
	}
	
	if result.Error != nil {
		return []entity.Playlist{}, result.Error
	}

	return playlists, nil
}

func (repo *OrmPlaylistRepository) FindByID(id uint, locale string) (entity.Playlist, error) {
	var playlist entity.Playlist
	
	var result *gorm.DB
	if(locale == "all") {
		result = repo.db.Preload("PlaylistTranslation").First(&playlist, "id = ?", id)
	} else {
		result = repo.db.Preload("PlaylistTranslation", "locale = ?", locale).First(&playlist, "id = ?", id)
	}
	
	if result.Error != nil {
		return entity.Playlist{}, result.Error
	}

	return playlist, nil
}

func (repo *OrmPlaylistRepository) SaveOrUpdate(playlist entity.Playlist, playlistTranslation entity.PlaylistTranslation, locale string) (entity.Playlist, error) {
	if playlist.ID == 0 {
		result := repo.db.Create(&playlist)
		if result.Error != nil {
			return entity.Playlist{}, result.Error
		}

		playlistTranslation.PlaylistID = playlist.ID
		result = repo.db.Create(&playlistTranslation)
		if result.Error != nil {
			result = repo.db.Delete(&playlist, playlist.ID)
			return entity.Playlist{}, result.Error
		}
	} else {
		result := repo.db.Save(&playlist)
		if result.Error != nil {
			return entity.Playlist{}, result.Error
		}

		result = repo.db.Save(&playlistTranslation)
		if result.Error != nil {
			return entity.Playlist{}, result.Error
		}
	}

	findResult := repo.db.Preload("PlaylistTranslation", "locale = ?", playlistTranslation.Locale).First(&playlist, "id = ?", playlist.ID)
	if findResult.Error != nil {
		return entity.Playlist{}, findResult.Error
	}

	return playlist, nil
}

func (repo *OrmPlaylistRepository) DeleteByID(id uint) error {
	repo.db.Where("playlist_id = ?", id).Delete(&entity.PlaylistTranslation{})
	result := repo.db.Delete(&entity.Playlist{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}