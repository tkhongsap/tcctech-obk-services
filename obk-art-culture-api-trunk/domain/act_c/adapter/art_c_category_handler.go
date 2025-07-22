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

type ArtCCategoryHandler struct {
	service service.ArtCCategoryService
	redis *redis.Client
	ctxBg context.Context
}

func NewArtCCategoryHandler(db *gorm.DB, redis *redis.Client, ctxBg context.Context) *ArtCCategoryHandler {
	repo := NewOrmArtCCategoryRepository(db)
	service := service.NewArtCCategoryService(repo)

	return &ArtCCategoryHandler{
		service: service,
		redis: redis,
		ctxBg: ctxBg,
	}
}

func (handler *ArtCCategoryHandler) FindAll(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	typeId := ctx.Params("typeId")
	typeIdUint, err := strconv.ParseUint(typeId, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	artCContents, err := handler.service.FindAll(uint(typeIdUint), locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find Art+C category content" })
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{ "message": "Get Art+C category content successfully", "data": artCContents})
}

func (handler *ArtCCategoryHandler) Find(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	typeId := ctx.Params("typeId")
	typeIdUint, err := strconv.ParseUint(typeId, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	content, err := handler.service.Find(uint(typeIdUint), uint(idUint), locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find Art+C category content" })
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{ "message": "Get Art+C category content successfully", "data": content })
}

func (handler *ArtCCategoryHandler) CreateOrUpdate(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	typeId := ctx.Params("typeId")
	typeIdUint, err := strconv.ParseUint(typeId, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	var request model.ArtCCreateOrUpdateModel
	err = ctx.BodyParser(&request)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}

	var artCCategory entity.ArtCCategory
	artCCategoryTranslation := entity.ArtCTranslation{
		Locale: locale,
		Title: request.Title,
		ShortDesc: request.ShortDesc,
		Desc: request.Desc,
		Thumbnail: request.Thumbnail,
		Banner: request.Banner,
		ProgramSectionTitle: request.ProgramSectionTitle,
		OpeningHours: request.OpeningHours,
		Locations: request.Locations,
		EnterFee: request.EnterFee,
		ExternalLink: request.ExternalLink,
		Tags: request.Tags,
	}

	id := ctx.Params("id")
	if id != "" {
		idUint, err := strconv.ParseUint(id, 10, 64)
		if err != nil {
			return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
		}

		artCCategory, _ = handler.service.Find(uint(typeIdUint), uint(idUint), locale)
		if(artCCategory.ID != 0) {
			artCCategoryTranslation.ArtCCategoryID = &artCCategory.ID

			if(artCCategory.ArtCTranslation != nil && len(artCCategory.ArtCTranslation) > 0) {
				artCCategoryTranslation.ID = artCCategory.ArtCTranslation[0].ID
			}
		}
	}

	var action string
	if action = "create"; ctx.Method() == "PUT" {
		action = "update"
	}

	if(artCCategory.ID == 0 && action == "update") {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Art+C category content not found" })
	}

	artCTypeId := uint(typeIdUint)
	artCCategory.ArtCTypeID = uint(artCTypeId)
	artCCategory.DisplayFreeLabel = request.DisplayFreeLabel
	artCCategory.DisplayList = request.DisplayList
	artCCategory.RelateProgramIds = request.RelateProgramIds
	artCCategoryTranslation.ArtCTypeID = &artCTypeId
	artCCategory, err = handler.service.CreateOrUpdate(artCCategory, artCCategoryTranslation)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't " + action + " Art+C category content" })
	}

	handler.redis.Del(handler.ctxBg, "art-culture/category/sub-category/" + locale + "/" + id)

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Art+C category content " + action + " successfully", "data": artCCategory })
}

func (handler *ArtCCategoryHandler) DeleteByID(ctx *fiber.Ctx) error {
	typeId := ctx.Params("typeId")
	typeIdUint, err := strconv.ParseUint(typeId, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	err = handler.service.DeleteByID(uint(typeIdUint), uint(idUint))
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't delete Art+C category content" })
	}

	handler.redis.Del(handler.ctxBg, "art-culture/category/sub-category/th/" + id)
	handler.redis.Del(handler.ctxBg, "art-culture/category/sub-category/en/" + id)
	handler.redis.Del(handler.ctxBg, "art-culture/category/sub-category/zh/" + id)

	return ctx.Status(http.StatusOK).JSON(fiber.Map{"message": "Art+C category content delete successfully"})
}

func (handler *ArtCCategoryHandler) PageCategoryContent(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	typeId := ctx.Params("typeId")
	typeIdUint, err := strconv.ParseUint(typeId, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	content, err := handler.service.PageContent(uint(typeIdUint), uint(idUint), locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find Art+C content" })
	}

	data, err := json.Marshal(content)
	if err == nil {
		handler.redis.Set(ctx.Context(), "art-culture/category/sub-category/" + locale + "/" + id, data, 5 * time.Minute)
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{ "message": "Get Art+C category content successfully", "data": content })
}

func (handler *ArtCCategoryHandler) VerifyCache(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	val, err := handler.redis.Get(handler.ctxBg, "art-culture/category/sub-category/" + locale + "/" + id).Bytes()
	if err != nil {
		return ctx.Next()
	}

	content := model.ArtCTypePageContent{}
    err = json.Unmarshal(val, &content)
    if err != nil {
		return ctx.Next()
    }

    return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get Art+C category cache content successfully", "data": content })
}