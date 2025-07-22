package adapter

import (
	"time"
	_ "time/tzdata"

	"example.com/art-culture-api/domain/common/utils"
	programEntity "example.com/art-culture-api/domain/programs/entity"

	"example.com/art-culture-api/domain/act_c/entity"
	"example.com/art-culture-api/domain/act_c/model"
	"example.com/art-culture-api/domain/act_c/repository"
	"gorm.io/gorm"
)

type OrmArtCCategoryRepository struct {
	db *gorm.DB
}

func NewOrmArtCCategoryRepository(db *gorm.DB) repository.ArtCCategoryRepository {
	return &OrmArtCCategoryRepository{
		db: db,
	}
}

func (repo *OrmArtCCategoryRepository) FindAll(typeId uint, locale string) ([]entity.ArtCCategory, error) {
	var artCCategoryContents []entity.ArtCCategory
	
	var result *gorm.DB
	if locale == "all" {
		result = repo.db.Preload("ArtCTranslation").Where("art_c_type_id = ?", typeId).Find(&artCCategoryContents)
	} else {
		result = repo.db.Preload("ArtCTranslation", "locale = ?", locale).Where("art_c_type_id = ?", typeId).Find(&artCCategoryContents)
	}

	if result.Error != nil {
		return []entity.ArtCCategory{}, result.Error
	}

	return artCCategoryContents, nil
}

func (repo *OrmArtCCategoryRepository) Find(typeId uint, id uint, locale string) (entity.ArtCCategory, error) {
	var artCCategory entity.ArtCCategory

	var result *gorm.DB
	if locale == "all" {
		result = repo.db.Preload("ArtCTranslation").Where("art_c_type_id = ?", typeId).Where("id = ?", id).First(&artCCategory)
	} else {
		result = repo.db.Preload("ArtCTranslation", "locale = ?", locale).Where("art_c_type_id = ?", typeId).Where("id = ?", id).First(&artCCategory)
	}

	if result.Error != nil {
		return entity.ArtCCategory{}, result.Error
	}

	return artCCategory, nil
}

func (repo *OrmArtCCategoryRepository) CreateOrUpdate(artCCategory entity.ArtCCategory, artCTranslation entity.ArtCTranslation) (entity.ArtCCategory, error) {
	if artCCategory.ID == 0 {
		result := repo.db.Create(&artCCategory)
		if result.Error != nil {
			return entity.ArtCCategory{}, result.Error
		}

		artCTranslation.ArtCCategoryID = &artCCategory.ID
		result = repo.db.Create(&artCTranslation)
		if result.Error != nil {
			result = repo.db.Delete(&entity.ArtCCategory{}, artCCategory.ID)
			return entity.ArtCCategory{}, result.Error
		}

		artCCategory.OrderCategory = artCCategory.ID
		result = repo.db.Save(&artCCategory)
		if result.Error != nil {
			return entity.ArtCCategory{}, result.Error
		}
	} else {
		result := repo.db.Save(&artCCategory)
		if result.Error != nil {
			return entity.ArtCCategory{}, result.Error
		}

		result = repo.db.Save(&artCTranslation)
		if result.Error != nil {
			return entity.ArtCCategory{}, result.Error
		}
	}

	findResult := repo.db.Preload("ArtCTranslation", "locale = ?", artCTranslation.Locale).First(&artCCategory, "id = ?", artCCategory.ID)
	if findResult.Error != nil {
		return entity.ArtCCategory{}, findResult.Error
	}

	return artCCategory, nil 
}

func (repo *OrmArtCCategoryRepository) DeleteByID(typeId uint, id uint) error {
	repo.db.Where("art_c_type_id = ?", typeId).Where("art_c_category_id = ?", id).Delete(&entity.ArtCTranslation{})
	result := repo.db.Where("art_c_type_id = ?", typeId).Delete(&entity.ArtCCategory{}, id)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (repo *OrmArtCCategoryRepository) OrderItems(ids []uint) error {
	for index, id := range ids {
		var artCCategory entity.ArtCCategory
		result := repo.db.First(&artCCategory, "id = ?", id)
		if result.Error != nil {
			return result.Error
		}

		artCCategory.OrderCategory = uint(index + 1)
		result = repo.db.Save(&artCCategory)
		if result.Error != nil {
			return result.Error
		}
	}
	
	return nil
}

func (repo *OrmArtCCategoryRepository) PageContent(typeId uint, id uint, locale string) (model.ArtCCategoryPageContent, error) {
	var artCCategoryPageContent model.ArtCCategoryPageContent

	var artCType entity.ArtCType
	repo.db.Preload("ArtCTranslation", "art_c_category_id IS NULL").First(&artCType, "id = ?", typeId)
	artCType.ArtCTranslation = utils.PickTranslation(
		artCType.ArtCTranslation,
		locale,
		func(t entity.ArtCTranslation) string { return t.Locale },
		func(t *entity.ArtCTranslation, l string) { t.Locale = l },
	)

	var artCCategory entity.ArtCCategory
	repo.db.Preload("ArtCTranslation").First(&artCCategory, "id = ?", id)
	artCCategory.ArtCTranslation = utils.PickTranslation(
		artCCategory.ArtCTranslation,
		locale,
		func(t entity.ArtCTranslation) string { return t.Locale },
		func(t *entity.ArtCTranslation, l string) { t.Locale = l },
	)

	loc, _ := time.LoadLocation("Asia/Bangkok")
	now := time.Now().In(loc)

	var relateProgramIds = []uint{0}
	if artCCategory.RelateProgramIds != nil && len(artCCategory.RelateProgramIds) > 0 {
		relateProgramIds = append(relateProgramIds, artCCategory.RelateProgramIds...)
	}

	var tempSelectedPrograms []programEntity.Program
	repo.db.
		Preload("ProgramTranslation").
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
	repo.db.
		Preload("ProgramTranslation").
		Where("art_c_type_id = ?", artCType.ID).
		Where("art_c_category_id = ?", artCCategory.ID).
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

	artCCategoryPageContent.ArtCType = artCType
	artCCategoryPageContent.ArtCCategory = artCCategory
	artCCategoryPageContent.Programs = programs

	return artCCategoryPageContent, nil
}
