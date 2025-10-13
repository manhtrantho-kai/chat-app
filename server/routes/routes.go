package routes

import (
	"server/api"
)

func SetupRoutes(api *api.Api) {
	app := api.App
	apiGroup := app.Group("/api")

	// Clans
	apiGroup.Get("/clans", api.GetClans)
	apiGroup.Get("/clans/:id", api.GetClanByID)

	// Categories
	apiGroup.Get("/clans/:clanId/categories", api.GetCategoriesByClan)

	// Channels
	apiGroup.Get("/clans/:clanId/channels", api.GetChannelsByClan)
	apiGroup.Get("/channels/:id", api.GetChannelByID)

	// Messages
	apiGroup.Get("/channels/:channelId/messages", api.GetMessages)
	apiGroup.Post("/channels/:channelId/messages", api.CreateMessage)

	// Stickers
	apiGroup.Get("/stickers", api.GetStickers)

	// WebSocket
	app.Get("/ws", api.WebSocketHandler)
}
