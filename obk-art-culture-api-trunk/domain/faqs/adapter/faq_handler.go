package adapter

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"example.com/art-culture-api/domain/faqs/entity"
	"example.com/art-culture-api/domain/faqs/model"
	"example.com/art-culture-api/domain/faqs/service"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type FaqHandler struct {
	service service.FaqService
	redis *redis.Client
	ctxBg context.Context
}

func NewFaqHandler(db *gorm.DB, redis *redis.Client, ctxBg context.Context) *FaqHandler {
	repo := NewOrmFaqRepository(db)
	service := service.NewFaqService(repo)

	return &FaqHandler{
		service: service,
		redis: redis,
		ctxBg: ctxBg,
	}
}

func (handler *FaqHandler) FindAll(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	faqs, err := handler.service.FindAll(locale)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Landing content not found" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get faqs content successfully", "data": faqs })
}

func (handler *FaqHandler) FindByID(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}
	
	faq, err := handler.service.FindByID(uint(idUint), locale)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Faq not found" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get faq content successfully", "data": faq })
}

func (handler *FaqHandler) SaveOrUpdate(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	var request model.FaqCreateOrUpdateModel
	err := ctx.BodyParser(&request)
	if err != nil {
		fmt.Println("err", err.Error())
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}

	var faq entity.Faq
	faqTranslation := entity.FaqTranslation{
		Locale: locale,
		Question: request.Question,
		Answer:   request.Answer,
	}
	
	id := ctx.Params("id")
	if id != "" {
		idUint, err := strconv.ParseUint(id, 10, 64)
		if err != nil {
			return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
		}

		faq, _ = handler.service.FindByID(uint(idUint), locale)
		if(faq.ID != 0) {
			faqTranslation.FaqID = faq.ID

			if(faq.FaqTranslation != nil && len(faq.FaqTranslation) > 0) {
				faqTranslation.ID = faq.FaqTranslation[0].ID
			}
		}
	}

	var action string 
	if action = "create"; ctx.Method() == "PUT" {
		action = "update"
	}

	if(faq.ID == 0 && action == "update") {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Faq content not found" })
	}	

	faq.IsPublished = request.IsPublished
	if !request.PublishedAt.IsZero() {
		faq.PublishedAt = &request.PublishedAt
	}
	faq, err = handler.service.SaveOrUpdate(faq, faqTranslation, locale)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't " + action + " faq content" })
	}

	handler.redis.Del(handler.ctxBg, "faqs/" + locale)

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Faq content " + action + " successfully", "data": faq })
}

func (handler *FaqHandler) DeleteByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	err = handler.service.DeleteByID(uint(idUint))
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't delete faq content" })
	}

	handler.redis.Del(handler.ctxBg, "faqs/th")
	handler.redis.Del(handler.ctxBg, "faqs/en")
	handler.redis.Del(handler.ctxBg, "faqs/zh")

	return ctx.Status(http.StatusOK).JSON(fiber.Map{"message": "Faq content delete successfully"})
}

func (handler *FaqHandler) OrderItems(ctx *fiber.Ctx) error {
	var request model.FaqOrderModel
	err := ctx.BodyParser(&request)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}

	Ids := request.Ids
	err = handler.service.OrderItems(Ids)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't set order to faq content" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{"message": "Faq content order successfully"})
}

func (handler *FaqHandler) PageContent(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	faqs, err := handler.service.PageContent(locale)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Landing content not found" })
	}

	data, err := json.Marshal(faqs)
	if err == nil {
		handler.redis.Set(ctx.Context(), "faqs/" + locale, data, 5 * time.Minute)
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get faqs content successfully", "data": faqs })
}

func (handler *FaqHandler) VerifyCache(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	val, err := handler.redis.Get(handler.ctxBg, "faqs/" + locale).Bytes()
	if err != nil {
		return ctx.Next()
	}

	content := []entity.Faq{}
    err = json.Unmarshal(val, &content)
    if err != nil {
		return ctx.Next()
    }

    return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get faqs cache content successfully", "data": content })
}