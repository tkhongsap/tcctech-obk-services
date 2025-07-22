package adapter

import (
	"net/http"
	"time"

	ac "example.com/art-culture-api/domain/act_c/adapter"
	repo "example.com/art-culture-api/domain/booking/adapter/repo"
	"example.com/art-culture-api/domain/booking/adapter/session"
	"example.com/art-culture-api/domain/booking/errs"
	"example.com/art-culture-api/domain/booking/service"
	"example.com/art-culture-api/domain/booking/validator"
	"example.com/art-culture-api/pkg/constants"
	"github.com/gofiber/fiber/v2"
	"github.com/jonboulle/clockwork"
	"gorm.io/gorm"
)

type BookingTicketHandler struct {
	service service.BookingTicketService
}

func NewBookingTicketHandler(db *gorm.DB) *BookingTicketHandler {
	clock := clockwork.NewRealClock()
	session := session.New(db)
	bookingTicketRepo := repo.NewOrmBookingTicketRepository(db)
	bookingSlotTimeRepo := repo.NewOrmBookingSlotTimeRepository(db)
	artCTranslationRepo := ac.NewOrmArtCTranslationRepository(db)
	service := service.NewBookingTicketService(
		session,
		clock,
		bookingTicketRepo,
		bookingSlotTimeRepo,
		artCTranslationRepo,
	)

	return &BookingTicketHandler{
		service: service,
	}
}

func (handler *BookingTicketHandler) GetTicket(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if err := validator.IsValidUUID(id); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("id").Error()})
	}

	res, httpStatusCode, err := handler.service.GetTicket(ctx.UserContext(), id, ctx.Get("locale"))
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}

func (handler *BookingTicketHandler) CheckIn(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if err := validator.IsValidUUID(id); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("id").Error()})
	}

	loc, err := time.LoadLocation(ctx.Get(constants.TimeZone))
	if err != nil {
		return ctx.Status(http.StatusBadRequest).
			JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg(constants.TimeZone).Error()})
	}

	res, httpStatusCode, err := handler.service.CheckIn(ctx.UserContext(), id, loc)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}

func (handler *BookingTicketHandler) ResetTicket(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if err := validator.IsValidUUID(id); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("id").Error()})
	}

	loc, err := time.LoadLocation(ctx.Get(constants.TimeZone))
	if err != nil {
		return ctx.Status(http.StatusBadRequest).
			JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg(constants.TimeZone).Error()})
	}

	res, httpStatusCode, err := handler.service.ResetTicket(ctx.UserContext(), id, loc)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}