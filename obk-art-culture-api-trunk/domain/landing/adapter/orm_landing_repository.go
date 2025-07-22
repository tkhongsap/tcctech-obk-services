package adapter

import (
	"encoding/json"
	"time"
	_ "time/tzdata"

	"gorm.io/gorm"

	artCEntity "example.com/art-culture-api/domain/act_c/entity"
	"example.com/art-culture-api/domain/common/utils"
	"example.com/art-culture-api/domain/landing/entity"
	"example.com/art-culture-api/domain/landing/model"
	"example.com/art-culture-api/domain/landing/repository"
	programEntity "example.com/art-culture-api/domain/programs/entity"
)

type OrmLandingPageRepository struct {
	db *gorm.DB
}

func NewOrmLandingPageRepository(db *gorm.DB) repository.LandingPageRepository {
	return &OrmLandingPageRepository{
		db: db,
	}
}

func (repo *OrmLandingPageRepository) Content(locale string) (model.LandingPageResponse, error) {
	var content model.LandingPageResponse

	landing, err := repo.Find(locale)
	if err != nil {
		return model.LandingPageResponse{}, err
	}

	tempHighlightPrograms := []programEntity.Program{}
	artCType := []artCEntity.ArtCType{}
	if locale == "all" {
		repo.db.Preload("ArtCTranslation", "art_c_category_id IS NULL").Order("order_type asc").Find(&artCType)
		repo.db.Preload("ProgramTranslation").Preload("Partners.PartnerTranslation").Preload("AddOns.AddOnTranslation").Where("id IN ?", landing.ProgramIds).Find(&tempHighlightPrograms)
	} else {
		repo.db.Preload("ArtCTranslation", "locale = ? AND art_c_category_id IS NULL", locale).Order("order_type asc").Find(&artCType)
		repo.db.Preload("ProgramTranslation", "locale = ?", locale).Preload("Partners.PartnerTranslation", "locale = ?", locale).Preload("AddOns.AddOnTranslation", "locale = ?", locale).Where("id IN ?", landing.ProgramIds).Find(&tempHighlightPrograms)
	}

	highlightPrograms := []programEntity.Program{}
	for _, pId := range landing.ProgramIds {
		for _, program := range tempHighlightPrograms {
			if program.ID == pId {
				highlightPrograms = append(highlightPrograms, program)
			}
		}
	}

	var translations []model.LandingContentTranslation
	for _, translation := range landing.LandingTranslation {
		var cnt model.LandingContentModel
		err := json.Unmarshal([]byte(translation.Content), &cnt)
		if err != nil {
			return model.LandingPageResponse{}, err
		}

		var item model.LandingContentTranslation
		item.Locale = translation.Locale
		item.Content.ArtCTitle = cnt.ArtCTitle
		item.Content.ArtCDesc = cnt.ArtCDesc
		item.Content.ArtMapTitle = cnt.ArtMapTitle
		item.Content.ArtMapDesc = cnt.ArtMapDesc
		item.Content.ProgramTitle = cnt.ProgramTitle
		item.Content.ProgramDesc = cnt.ProgramDesc

		translations = append(translations, item)
	}

	content.HighlightPrograms = highlightPrograms
	content.HighlightAutoPlay = landing.HighlightAutoPlay
	content.SectionOrder = landing.SectionOrder
	content.ArtCTypes = artCType
	content.Translation = translations
	content.CreatedAt = landing.CreatedAt
	content.UpdatedAt = landing.UpdatedAt

	return content, nil
}


func (repo *OrmLandingPageRepository) Find(locale string) (entity.LandingPage, error) {
	var landing entity.LandingPage

	var result *gorm.DB
	if(locale == "all") {
		result = repo.db.Preload("LandingTranslation").First(&landing)
	} else {
		result = repo.db.Preload("LandingTranslation", "locale = ?", locale).First(&landing)
	}

	if result.Error != nil {
		return entity.LandingPage{}, result.Error
	}

	return landing, nil
}

func (repo *OrmLandingPageRepository) SaveOrUpdate(landing entity.LandingPage, landingTranslation entity.LandingTranslation, artCTypesId []uint) (entity.LandingPage, error) {
	result := repo.db.Save(&landing)
	if result.Error != nil {
		return entity.LandingPage{}, result.Error
	}

	result = repo.db.Save(&landingTranslation)
	if result.Error != nil {
		return entity.LandingPage{}, result.Error
	}

	for index, id := range artCTypesId {
		var artCType artCEntity.ArtCType
		result := repo.db.First(&artCType, "id = ?", id)
		if result.Error != nil {
			return entity.LandingPage{}, result.Error
		}

		artCType.OrderType = uint(index + 1)
		result = repo.db.Save(&artCType)
		if result.Error != nil {
			return entity.LandingPage{}, result.Error
		}
	}

	return landing, nil
}

func pickArtCTranslation(translations []artCEntity.ArtCTranslation, locale string) []artCEntity.ArtCTranslation {
	var selected, fallback *artCEntity.ArtCTranslation

	for _, t := range translations {
		if t.Locale == locale {
			selected = &t
			break
		} else if t.Locale == "en" {
			fallback = &t
		}
	}

	if selected != nil {
		s := *selected
		s.Locale = locale
		return []artCEntity.ArtCTranslation{s}
	} else if fallback != nil {
		f := *fallback
		f.Locale = locale
		return []artCEntity.ArtCTranslation{f}
	}

	return []artCEntity.ArtCTranslation{}
}

func pickProgramTranslation(translations []programEntity.ProgramTranslation, locale string) []programEntity.ProgramTranslation {
	var selected, fallback *programEntity.ProgramTranslation

	for _, t := range translations {
		if t.Locale == locale {
			selected = &t
			break
		} else if t.Locale == "en" {
			fallback = &t
		}
	}

	if selected != nil {
		s := *selected
		s.Locale = locale // force override
		return []programEntity.ProgramTranslation{s}
	} else if fallback != nil {
		f := *fallback
		f.Locale = locale // override fallback to match selected
		return []programEntity.ProgramTranslation{f}
	}

	return []programEntity.ProgramTranslation{}
}

func (repo *OrmLandingPageRepository) PageContent(locale string) (model.LandingPageContent, error) {
	pageContent := model.LandingPageContent{}

	landing, err := repo.Find(locale)
	if err != nil {
		return model.LandingPageContent{}, err
	}

	loc, _ := time.LoadLocation("Asia/Bangkok")
	now := time.Now().In(loc)

	artCType := []artCEntity.ArtCType{}
	tempHighlightPrograms := []programEntity.Program{}
	tempPrograms := []programEntity.Program{}
	repo.db.Preload("ArtCTranslation", "art_c_category_id IS NULL").Order("order_type asc").Find(&artCType)
	for i, a := range artCType {
		artCType[i].ArtCTranslation = utils.PickTranslation(
			a.ArtCTranslation,
			locale,
			func(t artCEntity.ArtCTranslation) string { return t.Locale },
			func(t *artCEntity.ArtCTranslation, l string) { t.Locale = l },
		)
	}

	repo.db.Preload("ProgramTranslation").Where("id IN ?", landing.ProgramIds).Where("published_at IS NOT NULL").Where("published_at <= ?", now).Find(&tempHighlightPrograms)
	repo.db.Preload("ProgramTranslation").Where("is_published = ?", true).Where("published_at IS NOT NULL").Where("published_at <= ?", now).Find(&tempPrograms)

	for i, p := range tempHighlightPrograms {
		tempHighlightPrograms[i].ProgramTranslation = utils.PickTranslation(
			p.ProgramTranslation,
			locale,
			func(t programEntity.ProgramTranslation) string { return t.Locale },
			func(t *programEntity.ProgramTranslation, l string) { t.Locale = l },
		)
	}

	for i, p := range tempPrograms {
		tempPrograms[i].ProgramTranslation = utils.PickTranslation(
			p.ProgramTranslation,
			locale,
			func(t programEntity.ProgramTranslation) string { return t.Locale },
			func(t *programEntity.ProgramTranslation, l string) { t.Locale = l },
		)
	}

	highlightPrograms := []programEntity.Program{}

	for _, pId := range landing.ProgramIds {
		for _, program := range tempHighlightPrograms {
			if program.ID == pId {
				if(program.PeriodEnd != nil) {
					if(program.PeriodEnd.After(now)) {
						highlightPrograms = append(highlightPrograms, program)
					}
				} else {
					highlightPrograms = append(highlightPrograms, program)
				}
			}
		}
	}

	programs := []programEntity.Program{}
	for _, program := range tempPrograms {
		if(program.PeriodEnd != nil) {
			if(program.PeriodEnd.After(now)) {
				programs = append(programs, program)
			}
		} else {
			programs = append(programs, program)
		}
	}

	pageContent.SectionOrder = landing.SectionOrder
	pageContent.HighlightPrograms = highlightPrograms
	pageContent.HighlightAutoPlay = landing.HighlightAutoPlay
	pageContent.ArtCTypes = artCType
	pageContent.Programs = programs

	var translations []model.LandingContentTranslation
	for _, translation := range landing.LandingTranslation {
		var cnt model.LandingContentModel
		err := json.Unmarshal([]byte(translation.Content), &cnt)
		if err != nil {
			return model.LandingPageContent{}, err
		}

		var item model.LandingContentTranslation
		item.Locale = translation.Locale
		item.Content.ArtCTitle = cnt.ArtCTitle
		item.Content.ArtCDesc = cnt.ArtCDesc
		item.Content.ArtMapTitle = cnt.ArtMapTitle
		item.Content.ArtMapDesc = cnt.ArtMapDesc
		item.Content.ProgramTitle = cnt.ProgramTitle
		item.Content.ProgramDesc = cnt.ProgramDesc

		translations = append(translations, item)
	}

	pageContent.Translation = translations


	return pageContent, nil
}