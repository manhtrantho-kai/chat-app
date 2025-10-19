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

func (api *Api) CreateClan(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	var req struct {
		Name   string `json:"name"`
		Avatar string `json:"avatar"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}
	clan := models.Clan{
		ID:      generateID("clan"),
		Name:    req.Name,
		Icon:    req.Avatar,
		OwnerID: userID,
	}
	if err := api.Db.Create(&clan).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create clan"})
	}
	return c.JSON(clan)
}

func (api *Api) DeleteClan(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := api.Db.Delete(&models.Clan{}, "id = ?", id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not delete clan"})
	}
	return c.SendStatus(204)
}
