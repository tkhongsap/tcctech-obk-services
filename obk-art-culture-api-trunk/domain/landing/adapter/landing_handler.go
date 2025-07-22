package adapter

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"example.com/art-culture-api/domain/landing/model"
	"example.com/art-culture-api/domain/landing/service"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type LandingPageHandler struct {
	service service.LandingService
	redis *redis.Client
	ctxBg context.Context
}

func NewLandingPageHandler(db *gorm.DB, redis *redis.Client, ctxBg context.Context) *LandingPageHandler {
	repo := NewOrmLandingPageRepository(db)
	service := service.NewLandingService(repo)

	return &LandingPageHandler{
		service: service,
		redis: redis,
		ctxBg: ctxBg,
	}
}

func (handler *LandingPageHandler) Content(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required"})
	}

	landing, err := handler.service.Content(locale)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find landing content" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get landing content successfully", "data": landing })
}

func (handler *LandingPageHandler) CreateOrUpdate(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}
	
	var request model.LandingCreateOrUpdateModel
	err := ctx.BodyParser(&request)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}

	landing, err := handler.service.Find(locale)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find landing content" })
	}

	landing.ProgramIds = request.ProgramsId
	landing.HighlightAutoPlay = request.HighlightAutoPlay
	landing.SectionOrder = request.SectionOrder

	landingTranslation := landing.LandingTranslation[0]
	landingTranslation.ID = landing.LandingTranslation[0].ID
	landingTranslation.Locale = locale
	landingTranslation.Content = request.Content

	landing, err = handler.service.CreateOrUpdate(landing, landingTranslation, request.ArtCTypesId)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't update landing content" })
	}

	content, err := handler.service.Content("all")
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't return landing content" })
	}

	handler.redis.Del(handler.ctxBg, "landing-page/" + locale)

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Landing content update successfully", "data": content })
}

func (handler *LandingPageHandler) PageContent(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	content, err := handler.service.PageContent(locale)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find landing content" })
	}

	data, err := json.Marshal(content)
	if err == nil {
		handler.redis.Set(ctx.Context(), "landing-page/" + locale, data, 5 * time.Minute)
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get landing content successfully", "data": content })
}

func (handler *LandingPageHandler) VerifyCache(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	val, err := handler.redis.Get(handler.ctxBg, "landing-page/" + locale).Bytes()
	if err != nil {
		return ctx.Next()
	}

	content := model.LandingPageContent{}
    err = json.Unmarshal(val, &content)
    if err != nil {
		return ctx.Next()
    }

    return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get landing cache content successfully", "data": content })
}