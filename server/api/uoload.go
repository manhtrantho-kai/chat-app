package api

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func (api *Api) UploadFile(c *fiber.Ctx) error {
	// Parse the multipart form:
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Failed to parse multipart form"})
	}

	files := form.File["files"]
	if len(files) == 0 {
		return c.Status(400).JSON(fiber.Map{"error": "No files uploaded"})
	}

	var uploadedURLs []string
	for _, file := range files {
		openedFile, err := file.Open()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to open uploaded file"})
		}
		defer openedFile.Close()

		fileBytes := make([]byte, file.Size)
		_, err = openedFile.Read(fileBytes)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to read uploaded file"})
		}

		fileType := http.DetectContentType(fileBytes)
		if !(fileType == "image/jpeg" || fileType == "image/png" || fileType == "image/gif") {
			return c.Status(400).JSON(fiber.Map{"error": "Unsupported file type"})
		}

		// Upload to GitHub
		url, err := api.UploadService.UploadImage(c.Context(), file.Filename, fileBytes)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to upload file"})
		}
		uploadedURLs = append(uploadedURLs, url)
	}

	return c.JSON(fiber.Map{"urls": uploadedURLs})
}
