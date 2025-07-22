package repository

import (
	"context"

	"example.com/art-culture-api/domain/booking/entity"
)

type BookingSlotTimeRepository interface {
	FindByIDWithReadLock(ctx context.Context, id string) (entity.BookingSlotTime, error)
	Update(ctx context.Context, bookingSlotTime entity.BookingSlotTime) error
	UpdateByIDWithSelectedFields(ctx context.Context, id string, fields []string, m map[string]any) error
	BulkUpsert(ctx context.Context, bookingSlotTimes []entity.BookingSlotTime) ([]entity.BookingSlotTime, error)
	BulkDelete(ctx context.Context, bookingSlotTimes []entity.BookingSlotTime) ([]entity.BookingSlotTime, error)
	FindAllByTuplesOfProgramIDAndBookingSettingIDAndBookingSlotDateID(ctx context.Context, tuples [][]interface{}) ([]entity.BookingSlotTime, error)
	DeleteAllByBookingSettingID(ctx context.Context, bookingSettingID string) error
}
