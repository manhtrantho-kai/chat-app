package models

type Channel struct {
	ID         string `json:"id" gorm:"primaryKey"`
	Name       string `json:"name"`
	Type       string `json:"type"` // "text" hoặc "voice"
	CategoryID string `json:"categoryId"`
	ClanID     string `json:"clanId"`
	Position   int    `json:"position"`
}
