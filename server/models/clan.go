package models

type Clan struct {
	ID      string `json:"id" gorm:"primaryKey"`
	Name    string `json:"name"`
	Icon    string `json:"icon,omitempty"`
	OwnerID string `json:"ownerId"`
}
