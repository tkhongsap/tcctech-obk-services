package adapter

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"example.com/art-culture-api/domain/act_c/entity"
	"example.com/art-culture-api/domain/act_c/model"
	"example.com/art-culture-api/domain/act_c/service"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type ArtCTypeHandler struct {
	service service.ArtCTypeService
	redis *redis.Client
	ctxBg context.Context
}

func NewArtCHandler(db *gorm.DB, redis *redis.Client, ctxBg context.Context) *ArtCTypeHandler {
	repo := NewOrmArtCTypeRepository(db)
	service := service.NewArtCTypeService(repo)

	return &ArtCTypeHandler{
		service: service,
		redis: redis,
		ctxBg: ctxBg,
	}
}

func (handler *ArtCTypeHandler) FindAll(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	artCContents, err := handler.service.FindAll(locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find Art+C content" })
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{ "message": "Get Art+C content successfully", "data": artCContents})
}

func (handler *ArtCTypeHandler) Find(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	content, err := handler.service.Find(uint(idUint), locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find Art+C content" })
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{ "message": "Get Art+C content successfully", "data": content })
}

func (handler *ArtCTypeHandler) CreateOrUpdate(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	var request model.ArtCCreateOrUpdateModel
	err := ctx.BodyParser(&request)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}

	var artCType entity.ArtCType
	artCTypeTranslation := entity.ArtCTranslation{
		Locale: locale,
		Title: request.Title,
		ShortDesc: request.ShortDesc,
		Desc: request.Desc,
		Thumbnail: request.Thumbnail,
		Banner: request.Banner,
		CategorySectionTitle: request.CategorySectionTitle,
		PlaylistSectionTitle: request.PlaylistSectionTitle,
		ProgramSectionTitle: request.ProgramSectionTitle,
		OpeningHours: request.OpeningHours,
		Locations: request.Locations,
		EnterFee: request.EnterFee,
		ExternalLink: request.ExternalLink,
	}

	id := ctx.Params("id")
	if id != "" {
		idUint, err := strconv.ParseUint(id, 10, 64)
		if err != nil {
			return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
		}

		artCType, _ = handler.service.Find(uint(idUint), locale)
		if(artCType.ID != 0) {
			artCTypeTranslation.ArtCTypeID = &artCType.ID

			if(artCType.ArtCTranslation != nil && len(artCType.ArtCTranslation) > 0) {
				artCTypeTranslation.ID = artCType.ArtCTranslation[0].ID
			}
		}
	}

	var action string
	if action = "create"; ctx.Method() == "PUT" {
		action = "update"
	}

	if(artCType.ID == 0 && action == "update") {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Art+C content not found" })
	}

	artCType.DisplayFreeLabel = request.DisplayFreeLabel
	artCType.DisplayList = request.DisplayList
	artCType.Playlist = request.Playlist
	artCType.RelateProgramIds = request.RelateProgramIds
	artCType, err = handler.service.CreateOrUpdate(artCType, artCTypeTranslation)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't " + action + " Art+C content" })
	}

	handler.redis.Del(handler.ctxBg, "art-culture/category/" + locale + "/" + id)

	handler.redis.Del(handler.ctxBg, "landing-page/th/")
	handler.redis.Del(handler.ctxBg, "landing-page/en/")
	handler.redis.Del(handler.ctxBg, "landing-page/th/")

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Art+C content " + action + " successfully", "data": artCType })
}

func (handler *ArtCTypeHandler) DeleteByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	err = handler.service.DeleteByID(uint(idUint))
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't delete Art+C content" })
	}

	handler.redis.Del(handler.ctxBg, "art-culture/category/th/" + id)
	handler.redis.Del(handler.ctxBg, "art-culture/category/en/" + id)
	handler.redis.Del(handler.ctxBg, "art-culture/category/zh/" + id)

	handler.redis.Del(handler.ctxBg, "landing-page/th/")
	handler.redis.Del(handler.ctxBg, "landing-page/en/")
	handler.redis.Del(handler.ctxBg, "landing-page/th/")

	return ctx.Status(http.StatusOK).JSON(fiber.Map{"message": "Art+C content delete successfully"})
}

func (handler *ArtCTypeHandler) PageAllTypeContent(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	artCContents, err := handler.service.FindAll(locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find Art+C content" })
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{ "message": "Get Art+C content successfully", "data": artCContents})
}

func (handler *ArtCTypeHandler) PageTypeContent(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	content, err := handler.service.PageContent(locale, uint(idUint))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find Art+C content" })
	}

	data, err := json.Marshal(content)
	if err == nil {
		handler.redis.Set(ctx.Context(), "art-culture/category/" + locale + "/" + id, data, 5 * time.Minute)
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{ "message": "Get Art+C content successfully", "data": content })
}

func (handler *ArtCTypeHandler) VerifyCache(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	val, err := handler.redis.Get(handler.ctxBg, "art-culture/category/" + locale + "/" + id).Bytes()
	if err != nil {
		return ctx.Next()
	}

	content := model.ArtCTypePageContent{}
    err = json.Unmarshal(val, &content)
    if err != nil {
		return ctx.Next()
    }

    return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get Art+C cache content successfully", "data": content })
}