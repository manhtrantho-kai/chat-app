package api

import (
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func (api *Api) GetClans(c *fiber.Ctx) error {
	var clans []models.Clan
	if err := api.Db.Find(&clans).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch clans"})
	}
	return c.JSON(clans)
}

func (api *Api) GetClanByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var clan models.Clan
	if err := api.Db.First(&clan, "id = ?", id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Clan not found"})
	}
	return c.JSON(clan)
}
