package adapter

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"example.com/art-culture-api/domain/programs/entity"
	"example.com/art-culture-api/domain/programs/model"
	"example.com/art-culture-api/domain/programs/service"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type ProgramHandler struct {
	service service.ProgramService
	redis *redis.Client
	ctxBg context.Context
}

func NewProgramHandler(db *gorm.DB, redis *redis.Client, ctxBg context.Context) *ProgramHandler {
	repo := NewOrmProgramRepository(db)
	service := service.NewProgramService(repo)

	return &ProgramHandler{
		service: service,
		redis: redis,
		ctxBg: ctxBg,
	}
}

func (handler *ProgramHandler) FindAll(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	programs, err := handler.service.FindAll(locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find programs content" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get programs content successfully", "data": programs })
}

func (handler *ProgramHandler) FindByID(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	program, err := handler.service.FindByID(uint(idUint), locale)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Program not found" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get program content successfully", "data": program })
}

func (handler *ProgramHandler) SaveOrUpdate(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	var request model.ProgramCreateOrUpdateModel
	err := ctx.BodyParser(&request)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}

	partners, err := handler.service.FindPartners(request.Partners)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}

	addOns, err := handler.service.FindAddOns(request.AddOns)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}

	var action string
	if action = "create"; ctx.Method() == "PUT" {
		action = "update"
	}

	program := entity.Program{}
	programTranslation := entity.ProgramTranslation{
		Locale: locale,
		Title: request.Title,
		ShortDesc: request.ShortDesc,
		Desc: request.Desc,
		Author: request.Author,
		Thumbnail: request.Thumbnail,
		Banner: request.Banner,
		OpeningHours: request.OpeningHours,
		Locations: request.Locations,
		EnterFee: request.EnterFee,
		ExternalLink: request.ExternalLink,
		InfoItems: request.InfoItems,
		Tags: request.Tags,
		Audio: request.Audio,
		Video: request.Video,
	}

	if programTranslation.InfoItems == nil {
		programTranslation.InfoItems = []entity.IProgramInfoItem{}
	}

	id := ctx.Params("id")
	if id != "" {
		idUint, err := strconv.ParseUint(id, 10, 64)
		if err != nil {
			return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
		}

		programTranslation.ProgramID = uint(idUint)
		program, _ = handler.service.FindByID(uint(idUint), locale)
		if(program.ID != 0) {
			program, err = handler.service.ClearProgramPartners(program)
			if err != nil {
				return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't " + action + " program because of something went wrong with program partner", "error": err })
			}

			program, err = handler.service.ClearProgramAddOns(program)
			if err != nil {
				return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't " + action + " program because of something went wrong with program add-on", "error": err })
			}

			programTranslation.ProgramID = program.ID
			if(program.ProgramTranslation != nil && len(program.ProgramTranslation) > 0) {
				programTranslation.ID = program.ProgramTranslation[0].ID
			}
		}
	}

	program.ArtCTypeID = request.ArtCTypeID
	if request.ArtCCategoryID != 0 {
		program.ArtCCategoryID = &request.ArtCCategoryID
	} else {
		program.ArtCCategoryID = nil
	}

	program.IsPublished = request.IsPublished
	if !request.PublishedAt.IsZero() {
		program.PublishedAt = &request.PublishedAt
	}

	program.Type = request.Type

	if(request.PeriodAt.IsZero()) {
		program.PeriodAt = nil
	} else {
		program.PeriodAt = &request.PeriodAt
	}

	if(request.PeriodEnd.IsZero()) {
		program.PeriodEnd = nil
	} else {
		program.PeriodEnd = &request.PeriodEnd
	}
	
	program.IsProduct = request.IsProduct
	program.ProductPrice = request.ProductPrice
	program.DisplayFreeLabel = request.DisplayFreeLabel
	program.Partners = partners
	program.AddOns = addOns
	program.RelateProgramIds = request.RelateProgramIds
	program.RelateProductIds = request.RelateProductIds
	program, err = handler.service.SaveOrUpdate(program, programTranslation, locale)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't " + action + " program content", "error": err })
	}

	handler.redis.Del(handler.ctxBg, "program/" + locale + "/" + id)

	handler.redis.Del(handler.ctxBg, "landing-page/th/")
	handler.redis.Del(handler.ctxBg, "landing-page/en/")
	handler.redis.Del(handler.ctxBg, "landing-page/th/")

	return ctx.Status(http.StatusCreated).JSON(fiber.Map{ "message": "Program content " + action + " successfully", "data": program })
}

func (handler *ProgramHandler) DeleteByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	err = handler.service.DeleteByID(uint(idUint))
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't delete program content" })
	}

	handler.redis.Del(handler.ctxBg, "program/th/" + id)
	handler.redis.Del(handler.ctxBg, "program/en/" + id)
	handler.redis.Del(handler.ctxBg, "program/zh/" + id)

	handler.redis.Del(handler.ctxBg, "landing-page/th/")
	handler.redis.Del(handler.ctxBg, "landing-page/en/")
	handler.redis.Del(handler.ctxBg, "landing-page/th/")

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Programs delete successfully" })
}

func (handler *ProgramHandler) PageContent(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	content, err := handler.service.PageContent(uint(idUint), locale)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Program not found" })
	}

	data, err := json.Marshal(content)
	if err == nil {
		handler.redis.Set(ctx.Context(), "program/" + locale + "/" + id, data, 5 * time.Minute)
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get program content successfully", "data": content })
}

func (handler *ProgramHandler) PageListContent(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	content, err := handler.service.PageListContent(locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find programs content" })
	}

	data, err := json.Marshal(content)
	if err == nil {
		handler.redis.Set(ctx.Context(), "program/" + locale, data, 5 * time.Minute)
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get program list content successfully", "data": content })
}

func (handler *ProgramHandler) PageTagContent(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	tag := ctx.Params("tag")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Tag is required" })
	}

	content, err := handler.service.PageTagContent(locale, tag)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't find programs content" })
	}

	data, err := json.Marshal(content)
	if err == nil {
		handler.redis.Set(ctx.Context(), "program/tags/" + locale + "/" + tag, data, 5 * time.Minute)
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get program and add-on content successfully", "data": content })
}

func (handler *ProgramHandler) VerifyContentCache(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	val, err := handler.redis.Get(handler.ctxBg, "program/" + locale + "/" + id).Bytes()
	if err != nil {
		return ctx.Next()
	}

	content := model.ProgramPageContent{}
    err = json.Unmarshal(val, &content)
    if err != nil {
		return ctx.Next()
    }

    return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get program cache content successfully", "data": content })
}

func (handler *ProgramHandler) VerifyListCache(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	val, err := handler.redis.Get(handler.ctxBg, "program/" + locale).Bytes()
	if err != nil {
		return ctx.Next()
	}

	content := model.ProgramPageListContent{}
    err = json.Unmarshal(val, &content)
    if err != nil {
		return ctx.Next()
    }

    return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get program list cache content successfully", "data": content })
}

func (handler *ProgramHandler) VerifyTagCache(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	tag := ctx.Params("tag")
	val, err := handler.redis.Get(handler.ctxBg, "program/tags/" + locale + "/" + tag).Bytes()
	if err != nil {
		return ctx.Next()
	}

	content := model.ProgramPageContent{}
    err = json.Unmarshal(val, &content)
    if err != nil {
		return ctx.Next()
    }

    return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get program cache content successfully", "data": content })
}