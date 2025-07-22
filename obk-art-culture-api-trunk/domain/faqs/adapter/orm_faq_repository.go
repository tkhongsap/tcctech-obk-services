package adapter

import (
	"time"
	_ "time/tzdata"

	"example.com/art-culture-api/domain/common/utils"
	"example.com/art-culture-api/domain/faqs/entity"
	"gorm.io/gorm"
)

type OrmFaqRepository struct {
	db *gorm.DB
}

func NewOrmFaqRepository(db *gorm.DB) *OrmFaqRepository {
	return &OrmFaqRepository{
		db: db,
	}
}

func (repo *OrmFaqRepository) FindAll(locale string) ([]entity.Faq, error) {
	var faqs []entity.Faq

	var result *gorm.DB
	if(locale == "all") {
		result = repo.db.Preload("FaqTranslation").Order("order_no asc").Find(&faqs)	
	} else {
		result = repo.db.Preload("FaqTranslation", "locale = ?", locale).Order("order_no asc").Find(&faqs)
	}
	
	if result.Error != nil {
		return []entity.Faq{}, result.Error
	}

	return faqs, nil
}

func (repo *OrmFaqRepository) FindByID(id uint, locale string) (entity.Faq, error) {
	var faqContent entity.Faq

	var result *gorm.DB
	if(locale == "all") {
		result = repo.db.Preload("FaqTranslation").First(&faqContent, "id = ?", id)
	} else {
		result = repo.db.Preload("FaqTranslation", "locale = ?", locale).First(&faqContent, "id = ?", id)
	}
	
	if result.Error != nil {
		return entity.Faq{}, result.Error
	}

	return faqContent, nil
}

func (repo *OrmFaqRepository) SaveOrUpdate(faq entity.Faq, faqTranslation entity.FaqTranslation, locale string) (entity.Faq, error) {
	if faq.ID == 0 {
		result := repo.db.Create(&faq)
		if result.Error != nil {
			return entity.Faq{}, result.Error
		}

		faq.OrderNo = faq.ID
		result = repo.db.Save(&faq)
		if result.Error != nil {
			return entity.Faq{}, result.Error
		}

		faqTranslation.FaqID = faq.ID
		result = repo.db.Create(&faqTranslation)
		if result.Error != nil {
			result = repo.db.Delete(&entity.Faq{}, faq.ID)
			return entity.Faq{}, result.Error
		}
	} else {
		result := repo.db.Save(&faq)
		if result.Error != nil {
			return entity.Faq{}, result.Error
		}

		result = repo.db.Save(&faqTranslation)
		if result.Error != nil {
			return entity.Faq{}, result.Error
		}
	}

	findResult := repo.db.Preload("FaqTranslation", "locale = ?", faqTranslation.Locale).First(&faq, "id = ?", faq.ID)
	if findResult.Error != nil {
		return entity.Faq{}, findResult.Error
	}

	return faq, nil
}

func (repo *OrmFaqRepository) DeleteByID(id uint) error {
	repo.db.Where("faq_id = ?", id).Delete(&entity.FaqTranslation{})
	result := repo.db.Delete(&entity.Faq{}, id)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (repo *OrmFaqRepository) OrderItems(ids []uint) error {
	for index, id := range ids {
		var faq entity.Faq
		result := repo.db.First(&faq, "id = ?", id)
		if result.Error != nil {
			return result.Error
		}

		faq.OrderNo = uint(index + 1)
		result = repo.db.Save(&faq)
		if result.Error != nil {
			return result.Error
		}
	}
	
	return nil
}

func (repo *OrmFaqRepository) PageContent(locale string) ([]entity.Faq, error) {
	var faqs []entity.Faq
	
	var result *gorm.DB
	
	loc, _ := time.LoadLocation("Asia/Bangkok")
	now := time.Now().In(loc)
	
	result = repo.db.Preload("FaqTranslation").Where("is_published = ?", true).Where("published_at IS NOT NULL").Where("published_at <= ?", now).Order("order_no asc").Find(&faqs)
	
	if result.Error != nil {
		return []entity.Faq{}, result.Error
	}

	for i, a := range faqs {
		faqs[i].FaqTranslation = utils.PickTranslation(
			a.FaqTranslation,
			locale,
			func(t entity.FaqTranslation) string { return t.Locale },
			func(t *entity.FaqTranslation, l string) { t.Locale = l },
		)
	}

	return faqs, nil
}
