package repository

import (
	"context"
	"time"

	"example.com/art-culture-api/domain/booking/entity"
)

type BookingTxRepository interface {
	FindAllByUserID(ctx context.Context, locale string, preloadFields []string, filterFields map[string]any,
		time time.Time, userID string) ([]entity.BookingTx, error)
	FindAllByProgramIDOrBookerNameOrBookerEmailOrBookingSlotTimeID(ctx context.Context, programID *uint,
		bookerName *string, bookerEmail *string, bookingSlotTimeID *string) ([]entity.BookingTx, error)
	FindByID(ctx context.Context, id string, locale string) (entity.BookingTx, error)
	CountByBookingSlotDateIDs(ctx context.Context, bookingSlotDateIDs []string) (int64, error)
	CountByBookingSlotTimeIDs(ctx context.Context, bookingSlotTimeIDs []string) (int64, error)
	CountByBookingSettingIDs(ctx context.Context, bookingSettingIDs []string) (int64, error)
	Insert(ctx context.Context, bookingTx entity.BookingTx) (entity.BookingTx, error)
}
