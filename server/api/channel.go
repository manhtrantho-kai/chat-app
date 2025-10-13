package api

import (
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func (api *Api) GetChannelsByClan(c *fiber.Ctx) error {
	clanId := c.Params("clanId")
	var channels []models.Channel
	if err := api.Db.Where("clan_id = ?", clanId).Order("position asc").Find(&channels).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch channels"})
	}
	return c.JSON(channels)
}

func (api *Api) GetChannelByID(c *fiber.Ctx) error {
	id := c.Params("id")
	var channel models.Channel
	if err := api.Db.First(&channel, "id = ?", id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Channel not found"})
	}
	return c.JSON(channel)
}
