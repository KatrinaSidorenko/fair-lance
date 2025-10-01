package users

import (
	"errors"
	"regexp"

	"golang.org/x/crypto/bcrypt"
)
type UserService interface {
	CreateUser(user *User, password string) (uint, error)
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

var emailRegex = regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)

func isValidEmail(email string) bool {
    return emailRegex.MatchString(email)
}

func CheckPasswordHash(password, hash string) bool {
    return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

func (s *userService) CreateUser(user *User, password string) (uint, error) {
	if len(user.Username) < 3 {
		return 0, errors.New(INVLID_USERNAME)
	}

	if !isValidEmail(user.Email) {
		return 0, errors.New(INVLID_EMAIL)
	}

	if len(password) < 6 {
		return 0, errors.New(INVLID_PASSWORD)
	}

	existingUser, _ := s.repo.GetUserByEmail(user.Email)
	if existingUser != nil {
		return 0, errors.New(USER_ALREADY_EXISTS)
	}

	hashed, _ := HashPassword(password)
	user.PasswordHash = hashed
	
	return s.repo.CreateUser(user)
}