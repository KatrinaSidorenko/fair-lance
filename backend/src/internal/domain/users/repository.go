package users

import (
	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user *User) (uint, error)
	GetUserByEmail(email string) (*User, error)
	GetUserByID(userID uint) (*User, error)
	GetAllUsers() ([]User, error)
}

type userRepository struct {
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

func (r *userRepository) GetUserByID(userID uint) (*User, error) {
	var user User
	if err := r.db.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetAllUsers() ([]User, error) {
	var users []User
	if err := r.db.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}
