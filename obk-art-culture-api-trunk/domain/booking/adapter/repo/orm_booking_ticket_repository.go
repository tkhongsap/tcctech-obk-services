package repo

import (
	"context"

	"example.com/art-culture-api/domain/booking/adapter/session"
	"example.com/art-culture-api/domain/booking/entity"
	"gorm.io/gorm"
)

type OrmBookingTicketRepository struct {
	db *gorm.DB
}

func NewOrmBookingTicketRepository(db *gorm.DB) *OrmBookingTicketRepository {
	return &OrmBookingTicketRepository{
		db: db,
	}
}

func (repo *OrmBookingTicketRepository) BulkInsert(
	ctx context.Context,
	bookingTickets []entity.BookingTicket,
) ([]entity.BookingTicket, error) {
	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.WithContext(ctx).Create(&bookingTickets).Error; err != nil {
		return []entity.BookingTicket{}, err
	}
	return bookingTickets, nil
}

func (repo *OrmBookingTicketRepository) FindAllByBookingSettingID(
	ctx context.Context,
	bookingSettingID string,
) ([]entity.BookingTicket, error) {
	var bookingTickets []entity.BookingTicket
	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Where("booking_setting_id = ?", bookingSettingID).Find(&bookingTickets).Error; err != nil {
		return []entity.BookingTicket{}, err
	}
	return bookingTickets, nil
}

func (repo *OrmBookingTicketRepository) FindByIDWithPreloadedFields(
	ctx context.Context,
	id string,
	preloadFields []string,
	locale string,
) (entity.BookingTicket, error) {
	var bookingTicket entity.BookingTicket
	db := session.DB(ctx, repo.db).WithContext(ctx)

	for _, field := range preloadFields {
		if field == "program" {
			var locales []string
			if locale != "en" {
				locales = append(locales, "en", locale)
			} else {
				locales = append(locales, locale)
			}
			db = db.Preload("Program.ProgramTranslation", "locale IN (?)", locales)
		}
		if field == "bookingTx" {
			db = db.Preload("BookingTx")
		}
		if field == "bookingSlotDate" {
			db = db.Preload("BookingTx.BookingSlotDate")
		}
		if field == "bookingSlotTime" {
			db = db.Preload("BookingTx.BookingSlotTime")
		}
	}

	if err := db.Where("id = ?", id).First(&bookingTicket).Error; err != nil {
		return entity.BookingTicket{}, err
	}
	return bookingTicket, nil
}

func (repo *OrmBookingTicketRepository) UpdateByIDWithSelectedFields(
	ctx context.Context,
	id string,
	fields []string,
	m map[string]any,
) error {
	var bookingTicket entity.BookingTicket

	db := session.DB(ctx, repo.db).WithContext(ctx)

	if err := db.Model(&bookingTicket).Select(fields).Where("id = ?", id).Updates(m).Error; err != nil {
		return err
	}

	return nil
}
