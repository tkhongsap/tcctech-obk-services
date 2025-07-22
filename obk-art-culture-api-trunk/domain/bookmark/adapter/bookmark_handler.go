package adapter

import (
	"fmt"
	"net/http"

	"example.com/art-culture-api/domain/bookmark/entity"
	"example.com/art-culture-api/domain/bookmark/model"
	"example.com/art-culture-api/domain/bookmark/service"
	"example.com/art-culture-api/pkg/contexts"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type BookmarkHandler struct {
	service service.BookmarkService
}

func NewBookmarkHandler(db *gorm.DB) *BookmarkHandler {
	repo := NewBookmarkRepository(db)
	service := service.NewBookmarkService(repo)

	return &BookmarkHandler{
		service: service,
	}
}

func (handler *BookmarkHandler) FindAccountBookmarks(ctx *fiber.Ctx) error {
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

	bookmarks, err := handler.service.FindAccountBookmarks(userID)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Bookmarks not found" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get bookmarks successfully", "data": bookmarks })
}

func (handler *BookmarkHandler) FindAccountBookmarksByType(ctx *fiber.Ctx) error {
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

	contentType := ctx.Params("type")
	if contentType == "" {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "content type is required" })
	}

	bookmarks, err := handler.service.FindAccountBookmarksByType(userID, contentType)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Bookmarks not found" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Get bookmarks successfully", "data": bookmarks })
}


func (handler *BookmarkHandler) CreateAccountBookmark(ctx *fiber.Ctx) error {
	var request model.BookmarkCreateModel
	if err := ctx.BodyParser(&request); err != nil {
		fmt.Println(err)
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid request" })
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

	var bookmark entity.Bookmark
	bookmark.AccountId = userID
	bookmark.ContentType = request.ContentType
	bookmark.ContentId = request.ContentId

	bookmark, err := handler.service.CreateAccountBookmark(bookmark)
	if err != nil {
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Create bookmark failed" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Create bookmark successfully", "data": bookmark })
}

func (handler *BookmarkHandler) DeleteAccountBookmark(ctx *fiber.Ctx) error {
	var request model.BookmarkDeleteModel
	if err := ctx.BodyParser(&request); err != nil {
		fmt.Println(err)
		return ctx.Status(http.StatusBadRequest).JSON(fiber.Map{ "message": "Invalid request" })
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

	err := handler.service.DeleteAccountBookmark(userID, request.ContentType, request.ContentId)
	if err != nil {
		return ctx.Status(http.StatusNotFound).JSON(fiber.Map{ "message": "Remove bookmark failed" })
	}

	return ctx.Status(http.StatusOK).JSON(fiber.Map{ "message": "Delete bookmark successfully" })
}