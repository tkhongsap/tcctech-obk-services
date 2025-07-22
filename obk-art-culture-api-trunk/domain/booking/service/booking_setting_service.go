package service

import (
	"context"
	"errors"
	"fmt"
	"net/http"
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
	"example.com/art-culture-api/pkg"
	"example.com/art-culture-api/pkg/constants"
	"example.com/art-culture-api/pkg/contexts"
	"github.com/jonboulle/clockwork"
	"gorm.io/gorm"
)

type BookingSettingService interface {
	FindByProgramIDWithPreloadFields(c context.Context, app contexts.ClientType, pid uint, locale string, minDate *time.Time, fields []string) (model.BookingSettingResponse, int, error)
	Create(c context.Context, request model.BookingSettingCreateRequest, locale string, tz string) (map[string]any, int, error)
	Patch(c context.Context, id string, request model.BookingSettingPatchRequest, locale string, tz string) (map[string]any, int, error)
	Delete(c context.Context, id string) (map[string]any, int, error)
	GetAllWithPagination(c context.Context, pagination pkg.Pagination, preloadFields []string, filterFields map[string]any, locale string, tz string) (pkg.Pagination, int, error)
	CheckAvailability(c context.Context, request model.BookingSettingCheckAvailabilityRequest) ([]model.BookingSettingCheckAvailabilityResponse, int, error)
}

type bookingSettingService struct {
	session                   session.Session
	clock                     clockwork.Clock
	bookingTicketRepository   repository.BookingTicketRepository
	bookingTxRepository       repository.BookingTxRepository
	bookingSlotTimeRepository repository.BookingSlotTimeRepository
	bookingSlotDateRepository repository.BookingSlotDateRepository
	bookingSettingRepository  repository.BookingSettingRepository
	programRepository         programRepo.ProgramRepository
	artCTranslationRepository artCRepo.ArtCTranslationRepository
}

func NewBookingSettingService(
	session session.Session,
	clock clockwork.Clock,
	bookingTicketRepository repository.BookingTicketRepository,
	bookingTxRepository repository.BookingTxRepository,
	bookingSlotTimeRepository repository.BookingSlotTimeRepository,
	bookingSlotDateRepository repository.BookingSlotDateRepository,
	bookingSettingRepository repository.BookingSettingRepository,
	programRepository programRepo.ProgramRepository,
	artCTranslationRepository artCRepo.ArtCTranslationRepository,
) BookingSettingService {
	return &bookingSettingService{
		session:                   session,
		clock:                     clock,
		bookingTicketRepository:   bookingTicketRepository,
		bookingTxRepository:       bookingTxRepository,
		bookingSlotTimeRepository: bookingSlotTimeRepository,
		bookingSlotDateRepository: bookingSlotDateRepository,
		bookingSettingRepository:  bookingSettingRepository,
		programRepository:         programRepository,
		artCTranslationRepository: artCTranslationRepository,
	}
}
func (service *bookingSettingService) FindByProgramIDWithPreloadFields(
	c context.Context,
	client contexts.ClientType,
	pid uint,
	locale string,
	minDate *time.Time,
	fields []string,
) (model.BookingSettingResponse, int, error) {
	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()

	if !client.IsCMS() {
		if err := validator.IsValidLocale(locale); err != nil {
			return model.BookingSettingResponse{}, http.StatusBadRequest, err
		}
	}

	fieldsConfigMap := map[string]bool{
		"bookingSlotTimes": true,
		"bookingSlotDates": true,
		"program":          true,
	}

	var containBookingSlotTimes bool
	var containBookingSlotDates bool
	var containProgram bool
	var sanitizedPreloadFields []string
	for _, field := range fields {
		if fieldsConfigMap[field] {
			if field == "bookingSlotTimes" {
				containBookingSlotTimes = true
			}
			if field == "bookingSlotDates" {
				containBookingSlotDates = true
			}
			if field == "program" {
				containProgram = true
			}
			sanitizedPreloadFields = append(sanitizedPreloadFields, field)
		}
	}

	var bookingSetting entity.BookingSetting
	var err error
	if client.IsCMS() {
		bookingSetting, err = service.bookingSettingRepository.FindByProgramIDWithLocaleAndPreloadFields(
			ctx,
			"en",
			uint(pid),
			nil,
			sanitizedPreloadFields,
		)
	} else {
		var date *time.Time
		if minDate != nil {
			date = minDate
		}

		bookingSetting, err = service.bookingSettingRepository.FindByProgramIDWithLocaleAndPreloadFields(
			ctx,
			locale,
			uint(pid),
			date,
			sanitizedPreloadFields,
		)
	}

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return model.BookingSettingResponse{},
				http.StatusNotFound,
				errs.BuildCommonErrorNotFoundMsg("booking setting")
		} else {
			return model.BookingSettingResponse{},
				http.StatusInternalServerError,
				errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking setting content")
		}
	}

	var bookingSettingResponse model.BookingSettingResponse
	bookingSettingResponse.ID = bookingSetting.ID
	bookingSettingResponse.ProgramID = bookingSetting.ProgramID
	bookingSettingResponse.CreatedAt = bookingSetting.CreatedAt
	bookingSettingResponse.UpdatedAt = bookingSetting.UpdatedAt
	bookingSettingResponse.TicketPrice = bookingSetting.TicketPrice
	bookingSettingResponse.MaxTicketsPerTransaction = bookingSetting.MaxTicketsPerTransaction
	bookingSettingResponse.OpenBookingTime = bookingSetting.OpenBookingTime
	bookingSettingResponse.CloseBookingTime = bookingSetting.CloseBookingTime

	if client.IsCMS() {
		bookingSettingResponse.ConditionTextCN = bookingSetting.ConditionTextCN
		bookingSettingResponse.ConditionTextEN = bookingSetting.ConditionTextEN
		bookingSettingResponse.ConditionTextTH = bookingSetting.ConditionTextTH
	} else {
		conditionTextConfigMap := map[string]*string{
			"en": bookingSetting.ConditionTextEN,
			"th": bookingSetting.ConditionTextTH,
			"zh": bookingSetting.ConditionTextCN,
		}

		conditionText := ""
		if conditionTextConfigMap[locale] != nil {
			conditionText = *conditionTextConfigMap[locale]
		}
		bookingSettingResponse.ConditionText = &conditionText
	}

	if containBookingSlotTimes {
		if len(bookingSetting.BookingSlotDates) > 0 {
			bookingSlotDates := make([]model.BookingSettingSlotDate, 0, len(bookingSetting.BookingSlotDates))

			for _, bsd := range bookingSetting.BookingSlotDates {
				bookingSlotTimes := make([]model.BookingSettingSlotTime, 0, len(bsd.BookingSlotTimes))

				for _, bst := range bsd.BookingSlotTimes {
					bookingSlotTimes = append(bookingSlotTimes, model.BookingSettingSlotTime{
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
					})
				}

				bookingSlotDates = append(bookingSlotDates, model.BookingSettingSlotDate{
					ID:               bsd.ID,
					ProgramID:        bsd.ProgramID,
					BookingSettingID: bsd.BookingSettingID,
					CreatedAt:        bsd.CreatedAt,
					UpdatedAt:        bsd.UpdatedAt,
					SlotDate:         bsd.SlotDate,
					BookingSlotTimes: &bookingSlotTimes,
				})
			}

			bookingSettingResponse.BookingSlotDates = &bookingSlotDates
		}
	} else if containBookingSlotDates {
		if len(bookingSetting.BookingSlotDates) > 0 {
			bookingSlotDates := make([]model.BookingSettingSlotDate, 0, len(bookingSetting.BookingSlotDates))

			for _, bsd := range bookingSetting.BookingSlotDates {
				bookingSlotDates = append(bookingSlotDates, model.BookingSettingSlotDate{
					ID:               bsd.ID,
					ProgramID:        bsd.ProgramID,
					BookingSettingID: bsd.BookingSettingID,
					CreatedAt:        bsd.CreatedAt,
					UpdatedAt:        bsd.UpdatedAt,
					SlotDate:         bsd.SlotDate,
				})
			}

			bookingSettingResponse.BookingSlotDates = &bookingSlotDates
		}
	}

	if containProgram {
		if len(bookingSetting.Program.ProgramTranslation) > 0 {
			var artCTitle string
			artCTranslation, err := service.artCTranslationRepository.FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
				ctx,
				&bookingSetting.Program.ArtCTypeID,
				bookingSetting.Program.ArtCCategoryID,
				locale,
			)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					artCTitle = ""
				} else {
					return model.BookingSettingResponse{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find art c translation content")
				}
			} else {
				artCTitle = artCTranslation.Title
			}

			programTranslationCount := len(bookingSetting.Program.ProgramTranslation)
			localeIdx := 0   // default index is 0
			enLocaleIdx := 0 // default locale is "en"
			useDefaultLocale := false
			for i, pt := range bookingSetting.Program.ProgramTranslation {
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
				bookingSettingResponse.Program = &model.BookingSettingProgram{
					PeriodAt:  bookingSetting.Program.PeriodAt,
					PeriodEnd: bookingSetting.Program.PeriodEnd,
					ArtCTitle: artCTitle,
					Locale:    bookingSetting.Program.ProgramTranslation[enLocaleIdx].Locale,
					Locations: bookingSetting.Program.ProgramTranslation[enLocaleIdx].Locations,
					Title:     bookingSetting.Program.ProgramTranslation[enLocaleIdx].Title,
					Thumbnail: bookingSetting.Program.ProgramTranslation[enLocaleIdx].Thumbnail,
					Banner:    bookingSetting.Program.ProgramTranslation[enLocaleIdx].Banner,
				}
			} else {
				bookingSettingResponse.Program = &model.BookingSettingProgram{
					PeriodAt:  bookingSetting.Program.PeriodAt,
					PeriodEnd: bookingSetting.Program.PeriodEnd,
					ArtCTitle: artCTitle,
					Locale:    bookingSetting.Program.ProgramTranslation[localeIdx].Locale,
					Locations: bookingSetting.Program.ProgramTranslation[localeIdx].Locations,
					Title:     bookingSetting.Program.ProgramTranslation[localeIdx].Title,
					Thumbnail: bookingSetting.Program.ProgramTranslation[localeIdx].Thumbnail,
					Banner:    bookingSetting.Program.ProgramTranslation[localeIdx].Banner,
				}
			}
		}
	}

	return bookingSettingResponse, http.StatusOK, nil
}

func (service *bookingSettingService) Create(
	c context.Context,
	request model.BookingSettingCreateRequest,
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

			if request.ProgramID == nil {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorIsRequiredMsg("programId")
			}

			if request.TicketPrice == nil {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorIsRequiredMsg("ticketPrice")
			}

			if *request.TicketPrice < 0 {
				return map[string]any{}, http.StatusBadRequest, errors.New("ticketPrice should be greater than 0")
			}

			if request.MaxTicketsPerTransaction == nil {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorIsRequiredMsg("maxTicketsPerTransaction")
			}

			if request.OpenBookingTime == nil {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorIsRequiredMsg("openBookingTime")
			}

			if request.CloseBookingTime == nil {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorIsRequiredMsg("closeBookingTime")
			}

			if currentTime.In(loc).After((*request.CloseBookingTime).In(loc)) {
				return map[string]any{}, http.StatusBadRequest, errors.New("closeBookingTime less than current date")
			}

			if request.BookingSlotDates == nil {
				return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorIsRequiredMsg("bookingSlotDates")
			}

			if _, err := service.programRepository.FindOneByID(ctx, *request.ProgramID, ""); err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return map[string]any{}, http.StatusNotFound, errs.BuildCommonErrorNotFoundMsg("program")
				} else {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find program content")
				}
			}

			if _, err := service.bookingSettingRepository.FindByProgramID(ctx, *request.ProgramID); err == nil {
				return map[string]any{},
					http.StatusBadRequest,
					errs.BuildCommonErrorAlreadyExistsMsg("programId", "booking setting")
			}

			bookingSetting, err := service.bookingSettingRepository.Insert(ctx,
				entity.BookingSetting{
					ProgramID:                *request.ProgramID,
					ConditionTextEN:          request.ConditionTextEN,
					ConditionTextTH:          request.ConditionTextTH,
					ConditionTextCN:          request.ConditionTextCN,
					TicketPrice:              *request.TicketPrice,
					MaxTicketsPerTransaction: *request.MaxTicketsPerTransaction,
					OpenBookingTime:          *request.OpenBookingTime,
					CloseBookingTime:         *request.CloseBookingTime,
				})
			if err != nil {
				return map[string]any{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't create booking setting content")
			}

			bookingSlotDates := *request.BookingSlotDates
			if len(bookingSlotDates) > 0 {
				bsds := make([]entity.BookingSlotDate, 0, len(bookingSlotDates))
				slotDateCombinations := make([][2]time.Time, 0)
				for idx, bookingSlotDate := range bookingSlotDates {
					if bookingSlotDate.SlotDate == nil {
						return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorIsRequiredMsg("slotDate")
					}

					slotDate := *bookingSlotDate.SlotDate

					cy, cm, cd := currentTime.In(loc).Date()
					truncatedDayCurrentDate := time.Date(cy, cm, cd, 0, 0, 0, 0, loc)
					sy, sm, sd := slotDate.In(loc).Date()
					truncatedDaySlotDate := time.Date(sy, sm, sd, 0, 0, 0, 0, loc)

					if truncatedDayCurrentDate.After(truncatedDaySlotDate) {
						return map[string]any{}, http.StatusBadRequest, errors.New("slotDate less than current date")
					}

					if idx < len(bookingSlotDates)-1 {
						// Accumulate all slotDateCombinations
						for k := idx + 1; k < len(bookingSlotDates); k++ {
							slotDateCombinations = append(
								slotDateCombinations,
								[2]time.Time{slotDate.In(loc), bookingSlotDates[k].SlotDate.In(loc)},
							)
						}
					}

					if bookingSlotDate.BookingSlotTimes != nil {
						bookingSlotTimes := *bookingSlotDate.BookingSlotTimes
						if len(bookingSlotTimes) > 0 {
							bsts := make([]entity.BookingSlotTime, 0, len(bookingSlotTimes))

							var combinations [][2]struct {
								BeginSlotTime         *time.Time `json:"beginSlotTime"`
								EndSlotTime           *time.Time `json:"endSlotTime"`
								MaxTicketsPerSlotTime *int       `json:"maxTicketsPerSlotTime"`
							}
							for i := 0; i < len(bookingSlotTimes); i++ {
								if bookingSlotTimes[i].BeginSlotTime == nil {
									return map[string]any{},
										http.StatusBadRequest,
										errs.BuildCommonErrorIsRequiredMsg("beginSlotTime")
								}

								if bookingSlotTimes[i].EndSlotTime == nil {
									return map[string]any{},
										http.StatusBadRequest,
										errs.BuildCommonErrorIsRequiredMsg("endSlotTime")
								}

								if bookingSlotTimes[i].MaxTicketsPerSlotTime == nil {
									return map[string]any{},
										http.StatusBadRequest,
										errs.BuildCommonErrorIsRequiredMsg("maxTicketsPerSlotTime")
								}

								maxTicketsPerSlotTime := *bookingSlotTimes[i].MaxTicketsPerSlotTime
								if maxTicketsPerSlotTime < 0 {
									return map[string]any{},
										http.StatusBadRequest,
										errors.New("maxTicketsPerSlotTime should be greater than 0")
								}

								beginSlotTime := *bookingSlotTimes[i].BeginSlotTime
								endSlotTime := *bookingSlotTimes[i].EndSlotTime

								if y, m, d := beginSlotTime.In(loc).Date(); y != sy || m != sm || d != sd {
									return map[string]any{},
										http.StatusBadRequest,
										errs.BuildCommonErrorInvalidMsg("bookingSlotTimes")
								}

								if y, m, d := endSlotTime.In(loc).Date(); y != sy || m != sm || d != sd {
									return map[string]any{},
										http.StatusBadRequest,
										errs.BuildCommonErrorInvalidMsg("bookingSlotTimes")
								}

								bsts = append(bsts, entity.BookingSlotTime{
									ProgramID:             bookingSetting.ProgramID,
									BookingSettingID:      bookingSetting.ID,
									BeginSlotTime:         beginSlotTime,
									EndSlotTime:           endSlotTime,
									MaxTicketsPerSlotTime: maxTicketsPerSlotTime,
									BookedTicketsCount:    0,
									BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
								})

								if i < len(bookingSlotTimes)-1 {
									// Accumulate all combinations
									for j := i + 1; j < len(bookingSlotTimes); j++ {
										combinations = append(combinations, [2]struct {
											BeginSlotTime         *time.Time `json:"beginSlotTime"`
											EndSlotTime           *time.Time `json:"endSlotTime"`
											MaxTicketsPerSlotTime *int       `json:"maxTicketsPerSlotTime"`
										}{bookingSlotTimes[i], bookingSlotTimes[j]})
									}
								}
							}

							// Check for overlapping intervals in the accumulated combinations
							for _, pair := range combinations {
								firstBeginSlotTime := (*pair[0].BeginSlotTime).In(loc)
								firstEndSlotTime := (*pair[0].EndSlotTime).In(loc)
								secondBeginSlotTime := (*pair[1].BeginSlotTime).In(loc)
								secondEndSlotTime := (*pair[1].EndSlotTime).In(loc)
								if firstEndSlotTime.After(secondBeginSlotTime) &&
									firstBeginSlotTime.Before(secondEndSlotTime) {
									// Return error for overlapping intervals
									return map[string]any{},
										http.StatusBadRequest,
										errors.New("bookingSlotTimes overlapping intervals found")
								}
							}

							bsds = append(bsds, entity.BookingSlotDate{
								ProgramID:        bookingSetting.ProgramID,
								BookingSettingID: bookingSetting.ID,
								SlotDate:         truncatedDaySlotDate,
								BookingSlotTimes: bsts,
							})
						} else {
							bsds = append(bsds, entity.BookingSlotDate{
								ProgramID:        bookingSetting.ProgramID,
								BookingSettingID: bookingSetting.ID,
								SlotDate:         truncatedDaySlotDate,
							})
						}
					} else {
						bsds = append(bsds, entity.BookingSlotDate{
							ProgramID:        bookingSetting.ProgramID,
							BookingSettingID: bookingSetting.ID,
							SlotDate:         truncatedDaySlotDate,
						})
					}
				}

				// Check for duplication in the accumulated slotDateCombinations
				for _, pair := range slotDateCombinations {
					fy, fm, fd := pair[0].Date()
					sy, sm, sd := pair[1].Date()

					if fy == sy && fm == sm && fd == sd {
						// Return error for duplicated dates
						return map[string]any{}, http.StatusBadRequest, errors.New("bookingSlotDates duplicated dates found")
					}
				}

				_, err = service.bookingSlotDateRepository.BulkUpsert(ctx, bsds)
				if err != nil {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't create booking slot date contents")
				}
			}

			return map[string]any{"id": bookingSetting.ID}, http.StatusOK, nil
		}()

		if err != nil {
			return err
		}

		return nil
	})

	return res, httpStatusCode, err
}

func (service *bookingSettingService) Patch(
	c context.Context,
	idString string,
	request model.BookingSettingPatchRequest,
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

			bookingSetting, err := service.bookingSettingRepository.
				FindByIDWithBookingSlotDatesAndBookingSlotTimes(ctx, idString)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return map[string]any{}, http.StatusNotFound, errs.BuildCommonErrorNotFoundMsg("booking setting")
				} else {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking setting content")
				}
			}

			if request.TicketPrice != nil && *request.TicketPrice != bookingSetting.TicketPrice {
				if (request.OpenBookingTime != nil && (*request.OpenBookingTime).In(loc).Before(currentTime.In(loc))) ||
					bookingSetting.OpenBookingTime.In(loc).Before(currentTime.In(loc)) {
					return map[string]any{},
						http.StatusBadRequest,
						errors.New("ticketPrice cannot be edited because the sale is already opened")
				}

				if *request.TicketPrice < 0 {
					return map[string]any{}, http.StatusBadRequest, errors.New("ticketPrice should be greater than 0")
				}

				bookingTickets, err := service.bookingTicketRepository.
					FindAllByBookingSettingID(ctx, bookingSetting.ID)
				if err != nil {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking ticket contents")
				}

				if len(bookingTickets) > 0 {
					return map[string]any{},
						http.StatusBadRequest,
						errors.New("ticketPrice cannot be edited because the sale is already booked")
				}
			}

			if request.CloseBookingTime != nil && currentTime.In(loc).After((*request.CloseBookingTime).In(loc)) {
				return map[string]any{}, http.StatusBadRequest, errors.New("closeBookingTime less than current date")
			}

			if request.ProgramID != nil {
				if _, err := service.programRepository.
					FindOneByID(ctx, *request.ProgramID, ""); err != nil {
					if errors.Is(err, gorm.ErrRecordNotFound) {
						return map[string]any{}, http.StatusNotFound, errs.BuildCommonErrorNotFoundMsg("program")
					} else {
						return map[string]any{},
							http.StatusInternalServerError,
							errs.BuildCommonErrorInternalServerMsg(", ", "can't find program content")
					}
				}

				if v, err := service.bookingSettingRepository.
					FindByProgramID(ctx, *request.ProgramID); err == nil && v.ID != idString {
					return map[string]any{},
						http.StatusBadRequest,
						errs.BuildCommonErrorAlreadyExistsMsg("programId", "booking setting")
				}
			}

			fields, m := request.ToQueryParams()
			if err := service.bookingSettingRepository.
				UpdateByIDWithSelectedFields(ctx, bookingSetting.ID, fields, m); err != nil {
				return map[string]any{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't update booking setting content")
			}

			var toBeInsertedBookingSlotDates []entity.BookingSlotDate = make([]entity.BookingSlotDate, 0)
			var toBeUpdatedBookingSlotDates []entity.BookingSlotDate = make([]entity.BookingSlotDate, 0)

			if request.BookingSlotDates != nil {
				bookingSlotDates := *request.BookingSlotDates
				if len(bookingSlotDates) > 0 {
					slotDateCombinations := make([][2]time.Time, 0)
					for idx, bookingSlotDate := range bookingSlotDates {
						if bookingSlotDate.SlotDate == nil {
							return map[string]any{}, http.StatusBadRequest, errs.BuildCommonErrorIsRequiredMsg("slotDate")
						}

						slotDate := *bookingSlotDate.SlotDate

						sy, sm, sd := slotDate.In(loc).Date()
						truncatedDaySlotDate := time.Date(sy, sm, sd, 0, 0, 0, 0, loc)

						if idx < len(bookingSlotDates)-1 {
							// Accumulate all slotDateCombinations
							for k := idx + 1; k < len(bookingSlotDates); k++ {
								slotDateCombinations = append(
									slotDateCombinations,
									[2]time.Time{slotDate.In(loc), bookingSlotDates[k].SlotDate.In(loc)},
								)
							}
						}

						if bookingSlotDate.BookingSlotTimes != nil {
							bookingSlotTimes := *bookingSlotDate.BookingSlotTimes
							if len(bookingSlotTimes) > 0 {
								combinations := make([][2]struct {
									ID                    *string    `json:"id"`
									BeginSlotTime         *time.Time `json:"beginSlotTime"`
									EndSlotTime           *time.Time `json:"endSlotTime"`
									MaxTicketsPerSlotTime *int       `json:"maxTicketsPerSlotTime"`
								}, 0)

								var toBeInsertedBookingSlotTimes []entity.BookingSlotTime = make([]entity.BookingSlotTime, 0)
								var toBeUpdatedBookingSlotTimes []entity.BookingSlotTime = make([]entity.BookingSlotTime, 0)

								for i := 0; i < len(bookingSlotTimes); i++ {
									if bookingSlotTimes[i].BeginSlotTime == nil {
										return map[string]any{},
											http.StatusBadRequest,
											errs.BuildCommonErrorIsRequiredMsg("beginSlotTime")
									}

									if bookingSlotTimes[i].EndSlotTime == nil {
										return map[string]any{},
											http.StatusBadRequest,
											errs.BuildCommonErrorIsRequiredMsg("endSlotTime")
									}

									if bookingSlotTimes[i].MaxTicketsPerSlotTime == nil {
										return map[string]any{},
											http.StatusBadRequest,
											errs.BuildCommonErrorIsRequiredMsg("maxTicketsPerSlotTime")
									}

									maxTicketsPerSlotTime := *bookingSlotTimes[i].MaxTicketsPerSlotTime
									if maxTicketsPerSlotTime < 0 {
										return map[string]any{},
											http.StatusBadRequest,
											errors.New("maxTicketsPerSlotTime should be greater than 0")
									}

									beginSlotTime := *bookingSlotTimes[i].BeginSlotTime
									endSlotTime := *bookingSlotTimes[i].EndSlotTime

									if y, m, d := beginSlotTime.In(loc).Date(); y != sy || m != sm || d != sd {
										return map[string]any{},
											http.StatusBadRequest,
											errs.BuildCommonErrorInvalidMsg("bookingSlotTimes")
									}

									if y, m, d := endSlotTime.In(loc).Date(); y != sy || m != sm || d != sd {
										return map[string]any{},
											http.StatusBadRequest,
											errs.BuildCommonErrorInvalidMsg("bookingSlotTimes")
									}

									if bookingSlotTimes[i].ID == nil {
										toBeInsertedBookingSlotTimes = append(
											toBeInsertedBookingSlotTimes,
											entity.BookingSlotTime{
												ProgramID:             bookingSetting.ProgramID,
												BookingSettingID:      bookingSetting.ID,
												BeginSlotTime:         beginSlotTime,
												EndSlotTime:           endSlotTime,
												MaxTicketsPerSlotTime: maxTicketsPerSlotTime,
												BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
											},
										)
									} else {
										toBeUpdatedBookingSlotTimes = append(
											toBeUpdatedBookingSlotTimes,
											entity.BookingSlotTime{
												ID:                    *bookingSlotTimes[i].ID,
												ProgramID:             bookingSetting.ProgramID,
												BookingSettingID:      bookingSetting.ID,
												BeginSlotTime:         beginSlotTime,
												EndSlotTime:           endSlotTime,
												MaxTicketsPerSlotTime: maxTicketsPerSlotTime,
												BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
											},
										)
									}

									if i < len(bookingSlotTimes)-1 {
										// Accumulate all combinations
										for j := i + 1; j < len(bookingSlotTimes); j++ {
											combinations = append(combinations, [2]struct {
												ID                    *string    `json:"id"`
												BeginSlotTime         *time.Time `json:"beginSlotTime"`
												EndSlotTime           *time.Time `json:"endSlotTime"`
												MaxTicketsPerSlotTime *int       `json:"maxTicketsPerSlotTime"`
											}{bookingSlotTimes[i], bookingSlotTimes[j]})
										}
									}
								}

								// Check for overlapping intervals in the accumulated combinations
								for _, pair := range combinations {
									firstBeginSlotTime := (*pair[0].BeginSlotTime).In(loc)
									firstEndSlotTime := (*pair[0].EndSlotTime).In(loc)
									secondBeginSlotTime := (*pair[1].BeginSlotTime).In(loc)
									secondEndSlotTime := (*pair[1].EndSlotTime).In(loc)
									if firstEndSlotTime.After(secondBeginSlotTime) &&
										firstBeginSlotTime.Before(secondEndSlotTime) {
										// Return error for overlapping intervals
										return map[string]any{},
											http.StatusBadRequest,
											errors.New("bookingSlotTimes overlapping intervals found")
									}
								}

								if bookingSlotDate.ID == nil {
									bookingSlotTimes := append(
										toBeInsertedBookingSlotTimes,
										toBeUpdatedBookingSlotTimes...,
									)
									toBeInsertedBookingSlotDates = append(
										toBeInsertedBookingSlotDates,
										entity.BookingSlotDate{
											ProgramID: *utils.If(
												request.ProgramID != nil,
												request.ProgramID,
												&bookingSetting.ProgramID,
											),
											BookingSettingID: bookingSetting.ID,
											SlotDate:         truncatedDaySlotDate,
											BookingSlotTimes: bookingSlotTimes,
										},
									)
								} else {
									bookingSlotTimes := append(
										toBeInsertedBookingSlotTimes,
										toBeUpdatedBookingSlotTimes...,
									)
									toBeUpdatedBookingSlotDates = append(
										toBeUpdatedBookingSlotDates,
										entity.BookingSlotDate{
											ID: *bookingSlotDate.ID,
											ProgramID: *utils.If(
												request.ProgramID != nil,
												request.ProgramID,
												&bookingSetting.ProgramID,
											),
											BookingSettingID: bookingSetting.ID,
											SlotDate:         truncatedDaySlotDate,
											BookingSlotTimes: bookingSlotTimes,
										},
									)
								}
							} else {
								if bookingSlotDate.ID == nil {
									toBeInsertedBookingSlotDates = append(
										toBeInsertedBookingSlotDates,
										entity.BookingSlotDate{
											ProgramID: *utils.If(
												request.ProgramID != nil,
												request.ProgramID,
												&bookingSetting.ProgramID,
											),
											BookingSettingID: bookingSetting.ID,
											SlotDate:         truncatedDaySlotDate,
										},
									)
								} else {
									toBeUpdatedBookingSlotDates = append(
										toBeUpdatedBookingSlotDates,
										entity.BookingSlotDate{
											ID: *bookingSlotDate.ID,
											ProgramID: *utils.If(
												request.ProgramID != nil,
												request.ProgramID,
												&bookingSetting.ProgramID,
											),
											BookingSettingID: bookingSetting.ID,
											SlotDate:         truncatedDaySlotDate,
										})
								}
							}
						} else {
							if bookingSlotDate.ID == nil {
								toBeInsertedBookingSlotDates = append(
									toBeInsertedBookingSlotDates,
									entity.BookingSlotDate{
										ProgramID: *utils.If(
											request.ProgramID != nil,
											request.ProgramID,
											&bookingSetting.ProgramID,
										),
										BookingSettingID: bookingSetting.ID,
										SlotDate:         truncatedDaySlotDate,
									})
							} else {
								toBeUpdatedBookingSlotDates = append(
									toBeUpdatedBookingSlotDates,
									entity.BookingSlotDate{
										ID: *bookingSlotDate.ID,
										ProgramID: *utils.If(
											request.ProgramID != nil,
											request.ProgramID,
											&bookingSetting.ProgramID,
										),
										BookingSettingID: bookingSetting.ID,
										SlotDate:         truncatedDaySlotDate,
									})
							}
						}
					}

					// Check for duplication in the accumulated slotDateCombinations
					for _, pair := range slotDateCombinations {
						fy, fm, fd := pair[0].Date()
						sy, sm, sd := pair[1].Date()

						if fy == sy && fm == sm && fd == sd {
							// Return error for duplicated dates
							return map[string]any{},
								http.StatusBadRequest,
								errors.New("bookingSlotDates duplicated dates found")
						}
					}

					currentBookingSlotDates, err := service.bookingSlotDateRepository.
						FindAllByBookingSettingIDWithBookingSlotTimes(ctx, bookingSetting.ID)
					if err != nil {
						return map[string]any{},
							http.StatusInternalServerError,
							errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking slot date contents")
					}

					if len(currentBookingSlotDates) > 0 {
						ids := make([]string, 0, len(toBeUpdatedBookingSlotDates))
						for _, bsd := range toBeUpdatedBookingSlotDates {
							ids = append(ids, bsd.ID)
						}

						toBeDeletedBookingSlotDates := make([]entity.BookingSlotDate, 0)
						for _, c := range currentBookingSlotDates {
							if contains(ids, c.ID) {
								continue
							}

							toBeDeletedBookingSlotDates = append(toBeDeletedBookingSlotDates, c)
						}

						if len(toBeDeletedBookingSlotDates) > 0 {
							var bookingSlotDateIDs []string
							for _, bsd := range toBeDeletedBookingSlotDates {
								bookingSlotDateIDs = append(bookingSlotDateIDs, bsd.ID)
							}

							associatedBookingSlotTimes := make([]entity.BookingSlotTime, 0)
							for _, bsd := range toBeDeletedBookingSlotDates {
								if len(bsd.BookingSlotTimes) > 0 {
									associatedBookingSlotTimes = append(
										associatedBookingSlotTimes,
										bsd.BookingSlotTimes...,
									)
								}
							}

							if len(associatedBookingSlotTimes) > 0 {
								var bookingSlotTimeIDs []string
								for _, bst := range associatedBookingSlotTimes {
									bookingSlotTimeIDs = append(bookingSlotTimeIDs, bst.ID)
								}

								if rowsAffected, err := service.bookingTxRepository.
									CountByBookingSlotTimeIDs(ctx, bookingSlotTimeIDs); err != nil {
									return map[string]any{},
										http.StatusInternalServerError,
										errs.BuildCommonErrorInternalServerMsg(
											", ",
											"can't count booking transaction contents by booking slot time ids",
										)
								} else {
									if rowsAffected > 0 {
										return map[string]any{},
											http.StatusBadRequest,
											errors.New("can't delete booking slot time contents, because it is being used by booking transaction")
									}
								}

								_, err := service.bookingSlotTimeRepository.
									BulkDelete(ctx, associatedBookingSlotTimes)
								if err != nil {
									return map[string]any{},
										http.StatusInternalServerError,
										errs.BuildCommonErrorInternalServerMsg(
											", ",
											"can't delete booking slot time contents",
										)
								}
							}

							if len(bookingSlotDateIDs) > 0 {
								if rowsAffected, err := service.bookingTxRepository.
									CountByBookingSlotDateIDs(ctx, bookingSlotDateIDs); err != nil {
									return map[string]any{},
										http.StatusInternalServerError,
										errs.BuildCommonErrorInternalServerMsg(
											", ",
											"can't count booking transaction contents by booking slot date ids",
										)
								} else {
									if rowsAffected > 0 {
										return map[string]any{},
											http.StatusBadRequest,
											errors.New("can't delete booking slot date contents, because it is being used by booking transaction")
									}
								}
							}

							_, err := service.bookingSlotDateRepository.BulkDelete(ctx, toBeDeletedBookingSlotDates)
							if err != nil {
								return map[string]any{},
									http.StatusInternalServerError,
									errs.BuildCommonErrorInternalServerMsg(", ", "can't delete booking slot date contents")
							}
						}
					}

					if len(toBeUpdatedBookingSlotDates) > 0 {
						bsds, err := service.bookingSlotDateRepository.
							BulkUpsert(ctx, toBeUpdatedBookingSlotDates)
						if err != nil {
							return map[string]any{},
								http.StatusInternalServerError,
								errs.BuildCommonErrorInternalServerMsg(", ", "can't update booking slot date contents")
						}

						var bsts []entity.BookingSlotTime
						for _, bsd := range bsds {
							if len(bsd.BookingSlotTimes) == 0 {
								continue
							}

							// Assign inserted booking slot date id value to booking slot time records
							for _, bst := range bsd.BookingSlotTimes {
								// Both new records and existing records have same booking slot date id
								bst.BookingSlotDateID = bsd.ID
								bsts = append(bsts, bst)
							}
						}

						if len(bsts) > 0 {
							_, err := service.bookingSlotTimeRepository.BulkUpsert(ctx, bsts)
							if err != nil {
								return map[string]any{},
									http.StatusInternalServerError,
									errs.BuildCommonErrorInternalServerMsg(", ", "can't upsert booking slot time contents")
							}
						}
					}

					if len(toBeInsertedBookingSlotDates) > 0 {
						bsds, err := service.bookingSlotDateRepository.BulkUpsert(ctx, toBeInsertedBookingSlotDates)
						if err != nil {
							return map[string]any{},
								http.StatusInternalServerError,
								errs.BuildCommonErrorInternalServerMsg(", ", "can't insert booking slot date contents")
						}

						var bsts []entity.BookingSlotTime
						for _, bsd := range bsds {
							if len(bsd.BookingSlotTimes) == 0 {
								continue
							}

							// Assign inserted booking slot date id value to booking slot time records
							for _, bst := range bsd.BookingSlotTimes {
								// Both new records and existing records have same booking slot date id
								bst.BookingSlotDateID = bsd.ID
								bsts = append(bsts, bst)
							}
						}

						if len(bsts) > 0 {
							_, err := service.bookingSlotTimeRepository.BulkUpsert(ctx, bsts)
							if err != nil {
								return map[string]any{},
									http.StatusInternalServerError,
									errs.BuildCommonErrorInternalServerMsg(", ", "can't upsert booking slot time contents")
							}
						}
					}
				} else {
					if rowsAffected, err := service.bookingTxRepository.
						CountByBookingSettingIDs(ctx, []string{bookingSetting.ID}); err != nil {
						return map[string]any{},
							http.StatusInternalServerError,
							errs.BuildCommonErrorInternalServerMsg(", ", "can't count booking transaction contents by booking setting id")
					} else {
						if rowsAffected > 0 {
							return map[string]any{},
								http.StatusBadRequest,
								errors.New("Cannot delete Booking setting with existing purchased transactions.")
						}
					}

					if err := service.bookingSlotTimeRepository.
						DeleteAllByBookingSettingID(ctx, bookingSetting.ID); err != nil {
						return map[string]any{},
							http.StatusInternalServerError,
							errs.BuildCommonErrorInternalServerMsg(", ", "can't delete booking slot time contents")
					}

					if err := service.bookingSlotDateRepository.
						DeleteAllByBookingSettingID(ctx, bookingSetting.ID); err != nil {
						return map[string]any{},
							http.StatusInternalServerError,
							errs.BuildCommonErrorInternalServerMsg(", ", "can't delete booking slot date contents")
					}
				}
			}

			return map[string]any{"id": bookingSetting.ID}, http.StatusOK, nil
		}()

		if err != nil {
			return err
		}

		return nil
	})

	return res, httpStatusCode, err
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func (service *bookingSettingService) Delete(c context.Context, id string) (map[string]any, int, error) {
	var (
		res            map[string]any
		err            error
		httpStatusCode int
	)

	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()
	_ = service.session.Transact(ctx, func(ctx context.Context) error {
		res, httpStatusCode, err = func() (map[string]any, int, error) {
			bookingSetting, err := service.bookingSettingRepository.
				FindByIDWithBookingSlotDatesAndBookingSlotTimes(ctx, id)
			if err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return map[string]any{}, http.StatusNotFound, errs.BuildCommonErrorNotFoundMsg("booking setting")
				} else {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking setting content")
				}
			}

			if rowsAffected, err := service.bookingTxRepository.
				CountByBookingSettingIDs(ctx, []string{bookingSetting.ID}); err != nil {
				return map[string]any{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't count booking transaction contents by booking setting id")
			} else {
				if rowsAffected > 0 {
					return map[string]any{},
						http.StatusBadRequest,
						errors.New("Cannot delete Booking setting with existing purchased transactions.")
				}
			}

			if len(bookingSetting.BookingSlotDates) > 0 {
				bookingSlotDates := bookingSetting.BookingSlotDates

				bookingSlotTimes := make([]entity.BookingSlotTime, 0)
				for _, bsd := range bookingSlotDates {
					if len(bsd.BookingSlotTimes) > 0 {
						bookingSlotTimes = append(bookingSlotTimes, bsd.BookingSlotTimes...)
					}
				}

				if len(bookingSlotTimes) > 0 {
					_, err := service.bookingSlotTimeRepository.BulkDelete(ctx, bookingSlotTimes)
					if err != nil {
						return map[string]any{},
							http.StatusInternalServerError,
							errs.BuildCommonErrorInternalServerMsg(", ", "can't delete booking slot time contents")
					}
				}

				_, err := service.bookingSlotDateRepository.BulkDelete(ctx, bookingSlotDates)
				if err != nil {
					return map[string]any{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't delete booking slot date contents")
				}
			}

			err = service.bookingSettingRepository.DeleteByID(ctx, bookingSetting.ID)
			if err != nil {
				return map[string]any{},
					http.StatusInternalServerError,
					errs.BuildCommonErrorInternalServerMsg(", ", "can't delete booking setting content")
			}

			return map[string]any{"id": bookingSetting.ID}, http.StatusOK, nil
		}()

		if err != nil {
			return err
		}

		return nil
	})

	return res, httpStatusCode, err
}

func (service *bookingSettingService) GetAllWithPagination(
	c context.Context,
	pagination pkg.Pagination,
	preloadFields []string,
	filterFields map[string]any,
	locale string,
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

	if err := validator.IsValidLocale(locale); err != nil {
		return pkg.Pagination{}, http.StatusBadRequest, err
	}

	fieldsConfigMap := map[string]bool{
		"program": true,
	}

	var containProgram bool
	for _, field := range preloadFields {
		if fieldsConfigMap[field] {
			if field == "program" {
				containProgram = true
			}
		}
	}

	if paginatedBookingSettings, pagination, err := service.bookingSettingRepository.
		FindAllWithPagination(ctx, locale, pagination, filterFields, time.Date(y, m, d, 0, 0, 0, 0, loc)); err != nil {
		return pkg.Pagination{},
			http.StatusInternalServerError,
			errs.BuildCommonErrorInternalServerMsg(", ", "can't find the pagination of booking setting contents")
	} else {
		if len(paginatedBookingSettings) > 0 {
			var artCTranslations []artCEntity.ArtCTranslation
			if containProgram {
				tuples := make([][]interface{}, 0, len(paginatedBookingSettings))
				m := make(map[string]struct{}, 0)
				for _, bs := range paginatedBookingSettings {
					k := fmt.Sprintf("%v-%v-%v", bs.ArtCTypeID, bs.ArtCCategoryID, locale)
					if _, ok := m[k]; ok {
						continue
					}
					m[k] = struct{}{}
					tuples = append(tuples, []interface{}{bs.ArtCTypeID, bs.ArtCCategoryID, locale})
				}
				artCTranslations, err = service.artCTranslationRepository.
					FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(ctx, tuples)
				if err != nil {
					return pkg.Pagination{},
						http.StatusInternalServerError,
						errs.BuildCommonErrorInternalServerMsg(", ", "can't find art translation content")
				}
			}

			paginationResponse := make([]model.BookingSettingPaginationResponse, 0, len(paginatedBookingSettings))
			for _, bs := range paginatedBookingSettings {
				var r model.BookingSettingPaginationResponse
				r.ID = bs.ID
				r.ProgramID = bs.ProgramID
				r.TicketPrice = bs.TicketPrice
				r.OpenBookingTime = bs.OpenBookingTime
				r.CloseBookingTime = bs.CloseBookingTime
				r.MaxTickets = int(bs.TotalMaxTicketsPerSlotTime)
				r.BookedCount = int(bs.BookedCount)
				r.CheckedCount = int(bs.TotalCheckedIn)

				if containProgram {
					var matched bool
					var artCTranslationTitle string
					if len(artCTranslations) > 0 {
						for _, artCTranslation := range artCTranslations {
							if matched {
								break
							}

							isArtCTypeEqual := artCTranslation.ArtCTypeID != nil &&
								*artCTranslation.ArtCTypeID == bs.ArtCTypeID
							isArtCCategoryEqual := (artCTranslation.ArtCCategoryID != nil &&
								bs.ArtCCategoryID != nil &&
								*artCTranslation.ArtCCategoryID == *bs.ArtCCategoryID) ||
								(artCTranslation.ArtCCategoryID == nil && bs.ArtCCategoryID == nil)
							isLocaleEqual := artCTranslation.Locale == locale
							if isArtCTypeEqual && isArtCCategoryEqual && isLocaleEqual {
								matched = true
								artCTranslationTitle = artCTranslation.Title
							}
						}
					}

					r.Program = &model.BookingSettingPaginationProgram{
						PeriodAt:  bs.ProgramPeriodAt,
						PeriodEnd: bs.ProgramPeriodEnd,
						ArtCTitle: artCTranslationTitle,
						Locale:    bs.ProgramLocale,
						Locations: bs.ProgramLocations,
						Title:     bs.ProgramTitle,
					}
				}

				paginationResponse = append(paginationResponse, r)
			}

			pagination.Data = paginationResponse
			return *pagination, http.StatusOK, nil
		}

		pagination.Data = []model.BookingSettingPaginationResponse{}
		return *pagination, http.StatusOK, nil
	}
}

func (service *bookingSettingService) CheckAvailability(
	c context.Context,
	request model.BookingSettingCheckAvailabilityRequest,
) ([]model.BookingSettingCheckAvailabilityResponse, int, error) {
	ctx, cancel := context.WithTimeout(c, time.Second*5)
	defer cancel()

	if len(request.ProgramIDs) == 0 {
		return []model.BookingSettingCheckAvailabilityResponse{},
			http.StatusBadRequest,
			errs.BuildCommonErrorInvalidMsg("programIds")
	}

	bookingSettings, err := service.bookingSettingRepository.FindAllByProgramIDsWithBookingSlotDates(ctx, request.ProgramIDs)
	if err != nil {
		return []model.BookingSettingCheckAvailabilityResponse{},
			http.StatusInternalServerError,
			errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking setting contents")
	}

	var response []model.BookingSettingCheckAvailabilityResponse
	for _, programID := range request.ProgramIDs {
		isAvailable := false
		for _, bs := range bookingSettings {
			if bs.ProgramID == programID {
				openTimeCond := bs.OpenBookingTime.In(request.Time.Location()).Before(request.Time) ||
					bs.OpenBookingTime.In(request.Time.Location()).Equal(request.Time)
				closeTimeCond := bs.CloseBookingTime.In(request.Time.Location()).After(request.Time) ||
					bs.CloseBookingTime.In(request.Time.Location()).Equal(request.Time)
				inRange := openTimeCond && closeTimeCond

				if inRange {
					y, m, d := request.Time.Date()
					truncatedDate := time.Date(y, m, d, 0, 0, 0, 0, request.Time.Location())
					for _, bsd := range bs.BookingSlotDates {
						if bsd.SlotDate.In(request.Time.Location()).After(truncatedDate) ||
							bsd.SlotDate.In(request.Time.Location()).Equal(truncatedDate) {

							isAvailable = true
							break
						}
					}
				}
			}
		}

		response = append(response, model.BookingSettingCheckAvailabilityResponse{
			ProgramID:   programID,
			IsAvailable: isAvailable,
		})
	}

	return response, http.StatusOK, nil
}
