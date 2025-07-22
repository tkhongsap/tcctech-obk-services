package repo

import (
	"context"
	"time"

	"example.com/art-culture-api/domain/booking/adapter/session"
	"example.com/art-culture-api/domain/booking/entity"
	"gorm.io/gorm"
)

type OrmBookingTxRepository struct {
	db *gorm.DB
}

func NewOrmBookingTxRepository(db *gorm.DB) *OrmBookingTxRepository {
	return &OrmBookingTxRepository{
		db: db,
	}
}

func (repo *OrmBookingTxRepository) FindAllByUserID(
	ctx context.Context,
	locale string,
	preloadFields []string,
	filterFields map[string]any,
	time time.Time,
	userID string,
) ([]entity.BookingTx, error) {
	var bookingTxs []entity.BookingTx

	db := session.DB(ctx, repo.db).WithContext(ctx)

	var filteredByShowingStatus bool
	for k, v := range filterFields {
		if k == "showingStatus" {
			if v == "upcoming" {
				filteredByShowingStatus = true
				db = db.InnerJoins("BookingSlotTime").Where("end_slot_time < ?", time).Preload("BookingSlotDate")
			} else if v == "past" {
				filteredByShowingStatus = true
				db = db.InnerJoins("BookingSlotTime").Where("end_slot_time >= ?", time).Preload("BookingSlotDate")
			}
		}
	}

	if !filteredByShowingStatus {
		db = db.Preload("BookingSlotDate").Preload("BookingSlotTime")
	}

	for _, v := range preloadFields {
		if v == "program" {
			var locales []string
			if locale != "en" {
				locales = append(locales, "en", locale)
			} else {
				locales = append(locales, locale)
			}
			db = db.Preload("Program.ProgramTranslation", "locale IN ?", locales)
		}
	}

	db = db.Preload("BookingSetting")

	if err := db.Where("user_id = ?", userID).Find(&bookingTxs).Error; err != nil {
		return []entity.BookingTx{}, err
	}

	return bookingTxs, nil
}

func (repo *OrmBookingTxRepository) FindAllByProgramIDOrBookerNameOrBookerEmailOrBookingSlotTimeID(
	ctx context.Context,
	programID *uint,
	bookerName *string,
	bookerEmail *string,
	bookingSlotTimeID *string,
) ([]entity.BookingTx, error) {
	var bookingTxs []entity.BookingTx

	db := session.DB(ctx, repo.db).WithContext(ctx)

	db = db.Preload("BookingSlotDate").Preload("BookingSlotTime")
	if programID != nil {
		db = db.Where("program_id = ?", *programID)
	}
	if bookerName != nil {
		db = db.Where("booker_name LIKE ?", "%"+*bookerName+"%")
	}
	if bookerEmail != nil {
		db = db.Where("booker_email LIKE ?", "%"+*bookerEmail+"%")
	}
	if bookingSlotTimeID != nil {
		db = db.Where("booking_slot_time_id = ?", *bookingSlotTimeID)
	}

	if err := db.Find(&bookingTxs).Error; err != nil {
		return []entity.BookingTx{}, err
	}

	return bookingTxs, nil
}

func (repo *OrmBookingTxRepository) FindByID(ctx context.Context, id string, locale string) (entity.BookingTx, error) {
	var bookingTx entity.BookingTx

	db := session.DB(ctx, repo.db).WithContext(ctx)

	var locales []string
	if locale != "en" {
		locales = append(locales, "en", locale)
	} else {
		locales = append(locales, locale)
	}

	err := db.Preload("BookingSetting").Preload("BookingSlotDate").Preload("BookingSlotTime").Preload("BookingTickets").
		Preload("Program.ProgramTranslation", "locale IN (?)", locales).First(&bookingTx, "id = ?", id).Error
	if err != nil {
		return entity.BookingTx{}, err
	}

	return bookingTx, nil
}

func (repo *OrmBookingTxRepository) CountByBookingSlotDateIDs(
	ctx context.Context,
	bookingSlotDateIDs []string,
) (int64, error) {
	var count int64

	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Model(&entity.BookingTx{}).Where("booking_slot_date_id IN ?", bookingSlotDateIDs).
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (repo *OrmBookingTxRepository) CountByBookingSlotTimeIDs(
	ctx context.Context,
	bookingSlotTimeIDs []string,
) (int64, error) {
	var count int64

	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Model(&entity.BookingTx{}).Where("booking_slot_time_id IN ?", bookingSlotTimeIDs).
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (repo *OrmBookingTxRepository) CountByBookingSettingIDs(
	ctx context.Context,
	bookingSettingIDs []string,
) (int64, error) {
	var count int64

	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Model(&entity.BookingTx{}).Where("booking_setting_id IN ?", bookingSettingIDs).
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (repo *OrmBookingTxRepository) Insert(ctx context.Context, bookingTx entity.BookingTx) (entity.BookingTx, error) {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Create(&bookingTx).Error; err != nil {
		return entity.BookingTx{}, err
	}
	return bookingTx, nil
}
