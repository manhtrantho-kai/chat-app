package database

import (
	"database/sql"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *sql.DB

// Initialize initializes the SQLite database connection.
func Initialize(dataSourceName string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(dataSourceName), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	log.Println("Database connection established")
	return db
}

// GetDB returns the database connection.
func GetDB() *sql.DB {
	return db
}

// Close closes the database connection.
func Close() {
	if err := db.Close(); err != nil {
		log.Fatalf("Failed to close database: %v", err)
	}
	log.Println("Database connection closed")
}
