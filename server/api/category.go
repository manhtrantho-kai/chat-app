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

func (api *Api) CreateCategory(c *fiber.Ctx) error {
	clanId := c.Params("clanId")
	var req struct {
		Name     string `json:"name"`
		Position int    `json:"position"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}
	category := models.Category{
		ID:	   generateID("category"),
		Name:     req.Name,
		Position: req.Position,
		ClanID:   clanId,
	}
	if err := api.Db.Create(&category).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not create category"})
	}
	return c.JSON(category)
}

func (api *Api) DeleteCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := api.Db.Delete(&models.Category{}, "id = ?", id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not delete category"})
	}
	return c.JSON(fiber.Map{"message": "Category deleted successfully"})
}
