package repository

import (
	"context"
	"time"

	"example.com/art-culture-api/domain/booking/entity"
	"example.com/art-culture-api/pkg"
)

type BookingSettingRepository interface {
	FindByIDWithBookingSlotDatesAndBookingSlotTimes(ctx context.Context, id string) (entity.BookingSetting, error)
	FindByProgramIDWithLocaleAndPreloadFields(ctx context.Context, locale string, programID uint, minDate *time.Time, preloadFields []string) (entity.BookingSetting, error)
	FindByProgramID(ctx context.Context, programID uint) (entity.BookingSetting, error)
	Insert(ctx context.Context, bookingSetting entity.BookingSetting) (entity.BookingSetting, error)
	UpdateByIDWithSelectedFields(ctx context.Context, id string, fields []string, m map[string]any) error
	DeleteByID(ctx context.Context, id string) error
	FindAllWithPagination(ctx context.Context, locale string, pagination pkg.Pagination, filterFields map[string]any, currentDate time.Time) ([]entity.BookingSettingPagination, *pkg.Pagination, error)
	FindAllByProgramIDsWithBookingSlotDates(ctx context.Context, programIDs []uint) ([]entity.BookingSetting, error)
}
