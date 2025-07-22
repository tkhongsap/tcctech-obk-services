package service

import (
	"context"
	"errors"
	"net/http"
	"time"

	"example.com/art-culture-api/domain/booking/entity"
	"example.com/art-culture-api/domain/booking/errs"
	"example.com/art-culture-api/domain/booking/repository"
	"example.com/art-culture-api/domain/booking/session"
	"gorm.io/gorm"
)

type BookingSlotTimeService interface {
	PatchStatus(c context.Context, id string, status entity.BookingSlotTimeStatus) (map[string]any, int, error)
}

type bookingSlotTimeService struct {
	session                   session.Session
	bookingSlotTimeRepository repository.BookingSlotTimeRepository
}

func NewBookingSlotTimeService(
	session session.Session,
	bookingSlotTimeRepository repository.BookingSlotTimeRepository,
) BookingSlotTimeService {
	return &bookingSlotTimeService{
		session:                   session,
		bookingSlotTimeRepository: bookingSlotTimeRepository,
	}
}

func (service *bookingSlotTimeService) PatchStatus(
	c context.Context,
	id string,
	status entity.BookingSlotTimeStatus,
) (map[string]any, int, error) {

	var (
		res            map[string]any
		err            error
		httpStatusCode int
	)

	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()
	_ = service.session.Transact(ctx, func(ctx context.Context) error {
		res, httpStatusCode, err = func() (map[string]any, int, error) {
			bookingSlotTime, err := service.bookingSlotTimeRepository.FindByIDWithReadLock(ctx, id)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return map[string]any{},
						http.StatusNotFound,
						errs.BuildCommonErrorNotFoundMsg("booking slot time")
				} else {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking slot time content")
				}
			}

			if status == entity.BookingSlotTimeAvailable &&
				bookingSlotTime.BookingSlotTimeStatus == entity.BookingSlotTimeSoldOut &&
				bookingSlotTime.MaxTicketsPerSlotTime == bookingSlotTime.BookedTicketsCount {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorInvalidMsg("status")
			}

			if status == entity.BookingSlotTimeSoldOut &&
				bookingSlotTime.BookingSlotTimeStatus == entity.BookingSlotTimeSoldOut &&
				bookingSlotTime.MaxTicketsPerSlotTime == bookingSlotTime.BookedTicketsCount {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorInvalidMsg("status")
			}

			bookingSlotTime.BookingSlotTimeStatus = status

			err = service.bookingSlotTimeRepository.Update(ctx, bookingSlotTime)
			if err != nil {
				return map[string]any{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't update booking slot time content")
			}

			return map[string]any{"id": bookingSlotTime.ID}, http.StatusOK, nil
		}()

		if err != nil {
			return err
		}

		return nil
	})

	return res, httpStatusCode, err
}
