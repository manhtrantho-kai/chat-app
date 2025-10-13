package database

import (
	"log"
	"server/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// Initialize initializes the SQLite database connection.
func Initialize(dataSourceName string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(dataSourceName), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	log.Printf("Database connection established: %v", dataSourceName)

	err = db.AutoMigrate(
		&models.User{},
		&models.Clan{},
		&models.Category{},
		&models.Channel{},
		&models.Message{},
		&models.MessageAttachment{},
		&models.Sticker{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	return db
}

// GetDB returns the database connection.
func GetDB() *gorm.DB {
	return db
}

func Close() {
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get sql.DB: %v", err)
	}
	if err := sqlDB.Close(); err != nil {
		log.Fatalf("Failed to close database: %v", err)
	}
	log.Println("Database connection closed")
}
