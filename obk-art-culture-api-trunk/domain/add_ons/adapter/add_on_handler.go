package adapter

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	partnersEntity "example.com/art-culture-api/domain/partners/entity"

	"example.com/art-culture-api/domain/add_ons/entity"
	"example.com/art-culture-api/domain/add_ons/model"
	"example.com/art-culture-api/domain/add_ons/service"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type AddOnHandler struct {
	service service.AddOnService
	redis *redis.Client
	ctxBg context.Context
}

func NewAddOnHandler(db *gorm.DB, redis *redis.Client, ctxBg context.Context) *AddOnHandler {
	repo := NewOrmAddOnRepository(db)
	service := service.NewAddOnService(repo)

	return &AddOnHandler{
		service: service,
		redis: redis,
		ctxBg: ctxBg,
	}
}

func (handler *AddOnHandler) FindAll(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	addOns, err := handler.service.FindAll(locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find Add on content" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get Add on content list successfully", "data": addOns})
}

func (handler *AddOnHandler) FindByID(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	addOn, err := handler.service.FindByID(uint(idUint), locale)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Add on content not found" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get Add on content successfully", "data": addOn })
}

func (handler *AddOnHandler) SaveOrUpdate(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	var request model.AddOnCreateOrUpdateModel
	err := ctx.BodyParser(&request)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}
	
	partners, err := handler.service.FindPartners(request.Partners)
	if err != nil {
		partners = []partnersEntity.Partner{}
	}

	var action string
	if action = "create"; ctx.Method() == "PUT" {
		action = "update"
	}

	addOn := entity.AddOn{}

	addOnTranslation := entity.AddOnTranslation{
		Locale: locale,
		Title: request.Title,
		Desc: request.Desc,
		Thumbnail: request.Thumbnail,
		Banner: request.Banner,
		Audio: request.Audio,
		Video: request.Video,
		Tags: request.Tags,
	}

	id := ctx.Params("id")
	if id != "" {
		idUint, err := strconv.ParseUint(id, 10, 64)
		if err != nil {
			return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
		}

		addOnTranslation.AddOnID = uint(idUint)
		addOn, _ = handler.service.FindByID(uint(idUint), locale)
		if(addOn.ID != 0) {
			addOn, err = handler.service.ClearAddOnPartners(addOn)
			if err != nil {
				return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't " + action + " Add on content" })
			}

			addOnTranslation.AddOnID = addOn.ID
			if(addOn.AddOnTranslation != nil && len(addOn.AddOnTranslation) > 0) {
				addOnTranslation.ID = addOn.AddOnTranslation[0].ID
			}
		}
	}

	addOn.Type = request.Type
	addOn.IsPublished = request.IsPublished
	if !request.PublishedAt.IsZero() {
		addOn.PublishedAt = &request.PublishedAt
	}
	addOn.Partners = partners
	addOn, err = handler.service.SaveOrUpdate(addOn, addOnTranslation, locale)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't " + action + " Add on content" })
	}

	handler.redis.Del(handler.ctxBg, "add-on/" + locale + "/" + id)

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Add on content " + action + " successfully", "data": addOn })
}

func (handler *AddOnHandler) DeleteByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	err = handler.service.DeleteByID(uint(idUint))
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't delete Add on content" })
	}

	handler.redis.Del(handler.ctxBg, "add-on/th/" + id)
	handler.redis.Del(handler.ctxBg, "add-on/en/" + id)
	handler.redis.Del(handler.ctxBg, "add-on/zh/" + id)

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Add on content delete successfully" })
}

func (handler *AddOnHandler) PageContent(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	programId := ctx.Params("programId")
	programIdUint, err := strconv.ParseUint(programId, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	content, err := handler.service.PageContent(uint(programIdUint), uint(idUint), locale)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Add on content not found" })
	}

	data, err := json.Marshal(content)
	if err == nil {
		handler.redis.Set(ctx.Context(), "add-on/" + locale + "/" + id, data, 5 * time.Minute)
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get Add on content successfully", "data": content })
}

func (handler *AddOnHandler) VerifyCache(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	val, err := handler.redis.Get(handler.ctxBg, "add-on/" + locale + "/" + id).Bytes()
	if err != nil {
		return ctx.Next()
	}

	content := model.AddOnPageContent{}
    err = json.Unmarshal(val, &content)
    if err != nil {
		return ctx.Next()
    }

    return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get Add on cache content successfully", "data": content })
}