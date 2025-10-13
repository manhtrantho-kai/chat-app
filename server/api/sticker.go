package api

import (
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func (api *Api) GetStickers(c *fiber.Ctx) error {
	var stickers []models.Sticker
	if err := api.Db.Find(&stickers).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch stickers"})
	}
	return c.JSON(stickers)
}
