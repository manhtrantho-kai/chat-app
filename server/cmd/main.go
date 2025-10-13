package main

import (
	"log"
	"server/api"
	"server/config"
	"server/database"
	"server/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {
	config := config.LoadConfig()

	db := database.Initialize(config.DatabaseURL)

	app := fiber.New()

	api := api.NewApi(config, db, app)

	routes.SetupRoutes(api)

	log.Fatal(app.Listen(":8000"))
}
