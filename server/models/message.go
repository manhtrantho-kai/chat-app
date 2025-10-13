package models

import (
	"time"

	"gorm.io/gorm"
)

type Message struct {
	ID          string              `json:"id" gorm:"primaryKey"`
	Content     string              `json:"content"`
	AuthorID    string              `json:"authorId"`
	Author      *User               `json:"author" gorm:"-"`
	ChannelID   string              `json:"channelId"`
	CreatedAt   time.Time           `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt   *time.Time          `json:"updatedAt,omitempty" gorm:"autoUpdateTime"`
	Attachments []MessageAttachment `json:"attachments,omitempty" gorm:"-"`
	Sticker     *Sticker            `json:"sticker,omitempty" gorm:"-"`
}

type MessageAttachment struct {
	ID          string `json:"id" gorm:"primaryKey"`
	URL         string `json:"url"`
	Filename    string `json:"filename"`
	ContentType string `json:"contentType"`
	Size        int64  `json:"size"`
}

func (m *Message) Save(db *gorm.DB) error {
	return db.Create(m).Error
}

func GetMessages(db *gorm.DB, channelID string) ([]Message, error) {
	var messages []Message
	err := db.Where("channel_id = ?", channelID).Find(&messages).Error
	return messages, err
}

func GetMessagesByChannel(db *gorm.DB, channelID string, limit int) ([]Message, error) {
	var messages []Message
	err := db.Where("channel_id = ?", channelID).
		Order("created_at desc").
		Limit(limit).
		Find(&messages).Error
	return messages, err
}

func GetMessageByID(db *gorm.DB, id uint) (*Message, error) {
	var msg Message
	err := db.First(&msg, id).Error
	if err != nil {
		return nil, err
	}
	return &msg, nil
}
