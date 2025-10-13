package api

import (
	"server/config"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type Api struct {
	Config *config.Config
	Db     *gorm.DB
	App    *fiber.App
}

func NewApi(config *config.Config, db *gorm.DB, app *fiber.App) *Api {
	return &Api{
		Config: config,
		Db:     db,
		App:    app,
	}
}
