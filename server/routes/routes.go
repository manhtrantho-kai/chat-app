package routes

import (
	"server/api"
)

func SetupRoutes(api *api.Api) {
	app := api.App
	apiGroup := app.Group("/api")

	// Auth routes (không cần middleware)
	apiGroup.Post("/auth/login", api.Login)
	apiGroup.Post("/auth/register", api.Register)

	// Các route cần xác thực
	protected := apiGroup.Use(api.AuthMiddleware)

	// Clans
	protected.Get("/clans", api.GetClans)
	protected.Get("/clans/:id", api.GetClanByID)
	protected.Post("/clans", api.CreateClan)

	// Categories
	protected.Get("/clans/:clanId/categories", api.GetCategoriesByClan)
	protected.Post("/clans/:clanId/categories", api.CreateCategory)

	// Channels
	protected.Get("/clans/:clanId/channels", api.GetChannelsByClan)
	protected.Get("/channels/:id", api.GetChannelByID)
	protected.Post("/clans/:clanId/channels", api.CreateChannel)

	// Messages
	protected.Get("/channels/:channelId/messages", api.GetMessages)
	protected.Post("/channels/:channelId/messages", api.CreateMessage)

	// Stickers
	protected.Get("/stickers", api.GetStickers)

	// User
	protected.Post("/user/update", api.UpdateUser)

	// Files
	apiGroup.Post("/upload", api.UploadFile)

	// WebSocket
	app.Get("/ws", api.WebSocketHandler)
}
