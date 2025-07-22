package adapter

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"example.com/art-culture-api/domain/booking/errs"
	"example.com/art-culture-api/domain/booking/model"
	"example.com/art-culture-api/domain/booking/service"
	"example.com/art-culture-api/domain/booking/validator"
	"example.com/art-culture-api/pkg"
	"example.com/art-culture-api/pkg/constants"
	"example.com/art-culture-api/pkg/contexts"

	repo "example.com/art-culture-api/domain/booking/adapter/repo"
	"example.com/art-culture-api/domain/booking/adapter/session"

	ac "example.com/art-culture-api/domain/act_c/adapter"
	pr "example.com/art-culture-api/domain/programs/adapter"
	"github.com/gofiber/fiber/v2"
	"github.com/jonboulle/clockwork"
	"gorm.io/gorm"
)

type BookingSettingHandler struct {
	service service.BookingSettingService
}

func NewBookingSettingHandler(db *gorm.DB) *BookingSettingHandler {
	clock := clockwork.NewRealClock()
	session := session.New(db)
	bookingTicketRepo := repo.NewOrmBookingTicketRepository(db)
	bookingTxRepo := repo.NewOrmBookingTxRepository(db)
	bookingSlotTimeRepo := repo.NewOrmBookingSlotTimeRepository(db)
	bookingSlotDateRepo := repo.NewOrmBookingSlotDateRepository(db)
	bookingSettingRepo := repo.NewOrmBookingSettingRepository(db)
	programRepo := pr.NewOrmProgramRepository(db)
	artCTranslationRepo := ac.NewOrmArtCTranslationRepository(db)
	service := service.NewBookingSettingService(
		session,
		clock,
		bookingTicketRepo,
		bookingTxRepo,
		bookingSlotTimeRepo,
		bookingSlotDateRepo,
		bookingSettingRepo,
		programRepo,
		artCTranslationRepo,
	)

	return &BookingSettingHandler{
		service: service,
	}
}

func (handler *BookingSettingHandler) FindByProgramIDWithPreloadFields(ctx *fiber.Ctx) error {
	programID := ctx.Query("programId")
	if programID == "" {
		return ctx.Status(http.StatusBadRequest).
			JSON(fiber.Map{"message": errs.BuildCommonErrorIsRequiredMsg("programId").Error()})
	}

	var minDate *time.Time
	client, _ := ctx.Locals(contexts.ClientType{}).(contexts.ClientType)
	if !client.IsCMS() {
		loc, err := time.LoadLocation(ctx.Get(constants.TimeZone))
		if err != nil {
			return ctx.Status(http.StatusBadRequest).
				JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg(constants.TimeZone).Error()})
		}

		minDateQuery := ctx.Query("minDate")
		if minDateQuery != "" {
			layout := "2006-01-02"
			parsedTime, err := time.ParseInLocation(layout, minDateQuery, loc)
			if err != nil {
				return ctx.Status(http.StatusBadRequest).
					JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("minDate").Error()})
			}

			minDate = &parsedTime
		}
	}

	pid, err := strconv.ParseUint(programID, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).
			JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("id").Error()})
	}

	res, httpStatusCode, err := handler.service.
		FindByProgramIDWithPreloadFields(
			ctx.UserContext(),
			client,
			uint(pid), 
			ctx.Get("locale"),
			minDate,
			strings.Split(ctx.Query("fields"), ","),
		)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}

func (handler *BookingSettingHandler) Create(ctx *fiber.Ctx) error {
	var request model.BookingSettingCreateRequest
	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "invalid request body"})
	}

	res, httpStatusCode, err := handler.service.
		Create(ctx.UserContext(), request, ctx.Get("locale"), ctx.Get(constants.TimeZone))
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}

func (handler *BookingSettingHandler) Patch(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if err := validator.IsValidUUID(id); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("id").Error()})
	}

	var request model.BookingSettingPatchRequest
	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "invalid request body"})
	}

	// Validate if the parsed request struct is empty by checking if all fields are nil
	if request.ProgramID == nil &&
		request.ConditionTextEN == nil &&
		request.ConditionTextTH == nil &&
		request.ConditionTextCN == nil &&
		request.TicketPrice == nil &&
		request.MaxTicketsPerTransaction == nil &&
		request.OpenBookingTime == nil &&
		request.CloseBookingTime == nil &&
		request.BookingSlotDates == nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "invalid request body"})
	}

	res, httpStatusCode, err := handler.service.
		Patch(ctx.UserContext(), id, request, ctx.Get("locale"), ctx.Get(constants.TimeZone))
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}

func (handler *BookingSettingHandler) Delete(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if err := validator.IsValidUUID(id); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("id").Error()})
	}

	res, httpStatusCode, err := handler.service.Delete(ctx.UserContext(), id)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}

func (handler *BookingSettingHandler) GetAllWithPagination(ctx *fiber.Ctx) error {
	var request model.BookingSettingPaginationRequest
	if err := ctx.QueryParser(&request); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "invalid query params"})
	}

	loc, err := time.LoadLocation(ctx.Get(constants.TimeZone))
	if err != nil {
		return ctx.Status(http.StatusBadRequest).
			JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg(constants.TimeZone).Error()})
	}

	var pagination pkg.Pagination

	if request.Page != nil {
		pagination.Page = *request.Page
	}
	if request.Limit != nil {
		pagination.Limit = *request.Limit
	}

	var filterFields = make(map[string]any)
	if programTitle := request.ProgramTitle; programTitle != nil {
		filterFields["programTitle"] = *programTitle
	}
	if beginDate := request.BeginDate; beginDate != nil {
		filterFields["beginDate"] = (*beginDate).In(loc)
	}
	if endDate := request.EndDate; endDate != nil {
		filterFields["endDate"] = (*endDate).In(loc)
	}
	if status := request.Status; status != nil {
		var statusMap = map[string]bool{
			string(model.WaitingStatus):   true,
			string(model.OnGoingStatus):   true,
			string(model.CompletedStatus): true,
			string(model.SoldOutStatus):   true,
		}

		if !statusMap[*status] {
			return ctx.Status(http.StatusBadRequest).
				JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("status").Error()})
		}

		filterFields["status"] = *status
	}

	var fields string
	if request.Fields != nil {
		fields = *request.Fields
	}

	res, httpStatusCode, err := handler.service.GetAllWithPagination(
		ctx.UserContext(),
		pagination,
		strings.Split(fields, ","),
		filterFields,
		ctx.Get("locale"),
		ctx.Get(constants.TimeZone),
	)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(res)
}

func (handler *BookingSettingHandler) CheckAvailability(ctx *fiber.Ctx) error {
	var request model.BookingSettingCheckAvailabilityRequest
	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "invalid request body"})
	}

	if request.Time.IsZero() {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "invalid request body"})
	}

	loc, err := time.LoadLocation(ctx.Get(constants.TimeZone, "Asia/Bangkok"))
	if err != nil {
		return ctx.Status(http.StatusBadRequest).
			JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg(constants.TimeZone).Error()})
	}
	request.Time = request.Time.In(loc)

	res, httpStatusCode, err := handler.service.CheckAvailability(ctx.UserContext(), request)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}