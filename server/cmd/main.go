package main

import (
	"log"
	"server/api"
	"server/config"
	"server/database"
	"server/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	config := config.LoadConfig()

	db := database.Initialize(config.DatabaseURL)
	defer database.Close()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	api := api.NewApi(config, db, app)

	routes.SetupRoutes(api)

	log.Fatal(app.Listen(":8000"))
}
