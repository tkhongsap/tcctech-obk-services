package service

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	artCEntity "example.com/art-culture-api/domain/act_c/entity"
	artCRepo "example.com/art-culture-api/domain/act_c/repository"
	"example.com/art-culture-api/domain/booking/entity"
	"example.com/art-culture-api/domain/booking/errs"
	"example.com/art-culture-api/domain/booking/model"
	"example.com/art-culture-api/domain/booking/repository"
	"example.com/art-culture-api/domain/booking/session"
	"example.com/art-culture-api/domain/booking/utils"
	"example.com/art-culture-api/domain/booking/validator"
	programRepo "example.com/art-culture-api/domain/programs/repository"
	"example.com/art-culture-api/pkg/constants"
	"github.com/jonboulle/clockwork"
	"gorm.io/gorm"
)

type BookingTxService interface {
	FindAllByUserID(c context.Context, locale string, fields []string, showingStatus string, userID string) ([]model.BookingTxResponse, int, error)
	GetTransactions(c context.Context, programID *uint, bookerName *string, bookerEmail *string, bookingSlotTimeID *string) ([]model.BookingTxCMSResponse, int, error)
	FindByID(c context.Context, id string, locale string) (model.BookingTxResponse, int, error)
	Create(c context.Context, userID string, request model.BookingTxCreateRequest, locale string, tz string) (map[string]any, int, error)
}

type bookingTxService struct {
	session                   session.Session
	clock                     clockwork.Clock
	bookingTicketRepository   repository.BookingTicketRepository
	bookingTxRepository       repository.BookingTxRepository
	bookingSlotTimeRepository repository.BookingSlotTimeRepository
	bookingSlotDateRepository repository.BookingSlotDateRepository
	bookingSettingRepository  repository.BookingSettingRepository
	programRepository         programRepo.ProgramRepository
	artCTranslationRepository artCRepo.ArtCTranslationRepository
	notificationService       BookingNotificationService
}

func NewBookingTxService(
	session session.Session,
	clock clockwork.Clock,
	bookingTicketRepository repository.BookingTicketRepository,
	bookingTxRepository repository.BookingTxRepository,
	bookingSlotTimeRepository repository.BookingSlotTimeRepository,
	bookingSlotDateRepository repository.BookingSlotDateRepository,
	bookingSettingRepository repository.BookingSettingRepository,
	programRepository programRepo.ProgramRepository,
	artCTranslationRepository artCRepo.ArtCTranslationRepository,
	notificationService BookingNotificationService,
) BookingTxService {

	return &bookingTxService{
		session:                   session,
		clock:                     clock,
		bookingTicketRepository:   bookingTicketRepository,
		bookingTxRepository:       bookingTxRepository,
		bookingSlotTimeRepository: bookingSlotTimeRepository,
		bookingSlotDateRepository: bookingSlotDateRepository,
		bookingSettingRepository:  bookingSettingRepository,
		programRepository:         programRepository,
		artCTranslationRepository: artCTranslationRepository,
		notificationService:       notificationService,
	}
}

func (service *bookingTxService) FindAllByUserID(
	c context.Context,
	locale string,
	fields []string,
	showingStatus string,
	userID string,
) ([]model.BookingTxResponse, int, error) {
	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()

	currentTime := service.clock.Now()

	if err := validator.IsValidLocale(locale); err != nil {
		return []model.BookingTxResponse{}, http.StatusBadRequest, err
	}

	fieldsConfigMap := map[string]bool{
		"program": true,
	}

	var containProgram bool
	var sanitizedPreloadFields []string
	for _, field := range fields {
		if fieldsConfigMap[field] {
			if field == "program" {
				containProgram = true
			}
			sanitizedPreloadFields = append(sanitizedPreloadFields, field)
		}
	}

	showingStatusConfigMap := map[string]bool{
		"upcoming": true,
		"past":     true,
	}

	var filterFields = make(map[string]any)
	if showingStatus != "" {
		if showingStatusConfigMap[showingStatus] {
			filterFields["showingStatus"] = showingStatus
		}
	}

	bookingTxs, err := service.bookingTxRepository.FindAllByUserID(
		ctx,
		locale,
		sanitizedPreloadFields,
		filterFields,
		currentTime,
		userID,
	)
	if err != nil {
		return []model.BookingTxResponse{},
			http.StatusInternalServerError,
			errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking transaction content")
	}

	if len(bookingTxs) == 0 {
		return make([]model.BookingTxResponse, 0), http.StatusOK, nil
	}

	// List of ArtCTranslations
	var artCTranslations []artCEntity.ArtCTranslation
	if len(bookingTxs) > 0 && containProgram {
		tuples := make([][]interface{}, 0, len(bookingTxs))
		m := make(map[string]struct{}, 0)
		for _, bookingTx := range bookingTxs {
			if locale != "en" {
				k := fmt.Sprintf("%v-%v-%v", bookingTx.Program.ArtCTypeID, bookingTx.Program.ArtCCategoryID, "en")
				if _, ok := m[k]; ok {
					continue
				}
				m[k] = struct{}{}
				tuples = append(tuples, []interface{}{bookingTx.Program.ArtCTypeID, bookingTx.Program.ArtCCategoryID, "en"})
			}
			k := fmt.Sprintf("%v-%v-%v", bookingTx.Program.ArtCTypeID, bookingTx.Program.ArtCCategoryID, locale)
			if _, ok := m[k]; ok {
				continue
			}
			m[k] = struct{}{}
			tuples = append(tuples, []interface{}{bookingTx.Program.ArtCTypeID, bookingTx.Program.ArtCCategoryID, locale})
		}
		artCTranslations, err = service.artCTranslationRepository.
			FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(ctx, tuples)
		if err != nil {
			return []model.BookingTxResponse{},
				http.StatusInternalServerError,
				errs.BuildCommonErrorInternalServerMsg(", ", "can't find art translation content")
		}
	}

	bookingTxResponses := make([]model.BookingTxResponse, 0, len(bookingTxs))
	for _, bookingTx := range bookingTxs {
		var bookingTxResponse model.BookingTxResponse
		bookingTxResponse.ID = bookingTx.ID
		bookingTxResponse.CreatedAt = bookingTx.CreatedAt
		bookingTxResponse.UpdatedAt = bookingTx.UpdatedAt
		bookingTxResponse.UserID = bookingTx.UserID
		bookingTxResponse.ProgramID = bookingTx.ProgramID
		bookingTxResponse.BookingSlotDateID = bookingTx.BookingSlotDateID
		bookingTxResponse.BookingSlotTimeID = bookingTx.BookingSlotTimeID
		bookingTxResponse.BookerName = bookingTx.BookerName
		bookingTxResponse.BookerEmail = bookingTx.BookerEmail
		bookingTxResponse.BookerPhoneNumber = bookingTx.BookerPhoneNumber
		bookingTxResponse.TicketsCount = bookingTx.TicketsCount
		bookingTxResponse.SlotDate = bookingTx.BookingSlotDate.SlotDate
		bookingTxResponse.BeginSlotTime = bookingTx.BookingSlotTime.BeginSlotTime
		bookingTxResponse.EndSlotTime = bookingTx.BookingSlotTime.EndSlotTime
		bookingTxResponse.Price = float64(bookingTx.TicketsCount) * bookingTx.BookingSetting.TicketPrice
		bookingTxResponse.OrderId = utils.EncodeIDToObfuscatedString(bookingTx.OrderNo)

		if v, ok := filterFields["showingStatus"]; ok {
			bookingTxResponse.ShowingStatus = v.(string)
		} else {
			if bookingTx.BookingSlotTime.EndSlotTime.Before(currentTime) {
				bookingTxResponse.ShowingStatus = "past"
			} else {
				bookingTxResponse.ShowingStatus = "upcoming"
			}
		}

		// It is obvious that bookingTx.Program is not nil if containProgram is true
		if containProgram {
			// API returns only 1 locale
			if len(bookingTx.Program.ProgramTranslation) > 0 {
				var matched bool
				var artCTranslationTitle string
				var artCTranslationTitleEN string // default locale is "en"
				for _, artCTranslation := range artCTranslations {
					if matched {
						break
					}

					isArtCTypeEqual := artCTranslation.ArtCTypeID != nil &&
						*artCTranslation.ArtCTypeID == bookingTx.Program.ArtCTypeID
					isArtCCategoryEqual := (artCTranslation.ArtCCategoryID != nil &&
						bookingTx.Program.ArtCCategoryID != nil &&
						*artCTranslation.ArtCCategoryID == *bookingTx.Program.ArtCCategoryID) ||
						(artCTranslation.ArtCCategoryID == nil && bookingTx.Program.ArtCCategoryID == nil)
					isLocaleEqual := artCTranslation.Locale == locale
					if isArtCTypeEqual && isArtCCategoryEqual {
						if artCTranslation.Locale == "en" {
							artCTranslationTitleEN = artCTranslation.Title
						}
						if isLocaleEqual {
							matched = true
							artCTranslationTitle = artCTranslation.Title
						}
					}
				}

				programTranslationCount := len(bookingTx.Program.ProgramTranslation)
				localeIdx := 0   // default index is 0
				enLocaleIdx := 0 // default locale is "en"
				useDefaultLocale := false
				for i, pt := range bookingTx.Program.ProgramTranslation {
					if pt.Locale == "en" {
						enLocaleIdx = i
					}
					if locale != "en" {
						// if pt is the last element and entity's locale is not equal to the request's locale then use the default locale
						if i+1 == programTranslationCount && pt.Locale != locale {
							useDefaultLocale = true
						}
						if pt.Locale == locale {
							localeIdx = i
							break
						}
					} else {
						if pt.Locale == "en" {
							localeIdx = i
							break
						}
					}
				}

				if useDefaultLocale {
					bookingTxResponse.Program = &model.BookingTxProgram{
						PeriodAt:  bookingTx.Program.PeriodAt,
						PeriodEnd: bookingTx.Program.PeriodEnd,
						ArtCTitle: artCTranslationTitleEN,
						Locale:    bookingTx.Program.ProgramTranslation[enLocaleIdx].Locale,
						Locations: bookingTx.Program.ProgramTranslation[enLocaleIdx].Locations,
						Title:     bookingTx.Program.ProgramTranslation[enLocaleIdx].Title,
						Thumbnail: bookingTx.Program.ProgramTranslation[enLocaleIdx].Thumbnail,
						Banner:    bookingTx.Program.ProgramTranslation[enLocaleIdx].Banner,
					}
				} else {
					bookingTxResponse.Program = &model.BookingTxProgram{
						PeriodAt:  bookingTx.Program.PeriodAt,
						PeriodEnd: bookingTx.Program.PeriodEnd,
						ArtCTitle: artCTranslationTitle,
						Locale:    bookingTx.Program.ProgramTranslation[localeIdx].Locale,
						Locations: bookingTx.Program.ProgramTranslation[localeIdx].Locations,
						Title:     bookingTx.Program.ProgramTranslation[localeIdx].Title,
						Thumbnail: bookingTx.Program.ProgramTranslation[localeIdx].Thumbnail,
						Banner:    bookingTx.Program.ProgramTranslation[localeIdx].Banner,
					}
				}
			}
		}

		bookingTxResponses = append(bookingTxResponses, bookingTxResponse)
	}

	return bookingTxResponses, http.StatusOK, nil
}

func (service *bookingTxService) GetTransactions(
	c context.Context,
	programID *uint,
	bookerName *string,
	bookerEmail *string,
	bookingSlotTimeID *string,
) ([]model.BookingTxCMSResponse, int, error) {
	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()

	currentTime := service.clock.Now()

	bookingTxs, err := service.bookingTxRepository.
		FindAllByProgramIDOrBookerNameOrBookerEmailOrBookingSlotTimeID(
			ctx,
			programID,
			bookerName,
			bookerEmail,
			bookingSlotTimeID,
		)
	if err != nil {
		return []model.BookingTxCMSResponse{},
			http.StatusInternalServerError,
			errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking transaction content")
	}

	if len(bookingTxs) == 0 {
		return make([]model.BookingTxCMSResponse, 0), http.StatusOK, nil
	}

	bookingTxCMSResponses := make([]model.BookingTxCMSResponse, 0, len(bookingTxs))
	for _, bookingTx := range bookingTxs {
		var bookingTxResponse model.BookingTxCMSResponse
		bookingTxResponse.ID = bookingTx.ID
		bookingTxResponse.CreatedAt = bookingTx.CreatedAt
		bookingTxResponse.UpdatedAt = bookingTx.UpdatedAt
		bookingTxResponse.UserID = bookingTx.UserID
		bookingTxResponse.ProgramID = bookingTx.ProgramID
		bookingTxResponse.BookingSlotDateID = bookingTx.BookingSlotDateID
		bookingTxResponse.BookingSlotTimeID = bookingTx.BookingSlotTimeID
		bookingTxResponse.BookerName = bookingTx.BookerName
		bookingTxResponse.BookerEmail = bookingTx.BookerEmail
		bookingTxResponse.BookerPhoneNumber = bookingTx.BookerPhoneNumber
		bookingTxResponse.TicketsCount = bookingTx.TicketsCount
		bookingTxResponse.SlotDate = bookingTx.BookingSlotDate.SlotDate
		bookingTxResponse.BeginSlotTime = bookingTx.BookingSlotTime.BeginSlotTime
		bookingTxResponse.EndSlotTime = bookingTx.BookingSlotTime.EndSlotTime
		bookingTxResponse.Price = float64(bookingTx.TicketsCount) * bookingTx.BookingSetting.TicketPrice
		bookingTxResponse.OrderId = utils.EncodeIDToObfuscatedString(bookingTx.OrderNo)

		if bookingTx.BookingSlotTime.EndSlotTime.Before(currentTime) {
			bookingTxResponse.ShowingStatus = "past"
		} else {
			bookingTxResponse.ShowingStatus = "upcoming"
		}

		bookingTxCMSResponses = append(bookingTxCMSResponses, bookingTxResponse)
	}

	return bookingTxCMSResponses, http.StatusOK, nil
}

func (service *bookingTxService) FindByID(
	c context.Context,
	id string,
	locale string,
) (model.BookingTxResponse, int, error) {
	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()

	currentTime := service.clock.Now()

	if err := validator.IsValidLocale(locale); err != nil {
		return model.BookingTxResponse{}, http.StatusBadRequest, err
	}

	bookingTx, err := service.bookingTxRepository.FindByID(ctx, id, locale)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.BookingTxResponse{}, http.StatusNotFound, errs.BuildCommonErrorNotFoundMsg("booking transaction")
		} else {
			return model.BookingTxResponse{},
				http.StatusInternalServerError,
				errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking transaction content")
		}
	}

	var bookingTxResponse model.BookingTxResponse
	bookingTxResponse.ID = bookingTx.ID
	bookingTxResponse.CreatedAt = bookingTx.CreatedAt
	bookingTxResponse.UpdatedAt = bookingTx.UpdatedAt
	bookingTxResponse.UserID = bookingTx.UserID
	bookingTxResponse.ProgramID = bookingTx.ProgramID
	bookingTxResponse.BookingSlotDateID = bookingTx.BookingSlotDateID
	bookingTxResponse.BookingSlotTimeID = bookingTx.BookingSlotTimeID
	bookingTxResponse.OrderId = utils.EncodeIDToObfuscatedString(bookingTx.OrderNo)
	bookingTxResponse.BookerName = bookingTx.BookerName
	bookingTxResponse.BookerEmail = bookingTx.BookerEmail
	bookingTxResponse.BookerPhoneNumber = bookingTx.BookerPhoneNumber
	bookingTxResponse.TicketsCount = bookingTx.TicketsCount
	bookingTxResponse.SlotDate = bookingTx.BookingSlotDate.SlotDate
	bookingTxResponse.BeginSlotTime = bookingTx.BookingSlotTime.BeginSlotTime
	bookingTxResponse.EndSlotTime = bookingTx.BookingSlotTime.EndSlotTime
	bookingTxResponse.Price = float64(bookingTx.TicketsCount) * bookingTx.BookingSetting.TicketPrice
	if bookingTx.BookingSlotTime.EndSlotTime.Before(currentTime) {
		bookingTxResponse.ShowingStatus = "past"
	} else {
		bookingTxResponse.ShowingStatus = "upcoming"
	}

	// API returns only 1 locale
	if len(bookingTx.Program.ProgramTranslation) > 0 {
		var artCTitle string
		artCTranslation, err := service.artCTranslationRepository.
			FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
				ctx,
				&bookingTx.Program.ArtCTypeID,
				bookingTx.Program.ArtCCategoryID,
				locale,
			)
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				artCTitle = ""
			} else {
				return model.BookingTxResponse{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't find art c translation content")
			}
		} else {
			artCTitle = artCTranslation.Title
		}

		programTranslationCount := len(bookingTx.Program.ProgramTranslation)
		localeIdx := 0   // default index is 0
		enLocaleIdx := 0 // default locale is "en"
		useDefaultLocale := false
		for i, pt := range bookingTx.Program.ProgramTranslation {
			if pt.Locale == "en" {
				enLocaleIdx = i
			}
			if locale != "en" {
				// if pt is the last element and entity's locale is not equal to the request's locale then use the default locale
				if i+1 == programTranslationCount && pt.Locale != locale {
					useDefaultLocale = true
				}
				if pt.Locale == locale {
					localeIdx = i
					break
				}
			} else {
				if pt.Locale == "en" {
					localeIdx = i
					break
				}
			}
		}

		if useDefaultLocale {
			bookingTxResponse.Program = &model.BookingTxProgram{
				PeriodAt:  bookingTx.Program.PeriodAt,
				PeriodEnd: bookingTx.Program.PeriodEnd,
				ArtCTitle: artCTitle,
				Locale:    bookingTx.Program.ProgramTranslation[enLocaleIdx].Locale,
				Locations: bookingTx.Program.ProgramTranslation[enLocaleIdx].Locations,
				Title:     bookingTx.Program.ProgramTranslation[enLocaleIdx].Title,
				Thumbnail: bookingTx.Program.ProgramTranslation[enLocaleIdx].Thumbnail,
				Banner:    bookingTx.Program.ProgramTranslation[enLocaleIdx].Banner,
			}
		} else {
			bookingTxResponse.Program = &model.BookingTxProgram{
				PeriodAt:  bookingTx.Program.PeriodAt,
				PeriodEnd: bookingTx.Program.PeriodEnd,
				ArtCTitle: artCTitle,
				Locale:    bookingTx.Program.ProgramTranslation[localeIdx].Locale,
				Locations: bookingTx.Program.ProgramTranslation[localeIdx].Locations,
				Title:     bookingTx.Program.ProgramTranslation[localeIdx].Title,
				Thumbnail: bookingTx.Program.ProgramTranslation[localeIdx].Thumbnail,
				Banner:    bookingTx.Program.ProgramTranslation[localeIdx].Banner,
			}
		}
	}

	bookingTickets := make([]model.BookingTxTicket, 0, len(bookingTx.BookingTickets))
	for _, bookingTicket := range bookingTx.BookingTickets {
		bookingTickets = append(bookingTickets, model.BookingTxTicket{
			ID:          bookingTicket.ID,
			TicketNo:    utils.EncodeIDToObfuscatedString(bookingTicket.TicketNo),
			Status:      bookingTicket.Status.String(),
			CheckedInAt: bookingTicket.CheckedInAt,
		})
	}

	bookingTxResponse.BookingTickets = &bookingTickets

	return bookingTxResponse, http.StatusOK, nil
}

// For improvement, please refer to this topic (remove validation and execution UPDATE from the selected QUERY result),
// https://stackoverflow.com/a/51932824.
func (service *bookingTxService) Create(
	c context.Context,
	userID string,
	request model.BookingTxCreateRequest,
	locale string,
	tz string,
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
			currentTime := service.clock.Now()

			if err := validator.IsValidLocale(locale); err != nil {
				return map[string]any{}, http.StatusBadRequest, err
			}

			loc, err := time.LoadLocation(tz)
			if err != nil {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorInvalidMsg(constants.TimeZone)
			}

			if request.BookerName == nil {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorIsRequiredMsg("bookerName")
			}

			if request.BookerPhoneNumber == nil && request.BookerEmail == nil {
				return map[string]any{}, http.StatusBadRequest, errors.New("Either bookerPhoneNumber or bookerEmail is required")
			}

			if request.TicketsCount == nil {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorIsRequiredMsg("ticketsCount")
			}

			if *request.TicketsCount < 1 {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorInvalidMsg("ticketsCount")
			}

			program, err := service.programRepository.FindOneByID(ctx, request.ProgramID, locale)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return map[string]any{}, http.StatusNotFound, errs.BuildCommonErrorNotFoundMsg("program")
				} else {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find program content")
				}
			}

			bookingSetting, err := service.bookingSettingRepository.
				FindByProgramID(ctx, request.ProgramID)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return map[string]any{}, http.StatusNotFound, errs.BuildCommonErrorNotFoundMsg("booking setting")
				} else {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking setting content")
				}
			}

			if *request.TicketsCount > bookingSetting.MaxTicketsPerTransaction {
				return map[string]any{},
					http.StatusBadRequest,
					errors.New("ticketsCount greater than " + strconv.Itoa(bookingSetting.MaxTicketsPerTransaction))
			}

			bookingSlotTime, err := service.bookingSlotTimeRepository.
				FindByIDWithReadLock(ctx, request.BookingSlotTimeID)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return map[string]any{}, http.StatusNotFound, errs.BuildCommonErrorNotFoundMsg("booking slot time")
				} else {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking slot time content")
				}
			}

			if currentTime.In(loc).After(bookingSlotTime.EndSlotTime.In(loc)) {
				return map[string]any{}, http.StatusBadRequest, errors.New("bookingSlotTime less than current time")
			}

			if bookingSlotTime.BookingSlotTimeStatus.String() == entity.BookingSlotTimeSoldOut.String() {
				return map[string]any{}, http.StatusBadRequest, errors.New("status not available")
			}

			var increaseTicketsCount bool
			if *request.TicketsCount+bookingSlotTime.BookedTicketsCount > bookingSlotTime.MaxTicketsPerSlotTime {
				return map[string]any{},
					http.StatusBadRequest,
					errors.New("ticketsCount greater than maxTicketsPerSlotTime")
			} else {
				increaseTicketsCount = true
			}

			var updateToSoldOut bool
			if *request.TicketsCount+bookingSlotTime.BookedTicketsCount == bookingSlotTime.MaxTicketsPerSlotTime {
				updateToSoldOut = true
			}

			bookingSlotDate, err := service.bookingSlotDateRepository.
				FindByID(ctx, request.BookingSlotDateID)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return map[string]any{}, http.StatusNotFound, errs.BuildCommonErrorNotFoundMsg("booking slot date")
				} else {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking slot date content")
				}
			}

			if bookingSlotTime.BookingSlotDateID != bookingSlotDate.ID {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorInvalidMsg("bookingSlotDateId")
			}

			cY, cM, cD := currentTime.In(loc).Date()
			currentDate := time.Date(cY, cM, cD, 0, 0, 0, 0, loc)
			y, m, d := bookingSlotDate.SlotDate.In(loc).Date()
			bookingDate := time.Date(y, m, d, 0, 0, 0, 0, loc)

			if currentDate.After(bookingDate) {
				return map[string]any{}, http.StatusBadRequest, errors.New("bookingSlotDate less than current date")
			}

			btx := entity.BookingTx{
				UserID:            userID,
				ProgramID:         program.ID,
				BookingSettingID:  bookingSetting.ID,
				BookingSlotDateID: bookingSlotDate.ID,
				BookingSlotTimeID: bookingSlotTime.ID,
				BookerName:        *request.BookerName,
				TicketsCount:      *request.TicketsCount,
			}
			if request.BookerEmail != nil {
				btx.BookerEmail = request.BookerEmail
			}
			if request.BookerPhoneNumber != nil {
				btx.BookerPhoneNumber = request.BookerPhoneNumber
			}

			bookingTx, err := service.bookingTxRepository.Insert(ctx, btx)
			if err != nil {
				return map[string]any{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't create booking transaction content")
			}

			if increaseTicketsCount {
				bookingSlotTime.BookedTicketsCount += *request.TicketsCount
			}

			if updateToSoldOut {
				bookingSlotTime.BookingSlotTimeStatus = entity.BookingSlotTimeSoldOut
			}

			if err := service.bookingSlotTimeRepository.Update(ctx, bookingSlotTime); err != nil {
				return map[string]any{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't update booking slot time content")
			}

			bookingTickets := make([]entity.BookingTicket, 0, *request.TicketsCount)
			for i := 0; i < *request.TicketsCount; i++ {
				bookingTickets = append(bookingTickets, entity.BookingTicket{
					ProgramID:        program.ID,
					BookingSettingID: bookingSetting.ID,
					BookingTxID:      bookingTx.ID,
					Status:           entity.Booked,
					CheckedInAt:      nil,
				})
			}

			if _, err := service.bookingTicketRepository.
				BulkInsert(ctx, bookingTickets); err != nil {
				return map[string]any{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't create booking ticket contents")
			}

			_ = service.notificationService.SendBookingConfirm(
				locale,
				userID,
				program,
				bookingSlotDate.SlotDate.In(loc),
				bookingSlotTime.BeginSlotTime.In(loc),
			)

			return map[string]any{"id": bookingTx.ID}, http.StatusOK, nil
		}()

		if err != nil {
			return err
		}

		return nil
	})

	return res, httpStatusCode, err
}
