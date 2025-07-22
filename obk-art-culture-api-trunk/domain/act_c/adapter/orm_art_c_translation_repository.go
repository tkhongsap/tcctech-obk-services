package adapter

import (
	"context"

	"example.com/art-culture-api/domain/act_c/entity"
	"example.com/art-culture-api/domain/act_c/repository"
	"example.com/art-culture-api/domain/booking/adapter/session"
	"gorm.io/gorm"
)

type OrmArtCTranslationRepository struct {
	db *gorm.DB
}

func NewOrmArtCTranslationRepository(db *gorm.DB) repository.ArtCTranslationRepository {
	return &OrmArtCTranslationRepository{
		db: db,
	}
}

func (repo *OrmArtCTranslationRepository) FindByArtCTypeIdAndArtCCategoryIdAndLocale(ctx context.Context, artCTypeID *uint, artCCategoryID *uint, locale string) (entity.ArtCTranslation, error) {
	var artCTranslation entity.ArtCTranslation

	db := session.DB(ctx, repo.db).WithContext(ctx)

	var err error

	if artCTypeID != nil && artCCategoryID != nil {
		err = db.Where("art_c_type_id = ? AND art_c_category_id = ? AND locale = ?", artCTypeID, artCCategoryID, locale).First(&artCTranslation).Error
	} else if artCTypeID != nil && artCCategoryID == nil {
		err = db.Where("art_c_type_id = ? AND art_c_category_id is null AND locale = ?", artCTypeID, locale).First(&artCTranslation).Error
	} else if artCTypeID == nil && artCCategoryID != nil {
		err = db.Where("art_c_type_id is null AND art_c_category_id = ? AND locale = ?", artCCategoryID, locale).First(&artCTranslation).Error
	} else {
		err = db.Where("art_c_type_id is null AND art_c_category_id is null AND locale = ?", locale).First(&artCTranslation).Error
	}

	if err != nil {
		return entity.ArtCTranslation{}, err
	}

	return artCTranslation, nil
}

func (repo *OrmArtCTranslationRepository) FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(ctx context.Context, artCTypeID *uint, artCCategoryID *uint, locale string) (entity.ArtCTranslation, error) {
	var artCTranslations []entity.ArtCTranslation

	db := session.DB(ctx, repo.db).WithContext(ctx)

	var locales []string
	if locale != "en" {
		locales = append(locales, "en", locale)
	} else {
		locales = append(locales, locale)
	}

	var err error
	if artCTypeID != nil && artCCategoryID != nil {
		err = db.Where("art_c_type_id = ? AND art_c_category_id = ? AND locale IN (?)", artCTypeID, artCCategoryID, locales).Find(&artCTranslations).Error
	} else if artCTypeID != nil && artCCategoryID == nil {
		err = db.Where("art_c_type_id = ? AND art_c_category_id is null AND locale IN (?)", artCTypeID, locales).Find(&artCTranslations).Error
	} else if artCTypeID == nil && artCCategoryID != nil {
		err = db.Where("art_c_type_id is null AND art_c_category_id = ? AND locale IN (?)", artCCategoryID, locales).Find(&artCTranslations).Error
	} else {
		err = db.Where("art_c_type_id is null AND art_c_category_id is null AND locale IN (?)", locales).Find(&artCTranslations).Error
	}

	if err != nil {
		return entity.ArtCTranslation{}, err
	}

	if len(artCTranslations) < 1 {
		return entity.ArtCTranslation{}, gorm.ErrRecordNotFound
	}

	artCTranslationsLen := len(artCTranslations)
	localeIdx := 0
	enLocaleIdx := 0
	useDefaultLocale := false
	for i, ac := range artCTranslations {
		if ac.Locale == "en" {
			enLocaleIdx = i
		}
		if locale != "en" {
			// if ac is the last element then use default locale
			if i+1 == artCTranslationsLen && ac.Locale != locale {
				useDefaultLocale = true
			}
			if ac.Locale == locale {
				localeIdx = i
				break
			}
		} else {
			if ac.Locale == "en" {
				localeIdx = i
				break
			}
		}
	}

	if useDefaultLocale {
		return artCTranslations[enLocaleIdx], nil
	}
	return artCTranslations[localeIdx], nil
}

func (repo *OrmArtCTranslationRepository) FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(ctx context.Context, tuples [][]interface{}) ([]entity.ArtCTranslation, error) {
	var artCTranslations []entity.ArtCTranslation

	db := session.DB(ctx, repo.db).WithContext(ctx)

	var combinedCond *gorm.DB
	for i, args := range tuples {
		cond := buildCondition(repo.db, args[0], args[1], args[2].(string))

		if i == 0 {
			group := repo.db.Session(&gorm.Session{})
			combinedCond = group.Where(cond)
		} else {
			combinedCond = combinedCond.Or(cond)
		}
	}

	query := db.Where(combinedCond)
	err := query.Find(&artCTranslations).Error
	if err != nil {
		return []entity.ArtCTranslation{}, err
	}

	return artCTranslations, nil
}

func buildCondition(db *gorm.DB, artCTypeID interface{}, artCCategoryID interface{}, locale string) *gorm.DB {
	cond := db.Session(&gorm.Session{})
	if artCTypeID == nil {
		cond = cond.Where("art_c_type_id IS NULL")
	} else {
		cond = cond.Where("art_c_type_id = ?", artCTypeID)
	}

	if v, ok := artCCategoryID.(*uint); ok && v == nil {
		cond = cond.Where("art_c_category_id IS NULL")
	} else {
		cond = cond.Where("art_c_category_id = ?", artCCategoryID)
	}

	return cond.Where("locale = ?", locale)
}