package api

import (
	"fmt"
	"server/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func (api *Api) Register(c *fiber.Ctx) error {
	var req struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Hash error"})
	}
	user := models.User{
		ID:           generateID(),
		Username:     req.Username,
		PasswordHash: string(hash),
	}
	if err := api.Db.Create(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "User exists"})
	}
	token, err := createToken(user.ID, api.Config.JWTSecret)
	if err != nil {
		_ = api.Db.Delete(&user)
		return c.Status(500).JSON(fiber.Map{"error": "Token creation error"})
	}
	return c.JSON(fiber.Map{
		"token": token,
		"user":  user,
	})
}

// Đăng nhập
func (api *Api) Login(c *fiber.Ctx) error {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}
	var user models.User
	if err := api.Db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "User not found"})
	}
	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)) != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Wrong password"})
	}
	token, err := createToken(user.ID, api.Config.JWTSecret)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Token creation error"})
	}
	return c.JSON(fiber.Map{
		"token": token,
		"user":  user,
	})
}

// Middleware xác thực JWT
func (api *Api) AuthMiddleware(c *fiber.Ctx) error {
	auth := c.Get("Authorization")
	if auth == "" || len(auth) < 8 || auth[:7] != "Bearer " {
		return c.Status(401).JSON(fiber.Map{"error": "Missing token"})
	}
	tokenStr := auth[7:]
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return api.Config.JWTSecret, nil
	})
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
	}
	c.Locals("userId", claims["userId"])
	return c.Next()
}

// Tạo JWT token
func createToken(userId, jwtSecret string) (string, error) {
	claims := jwt.MapClaims{
		"userId": userId,
		"exp":    time.Now().Add(time.Hour * 72).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// Lấy thông tin user hiện tại
func (api *Api) GetCurrentUser(c *fiber.Ctx) error {
	userId, ok := c.Locals("userId").(string)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	var user models.User
	if err := api.Db.First(&user, "id = ?", userId).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}
	return c.JSON(user)
}

func generateID() string {
	return fmt.Sprintf("user-%d", time.Now().UnixNano())
}
