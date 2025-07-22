package adapter

import (
	"net/http"
	"strconv"
	"strings"

	ac "example.com/art-culture-api/domain/act_c/adapter"
	repo "example.com/art-culture-api/domain/booking/adapter/repo"
	"example.com/art-culture-api/domain/booking/adapter/session"
	"example.com/art-culture-api/domain/booking/errs"
	"example.com/art-culture-api/domain/booking/model"
	"example.com/art-culture-api/domain/booking/service"
	"example.com/art-culture-api/domain/booking/validator"
	pa "example.com/art-culture-api/domain/programs/adapter"
	"example.com/art-culture-api/pkg/constants"
	"example.com/art-culture-api/pkg/contexts"

	"github.com/gofiber/fiber/v2"
	"github.com/jonboulle/clockwork"
	"gorm.io/gorm"
)

type BookingTxHandler struct {
	service service.BookingTxService
}

func NewBookingTxHandler(db *gorm.DB) *BookingTxHandler {
	clock := clockwork.NewRealClock()
	session := session.New(db)
	bookingTicketRepo := repo.NewOrmBookingTicketRepository(db)
	bookingTxRepo := repo.NewOrmBookingTxRepository(db)
	bookingSlotTimeRepo := repo.NewOrmBookingSlotTimeRepository(db)
	bookingSlotDateRepo := repo.NewOrmBookingSlotDateRepository(db)
	bookingSettingRepo := repo.NewOrmBookingSettingRepository(db)
	programRepo := pa.NewOrmProgramRepository(db)
	artCTranslationRepo := ac.NewOrmArtCTranslationRepository(db)
	notificationService := service.NewBookingNotificationService()
	service := service.NewBookingTxService(
		session,
		clock,
		bookingTicketRepo,
		bookingTxRepo,
		bookingSlotTimeRepo,
		bookingSlotDateRepo,
		bookingSettingRepo,
		programRepo,
		artCTranslationRepo,
		notificationService,
	)

	return &BookingTxHandler{
		service: service,
	}
}

func (handler *BookingTxHandler) FindAllByUserID(ctx *fiber.Ctx) error {
	var userID string
	if user, err := contexts.GetUserContext(ctx); err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	} else {
		sub, err := user.GetSubject()
		if err != nil {
			return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		userID = sub
	}

	res, httpStatusCode, err := handler.service.FindAllByUserID(
		ctx.UserContext(),
		ctx.Get("locale"),
		strings.Split(ctx.Query("fields"), ","),
		ctx.Query("showingStatus"),
		userID,
	)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}

func (handler *BookingTxHandler) GetTransactions(ctx *fiber.Ctx) error {
	var programID *uint
	var bookerName, bookerEmail, bookingSlotTimeID *string
	if pid := ctx.Query("programId"); pid != "" {
		pidUint, err := strconv.ParseUint(pid, 10, 64)
		if err != nil {
			return ctx.Status(http.StatusBadRequest).
				JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("programId").Error()})
		}

		p := uint(pidUint)
		programID = &p
	}

	if bsdID := ctx.Query("bookingSlotTimeId"); bsdID != "" {
		err := validator.IsValidUUID(bsdID)
		if err != nil {
			return ctx.Status(http.StatusBadRequest).
				JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("bookingSlotTimeId").Error()})
		}

		bookingSlotTimeID = &bsdID
	}

	if bn := ctx.Query("bookerName"); bn != "" {
		bookerName = &bn
	}

	if be := ctx.Query("bookerEmail"); be != "" {
		bookerEmail = &be
	}

	res, httpStatusCode, err := handler.service.GetTransactions(
		ctx.UserContext(),
		programID,
		bookerName,
		bookerEmail,
		bookingSlotTimeID,
	)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}

func (handler *BookingTxHandler) FindByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	if err := validator.IsValidUUID(id); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("id").Error()})
	}

	res, httpStatusCode, err := handler.service.FindByID(ctx.UserContext(), id, ctx.Get("locale"))
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}

func (handler *BookingTxHandler) Create(ctx *fiber.Ctx) error {
	var request model.BookingTxCreateRequest
	if err := ctx.BodyParser(&request); err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "invalid request body"})
	}

	if err := validator.IsValidUUID(request.BookingSlotDateID); err != nil {
		return ctx.Status(http.StatusBadRequest).
			JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("bookingSlotDateId").Error()})
	}

	if err := validator.IsValidUUID(request.BookingSlotTimeID); err != nil {
		return ctx.Status(http.StatusBadRequest).
			JSON(fiber.Map{"message": errs.BuildCommonErrorInvalidMsg("bookingSlotTimeId").Error()})
	}

	var userID string
	if user, err := contexts.GetUserContext(ctx); err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	} else {
		sub, err := user.GetSubject()
		if err != nil {
			return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		userID = sub
	}

	res, httpStatusCode, err := handler.service.Create(
		ctx.UserContext(),
		userID,
		request,
		ctx.Get("locale"),
		ctx.Get(constants.TimeZone),
	)
	if err != nil {
		return ctx.Status(httpStatusCode).JSON(fiber.Map{"message": err.Error()})
	}
	return ctx.Status(httpStatusCode).JSON(fiber.Map{"data": res})
}
