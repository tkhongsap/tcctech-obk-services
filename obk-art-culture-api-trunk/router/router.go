package router

import (
	"fmt"
	"os"

	"context"

	"example.com/art-culture-api/configuration"
	artCAdapter "example.com/art-culture-api/domain/act_c/adapter"
	addOnAdapter "example.com/art-culture-api/domain/add_ons/adapter"
	bookingAdapter "example.com/art-culture-api/domain/booking/adapter/handler"
	bookmarkAdapter "example.com/art-culture-api/domain/bookmark/adapter"
	faqAdapter "example.com/art-culture-api/domain/faqs/adapter"
	landingAdapter "example.com/art-culture-api/domain/landing/adapter"
	partnerAdapter "example.com/art-culture-api/domain/partners/adapter"
	playlistAdapter "example.com/art-culture-api/domain/playlist/adapter"
	programsAdapter "example.com/art-culture-api/domain/programs/adapter"
	walkingMeetingMapAdapter "example.com/art-culture-api/domain/walking_meeting_map/adapter"
	"example.com/art-culture-api/middlewares"
	"example.com/art-culture-api/pkg/contexts"
	"example.com/art-culture-api/pkg/enums/permission"

	"github.com/go-redis/redis/v8"
	/* "example.com/art-culture-api/pkg/enums/permission" */

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB, redis *redis.Client, config configuration.Config) {
	ctxBg := context.Background()

	api := app.Group("/api")

	landingContentHandler := landingAdapter.NewLandingPageHandler(db, redis, ctxBg)
	landingRoute := api.Group("/landing")
	landingRoute.Get("/content", landingContentHandler.Content)
	landingRoute.Put("/content", landingContentHandler.CreateOrUpdate)
	landingRoute.Get("/page", landingContentHandler.VerifyCache, landingContentHandler.PageContent)

	artCContentHandler := artCAdapter.NewArtCHandler(db, redis, ctxBg)
	artCRoute := api.Group("/art-c")
	artCRoute.Get("/", artCContentHandler.FindAll)
	artCRoute.Get("/:id", artCContentHandler.Find)
	artCRoute.Post("/", artCContentHandler.CreateOrUpdate)
	artCRoute.Put("/:id", artCContentHandler.CreateOrUpdate)
	artCRoute.Delete("/:id", artCContentHandler.DeleteByID)
	artCRoute.Get("/page/all", artCContentHandler.VerifyCache, artCContentHandler.PageAllTypeContent)
	artCRoute.Get("/page/:id", artCContentHandler.VerifyCache, artCContentHandler.PageTypeContent)

	artCCategoryHandler := artCAdapter.NewArtCCategoryHandler(db, redis, ctxBg)
	artCCategoryRoute := api.Group("/art-c/category")
	artCCategoryRoute.Get("/:typeId", artCCategoryHandler.FindAll)
	artCCategoryRoute.Get("/:typeId/:id", artCCategoryHandler.Find)
	artCCategoryRoute.Post("/:typeId", artCCategoryHandler.CreateOrUpdate)
	artCCategoryRoute.Put("/:typeId/:id", artCCategoryHandler.CreateOrUpdate)
	artCCategoryRoute.Delete("/:typeId/:id", artCCategoryHandler.DeleteByID)
	artCCategoryRoute.Get("/page/:typeId/:id", artCCategoryHandler.VerifyCache, artCCategoryHandler.PageCategoryContent)

	partnerHandler := partnerAdapter.NewPartnerHandler(db)
	partnerRoute := api.Group("/partners")
	partnerRoute.Get("/", partnerHandler.FindAll)
	partnerRoute.Get("/:id", partnerHandler.FindByID)
	partnerRoute.Post("/", partnerHandler.SaveOrUpdate)
	partnerRoute.Put("/:id", partnerHandler.SaveOrUpdate)
	partnerRoute.Delete("/:id", partnerHandler.DeleteByID)

	programsHandler := programsAdapter.NewProgramHandler(db, redis, ctxBg)
	programsRoute := api.Group("/programs")
	programsRoute.Get("/page", programsHandler.VerifyListCache, programsHandler.PageListContent)
	programsRoute.Get("/page/:id", programsHandler.VerifyContentCache, programsHandler.PageContent)
	programsRoute.Get("/page/tags/:tag", programsHandler.VerifyTagCache, programsHandler.PageTagContent)
	programsRoute.Get("/", programsHandler.FindAll)
	programsRoute.Get("/:id", programsHandler.FindByID)
	programsRoute.Post("/", programsHandler.SaveOrUpdate)
	programsRoute.Put("/:id", programsHandler.SaveOrUpdate)
	programsRoute.Delete("/:id", programsHandler.DeleteByID)

	addOnHandler := addOnAdapter.NewAddOnHandler(db, redis, ctxBg)
	addOnRoute := api.Group("/add-on")
	addOnRoute.Get("/", addOnHandler.FindAll)
	addOnRoute.Get("/:id", addOnHandler.FindByID)
	addOnRoute.Post("/", addOnHandler.SaveOrUpdate)
	addOnRoute.Put("/:id", addOnHandler.SaveOrUpdate)
	addOnRoute.Delete("/:id", addOnHandler.DeleteByID)
	addOnRoute.Get("/page/:programId/:id", addOnHandler.VerifyCache, addOnHandler.PageContent)

	faqsHandler := faqAdapter.NewFaqHandler(db, redis, ctxBg)
	faqsRoute := api.Group("/faqs")
	faqsRoute.Get("/page", faqsHandler.VerifyCache, faqsHandler.PageContent)
	faqsRoute.Get("/", faqsHandler.FindAll)
	faqsRoute.Get("/:id", faqsHandler.FindByID)
	faqsRoute.Post("/", faqsHandler.SaveOrUpdate)
	faqsRoute.Put("/:id", faqsHandler.SaveOrUpdate)
	faqsRoute.Delete("/:id", faqsHandler.DeleteByID)
	faqsRoute.Put("/order/items", faqsHandler.OrderItems)

	walkingMeetingMapHandler := walkingMeetingMapAdapter.NewWalkingMeetingMapHandler(redis, ctxBg, config)
	walkingMeetingMapRoute := api.Group("/walking-meeting-map")
	walkingMeetingMapRoute.Get("/", walkingMeetingMapHandler.FindAll)
	walkingMeetingMapRoute.Get("/:id", walkingMeetingMapHandler.FindByID)

	PlaylistHandler := playlistAdapter.NewPlaylistHandler(db)
	playlistRoute := api.Group("/playlist")
	playlistRoute.Get("/", PlaylistHandler.FindAll)
	playlistRoute.Get("/:id", PlaylistHandler.FindByID)
	playlistRoute.Post("/", PlaylistHandler.SaveOrUpdate)
	playlistRoute.Put("/:id", PlaylistHandler.SaveOrUpdate)
	playlistRoute.Delete("/:id", PlaylistHandler.DeleteByID)

	// Booking handlers
	bookingSettingHandler := bookingAdapter.NewBookingSettingHandler(db)
	bookingSlotDateHandler := bookingAdapter.NewBookingSlotDateHandler(db)
	bookingSlotTimeHandler := bookingAdapter.NewBookingSlotTimeHandler(db)
	bookingTxHandler := bookingAdapter.NewBookingTxHandler(db)
	bookingTicketHandler := bookingAdapter.NewBookingTicketHandler(db)

	// Public API
	bookingSettingRoute := api.Group("/booking-settings", middlewares.NewClientTypeMiddleware(contexts.NewClientTypePublic()))
	bookingSettingRoute.Get("/detail", bookingSettingHandler.FindByProgramIDWithPreloadFields)
	bookingSettingRoute.Post("/check-availability", bookingSettingHandler.CheckAvailability)

	// User API
	userAPI := app.Group("/user-api", middlewares.NewClientTypeMiddleware(contexts.NewClientTypeMobile()))
	userAPI.Get("/info", func(c *fiber.Ctx) error {
		info := fmt.Sprintf("[%v] %v", c.Locals(contexts.ClientType{}).(contexts.ClientType), os.Getenv("COMMIT_SHA"))
		return c.SendString(info)
	})

	userAPI.Use(middlewares.NewJWTMiddleware())

	userBookingSettingRoute := userAPI.Group("/booking-settings")
	userBookingSettingRoute.Get("/detail", bookingSettingHandler.FindByProgramIDWithPreloadFields)

	userBookingSlotDateRoute := userAPI.Group("/booking-slot-dates")
	userBookingSlotDateRoute.Get("/:id", bookingSlotDateHandler.FindByIDWithBookingSlotTimes)

	userBookingTxRoute := userAPI.Group("/booking-transactions")
	userBookingTxRoute.Get("/", bookingTxHandler.FindAllByUserID)
	userBookingTxRoute.Get("/:id", bookingTxHandler.FindByID)
	userBookingTxRoute.Post("/", bookingTxHandler.Create)

	BookmarkHandler := bookmarkAdapter.NewBookmarkHandler(db)
	bookmarkRoute := userAPI.Group("/bookmark")
	bookmarkRoute.Get("/", BookmarkHandler.FindAccountBookmarks)
	bookmarkRoute.Get("/:type", BookmarkHandler.FindAccountBookmarksByType)
	bookmarkRoute.Post("/", BookmarkHandler.CreateAccountBookmark)
	bookmarkRoute.Delete("/", BookmarkHandler.DeleteAccountBookmark)

	// CMS API Group
	cmsAPI := app.Group("/cms-api", middlewares.NewClientTypeMiddleware(contexts.NewClientTypeCMS()))
	cmsAPI.Get("/info", func(c *fiber.Ctx) error {
		info := fmt.Sprintf("[%v] %v", c.Locals(contexts.ClientType{}).(contexts.ClientType), os.Getenv("COMMIT_SHA"))
		return c.SendString(info)
	})

	cmsAPI.Use(middlewares.NewJWTMiddleware())

	// hotfix
	cmsProgramRoute := cmsAPI.Group("/programs")
	cmsProgramRoute.Get("/:id", programsHandler.FindByID)

	permissionGuard := middlewares.NewPermissionMiddleware(redis)

	cmsBookingSettingRoute := cmsAPI.Group("/booking-settings")
	cmsBookingSettingRoute.Get(
		"/",
		permissionGuard.Verify(permission.ViewBookingStatus, permission.EditBookingStatus),
		bookingSettingHandler.GetAllWithPagination,
	)
	cmsBookingSettingRoute.Get(
		"/detail",
		permissionGuard.Verify(permission.CreateBookingSettings, permission.EditBookingSettings),
		bookingSettingHandler.FindByProgramIDWithPreloadFields,
	)
	cmsBookingSettingRoute.Post(
		"/",
		permissionGuard.Verify(permission.CreateBookingSettings),
		bookingSettingHandler.Create,
	)
	cmsBookingSettingRoute.Patch(
		"/:id",
		permissionGuard.Verify(permission.EditBookingSettings),
		bookingSettingHandler.Patch,
	)
	cmsBookingSettingRoute.Delete(
		"/:id",
		permissionGuard.Verify(permission.EditBookingSettings),
		bookingSettingHandler.Delete,
	)

	cmsBookingSlotDateRoute := cmsAPI.Group("/booking-slot-dates")
	cmsBookingSlotDateRoute.Get(
		"/",
		permissionGuard.Verify(permission.ViewBookingStatus, permission.EditBookingStatus),
		bookingSlotDateHandler.GetAllWithPagination,
	)

	cmsBookingSlotTimeRoute := cmsAPI.Group("/booking-slot-times")
	cmsBookingSlotTimeRoute.Patch(
		"/:id",
		permissionGuard.Verify(permission.EditBookingStatus),
		bookingSlotTimeHandler.PatchStatus,
	)

	cmsBookingTxRoute := cmsAPI.Group("/booking-transactions")
	cmsBookingTxRoute.Get(
		"/",
		permissionGuard.Verify(permission.ViewBookingHistory),
		bookingTxHandler.GetTransactions,
	)
	cmsBookingTxRoute.Get(
		"/:id",
		permissionGuard.Verify(permission.ViewBookingHistory),
		bookingTxHandler.FindByID,
	)

	cmsBookingTicketRoute := cmsAPI.Group("/booking-tickets")
	cmsBookingTicketRoute.Get(
		"/:id",
		permissionGuard.Verify(permission.ScanTicket, permission.ResetTicket),
		bookingTicketHandler.GetTicket,
	)
	cmsBookingTicketRoute.Patch(
		"/:id/check-in",
		permissionGuard.Verify(permission.ScanTicket),
		bookingTicketHandler.CheckIn,
	)
	cmsBookingTicketRoute.Patch(
		"/:id/reset-ticket",
		permissionGuard.Verify(permission.ResetTicket),
		bookingTicketHandler.ResetTicket,
	)

}
