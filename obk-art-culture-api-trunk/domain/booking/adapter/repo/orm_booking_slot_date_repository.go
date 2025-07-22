package repo

import (
	"context"
	"math"
	"time"

	"example.com/art-culture-api/domain/booking/adapter/session"
	"example.com/art-culture-api/domain/booking/entity"
	"example.com/art-culture-api/pkg"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OrmBookingSlotDateRepository struct {
	db *gorm.DB
}

func NewOrmBookingSlotDateRepository(db *gorm.DB) *OrmBookingSlotDateRepository {
	return &OrmBookingSlotDateRepository{
		db: db,
	}
}

func (repo *OrmBookingSlotDateRepository) FindByID(ctx context.Context, id string) (entity.BookingSlotDate, error) {
	var bookingSlotDate entity.BookingSlotDate

	db := session.DB(ctx, repo.db).WithContext(ctx)

	err := db.First(&bookingSlotDate, "id = ?", id).Error
	if err != nil {
		return entity.BookingSlotDate{}, err
	}

	return bookingSlotDate, nil
}

func (repo *OrmBookingSlotDateRepository) FindByIDWithBookingSlotTimes(
	ctx context.Context,
	id string,
) (entity.BookingSlotDate, error) {
	var bookingSlotDate entity.BookingSlotDate

	db := session.DB(ctx, repo.db).WithContext(ctx)

	err := db.Preload("BookingSlotTimes", func(db *gorm.DB) *gorm.DB {
		return db.Order("booking_slot_times.begin_slot_time ASC")
	}).First(&bookingSlotDate, "id = ?", id).Error
	if err != nil {
		return entity.BookingSlotDate{}, err
	}

	return bookingSlotDate, nil
}

func (repo *OrmBookingSlotDateRepository) BulkUpsert(
	ctx context.Context,
	bookingSlotDates []entity.BookingSlotDate,
) ([]entity.BookingSlotDate, error) {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Clauses(clause.OnConflict{UpdateAll: true}).Create(&bookingSlotDates).Error; err != nil {
		return []entity.BookingSlotDate{}, err
	}
	return bookingSlotDates, nil
}

func (repo *OrmBookingSlotDateRepository) BulkDelete(
	ctx context.Context,
	bookingSlotDates []entity.BookingSlotDate,
) ([]entity.BookingSlotDate, error) {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Delete(&bookingSlotDates).Error; err != nil {
		return []entity.BookingSlotDate{}, err
	}
	return bookingSlotDates, nil
}

func (repo *OrmBookingSlotDateRepository) FindAllByBookingSettingIDWithBookingSlotTimes(
	ctx context.Context,
	bookingSettingID string,
) ([]entity.BookingSlotDate, error) {
	var bookingSlotDates []entity.BookingSlotDate

	db := session.DB(ctx, repo.db).WithContext(ctx)

	err := db.Preload("BookingSlotTimes").Where("booking_setting_id = ?", bookingSettingID).Find(&bookingSlotDates).Error
	if err != nil {
		return []entity.BookingSlotDate{}, err
	}

	return bookingSlotDates, nil
}

func (repo *OrmBookingSlotDateRepository) DeleteAllByBookingSettingID(
	ctx context.Context,
	bookingSettingID string,
) error {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Where("booking_setting_id = ?", bookingSettingID).Delete(&entity.BookingSlotDate{}).Error; err != nil {
		return err
	}
	return nil
}

func (repo *OrmBookingSlotDateRepository) FindAllWithPagination(
	ctx context.Context,
	pagination pkg.Pagination,
	filterFields map[string]any,
	currentDate time.Time,
) ([]entity.BookingSlotDate, *pkg.Pagination, error) {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	pagination.Sort = "updated_at desc"
	paginateFn := func(db *gorm.DB) *gorm.DB {
		return db.Offset(pagination.GetOffset()).Limit(pagination.GetLimit()).Order(pagination.GetSort())
	}

	var filteredByBeginDate bool
	var filteredByEndDate bool
	var filteredByStatus bool
	var filteredByBookingSettingID bool
	for k := range filterFields {
		if k == "beginDate" {
			filteredByBeginDate = true
		}
		if k == "endDate" {
			filteredByEndDate = true
		}
		if k == "status" {
			filteredByStatus = true
		}
		if k == "bookingSettingId" {
			filteredByBookingSettingID = true
		}
	}

	var isWaitingStatus bool
	var isOnGoingStatus bool
	var isCompletedStatus bool
	var isSoldOutStatus bool
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

	var query *gorm.DB = db.Model(&entity.BookingSlotDate{})

	if filteredByBeginDate {
		if endDate, ok := filterFields["beginDate"].(time.Time); ok {
			query = query.Where("slot_date >= ?", endDate)
		}
	}

	if filteredByEndDate {
		if endDate, ok := filterFields["endDate"].(time.Time); ok {
			query = query.Where("slot_date <= ?", endDate)
		}
	}

	var hasJoinedBookingSetting bool
	if filteredByBookingSettingID {
		if bookingSettingID, ok := filterFields["bookingSettingId"].(string); ok {
			query = query.InnerJoins(
				"BookingSetting",
				db.Where(&entity.BookingSetting{ID: bookingSettingID}).Session(&gorm.Session{}),
			)
			hasJoinedBookingSetting = true
		}
	}

	if isWaitingStatus {
		if !hasJoinedBookingSetting {
			query = query.InnerJoins("BookingSetting")
			hasJoinedBookingSetting = true
		}
		query = query.Where(
			"? < open_booking_time OR (? > close_booking_time AND ? <= slot_date)",
			currentDate, currentDate, currentDate,
		).Joins(
			"INNER JOIN booking_slot_times ON booking_slot_times.booking_slot_date_id = booking_slot_dates.id AND status = ?",
			entity.BookingSlotTimeAvailable,
		)
	}

	if isOnGoingStatus {
		if !hasJoinedBookingSetting {
			query = query.InnerJoins("BookingSetting")
			hasJoinedBookingSetting = true
		}
		query = query.Where(
			"? >= open_booking_time AND ? <= close_booking_time AND ? <= slot_date",
			currentDate, currentDate, currentDate,
		).Joins(
			"INNER JOIN booking_slot_times ON booking_slot_times.booking_slot_date_id = booking_slot_dates.id AND status = ?",
			entity.BookingSlotTimeAvailable,
		)
	}

	if isCompletedStatus {
		if !hasJoinedBookingSetting {
			query = query.InnerJoins("BookingSetting")
			hasJoinedBookingSetting = true
		}
		query = query.Where(
			"? > begin_slot_time",
			currentDate,
		).Joins(
			"INNER JOIN booking_slot_times ON booking_slot_times.booking_slot_date_id = booking_slot_dates.id",
		)
	}

	if isSoldOutStatus {
		if !hasJoinedBookingSetting {
			query = query.InnerJoins("BookingSetting")
		}
		query = query.Where(
			"? < begin_slot_time",
			currentDate,
		).Joins(
			"INNER JOIN booking_slot_times ON booking_slot_times.booking_slot_date_id = booking_slot_dates.id AND status = ?",
			entity.BookingSlotTimeSoldOut,
		)
	}

	mainQuery := db.Table("(?)", query).Select("DISTINCT *")
	countQuery := db.Table("(?)", mainQuery).Select("COUNT(*)")

	var totalRecords int64
	if err := countQuery.Scan(&totalRecords).Error; err != nil {
		return []entity.BookingSlotDate{}, &pkg.Pagination{}, err
	}

	var results []entity.BookingSlotDate
	if err := mainQuery.Scopes(paginateFn).Preload("BookingSlotTimes").Find(&results).Error; err != nil {
		return []entity.BookingSlotDate{}, &pkg.Pagination{}, err
	}

	pagination.TotalRecords = totalRecords
	pagination.TotalPages = int(math.Ceil(float64(totalRecords) / float64(pagination.Limit)))

	// convert to camel case
	pagination.Sort = "updatedAt desc"

	return results, &pagination, nil
}
