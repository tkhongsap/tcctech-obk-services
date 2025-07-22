package adapter

import (
	"context"
	"net/http"
	"strconv"

	"example.com/art-culture-api/configuration"
	"example.com/art-culture-api/domain/walking_meeting_map/model"

	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
)

type WalkingMeetingMapHandler struct {
	redis  *redis.Client
	ctxBg  context.Context
	config configuration.Config
}

func NewWalkingMeetingMapHandler(redis *redis.Client, ctxBg context.Context, config configuration.Config) *WalkingMeetingMapHandler {
	return &WalkingMeetingMapHandler{
		redis:  redis,
		ctxBg:  ctxBg,
		config: config,
	}
}

func (handler *WalkingMeetingMapHandler) FindAll(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Locale is required"})
	}

	routeData := model.GetRouteItems(handler.config)

	data, exists := routeData[locale]
	if !exists {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Locale not found"})
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Get walking meeting map content successfully",
		"data":    data,
	})
}


func (handler *WalkingMeetingMapHandler) FindByID(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Locale is required"})
	}

	idParam := ctx.Params("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{"message": "Invalid ID format"})
	}

	routeData := model.GetRouteItems(handler.config)

	items, exists := routeData[locale]
	if !exists {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Locale not found"})
	}

	// Search for the route by ID
	for _, item := range items {
		if item.ID == id {
			return ctx.Status(http.StatusOK).JSON(fiber.Map{
				"message": "Get walking meeting map item successfully",
				"data":    item,
			})
		}
	}

	return ctx.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Item not found"})
}