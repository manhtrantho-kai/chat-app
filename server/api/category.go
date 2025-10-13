package api

import (
	"server/models"

	"github.com/gofiber/fiber/v2"
)

func (api *Api) GetCategoriesByClan(c *fiber.Ctx) error {
	clanId := c.Params("clanId")
	var categories []models.Category
	if err := api.Db.Where("clan_id = ?", clanId).Order("position asc").Find(&categories).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not fetch categories"})
	}
	return c.JSON(categories)
}
