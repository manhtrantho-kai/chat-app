package models

type Sticker struct {
    ID   string `json:"id" gorm:"primaryKey"`
    Name string `json:"name"`
    URL  string `json:"url"`
}
