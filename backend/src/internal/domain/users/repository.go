package users

import (
	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user *User) (uint, error)
	GetUserByEmail(email string) (*User, error)
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

func (r *userRepository) GetUserByEmail(email string) (*User, error) {
	var user User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}	
	return &user, nil
}

