package database

import (
	"log"
	"server/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedAdminUser creates a default admin user for testing
func SeedAdminUser(db *gorm.DB) {
	// Check if admin already exists
	var existingAdmin models.User
	if err := db.Where("username = ?", "admin").First(&existingAdmin).Error; err == nil {
		log.Println("✓ Admin user already exists")
		return
	}

	// Create admin user with hashed password
	hash, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("✗ Failed to hash admin password: %v", err)
		return
	}

	adminUser := models.User{
		ID:           "admin",
		Username:     "admin",
		Avatar:       "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
		Status:       "online",
		PasswordHash: string(hash),
	}

	if err := db.Create(&adminUser).Error; err != nil {
		log.Printf("✗ Failed to seed admin user: %v", err)
	} else {
		log.Println("✓ Admin user seeded successfully")
		log.Println("  Username: admin")
		log.Println("  Password: admin123")
	}
}
