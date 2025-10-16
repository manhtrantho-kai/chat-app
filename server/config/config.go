package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL      string
	ApiKey           string
	JWTSecret        string
	GithubRepoOwner  string
	GithubRepoName   string
	GithubRepoBranch string
	GithubToken      string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return &Config{
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		ApiKey:           os.Getenv("API_KEY"),
		JWTSecret:        os.Getenv("JWT_SECRET"),
		GithubRepoOwner:  os.Getenv("GITHUB_REPO_OWNER"),
		GithubRepoName:   os.Getenv("GITHUB_REPO_NAME"),
		GithubRepoBranch: os.Getenv("GITHUB_REPO_BRANCH"),
		GithubToken:      os.Getenv("GITHUB_TOKEN"),
	}
}
