package main

import (
	"log"

	_ "time/tzdata"

	"example.com/art-culture-api/configuration"
	"example.com/art-culture-api/router"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	// set up the configuration
	config := configuration.New()
	
	// init DB
	db := configuration.SetupDatabase(config)
	redis := configuration.SetupRedis(config)

	//setup fiber
	app := fiber.New(configuration.SetupServer())
	app.Use(recover.New())
	app.Use(cors.New())

	router.SetupRoutes(app, db, redis, config)

	app.Static("/images", "./assets/images")

	// Health check route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Server is running! 🚀")
	})

	//start app
	err := app.Listen(config.Get("SERVER.PORT"))
	if(err != nil) {
		log.Fatalf("could not start server: %v", err)
	}
}