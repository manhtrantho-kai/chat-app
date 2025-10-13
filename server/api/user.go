package api

import (
	"server/models"

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
