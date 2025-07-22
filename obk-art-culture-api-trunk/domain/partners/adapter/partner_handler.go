package adapter

import (
	"net/http"
	"strconv"

	"example.com/art-culture-api/domain/partners/entity"
	"example.com/art-culture-api/domain/partners/model"
	"example.com/art-culture-api/domain/partners/service"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type PartnerHandler struct {
	service service.PartnerService
}

func NewPartnerHandler(db *gorm.DB) PartnerHandler {
	repo := NewOrmPartnerRepository(db)
	service := service.NewPartnerService(repo)

	return PartnerHandler{service: service}
}

func (handler *PartnerHandler) FindAll(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	partners, err := handler.service.FindAll(locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find partner content" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get partners content successfully", "data": partners })
}

func (handler *PartnerHandler) FindByID(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	partner, err := handler.service.FindByID(uint(idUint), locale)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Partner content not found" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get partner content successfully", "data": partner })
}

func (handler *PartnerHandler) SaveOrUpdate(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	var request model.PartnerCreateOrUpdateModel
	err := ctx.BodyParser(&request)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}

	var partner entity.Partner
	partnerTranslation := entity.PartnerTranslation{
		Locale: locale,
		Title: request.Title,
		Thumbnail: request.Thumbnail,
		Link: request.Link,
	}

	id := ctx.Params("id")
	if id != "" {
		idUint, err := strconv.ParseUint(id, 10, 64)
		if err != nil {
			return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "error": "Invalid ID" })
		}
		
		partner, _ = handler.service.FindByID(uint(idUint), locale)
		if(partner.ID != 0) {
			partnerTranslation.PartnerID = partner.ID

			if(partner.PartnerTranslation != nil && len(partner.PartnerTranslation) > 0) {
				partnerTranslation.ID = partner.PartnerTranslation[0].ID
			}
		}
	}

	var action string
	if action = "create"; ctx.Method() == "PUT" {
		action = "update"
	}
	
	if(partner.ID == 0 && action == "update") {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Partner content not found" })
	}

	partner, err = handler.service.SaveOrUpdate(partner, partnerTranslation, locale)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't " + action + " partner content" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Partner content " + action + " successfully", "data": partner })
}

func (handler *PartnerHandler) DeleteByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}
	
	err = handler.service.DeleteByID(uint(idUint))
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't delete partner content" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Partner content delete successfully" })
}
