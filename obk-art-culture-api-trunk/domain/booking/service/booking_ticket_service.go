package service

import (
	"context"
	"errors"
	"net/http"
	"time"

	artCRepo "example.com/art-culture-api/domain/act_c/repository"
	"example.com/art-culture-api/domain/booking/entity"
	"example.com/art-culture-api/domain/booking/errs"
	"example.com/art-culture-api/domain/booking/model"
	"example.com/art-culture-api/domain/booking/repository"
	"example.com/art-culture-api/domain/booking/session"
	"example.com/art-culture-api/domain/booking/utils"
	"example.com/art-culture-api/domain/booking/validator"
	"github.com/jonboulle/clockwork"
	"gorm.io/gorm"
)

type BookingTicketService interface {
	GetTicket(c context.Context, id string, locale string) (model.BookingTicketDetailResponse, int, error)
	CheckIn(c context.Context, id string, loc *time.Location) (model.BookingTicketResponse, int, error)
	ResetTicket(c context.Context, id string, loc *time.Location) (model.BookingTicketResponse, int, error)
}

type bookingTicketService struct {
	session                   session.Session
	clock                     clockwork.Clock
	bookingTicketRepository   repository.BookingTicketRepository
	bookingSlotTimeRepository repository.BookingSlotTimeRepository
	artCTranslationRepository artCRepo.ArtCTranslationRepository
}

func NewBookingTicketService(
	session session.Session,
	clock clockwork.Clock,
	bookingTicketRepository repository.BookingTicketRepository,
	bookingSlotTimeRepository repository.BookingSlotTimeRepository,
	artCTranslationRepository artCRepo.ArtCTranslationRepository,
) BookingTicketService {
	return &bookingTicketService{
		session:                   session,
		clock:                     clock,
		bookingTicketRepository:   bookingTicketRepository,
		bookingSlotTimeRepository: bookingSlotTimeRepository,
		artCTranslationRepository: artCTranslationRepository,
	}
}

func (service *bookingTicketService) GetTicket(
	c context.Context,
	id string,
	locale string,
) (model.BookingTicketDetailResponse, int, error) {
	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()

	if err := validator.IsValidLocale(locale); err != nil {
		return model.BookingTicketDetailResponse{}, http.StatusBadRequest, err
	}

	bookingTicket, err := service.bookingTicketRepository.FindByIDWithPreloadedFields(
		ctx,
		id,
		[]string{"program", "bookingTx", "bookingSlotDate", "bookingSlotTime"},
		locale,
	)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.BookingTicketDetailResponse{},
				http.StatusNotFound,
				errs.BuildCommonErrorNotFoundMsg("booking ticket")
		} else {
			return model.BookingTicketDetailResponse{},
				http.StatusInternalServerError,
				errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking ticket content")
		}
	}

	var bookingTicketResponse model.BookingTicketDetailResponse
	bookingTicketResponse.ID = bookingTicket.ID
	bookingTicketResponse.Status = bookingTicket.Status.String()
	bookingTicketResponse.CheckedInAt = bookingTicket.CheckedInAt
	bookingTicketResponse.TicketNo = utils.EncodeIDToObfuscatedString(bookingTicket.TicketNo)
	bookingTicketResponse.BookingTx = &model.BookingTicketTx{
		BookerName:        bookingTicket.BookingTx.BookerName,
		BookerEmail:       bookingTicket.BookingTx.BookerEmail,
		BookerPhoneNumber: bookingTicket.BookingTx.BookerPhoneNumber,
		SlotDate:          bookingTicket.BookingTx.BookingSlotDate.SlotDate,
		BeginSlotTime:     bookingTicket.BookingTx.BookingSlotTime.BeginSlotTime,
		EndSlotTime:       bookingTicket.BookingTx.BookingSlotTime.EndSlotTime,
	}

	if len(bookingTicket.Program.ProgramTranslation) > 0 {
		artCTranslation, err := service.artCTranslationRepository.
			FindByArtCTypeIdAndArtCCategoryIdAndLocale(
				ctx,
				&bookingTicket.Program.ArtCTypeID,
				bookingTicket.Program.ArtCCategoryID,
				locale,
			)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return model.BookingTicketDetailResponse{},
					http.StatusNotFound,
					errs.BuildCommonErrorNotFoundMsg("art c translation")
			} else {
				return model.BookingTicketDetailResponse{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't find art c translation content")
			}
		}

		bookingTicketResponse.Program = &model.BookingTicketProgram{
			PeriodAt:  bookingTicket.Program.PeriodAt,
			PeriodEnd: bookingTicket.Program.PeriodEnd,
			ArtCTitle: artCTranslation.Title,
			Locale:    bookingTicket.Program.ProgramTranslation[0].Locale,
			Locations: bookingTicket.Program.ProgramTranslation[0].Locations,
			Title:     bookingTicket.Program.ProgramTranslation[0].Title,
			Thumbnail: bookingTicket.Program.ProgramTranslation[0].Thumbnail,
			Banner:    bookingTicket.Program.ProgramTranslation[0].Banner,
		}
	}

	return bookingTicketResponse, http.StatusOK, nil
}

func (service *bookingTicketService) CheckIn(
	c context.Context,
	id string,
	loc *time.Location,
) (model.BookingTicketResponse, int, error) {
	var (
		res            model.BookingTicketResponse
		err            error
		httpStatusCode int
	)

	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()

	_ = service.session.Transact(ctx, func(ctx context.Context) error {
		res, httpStatusCode, err = func() (model.BookingTicketResponse, int, error) {
			currentTime := service.clock.Now()

			bookingTicket, err := service.bookingTicketRepository.FindByIDWithPreloadedFields(
				ctx,
				id,
				[]string{"bookingSlotDate", "bookingSlotTime"},
				"",
			)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return model.BookingTicketResponse{},
						http.StatusNotFound,
						errs.BuildCommonErrorNotFoundMsg("booking ticket")
				} else {
					return model.BookingTicketResponse{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking ticket content")
				}
			}

			if bookingTicket.Status == entity.CheckedIn {
				return model.BookingTicketResponse{}, http.StatusBadRequest, errors.New("ticket already used")
			}

			currentDateTime := currentTime.In(loc)
			endSlotTime := bookingTicket.BookingTx.BookingSlotTime.EndSlotTime.In(loc)

			if currentDateTime.After(endSlotTime) {
				return model.BookingTicketResponse{},
					http.StatusBadRequest,
					errors.New("this ticket is past its showtime")
			}

			y, m, d := currentDateTime.Date()
			currentDate := time.Date(y, m, d, 0, 0, 0, 0, loc)
			slotDate := bookingTicket.BookingTx.BookingSlotDate.SlotDate.In(loc)
			if slotDate.After(currentDate) {
				return model.BookingTicketResponse{},
					http.StatusBadRequest,
					errors.New("this ticket is not valid for today's showtime")
			}

			if err := service.bookingTicketRepository.UpdateByIDWithSelectedFields(
				ctx,
				bookingTicket.ID,
				[]string{"status", "checked_in_at"},
				map[string]interface{}{"status": entity.CheckedIn, "checked_in_at": currentTime},
			); err != nil {
				return model.BookingTicketResponse{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't update booking ticket content")
			}

			bookingSlotTime, err := service.bookingSlotTimeRepository.FindByIDWithReadLock(
				ctx,
				bookingTicket.BookingTx.BookingSlotTimeID,
			)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return model.BookingTicketResponse{},
						http.StatusNotFound,
						errs.BuildCommonErrorNotFoundMsg("booking slot time")
				} else {
					return model.BookingTicketResponse{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking slot time content")
				}
			}

			increasedCheckedInTicketsCount := bookingSlotTime.CheckedInTicketsCount + 1
			if err := service.bookingSlotTimeRepository.UpdateByIDWithSelectedFields(
				ctx,
				bookingTicket.BookingTx.BookingSlotTimeID,
				[]string{"checked_in_tickets_count"},
				map[string]interface{}{"checked_in_tickets_count": increasedCheckedInTicketsCount},
			); err != nil {
				return model.BookingTicketResponse{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't update booking slot time content")
			}

			var bookingTicketResponse model.BookingTicketResponse
			bookingTicketResponse.ID = bookingTicket.ID
			bookingTicketResponse.BookedTicketsCount = bookingSlotTime.BookedTicketsCount
			bookingTicketResponse.CheckedInTicketsCount = increasedCheckedInTicketsCount

			return bookingTicketResponse, http.StatusOK, nil
		}()

		if err != nil {
			return err
		}

		return nil
	})

	return res, httpStatusCode, err
}

func (service *bookingTicketService) ResetTicket(
	c context.Context,
	id string,
	loc *time.Location,
) (model.BookingTicketResponse, int, error) {
	var (
		res            model.BookingTicketResponse
		err            error
		httpStatusCode int
	)

	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()

	_ = service.session.Transact(ctx, func(ctx context.Context) error {
		res, httpStatusCode, err = func() (model.BookingTicketResponse, int, error) {
			currentTime := service.clock.Now()

			bookingTicket, err := service.bookingTicketRepository.FindByIDWithPreloadedFields(
				ctx,
				id,
				[]string{"bookingSlotTime"},
				"",
			)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return model.BookingTicketResponse{},
						http.StatusNotFound,
						errs.BuildCommonErrorNotFoundMsg("booking ticket")
				} else {
					return model.BookingTicketResponse{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking ticket content")
				}
			}

			if bookingTicket.Status == entity.Booked {
				return model.BookingTicketResponse{},
					http.StatusBadRequest,
					errors.New("not allow to reset tickets that are already booked")
			}

			currentDateTime := currentTime.In(loc)
			endSlotTime := bookingTicket.BookingTx.BookingSlotTime.EndSlotTime.In(loc)
			if currentDateTime.After(endSlotTime) {
				return model.BookingTicketResponse{},
					http.StatusBadRequest,
					errors.New("ticket's showtime has already passed")
			}

			fields := []string{"status", "checked_in_at"}
			m := map[string]interface{}{"status": entity.Booked, "checked_in_at": nil}
			if err := service.bookingTicketRepository.UpdateByIDWithSelectedFields(
				ctx,
				bookingTicket.ID,
				fields,
				m,
			); err != nil {
				return model.BookingTicketResponse{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't update booking ticket content")
			}

			bookingSlotTime, err := service.bookingSlotTimeRepository.FindByIDWithReadLock(
				ctx,
				bookingTicket.BookingTx.BookingSlotTimeID,
			)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return model.BookingTicketResponse{},
						http.StatusNotFound,
						errs.BuildCommonErrorNotFoundMsg("booking slot time")
				} else {
					return model.BookingTicketResponse{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking slot time content")
				}
			}

			decreasedCheckedInTicketsCount := bookingSlotTime.CheckedInTicketsCount - 1
			if err := service.bookingSlotTimeRepository.UpdateByIDWithSelectedFields(
				ctx,
				bookingTicket.BookingTx.BookingSlotTimeID,
				[]string{"checked_in_tickets_count"},
				map[string]interface{}{"checked_in_tickets_count": decreasedCheckedInTicketsCount},
			); err != nil {
				return model.BookingTicketResponse{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't update booking slot time content")
			}

			var bookingTicketResponse model.BookingTicketResponse
			bookingTicketResponse.ID = bookingTicket.ID
			bookingTicketResponse.BookedTicketsCount = bookingSlotTime.BookedTicketsCount
			bookingTicketResponse.CheckedInTicketsCount = decreasedCheckedInTicketsCount

			return bookingTicketResponse, http.StatusOK, nil
		}()

		if err != nil {
			return err
		}

		return nil
	})

	return res, httpStatusCode, err
}
