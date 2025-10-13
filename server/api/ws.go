package api

import (
	"log"

	"github.com/gofiber/fiber/v2"
	websocket "github.com/gofiber/websocket/v2"
)

func (api *Api) WebSocketHandler(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		c.Locals("allowed", true)
		return websocket.New(func(conn *websocket.Conn) {
			defer conn.Close()
			for {
				// Đọc message từ client
				messageType, message, err := conn.ReadMessage()
				if err != nil {
					log.Println("read:", err)
					break
				}
				log.Printf("recv: %s", message)

				// Gửi lại message cho client (echo)
				if err := conn.WriteMessage(messageType, message); err != nil {
					log.Println("write:", err)
					break
				}
			}
		})(c)
	}
	return fiber.ErrUpgradeRequired
}
