package repository

import (
	"context"
	"time"

	"example.com/art-culture-api/domain/booking/entity"
	"example.com/art-culture-api/pkg"
)

type BookingSlotDateRepository interface {
	FindByID(ctx context.Context, id string) (entity.BookingSlotDate, error)
	FindByIDWithBookingSlotTimes(ctx context.Context, id string) (entity.BookingSlotDate, error)
	BulkUpsert(ctx context.Context, bookingSlotDates []entity.BookingSlotDate) ([]entity.BookingSlotDate, error)
	BulkDelete(ctx context.Context, bookingSlotDates []entity.BookingSlotDate) ([]entity.BookingSlotDate, error)
	FindAllByBookingSettingIDWithBookingSlotTimes(ctx context.Context, bookingSettingID string) ([]entity.BookingSlotDate, error) 
	DeleteAllByBookingSettingID(ctx context.Context, bookingSettingID string) error
	FindAllWithPagination(ctx context.Context, pagination pkg.Pagination, filterFields map[string]any, currentDate time.Time) ([]entity.BookingSlotDate, *pkg.Pagination, error)
}
