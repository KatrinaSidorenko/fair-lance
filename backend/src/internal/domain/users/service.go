package users

import (
	"errors"
	"regexp"

	"golang.org/x/crypto/bcrypt"

	"fairlance/internal/auth"
)

type UserService interface {
	CreateUser(user *User, password string) (uint, error)
	LoginUser(email, password string) (string, error)
	GetUserByID(userID uint) (*User, error)
}

type userService struct {
	repo         UserRepository
	tokenManager *auth.TokenManager
}

func NewUserService(repo UserRepository, tokenManager *auth.TokenManager) UserService {
	return &userService{repo: repo, tokenManager: tokenManager}
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
		return 0, errors.New(INVALD_EMAIL)
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

func (s *userService) LoginUser(email, password string) (string, error) {
	user, err := s.repo.GetUserByEmail(email)
	if err != nil || user == nil {
		return "", errors.New(USER_NOT_FOUND)
	}

	if !CheckPasswordHash(password, user.PasswordHash) {
		return "", errors.New(IVALID_CREDENTIALS)
	}

	return s.tokenManager.GenerateToken(user.ID, user.RoleID)
}

func (s *userService) GetUserByID(userID uint) (*User, error) {
	return s.repo.GetUserByID(userID)
}
