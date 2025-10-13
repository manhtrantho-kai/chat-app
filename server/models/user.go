package models

type User struct {
    ID       string `json:"id" gorm:"primaryKey"`
    Username string `json:"username"`
    Avatar   string `json:"avatar,omitempty"`
    Status   string `json:"status"`
    PasswordHash string `json:"-"`
}