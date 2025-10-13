package api

import (
	"net/http"
	"server/models"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
)

// GET /api/channels/:channelId/messages?limit=50
func (api *Api) GetMessages(c *fiber.Ctx) error {
	channelId := c.Params("channelId")
	limitStr := c.Query("limit", "50")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 50
	}
	messages, err := models.GetMessagesByChannel(api.Db, channelId, limit)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve messages"})
	}
	return c.JSON(messages)
}

// POST /api/channels/:channelId/messages
func (api *Api) CreateMessage(c *fiber.Ctx) error {
	channelId := c.Params("channelId")

	contentType := c.Get("Content-Type")
	var msg models.Message

	if strings.HasPrefix(contentType, "multipart/form-data") {
		// Gửi text + file
		msg.Content = c.FormValue("content")
		msg.ChannelID = channelId
		msg.AuthorID = c.FormValue("authorId")
		msg.CreatedAt = time.Now().UTC()
		// files, err := c.FormFile("attachments[]")
		// if err == nil && files != nil {
		// 	// Xử lý lưu file, ví dụ: lưu đường dẫn vào msg.Attachments
		// 	// (bạn cần tự cài đặt logic lưu file)
		// 	msg.Attachments = []string{files.Filename}
		// }
	} else {
		// Gửi text hoặc sticker (json)
		var body map[string]interface{}
		if err := c.BodyParser(&body); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
		}
		msg.ChannelID = channelId
		msg.AuthorID, _ = body["authorId"].(string)
		msg.CreatedAt = time.Now().UTC()
		// if stickerId, ok := body["stickerId"].(string); ok {
		// 	msg.Sticker = stickerId
		// } 
		msg.Content, _ = body["content"].(string)
	}

	if err := msg.Save(api.Db); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Could not save message"})
	}

	// Trả về message đã lưu (có thể bổ sung author object nếu cần)
	return c.Status(http.StatusCreated).JSON(msg)
}

// GET /api/messages/:id
func (api *Api) GetMessageByID(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid message id"})
	}
	msg, err := models.GetMessageByID(api.Db, uint(id))
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Message not found"})
	}
	return c.JSON(msg)
}
