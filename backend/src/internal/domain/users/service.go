package users

import (
	"golang.org/x/crypto/bcrypt"
)
type UserService interface {
	CreateUser(user *User) (uint, error)
}

type userService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) UserService {
	return &userService{repo: repo}
}

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
    return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

func (s *userService) CreateUser(user *User) (uint, error) {
	// Business logic can be added here (e.g., validation, hashing passwords, etc.)
	return s.repo.CreateUser(user) // Assuming db is managed elsewhere
}