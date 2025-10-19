package api

import (
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func (api *Api) GetChannelsByClan(c *fiber.Ctx) error {
	categoryId := c.Params("categoryId")
	var channels []models.Channel
	if err := api.Db.Where("category_id = ?", categoryId).Order("position asc").Find(&channels).Error; err != nil {
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

func (api *Api) CreateChannel(c *fiber.Ctx) error {
	categoryID := c.Params("category_id")
	clanID := c.Params("clanId")
	var req struct {
		Name     string `json:"name"`
		Position int    `json:"position"`
		Type     string `json:"type"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}
	channel := models.Channel{
		ID:         generateID("channel"),
		Name:       req.Name,
		Position:   req.Position,
		CategoryID: categoryID,
		ClanID:     clanID,
		Type:       req.Type,
	}
	if err := api.Db.Create(&channel).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create channel"})
	}
	return c.JSON(channel)
}
