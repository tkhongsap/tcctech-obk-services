package repository

import (
	"context"

	"example.com/art-culture-api/domain/booking/entity"
)

type BookingTicketRepository interface {
	BulkInsert(ctx context.Context, bookingTickets []entity.BookingTicket) ([]entity.BookingTicket, error)
	FindAllByBookingSettingID(ctx context.Context, bookingSettingID string) ([]entity.BookingTicket, error)
	FindByIDWithPreloadedFields(ctx context.Context, id string, preloadFields []string, locale string) (entity.BookingTicket, error)
	UpdateByIDWithSelectedFields(ctx context.Context, id string, fields []string, m map[string]any) error
}
