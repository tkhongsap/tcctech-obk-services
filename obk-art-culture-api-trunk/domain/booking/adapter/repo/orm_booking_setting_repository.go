package repo

import (
	"context"
	"math"
	"time"

	"example.com/art-culture-api/domain/booking/adapter/session"
	"example.com/art-culture-api/domain/booking/entity"
	"example.com/art-culture-api/pkg"
	"gorm.io/gorm"
)

type OrmBookingSettingRepository struct {
	db *gorm.DB
}

func NewOrmBookingSettingRepository(db *gorm.DB) *OrmBookingSettingRepository {
	return &OrmBookingSettingRepository{
		db: db,
	}
}

func (repo *OrmBookingSettingRepository) FindByIDWithBookingSlotDatesAndBookingSlotTimes(
	ctx context.Context,
	id string,
) (entity.BookingSetting, error) {
	var bookingSetting entity.BookingSetting

	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Preload("BookingSlotDates.BookingSlotTimes").First(&bookingSetting, "id = ?", id).Error; err != nil {
		return entity.BookingSetting{}, err
	}
	return bookingSetting, nil
}

func (repo *OrmBookingSettingRepository) FindByProgramIDWithLocaleAndPreloadFields(
	ctx context.Context,
	locale string,
	programID uint,
	minDate *time.Time,
	preloadFields []string,
) (entity.BookingSetting, error) {
	var bookingSetting entity.BookingSetting

	db := session.DB(ctx, repo.db).WithContext(ctx)

	for _, v := range preloadFields {
		if v == "bookingSlotTimes" {
			db = db.Preload("BookingSlotDates.BookingSlotTimes")
		} else if v == "bookingSlotDates" {
			db = db.Preload("BookingSlotDates", func(db *gorm.DB) *gorm.DB {
				if minDate != nil {
					return db.Where("slot_date >= ?", &minDate).Order("booking_slot_dates.slot_date ASC")
				}
				return db.Order("booking_slot_dates.slot_date ASC")
			})
		}
		if v == "program" {
			if locale == "all" {
				db = db.Preload("Program.ProgramTranslation")
			} else {
				var locales []string
				if locale != "en" {
					locales = append(locales, "en", locale)
				} else {
					locales = append(locales, locale)
				}

				db = db.Preload("Program.ProgramTranslation", "locale IN (?)", locales)
			}
		}
	}

	if err := db.First(&bookingSetting, "program_id = ?", programID).Error; err != nil {
		return entity.BookingSetting{}, err
	}

	return bookingSetting, nil
}

func (repo *OrmBookingSettingRepository) FindByProgramID(
	ctx context.Context,
	programID uint,
) (entity.BookingSetting, error) {
	var bookingSetting entity.BookingSetting

	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.First(&bookingSetting, "program_id = ?", programID).Error; err != nil {
		return entity.BookingSetting{}, err
	}

	return bookingSetting, nil
}

func (repo *OrmBookingSettingRepository) Insert(
	ctx context.Context,
	bookingSetting entity.BookingSetting,
) (entity.BookingSetting, error) {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Create(&bookingSetting).Error; err != nil {
		return entity.BookingSetting{}, err
	}

	return bookingSetting, nil
}

func (repo *OrmBookingSettingRepository) UpdateByIDWithSelectedFields(
	ctx context.Context,
	id string,
	fields []string,
	m map[string]any,
) error {
	var bookingSetting entity.BookingSetting

	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Model(&bookingSetting).Select(fields).Where("id = ?", id).Updates(m).Error; err != nil {
		return err
	}

	return nil
}

func (repo *OrmBookingSettingRepository) DeleteByID(ctx context.Context, id string) error {
	db := session.DB(ctx, repo.db).WithContext(ctx)
	return db.Delete(&entity.BookingSetting{}, "id = ?", id).Error
}

func (repo *OrmBookingSettingRepository) FindAllWithPagination(
	ctx context.Context,
	locale string,
	pagination pkg.Pagination,
	filterFields map[string]any,
	currentDate time.Time,
) ([]entity.BookingSettingPagination, *pkg.Pagination, error) {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	pagination.Sort = "updated_at desc"
	paginateFn := func(db *gorm.DB) *gorm.DB {
		return db.Offset(pagination.GetOffset()).Limit(pagination.GetLimit()).Order("bs.id")
	}

	var filteredByProgramTitle, filteredByBeginDate, filteredByEndDate, filteredByStatus bool
	for k, _ := range filterFields {
		if k == "programTitle" {
			filteredByProgramTitle = true
		}
		if k == "beginDate" {
			filteredByBeginDate = true
		}
		if k == "endDate" {
			filteredByEndDate = true
		}
		if k == "status" {
			filteredByStatus = true
		}
	}

	var isWaitingStatus, isOnGoingStatus, isCompletedStatus, isSoldOutStatus bool
	if filteredByStatus {
		if status, ok := filterFields["status"].(string); ok {
			switch status {
			case "waiting":
				isWaitingStatus = true
			case "on_going":
				isOnGoingStatus = true
			case "completed":
				isCompletedStatus = true
			case "sold_out":
				isSoldOutStatus = true
			}
		}
	}

	var query *gorm.DB
	if isSoldOutStatus {
		query = db.Table("booking_settings bs").
			Select(`DISTINCT ON (bs.id) bs.id, bs.program_id, p.art_c_type_id, p.art_c_category_id, bs.ticket_price, 
                bs.open_booking_time, bs.close_booking_time, pt.title AS program_title, pt.locations AS program_locations, 
                p.period_at AS program_period_at, p.period_end AS program_period_end, pt.locale AS program_locale, 
                COUNT(bt.id) AS booked_count, 
                SUM(bst.max_tickets_per_slot_time) AS total_max_tickets_per_slot_time,
				COUNT(CASE WHEN bt.status = 'checked_in' THEN 1 END) AS total_checked_in, bs.updated_at`).
			Joins("LEFT JOIN programs p ON bs.program_id = p.id").
			Joins("LEFT JOIN program_translations pt ON p.id = pt.program_id").
			Joins("LEFT JOIN booking_slot_dates bsd ON bsd.booking_setting_id = bs.id AND bsd.program_id = p.id").
			Joins("LEFT JOIN booking_slot_times bst ON bst.program_id = p.id AND bst.booking_setting_id = bs.id AND bst.booking_slot_date_id = bsd.id").
			Joins("LEFT JOIN booking_transactions btx ON btx.program_id = p.id AND btx.booking_setting_id = bs.id AND btx.booking_slot_date_id = bsd.id AND btx.booking_slot_time_id = bst.id").
			Joins("LEFT JOIN booking_tickets bt ON bt.program_id = p.id AND bt.booking_setting_id = bs.id AND bt.booking_transaction_id = btx.id")
	} else if isWaitingStatus || isOnGoingStatus {
		query = db.Table("booking_settings bs").
			Select(`DISTINCT ON (bs.id) bs.id, bs.program_id, p.art_c_type_id, p.art_c_category_id, bs.ticket_price, 
                bs.open_booking_time, bs.close_booking_time, pt.title AS program_title, pt.locations AS program_locations, 
                p.period_at AS program_period_at, p.period_end AS program_period_end, pt.locale AS program_locale, 
                COUNT(bt.id) AS booked_count, 
                SUM(bst.max_tickets_per_slot_time) AS total_max_tickets_per_slot_time,
				COUNT(CASE WHEN bt.status = 'checked_in' THEN 1 END) AS total_checked_in, bs.updated_at`).
			Joins("LEFT JOIN programs p ON bs.program_id = p.id").
			Joins("LEFT JOIN program_translations pt ON p.id = pt.program_id").
			Joins("LEFT JOIN booking_slot_dates bsd ON bsd.booking_setting_id = bs.id AND bsd.program_id = p.id").
			Joins("LEFT JOIN booking_slot_times bst ON bst.program_id = p.id AND bst.booking_setting_id = bs.id AND bst.booking_slot_date_id = bsd.id").
			Joins("LEFT JOIN booking_transactions btx ON btx.program_id = p.id AND btx.booking_setting_id = bs.id AND btx.booking_slot_date_id = bsd.id AND btx.booking_slot_time_id = bst.id").
			Joins("LEFT JOIN booking_tickets bt ON bt.program_id = p.id AND bt.booking_setting_id = bs.id AND bt.booking_transaction_id = btx.id")
	} else {
		// TODO: remove booking_slot_dates, booking_slot_times and booking_transactions LEFT JOINS
		query = db.Table("booking_settings bs").
			Select(`DISTINCT ON (bs.id) bs.id, bs.program_id, p.art_c_type_id, p.art_c_category_id, bs.ticket_price, 
                bs.open_booking_time, bs.close_booking_time, pt.title AS program_title, pt.locations AS program_locations, 
                p.period_at AS program_period_at, p.period_end AS program_period_end, pt.locale AS program_locale, 
                COUNT(bt.id) AS booked_count, 
                SUM(bst.max_tickets_per_slot_time) AS total_max_tickets_per_slot_time, 
				COUNT(CASE WHEN bt.status = 'checked_in' THEN 1 END) AS total_checked_in, bs.updated_at`).
			Joins("LEFT JOIN programs p ON bs.program_id = p.id").
			Joins("LEFT JOIN program_translations pt ON p.id = pt.program_id").
			Joins("LEFT JOIN booking_slot_dates bsd ON bsd.booking_setting_id = bs.id AND bsd.program_id = p.id").
			Joins("LEFT JOIN booking_slot_times bst ON bst.program_id = p.id AND bst.booking_setting_id = bs.id AND bst.booking_slot_date_id = bsd.id").
			Joins("LEFT JOIN booking_transactions btx ON btx.program_id = p.id AND btx.booking_setting_id = bs.id AND btx.booking_slot_date_id = bsd.id AND btx.booking_slot_time_id = bst.id").
			Joins("LEFT JOIN booking_tickets bt ON bt.program_id = p.id AND bt.booking_setting_id = bs.id AND bt.booking_transaction_id = btx.id")
	}

	if filteredByProgramTitle {
		if programTitle, ok := filterFields["programTitle"].(string); ok {
			query = query.Where("LOWER(pt.title) LIKE LOWER(?)", "%"+programTitle+"%")
		}
	}

	if filteredByBeginDate {
		if endDate, ok := filterFields["beginDate"].(time.Time); ok {
			query = query.Where("bsd.slot_date >= ?", endDate)
		}
	}

	if filteredByEndDate {
		if endDate, ok := filterFields["endDate"].(time.Time); ok {
			query = query.Where("bsd.slot_date <= ?", endDate)
		}
	}

	if isWaitingStatus {
		query = query.Where(
			"bst.status = ? AND (? < bs.open_booking_time OR (? > bs.close_booking_time AND ? <= bsd.slot_date))",
			entity.BookingSlotTimeAvailable, currentDate, currentDate, currentDate,
		)
	}

	if isOnGoingStatus {
		query = query.Where(
			"bst.status = ? AND ? >= bs.open_booking_time AND ? <= bs.close_booking_time AND ? <= bsd.slot_date",
			entity.BookingSlotTimeAvailable, currentDate, currentDate, currentDate,
		)
	}

	if isCompletedStatus {
		query = query.Where("? > bst.begin_slot_time", currentDate)
	}

	if isSoldOutStatus { // final clause for sold out condition
		query = query.Where(
			"bst.status = ? AND ? < bst.begin_slot_time",
			entity.BookingSlotTimeSoldOut, currentDate,
		)
	}

	// End of optional query statement
	query = query.Where("pt.locale = ?", locale).Group("bs.id, bs.program_id, p.art_c_type_id, p.art_c_category_id, bs.ticket_price, bs.open_booking_time, bs.close_booking_time, pt.title, pt.locations, p.period_at, p.period_end, pt.locale")

	var totalRecords int64
	if err := query.Count(&totalRecords).Error; err != nil {
		return []entity.BookingSettingPagination{}, &pkg.Pagination{}, err
	}

	var results []entity.BookingSettingPagination
	if err := db.Table("(?)", query.Scopes(paginateFn)).Order(pagination.GetSort()).Find(&results).Error; err != nil {
		return []entity.BookingSettingPagination{}, &pkg.Pagination{}, err
	}

	pagination.TotalRecords = totalRecords
	pagination.TotalPages = int(math.Ceil(float64(totalRecords) / float64(pagination.Limit)))

	pagination.Sort = "updatedAt desc"

	return results, &pagination, nil
}

func (repo *OrmBookingSettingRepository) FindAllByProgramIDsWithBookingSlotDates(
	ctx context.Context,
	programIDs []uint,
) ([]entity.BookingSetting, error) {
	var bookingSettings []entity.BookingSetting

	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Preload("BookingSlotDates").Find(&bookingSettings, "program_id IN (?)", programIDs).Error; err != nil {
		return nil, err
	}

	return bookingSettings, nil
}
