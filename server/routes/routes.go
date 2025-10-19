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
	protected.Delete("/clans/:id", api.DeleteClan)

	// Categories
	protected.Get("/clans/:clanId/categories", api.GetCategoriesByClan)
	protected.Post("/clans/:clanId/categories", api.CreateCategory)
	protected.Delete("/categories/:id", api.DeleteCategory)

	// Channels
	protected.Get("/category/:categoryId/channels", api.GetChannelsByClan)
	protected.Get("/channels/:id", api.GetChannelByID)
	protected.Post("/category/:categoryId/channels", api.CreateChannel)
	protected.Delete("/channels/:id", api.DeleteChannel)

	// Messages
	protected.Get("/channels/:channelId/messages", api.GetMessages)
	protected.Post("/channels/:channelId/messages", api.CreateMessage)

	// Stickers
	protected.Get("/stickers", api.GetStickers)

	// User
	protected.Post("/user/update", api.UpdateUser)
	protected.Get("/user/:id", api.GetUserByID)

	// Files
	protected.Post("/upload", api.UploadFile)

	// WebSocket
	app.Get("/ws", api.WebSocketHandler)
}
