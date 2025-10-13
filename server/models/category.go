package models

type Category struct {
    ID       string `json:"id" gorm:"primaryKey"`
    Name     string `json:"name"`
    ClanID   string `json:"clanId"`
    Position int    `json:"position"`
}