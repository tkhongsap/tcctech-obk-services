package adapter

import (
	"net/http"

	repo "example.com/art-culture-api/domain/booking/adapter/repo"
	"example.com/art-culture-api/domain/booking/adapter/session"
	"example.com/art-culture-api/domain/booking/entity"
	"example.com/art-culture-api/domain/booking/errs"
	"example.com/art-culture-api/domain/booking/model"
	"example.com/art-culture-api/domain/booking/service"
	"example.com/art-culture-api/domain/booking/validator"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type BookingSlotTimeHandler struct {
	service service.BookingSlotTimeService
}

func NewBookingSlotTimeHandler(db *gorm.DB) *BookingSlotTimeHandler {
	session := session.New(db)
	repo := repo.NewOrmBookingSlotTimeRepository(db)
	service := service.NewBookingSlotTimeService(session, repo)

	return &BookingSlotTimeHandler{
		service: service,
	}
}

func (handler *BookingSlotTimeHandler) PatchStatus(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if err := validator.IsValidUUID(id); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("id").Error()})
	}

	var request model.BookingSlotTimePatchStatusRequest
	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "invalid request body"})
	}

	if request.Status == nil {
		return ctx.Status(http.StatusBadRequest).
			JSON(fiber.Map{"message": errs.BuildCommonErrorIsRequiredMsg("status").Error()})
	}

	var statusMap = map[string]entity.BookingSlotTimeStatus{
		"available": entity.BookingSlotTimeAvailable,
		"sold_out":  entity.BookingSlotTimeSoldOut,
	}

	status := statusMap[*request.Status]
	if status == "" {
		return ctx.Status(http.StatusBadRequest).
			JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("status").Error()})
	}

	res, httpStatusCode, err := handler.service.PatchStatus(ctx.UserContext(), id, status)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}
