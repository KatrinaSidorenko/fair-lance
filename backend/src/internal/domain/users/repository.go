package users

import (
	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user *User) (uint, error)
}

type userRepository struct{
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) CreateUser(user *User) (uint, error) {
    if err := r.db.Create(user).Error; err != nil {
        return 0, err
    }
    return user.ID, nil
}

