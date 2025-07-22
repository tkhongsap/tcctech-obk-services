package adapter

import (
	"errors"
	"time"
	_ "time/tzdata"

	"example.com/art-culture-api/domain/add_ons/entity"
	"example.com/art-culture-api/domain/add_ons/model"
	"example.com/art-culture-api/domain/common/utils"
	partnerEntity "example.com/art-culture-api/domain/partners/entity"
	programEntity "example.com/art-culture-api/domain/programs/entity"
	"gorm.io/gorm"
)

type OrmAddOnRepository struct {
	db *gorm.DB
}

func NewOrmAddOnRepository(db *gorm.DB) *OrmAddOnRepository {
	return &OrmAddOnRepository{
		db: db,
	}
}

func (repo *OrmAddOnRepository) FindAll(locale string) ([]entity.AddOn, error) {
	var addOns []entity.AddOn

	var result *gorm.DB
	if(locale == "all") {
		result = repo.db.Preload("AddOnTranslation").Preload("Partners.PartnerTranslation").Find(&addOns)
	} else {
		result = repo.db.Preload("AddOnTranslation", "locale = ?", locale).Preload("Partners.PartnerTranslation", "locale = ?", locale).Find(&addOns)
	}
	
	if result.Error != nil {
		return []entity.AddOn{}, result.Error
	}

	return addOns, nil
}

func (repo *OrmAddOnRepository) FindByID(id uint, locale string) (entity.AddOn, error) {
	var addOn entity.AddOn

	var result *gorm.DB
	if(locale == "all") {
		result = repo.db.Preload("AddOnTranslation").Preload("Partners.PartnerTranslation").First(&addOn, "id = ?", id)
	} else {
		result = repo.db.Preload("AddOnTranslation", "locale = ?", locale).Preload("Partners.PartnerTranslation", "locale = ?", locale).First(&addOn, "id = ?", id)
	}

	if result.Error != nil {
		return entity.AddOn{}, result.Error
	}

	return addOn, nil
}

func (repo *OrmAddOnRepository) SaveOrUpdate(addOn entity.AddOn, addOnTranslation entity.AddOnTranslation, locale string) (entity.AddOn, error) {
	for idx, partner := range addOn.Partners {
		repo.db.Preload("PartnerTranslation").First(&partner, partner.ID)
		addOn.Partners[idx] = partner
	}

	if addOn.ID == 0 {
		result := repo.db.Create(&addOn)
		if result.Error != nil {
			return entity.AddOn{}, result.Error
		}

		addOnTranslation.AddOnID = addOn.ID
		result = repo.db.Create(&addOnTranslation)
		if result.Error != nil {
			result = repo.db.Delete(&entity.AddOn{}, addOn.ID)
			return entity.AddOn{}, result.Error
		}
	} else {
		result := repo.db.Save(&addOn)
		if result.Error != nil {
			return entity.AddOn{}, result.Error
		}

		result = repo.db.Save(&addOnTranslation)
		if result.Error != nil {
			return entity.AddOn{}, result.Error
		}
	}

	findResult := repo.db.Preload("AddOnTranslation", "locale = ?", locale).Preload("Partners.PartnerTranslation", "locale = ?", locale).First(&addOn, "id = ?", addOn.ID)
	if findResult.Error != nil {
		return entity.AddOn{}, findResult.Error
	}

	return addOn, nil
}

func (repo *OrmAddOnRepository) DeleteByID(id uint) error {
	var addOn entity.AddOn
	result := repo.db.Preload("Partners").First(&addOn, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}

	repo.db.Model(&addOn).Association("Partners").Clear()
	repo.db.Where("add_on_id = ?", id).Delete(&entity.AddOnTranslation{})
	result = repo.db.Delete(&entity.AddOn{}, id)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (repo *OrmAddOnRepository) FindPartners(partners []partnerEntity.Partner) ([]partnerEntity.Partner, error) {
	partnersID := make([]uint, len(partners))
	for i, partner := range partners {
		partnersID[i] = partner.ID
	}

	var findPartners []partnerEntity.Partner
	result := repo.db.Where("id IN ?", partnersID).Find(&findPartners)

	if result.Error != nil || len(findPartners) == 0 {
		return []partnerEntity.Partner{}, errors.New("partners not found")
	}

	return findPartners, nil
}

func (repo *OrmAddOnRepository) ClearAddOnPartners(addOn entity.AddOn) (entity.AddOn, error) {
	err := repo.db.Model(&addOn).Association("Partners").Clear()
	if err != nil {
		return entity.AddOn{}, err
	}

	return addOn, nil
}

func (repo *OrmAddOnRepository) PageContent(programId uint, id uint, locale string) (model.AddOnPageContent, error) {
	var pageContent model.AddOnPageContent
	
	loc, _ := time.LoadLocation("Asia/Bangkok")
	now := time.Now().In(loc)

	var program programEntity.Program
	var addOnsId []uint
	if programId != 0 {
		repo.db.Preload("ProgramTranslation").Preload("AddOns").First(&program, "id = ?", programId)
		for _, addOn := range program.AddOns {
			if addOn.ID != id {
				addOnsId = append(addOnsId, addOn.ID)
			}
		}
	}

	var addOn entity.AddOn
	repo.db.Preload("AddOnTranslation").Preload("Partners.PartnerTranslation").First(&addOn, "id = ?", id)
	addOn.AddOnTranslation = utils.PickTranslation(
		addOn.AddOnTranslation,
		locale,
		func(t entity.AddOnTranslation) string { return t.Locale },
		func(t *entity.AddOnTranslation, l string) { t.Locale = l },
	)

	for i, a := range addOn.Partners {
		addOn.Partners[i].PartnerTranslation = utils.PickTranslation(
			a.PartnerTranslation,
			locale,
			func(t partnerEntity.PartnerTranslation) string { return t.Locale },
			func(t *partnerEntity.PartnerTranslation, l string) { t.Locale = l },
		)
	}

	var relateAddOns []entity.AddOn
	if programId != 0 {
		repo.db.Preload("AddOnTranslation").Preload("Partners.PartnerTranslation").Where("is_published = ?", true).Where("published_at IS NOT NULL").Where("published_at <= ?", now).Where("id IN ?", addOnsId).Find(&relateAddOns)
		for i, a := range relateAddOns {
			relateAddOns[i].AddOnTranslation = utils.PickTranslation(
				a.AddOnTranslation,
				locale,
				func(t entity.AddOnTranslation) string { return t.Locale },
				func(t *entity.AddOnTranslation, l string) { t.Locale = l },
			)
		}
	} else {
		relateAddOns = []entity.AddOn{}
	}

	var relatePrograms []programEntity.Program
	if programId != 0 {
		repo.db.Preload("ProgramTranslation").Preload("Partners.PartnerTranslation").Preload("AddOns.AddOnTranslation").Where("id != ?", program.ID).Where("art_c_type_id = ?", program.ArtCTypeID).Where("is_published = ?", true).Where("published_at IS NOT NULL").Where("published_at <= ?", now).Find(&relatePrograms)
		for i, a := range relatePrograms {
			relatePrograms[i].ProgramTranslation = utils.PickTranslation(
				a.ProgramTranslation,
				locale,
				func(t programEntity.ProgramTranslation) string { return t.Locale },
				func(t *programEntity.ProgramTranslation, l string) { t.Locale = l },
			)
		}

		for _, program := range relatePrograms {
			if(program.PeriodEnd != nil) {
				if(program.PeriodEnd.After(now)) {
					relatePrograms = append(relatePrograms, program)
				}
			} else {
				relatePrograms = append(relatePrograms, program)
			}
		}
	} else {
		relatePrograms = []programEntity.Program{}
	}

	pageContent.AddOn = addOn
	pageContent.RelateAddOns = relateAddOns
	pageContent.RelatePrograms = relatePrograms

	return pageContent, nil
}
