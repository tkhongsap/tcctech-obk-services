package adapter

import (
	"context"
	"errors"
	"time"
	_ "time/tzdata"

	artCEntity "example.com/art-culture-api/domain/act_c/entity"
	addOnEntity "example.com/art-culture-api/domain/add_ons/entity"
	"example.com/art-culture-api/domain/booking/adapter/session"
	"example.com/art-culture-api/domain/common/utils"
	partnerEntity "example.com/art-culture-api/domain/partners/entity"
	"example.com/art-culture-api/domain/programs/entity"
	"example.com/art-culture-api/domain/programs/model"
	"gorm.io/gorm"
)

type OrmProgramRepository struct {
	db *gorm.DB
}

func NewOrmProgramRepository(db *gorm.DB) *OrmProgramRepository {
	return &OrmProgramRepository{
		db: db,
	}
}

func (repo *OrmProgramRepository) FindAll(locale string) ([]entity.Program, error) {
	var programs []entity.Program

	var result *gorm.DB
	if locale == "all" {
		result = repo.db.Preload("ProgramTranslation").Preload("Partners.PartnerTranslation").Preload("AddOns.AddOnTranslation").Find(&programs)
	} else {
		result = repo.db.Preload("ProgramTranslation", "locale = ?", locale).Preload("Partners.PartnerTranslation", "locale = ?", locale).Preload("AddOns.AddOnTranslation", "locale = ?", locale).Find(&programs)
	}

	if result.Error != nil {
		return []entity.Program{}, result.Error
	}

	return programs, nil
}

func (repo *OrmProgramRepository) FindOneByID(ctx context.Context, id uint, locale string) (entity.Program, error) {
	var program entity.Program

	db := session.DB(ctx, repo.db).WithContext(ctx)

	if locale == "" {
		if err := db.First(&program, "id = ?", id).Error; err != nil {
			return entity.Program{}, err
		}
	} else if locale == "all" {
		if err := db.Preload("ProgramTranslation").Preload("Partners.PartnerTranslation").Preload("AddOns.AddOnTranslation").First(&program, "id = ?", id).Error; err != nil {
			return entity.Program{}, err
		}
	} else {
		if err := db.Preload("ProgramTranslation", "locale = ?", locale).Preload("Partners.PartnerTranslation", "locale = ?", locale).Preload("AddOns.AddOnTranslation", "locale = ?", locale).First(&program, "id = ?", id).Error; err != nil {
			return entity.Program{}, err
		}
	}

	return program, nil
}

func (repo *OrmProgramRepository) FindByID(id uint, locale string) (entity.Program, error) {
	var program entity.Program

	var result *gorm.DB
	if locale == "all" {
		result = repo.db.Preload("ProgramTranslation").Preload("Partners.PartnerTranslation").Preload("AddOns.AddOnTranslation").First(&program, "id = ?", id)
	} else {
		result = repo.db.Preload("ProgramTranslation", "locale = ?", locale).Preload("Partners.PartnerTranslation", "locale = ?", locale).Preload("AddOns.AddOnTranslation", "locale = ?", locale).First(&program, "id = ?", id)
	}

	if result.Error != nil {
		return entity.Program{}, result.Error
	}

	return program, nil
}

func (repo *OrmProgramRepository) SaveOrUpdate(program entity.Program, programTranslation entity.ProgramTranslation, locale string) (entity.Program, error) {
	for idx, partner := range program.Partners {
		repo.db.Preload("PartnerTranslation").First(&partner, partner.ID)
		program.Partners[idx] = partner
	}

	if program.ID == 0 {
		result := repo.db.Create(&program)
		if result.Error != nil {
			return entity.Program{}, result.Error
		}

		programTranslation.ProgramID = program.ID
		result = repo.db.Create(&programTranslation)
		if result.Error != nil {
			result = repo.db.Delete(&entity.Program{}, program.ID)
			return entity.Program{}, result.Error
		}
	} else {
		result := repo.db.Save(&program)
		if result.Error != nil {
			return entity.Program{}, result.Error
		}

		result = repo.db.Save(&programTranslation)
		if result.Error != nil {
			return entity.Program{}, result.Error
		}
	}

	findResult := repo.db.Preload("ProgramTranslation").Preload("Partners.PartnerTranslation").Preload("AddOns.AddOnTranslation").First(&program, "id = ?", program.ID)
	if findResult.Error != nil {
		return entity.Program{}, findResult.Error
	}

	return program, nil
}

func (repo *OrmProgramRepository) DeleteByID(id uint) error {
	var program entity.Program
	result := repo.db.Preload("Partners").Preload("AddOns").First(&program, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}

	err := repo.db.Model(&program).Association("Partners").Clear()
	if err != nil {
		return err
	}

	err = repo.db.Model(&program).Association("AddOns").Clear()
	if err != nil {
		return err
	}

	repo.db.Where("program_id = ?", id).Delete(&entity.ProgramTranslation{})
	repo.db.Model(&program).Association("Partners").Clear()
	result = repo.db.Delete(&entity.Program{}, id)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (repo *OrmProgramRepository) FindPartners(partners []partnerEntity.Partner) ([]partnerEntity.Partner, error) {
	partnersID := make([]uint, len(partners))
	for i, partner := range partners {
		partnersID[i] = partner.ID
	}

	var findPartners []partnerEntity.Partner
	result := repo.db.Where("id IN ?", partnersID).Find(&findPartners)

	if result.Error != nil {
		return []partnerEntity.Partner{}, errors.New("Find partners failed")
	}

	return findPartners, nil
}

func (repo *OrmProgramRepository) ClearProgramPartners(program entity.Program) (entity.Program, error) {
	err := repo.db.Model(&program).Association("Partners").Clear()
	if err != nil {
		return entity.Program{}, err
	}

	return program, nil
}

func (repo *OrmProgramRepository) FindAddOns(addOns []addOnEntity.AddOn) ([]addOnEntity.AddOn, error) {
	addOnsID := make([]uint, len(addOns))
	for i, addOn := range addOns {
		addOnsID[i] = addOn.ID
	}

	var findAddOns []addOnEntity.AddOn
	result := repo.db.Where("id IN ?", addOnsID).Find(&findAddOns)

	if result.Error != nil {
		return []addOnEntity.AddOn{}, errors.New("Find add-ons failed")
	}

	return findAddOns, nil
}

func (repo *OrmProgramRepository) ClearProgramAddOns(program entity.Program) (entity.Program, error) {
	err := repo.db.Model(&program).Association("AddOns").Clear()
	if err != nil {
		return entity.Program{}, err
	}

	return program, nil
}

func (repo *OrmProgramRepository) PageContent(id uint, locale string) (model.ProgramPageContent, error) {
	var pageContent model.ProgramPageContent

	loc, _ := time.LoadLocation("Asia/Bangkok")
	now := time.Now().In(loc)

	var program entity.Program
		repo.db.Preload("ProgramTranslation").
		Preload("Partners.PartnerTranslation").
		Preload("AddOns", "is_published = ? AND published_at IS NOT NULL AND published_at <= ?", true, now).
		Preload("AddOns.AddOnTranslation").
		First(&program, "id = ?", id)
	program.ProgramTranslation = utils.PickTranslation(
		program.ProgramTranslation,
		locale,
		func(t entity.ProgramTranslation) string { return t.Locale },
		func(t *entity.ProgramTranslation, l string) { t.Locale = l },
	)

	for i, a := range program.AddOns {
		program.AddOns[i].AddOnTranslation = utils.PickTranslation(
			a.AddOnTranslation,
			locale,
			func(t addOnEntity.AddOnTranslation) string { return t.Locale },
			func(t *addOnEntity.AddOnTranslation, l string) { t.Locale = l },
		)
	}

	for i, a := range program.Partners {
		program.Partners[i].PartnerTranslation = utils.PickTranslation(
			a.PartnerTranslation,
			locale,
			func(t partnerEntity.PartnerTranslation) string { return t.Locale },
			func(t *partnerEntity.PartnerTranslation, l string) { t.Locale = l },
		)
	}

	var artCType artCEntity.ArtCType
	repo.db.Preload("ArtCTranslation", "art_c_category_id IS NULL").First(&artCType, "id = ?", program.ArtCTypeID)
	artCType.ArtCTranslation = utils.PickTranslation(
		artCType.ArtCTranslation,
		locale,
		func(t artCEntity.ArtCTranslation) string { return t.Locale },
		func(t *artCEntity.ArtCTranslation, l string) { t.Locale = l },
	)

	var artCCategory artCEntity.ArtCCategory
	if program.ArtCCategoryID != nil {
		repo.db.Preload("ArtCTranslation").First(&artCCategory, "id = ?", *program.ArtCCategoryID)
		artCCategory.ArtCTranslation = utils.PickTranslation(
			artCCategory.ArtCTranslation,
			locale,
			func(t artCEntity.ArtCTranslation) string { return t.Locale },
			func(t *artCEntity.ArtCTranslation, l string) { t.Locale = l },
		)

		pageContent.ArtCCategory = &artCCategory
	} else {
		pageContent.ArtCCategory = nil
	}

	var tempRelatePrograms []entity.Program
	var tempRelateProducts []entity.Program
	repo.db.
		Preload("ProgramTranslation").
		Preload("Partners.PartnerTranslation").
		Preload("AddOns.AddOnTranslation").
		Where("id IN ?", program.RelateProgramIds).
		Where("is_published = ?", true).
		Where("published_at IS NOT NULL").
		Where("published_at <= ?", now).
		Find(&tempRelatePrograms)
	for i, a := range tempRelatePrograms {
		tempRelatePrograms[i].ProgramTranslation = utils.PickTranslation(
			a.ProgramTranslation,
			locale,
			func(t entity.ProgramTranslation) string { return t.Locale },
			func(t *entity.ProgramTranslation, l string) { t.Locale = l },
		)
	}

	repo.db.
		Preload("ProgramTranslation").
		Preload("Partners.PartnerTranslation").
		Preload("AddOns.AddOnTranslation").
		Where("id IN ?", program.RelateProductIds).
		Where("is_published = ?", true).
		Where("published_at IS NOT NULL").
		Where("published_at <= ?", now).
		Find(&tempRelateProducts)
	for i, a := range tempRelateProducts {
		tempRelateProducts[i].ProgramTranslation = utils.PickTranslation(
			a.ProgramTranslation,
			locale,
			func(t entity.ProgramTranslation) string { return t.Locale },
			func(t *entity.ProgramTranslation, l string) { t.Locale = l },
		)
	}

	relatePrograms := []entity.Program{}
	for _, rProgramId := range program.RelateProgramIds {
		for _, tRProgram := range tempRelatePrograms {
			if tRProgram.ID == rProgramId {
				if tRProgram.PeriodEnd != nil {
					if tRProgram.PeriodEnd.After(now) {
						relatePrograms = append(relatePrograms, tRProgram)
					}
				} else {
					relatePrograms = append(relatePrograms, tRProgram)
				}
			}
		}
	}

	relateProducts := []entity.Program{}
	for _, rProductId := range program.RelateProductIds {
		for _, tRProduct := range tempRelateProducts {
			if tRProduct.ID == rProductId {
				if tRProduct.PeriodEnd != nil {
					if tRProduct.PeriodEnd.After(now) {
						relateProducts = append(relateProducts, tRProduct)
					}
				} else {
					relateProducts = append(relateProducts, tRProduct)
				}
			}
		}
	}

	pageContent.ArtCType = artCType

	pageContent.Program = program
	pageContent.RelatePrograms = relatePrograms
	pageContent.RelateProducts = relateProducts

	return pageContent, nil
}

func (repo *OrmProgramRepository) PageListContent(locale string) (model.ProgramPageListContent, error) {
	var pageListContent model.ProgramPageListContent

	var artCTypes []artCEntity.ArtCType
	repo.db.Preload("Program.ProgramTranslation").Preload("ArtCTranslation", "art_c_category_id IS NULL").Find(&artCTypes)
	for i, a := range artCTypes {
		artCTypes[i].ArtCTranslation = utils.PickTranslation(
			a.ArtCTranslation,
			locale,
			func(t artCEntity.ArtCTranslation) string { return t.Locale },
			func(t *artCEntity.ArtCTranslation, l string) { t.Locale = l },
		)
	}

	var programs []entity.Program

	loc, _ := time.LoadLocation("Asia/Bangkok")
	now := time.Now().In(loc)

	repo.db.Preload("ProgramTranslation").Preload("Partners.PartnerTranslation").Preload("AddOns.AddOnTranslation").Where("is_published = ?", true).Where("published_at IS NOT NULL").Where("published_at <= ?", now).Find(&programs)
	for i, a := range programs {
		programs[i].ProgramTranslation = utils.PickTranslation(
			a.ProgramTranslation,
			locale,
			func(t entity.ProgramTranslation) string { return t.Locale },
			func(t *entity.ProgramTranslation, l string) { t.Locale = l },
		)
	}

	pageListContent.ArtCTypes = artCTypes
	pageListContent.Programs = programs

	return pageListContent, nil
}

func (repo *OrmProgramRepository) PageTagContent(locale string, tag string) (model.ProgramPageTagContent, error) {
	var pageTagContent model.ProgramPageTagContent

	var artCTypes []artCEntity.ArtCType
	repo.db.Preload("ArtCTranslation", "art_c_category_id IS NULL").Find(&artCTypes)
	for i, a := range artCTypes {
		artCTypes[i].ArtCTranslation = utils.PickTranslation(
			a.ArtCTranslation,
			locale,
			func(t artCEntity.ArtCTranslation) string { return t.Locale },
			func(t *artCEntity.ArtCTranslation, l string) { t.Locale = l },
		)
	}

	var programs []entity.Program

	loc, _ := time.LoadLocation("Asia/Bangkok")
	now := time.Now().In(loc)

	repo.db.Joins("JOIN program_translations ON program_translations.program_id = programs.id").
		Where("program_translations.tags LIKE ?", "%"+tag+"%").
		Where("tags LIKE ?", "%"+tag+"%").
		Where("is_published = ?", true).
		Where("published_at IS NOT NULL").
		Where("published_at <= ?", now).
		Preload("ProgramTranslation").
		Find(&programs)
	for i, a := range programs {
		programs[i].ProgramTranslation = utils.PickTranslation(
			a.ProgramTranslation,
			locale,
			func(t entity.ProgramTranslation) string { return t.Locale },
			func(t *entity.ProgramTranslation, l string) { t.Locale = l },
		)
	}

	var addOns []addOnEntity.AddOn
	repo.db.Joins("JOIN add_on_translations ON add_on_translations.add_on_id = add_ons.id").
		Where("add_on_translations.tags LIKE ?", "%"+tag+"%").
		Where("tags LIKE ?", "%"+tag+"%").
		Where("is_published = ?", true).
		Where("published_at IS NOT NULL").
		Where("published_at <= ?", now).
		Preload("AddOnTranslation").
		Find(&addOns)
	for i, a := range addOns {
		addOns[i].AddOnTranslation = utils.PickTranslation(
			a.AddOnTranslation,
			locale,
			func(t addOnEntity.AddOnTranslation) string { return t.Locale },
			func(t *addOnEntity.AddOnTranslation, l string) { t.Locale = l },
		)
	}

	pageTagContent.ArtCTypes = artCTypes
	pageTagContent.Programs = programs
	pageTagContent.AddOns = addOns

	return pageTagContent, nil
}
