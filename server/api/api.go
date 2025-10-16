package api

import (
	"server/config"
	"server/service"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type Api struct {
	Config        *config.Config
	Db            *gorm.DB
	App           *fiber.App
	UploadService *service.GithubUploadService
}

func NewApi(config *config.Config, db *gorm.DB, app *fiber.App) *Api {
	uploadService := service.NewGithubUploadService(config)
	return &Api{
		Config:        config,
		Db:            db,
		App:           app,
		UploadService: uploadService,
	}
}
