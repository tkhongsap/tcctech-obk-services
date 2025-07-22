package service

import (
	"context"
	"errors"
	"net/http"
	"time"

	"example.com/art-culture-api/domain/booking/errs"
	"example.com/art-culture-api/domain/booking/model"
	"example.com/art-culture-api/domain/booking/repository"
	"example.com/art-culture-api/pkg"
	"example.com/art-culture-api/pkg/constants"
	"github.com/jonboulle/clockwork"
	"gorm.io/gorm"
)

type BookingSlotDateService interface {
	FindByIDWithBookingSlotTimes(c context.Context, id string) (model.BookingSlotDateResponse, int, error)
	GetAllWithPagination(c context.Context, pagination pkg.Pagination, filterFields map[string]any, tz string) (pkg.Pagination, int, error)
}

type bookingSlotDateService struct {
	clock                     clockwork.Clock
	bookingSlotDateRepository repository.BookingSlotDateRepository
}

func NewBookingSlotDateService(
	clock clockwork.Clock,
	bookingSlotDateRepository repository.BookingSlotDateRepository,
) BookingSlotDateService {
	return &bookingSlotDateService{
		clock:                     clock,
		bookingSlotDateRepository: bookingSlotDateRepository,
	}
}

func (service *bookingSlotDateService) FindByIDWithBookingSlotTimes(
	c context.Context,
	id string,
) (model.BookingSlotDateResponse, int, error) {
	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()

	bookingSlotDate, err := service.bookingSlotDateRepository.FindByIDWithBookingSlotTimes(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.BookingSlotDateResponse{},
				http.StatusNotFound,
				errs.BuildCommonErrorNotFoundMsg("booking slot date")
		} else {
			return model.BookingSlotDateResponse{},
				http.StatusInternalServerError,
				errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking slot date content")
		}
	}

	var bookingSlotDateResponse model.BookingSlotDateResponse
	bookingSlotDateResponse.ID = bookingSlotDate.ID
	bookingSlotDateResponse.CreatedAt = bookingSlotDate.CreatedAt
	bookingSlotDateResponse.UpdatedAt = bookingSlotDate.UpdatedAt
	bookingSlotDateResponse.ProgramID = bookingSlotDate.ProgramID
	bookingSlotDateResponse.BookingSettingID = bookingSlotDate.BookingSettingID
	bookingSlotDateResponse.SlotDate = bookingSlotDate.SlotDate

	bookingSlotTimes := make([]model.BookingSlotDateSlotTime, 0, len(bookingSlotDate.BookingSlotTimes))

	for _, bookingSlotTime := range bookingSlotDate.BookingSlotTimes {
		bookingSlotTimes = append(bookingSlotTimes, model.BookingSlotDateSlotTime{
			ID:                    bookingSlotTime.ID,
			BeginSlotTime:         bookingSlotTime.BeginSlotTime,
			EndSlotTime:           bookingSlotTime.EndSlotTime,
			MaxTicketsPerSlotTime: bookingSlotTime.MaxTicketsPerSlotTime,
			BookedTicketsCount:    bookingSlotTime.BookedTicketsCount,
			Status:                bookingSlotTime.BookingSlotTimeStatus.String(),
		})
	}
	bookingSlotDateResponse.BookingSlotTimes = bookingSlotTimes

	return bookingSlotDateResponse, http.StatusOK, nil
}

func (service *bookingSlotDateService) GetAllWithPagination(
	c context.Context,
	pagination pkg.Pagination,
	filterFields map[string]any,
	tz string,
) (pkg.Pagination, int, error) {
	loc, err := time.LoadLocation(tz)
	if err != nil {
		return pkg.Pagination{}, http.StatusBadRequest, errs.BuildCommonErrorInvalidMsg(constants.TimeZone)
	}

	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()

	currentTime := service.clock.Now()
	y, m, d := currentTime.In(loc).Date()

	if paginatedBookingSlotDates, pagination, err := service.bookingSlotDateRepository.
		FindAllWithPagination(ctx, pagination, filterFields, time.Date(y, m, d, 0, 0, 0, 0, loc)); err != nil {
		return pkg.Pagination{},
			http.StatusInternalServerError,
			errs.BuildCommonErrorInternalServerMsg(", ", "can't find the pagination of booking slot date contents")
	} else {
		if len(paginatedBookingSlotDates) > 0 {
			paginationResponse := make([]model.BookingSlotDatePaginationResponse, 0, len(paginatedBookingSlotDates))
			for _, bsd := range paginatedBookingSlotDates {
				var r model.BookingSlotDatePaginationResponse
				r.ID = bsd.ID
				r.CreatedAt = bsd.CreatedAt
				r.UpdatedAt = bsd.UpdatedAt
				r.ProgramID = bsd.ProgramID
				r.BookingSettingID = bsd.BookingSettingID
				r.SlotDate = bsd.SlotDate

				if len(bsd.BookingSlotTimes) > 0 {
					bookingSlotTimes := make([]model.BookingSlotDatePaginationSlotTime, 0, len(bsd.BookingSlotTimes))
					for _, bst := range bsd.BookingSlotTimes {
						bookingSlotTimes = append(bookingSlotTimes, model.BookingSlotDatePaginationSlotTime{
							ID:                    bst.ID,
							BookingSettingID:      bst.BookingSettingID,
							ProgramID:             bst.ProgramID,
							BookingSlotDateID:     bst.BookingSlotDateID,
							CreatedAt:             bst.CreatedAt,
							UpdatedAt:             bst.UpdatedAt,
							BeginSlotTime:         bst.BeginSlotTime,
							EndSlotTime:           bst.EndSlotTime,
							MaxTicketsPerSlotTime: bst.MaxTicketsPerSlotTime,
							BookedTicketsCount:    bst.BookedTicketsCount,
							Status:                bst.BookingSlotTimeStatus.String(),
							CheckedInTicketsCount: bst.CheckedInTicketsCount,
						})
					}

					r.BookingSlotTimes = &bookingSlotTimes
				} else {
					r.BookingSlotTimes = &[]model.BookingSlotDatePaginationSlotTime{}
				}

				paginationResponse = append(paginationResponse, r)
			}

			pagination.Data = paginationResponse
			return *pagination, http.StatusOK, nil
		}

		pagination.Data = []model.BookingSlotDatePaginationResponse{}
		return *pagination, http.StatusOK, nil
	}
}
