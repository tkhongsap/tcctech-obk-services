package adapter

import (
	"net/http"
	"time"

	repo "example.com/art-culture-api/domain/booking/adapter/repo"
	"example.com/art-culture-api/domain/booking/errs"
	"example.com/art-culture-api/domain/booking/model"
	"example.com/art-culture-api/domain/booking/service"
	"example.com/art-culture-api/domain/booking/validator"
	"example.com/art-culture-api/pkg"
	"example.com/art-culture-api/pkg/constants"

	"github.com/gofiber/fiber/v2"
	"github.com/jonboulle/clockwork"
	"gorm.io/gorm"
)

type BookingSlotDateHandler struct {
	service service.BookingSlotDateService
}

func NewBookingSlotDateHandler(db *gorm.DB) *BookingSlotDateHandler {
	clock := clockwork.NewRealClock()
	repo := repo.NewOrmBookingSlotDateRepository(db)
	service := service.NewBookingSlotDateService(clock, repo)

	return &BookingSlotDateHandler{
		service: service,
	}
}

func (handler *BookingSlotDateHandler) FindByIDWithBookingSlotTimes(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if err := validator.IsValidUUID(id); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("id").Error()})
	}
	res, httpStatusCode, err := handler.service.FindByIDWithBookingSlotTimes(ctx.UserContext(), id)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}

func (handler *BookingSlotDateHandler) GetAllWithPagination(ctx *fiber.Ctx) error {
	var request model.BookingSlotDatePaginationRequest
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
	if bookingSettingID := request.BookingSettingID; bookingSettingID != nil {
		filterFields["bookingSettingId"] = *bookingSettingID
	}
	if beginDate := request.BeginDate; beginDate != nil {
		filterFields["beginDate"] = (*beginDate).In(loc)
	}
	if endDate := request.EndDate; endDate != nil {
		filterFields["endDate"] = (*endDate).In(loc)
	}
	if status := request.Status; status != nil {
		var statusMap = map[string]bool{
			string(model.Waiting):   true,
			string(model.OnGoing):   true,
			string(model.Completed): true,
			string(model.SoldOut):   true,
		}

		if !statusMap[*status] {
			return ctx.Status(http.StatusBadRequest).
				JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("status").Error()})
		}

		filterFields["status"] = *status
	}

	res, httpStatusCode, err := handler.service.
		GetAllWithPagination(ctx.UserContext(), pagination, filterFields, ctx.Get(constants.TimeZone))
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(res)
}
