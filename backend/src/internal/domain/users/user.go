package users

import "time"

type User struct {
	ID           uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Username     string    `json:"username" gorm:"not null"`
	Email        string    `json:"email" gorm:"uniqueIndex;not null"`
	PasswordHash string    `json:"-" gorm:"column:password;not null"`
	RoleID       uint      `json:"role_id" gorm:"not null"`
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
