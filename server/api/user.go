package api

import (
	"server/models"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func GetUserByUsername(db *gorm.DB, username string) (*models.User, error) {
	var user models.User
	err := db.Where("username = ?", username).First(&user).Error
	return &user, err
}

func CheckPassword(password string, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

func Login(db *gorm.DB, username, password string) bool {
	user, err := GetUserByUsername(db, username)
	if err != nil {
		return false
	}
	return CheckPassword(password, user.PasswordHash)
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (api *Api) UpdateUser(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	var req struct {
		Username string `json:"username"`
		Avatar   string `json:"avatar"`
		Status   string `json:"status"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	var user models.User
	if err := api.Db.First(&user, "id = ?", userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}

	if req.Username != "" {
		user.Username = req.Username
	}
	if req.Avatar != "" {
		user.Avatar = req.Avatar
	}
	if req.Status != "" {
		user.Status = req.Status
	}
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.Password != "" {
		hashedPassword, err := HashPassword(req.Password)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to hash password"})
		}
		user.PasswordHash = hashedPassword
	}

	if err := api.Db.Save(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update user"})
	}

	return c.JSON(user)
}
