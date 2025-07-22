package repo

import (
	"context"
	"errors"

	"example.com/art-culture-api/domain/booking/adapter/session"
	"example.com/art-culture-api/domain/booking/entity"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OrmBookingSlotTimeRepository struct {
	db *gorm.DB
}

func NewOrmBookingSlotTimeRepository(db *gorm.DB) *OrmBookingSlotTimeRepository {
	return &OrmBookingSlotTimeRepository{
		db: db,
	}
}

func (repo *OrmBookingSlotTimeRepository) FindByIDWithReadLock(
	ctx context.Context,
	id string,
) (entity.BookingSlotTime, error) {
	var bookingSlotTime entity.BookingSlotTime

	db := session.DB(ctx, repo.db).WithContext(ctx)
	err := db.Clauses(clause.Locking{Strength: "UPDATE"}).First(&bookingSlotTime, "id = ?", id).Error
	if err != nil {
		return entity.BookingSlotTime{}, err
	}

	return bookingSlotTime, nil
}

func (repo *OrmBookingSlotTimeRepository) Update(ctx context.Context, bookingSlotTime entity.BookingSlotTime) error {
	if bookingSlotTime.ID == "" {
		return errors.New("primary key is required")
	}

	db := session.DB(ctx, repo.db).WithContext(ctx)
	result := db.Save(&bookingSlotTime)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (repo *OrmBookingSlotTimeRepository) UpdateByIDWithSelectedFields(
	ctx context.Context,
	id string,
	fields []string,
	m map[string]any,
) error {
	var bookingSlotTime entity.BookingSlotTime

	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Model(&bookingSlotTime).Select(fields).Where("id = ?", id).Updates(m).Error; err != nil {
		return err
	}

	return nil
}

func (repo *OrmBookingSlotTimeRepository) BulkUpsert(
	ctx context.Context,
	bookingSlotTimes []entity.BookingSlotTime,
) ([]entity.BookingSlotTime, error) {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"begin_slot_time", "end_slot_time", "max_tickets_per_slot_time"}),
	}).Create(&bookingSlotTimes).Error; err != nil {
		return []entity.BookingSlotTime{}, err
	}
	return bookingSlotTimes, nil
}

func (repo *OrmBookingSlotTimeRepository) BulkDelete(
	ctx context.Context,
	bookingSlotTimes []entity.BookingSlotTime,
) ([]entity.BookingSlotTime, error) {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Delete(&bookingSlotTimes).Error; err != nil {
		return []entity.BookingSlotTime{}, err
	}
	return bookingSlotTimes, nil
}

func (repo *OrmBookingSlotTimeRepository) FindAllByTuplesOfProgramIDAndBookingSettingIDAndBookingSlotDateID(
	ctx context.Context,
	tuples [][]interface{},
) ([]entity.BookingSlotTime, error) {
	var bookingSlotTimes []entity.BookingSlotTime

	db := session.DB(ctx, repo.db).WithContext(ctx)

	err := db.Where("(program_id, booking_setting_id, booking_slot_date_id) IN (?)", tuples).Find(&bookingSlotTimes).Error
	if err != nil {
		return []entity.BookingSlotTime{}, err
	}

	return bookingSlotTimes, nil
}

func (repo *OrmBookingSlotTimeRepository) DeleteAllByBookingSettingID(
	ctx context.Context,
	bookingSettingID string,
) error {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Where("booking_setting_id = ?", bookingSettingID).Delete(&entity.BookingSlotTime{}).Error; err != nil {
		return err
	}
	return nil
}
