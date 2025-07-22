package adapter

import (
	"example.com/art-culture-api/domain/partners/entity"
	"gorm.io/gorm"
)

type OrmPartnerRepository struct {
	db *gorm.DB
}

func NewOrmPartnerRepository(db *gorm.DB) *OrmPartnerRepository {
	return &OrmPartnerRepository{
		db: db,
	}
}

func (repo *OrmPartnerRepository) FindAll(locale string) ([]entity.Partner, error) {
	var partners []entity.Partner

	var result *gorm.DB
	if(locale == "all") {
		result = repo.db.Preload("PartnerTranslation").Find(&partners)	
	} else {
		result = repo.db.Preload("PartnerTranslation", "locale = ?", locale).Find(&partners)
	}

	if result.Error != nil {
		return []entity.Partner{}, result.Error
	}

	return partners, nil
}

func (repo *OrmPartnerRepository) FindByID(id uint, locale string) (entity.Partner, error) {
	var partner entity.Partner
	
	var result *gorm.DB
	if(locale == "all") {
		result = repo.db.Preload("PartnerTranslation").First(&partner, "id = ?", id)
	} else {
		result = repo.db.Preload("PartnerTranslation", "locale = ?", locale).First(&partner, "id = ?", id)
	}
	
	if result.Error != nil {
		return entity.Partner{}, result.Error
	}

	return partner, nil
}

func (repo *OrmPartnerRepository) SaveOrUpdate(partner entity.Partner, partnerTranslation entity.PartnerTranslation, locale string) (entity.Partner, error) {
	if partner.ID == 0 {
		result := repo.db.Create(&partner)
		if result.Error != nil {
			return entity.Partner{}, result.Error
		}

		partnerTranslation.PartnerID = partner.ID
		result = repo.db.Create(&partnerTranslation)
		if result.Error != nil {
			result = repo.db.Delete(&entity.Partner{}, partner.ID)
			return entity.Partner{}, result.Error
		}
	} else {
		result := repo.db.Save(&partner)
		if result.Error != nil {
			return entity.Partner{}, result.Error
		}

		result = repo.db.Save(&partnerTranslation)
		if result.Error != nil {
			return entity.Partner{}, result.Error
		}
	}

	findResult := repo.db.Preload("PartnerTranslation", "locale = ?", partnerTranslation.Locale).First(&partner, "id = ?", partner.ID)
	if findResult.Error != nil {
		return entity.Partner{}, findResult.Error
	}

	return partner, nil
}

func (repo *OrmPartnerRepository) DeleteByID(id uint) error {
	repo.db.Where("partner_id = ?", id).Delete(&entity.PartnerTranslation{})
	result := repo.db.Delete(&entity.Partner{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
