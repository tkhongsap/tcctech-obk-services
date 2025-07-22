package adapter

import (
	"net/http"
	"strconv"

	"example.com/art-culture-api/domain/playlist/entity"
	"example.com/art-culture-api/domain/playlist/model"
	"example.com/art-culture-api/domain/playlist/service"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type PlaylistHandler struct {
	service service.PlaylistService
}

func NewPlaylistHandler(db *gorm.DB) *PlaylistHandler {
	repo := NewOrmPlaylistRepository(db)
	service := service.NewPlaylistService(repo)

	return &PlaylistHandler{
		service: service,
	}
}

func (handler *PlaylistHandler) FindAll(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	playlists, err := handler.service.FindAll(locale)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{ "message": "Playlists content not found" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get playlists content successfully", "data": playlists })
}

func (handler *PlaylistHandler) FindByID(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}

	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	playlist, err := handler.service.FindByID(uint(idUint), locale)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Playlist not found" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get playlist content successfully", "data": playlist })
}

func (handler *PlaylistHandler) SaveOrUpdate(ctx *fiber.Ctx) error {
	locale := ctx.Query("locale")
	if locale == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Locale is required" })
	}
	
	var request model.ProgramCreateOrUpdateModel
	err := ctx.BodyParser(&request)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": err.Error() })
	}

	var playlist entity.Playlist
	playlistTranslation := entity.PlaylistTranslation{
		Locale: locale,
		Title: request.Title,
		Desc: request.Desc,
		Author: request.Author,
		Thumbnail: request.Thumbnail,
		Durations: request.Durations,
		Link: request.Link,
	}

	id := ctx.Params("id")
	if id != "" {
		idUint, err := strconv.ParseUint(id, 10, 64)
		if err != nil {
			return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
		}

		playlist, _ = handler.service.FindByID(uint(idUint), locale)
		if playlist.ID != 0 {
			playlistTranslation.PlaylistID = playlist.ID

			if playlist.PlaylistTranslation != nil && len(playlist.PlaylistTranslation) > 0 {
				playlistTranslation.ID = playlist.PlaylistTranslation[0].ID
			}
		}
	}

	var action string 
	if action = "create"; ctx.Method() == "PUT" {
		action = "update"
	}

	if playlist.ID == 0 && action == "update" {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Playlist not found" })
	}
	
	playlist.IsPublished = request.IsPublished
	if !request.PublishedAt.IsZero() {
		playlist.PublishedAt = &request.PublishedAt
	}

	playlist, err = handler.service.SaveOrUpdate(playlist, playlistTranslation, locale)
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't save playlist content" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Save playlist content successfully", "data": playlist })
}

func (handler *PlaylistHandler) DeleteByID(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid ID" })
	}

	err = handler.service.DeleteByID(uint(idUint))
	if err != nil {
		return ctx.Status(http.StatusInternalServerError).JSON(fiber.Map{ "message": "Something went wrong, can't delete program content" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Playlist delete successfully" })
}