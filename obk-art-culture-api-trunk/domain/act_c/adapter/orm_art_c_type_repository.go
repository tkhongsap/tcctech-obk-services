package adapter

import (
	"time"
	_ "time/tzdata"

	"example.com/art-culture-api/domain/act_c/entity"
	"example.com/art-culture-api/domain/act_c/model"
	"example.com/art-culture-api/domain/act_c/repository"
	"example.com/art-culture-api/domain/common/utils"
	playlistEntity "example.com/art-culture-api/domain/playlist/entity"
	programEntity "example.com/art-culture-api/domain/programs/entity"
	"gorm.io/gorm"
)

type OrmArtCTypeRepository struct {
	db *gorm.DB
}

func NewOrmArtCTypeRepository(db *gorm.DB) repository.ArtCTypeRepository {
	return &OrmArtCTypeRepository{
		db: db,
	}
}

func (repo *OrmArtCTypeRepository) FindAll(locale string) ([]entity.ArtCType, error) {
	var artCTypeContents []entity.ArtCType

	var result *gorm.DB
	if(locale == "all") {
		result = repo.db.Preload("ArtCCategory.ArtCTranslation").Preload("ArtCTranslation", "art_c_category_id IS NULL").Order("order_type asc").Find(&artCTypeContents)
	} else {
		result = repo.db.Preload("ArtCCategory.ArtCTranslation", "locale = ?", locale).Preload("ArtCTranslation", "locale = ? AND art_c_category_id IS NULL", locale).Order("order_type asc").Find(&artCTypeContents)
	}

	if result.Error != nil {
		return []entity.ArtCType{}, result.Error
	}

	return artCTypeContents, nil
}

func (repo *OrmArtCTypeRepository) Find(id uint, locale string) (entity.ArtCType, error) {
	var artCType entity.ArtCType

	var result *gorm.DB
	if locale == "all" {
		result = repo.db.Preload("ArtCCategory.ArtCTranslation").Preload("ArtCTranslation", "art_c_category_id IS NULL").First(&artCType, "id = ?", id)
	} else {
		result = repo.db.Preload("ArtCCategory.ArtCTranslation", "locale = ?", locale).Preload("ArtCTranslation", "locale = ? AND art_c_category_id IS NULL", locale).First(&artCType, "id = ?", id)
	}
	
	if result.Error != nil {
		return entity.ArtCType{}, result.Error
	}

	return artCType, nil
}

func (repo *OrmArtCTypeRepository) CreateOrUpdate(artCType entity.ArtCType, artCTranslation entity.ArtCTranslation) (entity.ArtCType, error) {
	if artCType.ID == 0 {
		result := repo.db.Create(&artCType)
		if result.Error != nil {
			return entity.ArtCType{}, result.Error
		}

		artCTranslation.ArtCTypeID = &artCType.ID
		result = repo.db.Create(&artCTranslation)
		if result.Error != nil {
			result = repo.db.Delete(&entity.ArtCType{}, artCType.ID)
			return entity.ArtCType{}, result.Error
		}

		artCType.OrderType = artCType.ID
		result = repo.db.Save(&artCType)
		if result.Error != nil {
			return entity.ArtCType{}, result.Error
		}
	} else {
		result := repo.db.Save(&artCType)
		if result.Error != nil {
			return entity.ArtCType{}, result.Error
		}

		result = repo.db.Save(&artCTranslation)
		if result.Error != nil {
			return entity.ArtCType{}, result.Error
		}
	}

	findResult := repo.db.Preload("ArtCTranslation", "locale = ?", artCTranslation.Locale).First(&artCType, "id = ?", artCType.ID)
	if findResult.Error != nil {
		return entity.ArtCType{}, findResult.Error
	}

	return artCType, nil 
}

func (repo *OrmArtCTypeRepository) DeleteByID(id uint) error {
	repo.db.Where("art_c_type_id = ?", id).Delete(&entity.ArtCTranslation{})
	repo.db.Where("art_c_type_id = ?", id).Delete(&entity.ArtCCategory{})
	result := repo.db.Delete(&entity.ArtCType{}, id)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (repo *OrmArtCTypeRepository) OrderItems(ids []uint) error {
	for index, id := range ids {
		var artCType entity.ArtCType
		result := repo.db.First(&artCType, "id = ?", id)
		if result.Error != nil {
			return result.Error
		}

		artCType.OrderType = uint(index + 1)
		result = repo.db.Save(&artCType)
		if result.Error != nil {
			return result.Error
		}
	}
	
	return nil
}

func (repo *OrmArtCTypeRepository) PageContent(locale string, id uint) (model.ArtCTypePageContent, error) {
	var artCTypePageContent model.ArtCTypePageContent

	var artCTypes []entity.ArtCType
	repo.db.Preload("ArtCCategory.ArtCTranslation").Preload("ArtCTranslation", "art_c_category_id IS NULL").Order("order_type asc").Find(&artCTypes)
	for i, a := range artCTypes {
		artCTypes[i].ArtCTranslation = utils.PickTranslation(
			a.ArtCTranslation,
			locale,
			func(t entity.ArtCTranslation) string { return t.Locale },
			func(t *entity.ArtCTranslation, l string) { t.Locale = l },
		)
	}

	var artCType entity.ArtCType
	repo.db.Preload("ArtCTranslation", "art_c_category_id IS NULL").Preload("ArtCCategory.ArtCTranslation").First(&artCType, "id = ?", id)
	artCType.ArtCTranslation = utils.PickTranslation(
		artCType.ArtCTranslation,
		locale,
		func(t entity.ArtCTranslation) string { return t.Locale },
		func(t *entity.ArtCTranslation, l string) { t.Locale = l },
	)

	loc, _ := time.LoadLocation("Asia/Bangkok")
	now := time.Now().In(loc)

	var relateProgramIds = []uint{0}
	if artCType.RelateProgramIds != nil && len(artCType.RelateProgramIds) > 0 {
		relateProgramIds = append(relateProgramIds, artCType.RelateProgramIds...)
	}

	var tempSelectedPrograms []programEntity.Program
	repo.db.Preload("ProgramTranslation").
		Where("id IN ?", relateProgramIds).
		Where("is_published = ?", true).
		Where("published_at IS NOT NULL").
		Where("published_at <= ?", now).
		Find(&tempSelectedPrograms)

	for i, a := range tempSelectedPrograms {
		tempSelectedPrograms[i].ProgramTranslation = utils.PickTranslation(
			a.ProgramTranslation,
			locale,
			func(t programEntity.ProgramTranslation) string { return t.Locale },
			func(t *programEntity.ProgramTranslation, l string) { t.Locale = l },
		)
	}
	
	var selectedPrograms []programEntity.Program
	for _, programId := range relateProgramIds {
		for _, program := range tempSelectedPrograms {
			if program.ID == programId {
				if(program.PeriodEnd != nil) {
					if(program.PeriodEnd.After(now)) {
						selectedPrograms = append(selectedPrograms, program)
					}
				} else {
					selectedPrograms = append(selectedPrograms, program)
				}
				break
			}
		}
	}
	
	var tempRelatePrograms []programEntity.Program
	repo.db.Preload("ProgramTranslation").
		Where("art_c_type_id = ?", artCType.ID).
		Where("id NOT IN ?", relateProgramIds).
		Where("is_published = ?", true).
		Where("published_at IS NOT NULL").
		Where("published_at <= ?", now).
		Find(&tempRelatePrograms)

	for i, a := range tempRelatePrograms {
		tempRelatePrograms[i].ProgramTranslation = utils.PickTranslation(
			a.ProgramTranslation,
			locale,
			func(t programEntity.ProgramTranslation) string { return t.Locale },
			func(t *programEntity.ProgramTranslation, l string) { t.Locale = l },
		)
	}

	var programs []programEntity.Program
	programs = append(programs, selectedPrograms...)
	for _, program := range tempRelatePrograms {
		if(program.PeriodEnd != nil) {
			if(program.PeriodEnd.After(now)) {
				programs = append(programs, program)
			}
		} else {
			programs = append(programs, program)
		}
	}

	var playlists []playlistEntity.Playlist
	repo.db.Preload("PlaylistTranslation").Where("id IN ?", artCType.Playlist).Find(&playlists)

	for i, a := range playlists {
		playlists[i].PlaylistTranslation = utils.PickTranslation(
			a.PlaylistTranslation,
			locale,
			func(t playlistEntity.PlaylistTranslation) string { return t.Locale },
			func(t *playlistEntity.PlaylistTranslation, l string) { t.Locale = l },
		)
	}

	artCTypePageContent.ArtCTypes = artCTypes
	artCTypePageContent.ArtCType = artCType
	artCTypePageContent.Programs = programs
	artCTypePageContent.Playlist = playlists
	
	return artCTypePageContent, nil
}

