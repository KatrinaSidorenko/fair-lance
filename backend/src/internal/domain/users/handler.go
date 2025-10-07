package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"fairlance/internal/errors"
)

type UserHandler struct {
	service UserService
	db      *gorm.DB
}

func NewUserHandler(service UserService, db *gorm.DB) *UserHandler {
	return &UserHandler{service: service, db: db}
}

func (h *UserHandler) RegisterUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errors.InvalidInputError(err.Error()))
		return
	}

	user := User{
		Username: req.Username,
		Email:    req.Email,
		RoleID:   req.RoleID,
	}

	id, err := h.service.CreateUser(&user, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errors.InternalError(err.Error()))
		return
	}

	res := UserResponse{
		ID:       id,
		Username: user.Username,
		Email:    user.Email,
		RoleID:   user.RoleID,
	}

	c.JSON(http.StatusCreated, res)
}

func (h *UserHandler) LoginUser(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errors.InvalidInputError(err.Error()))
		return
	}
	token, err := h.service.LoginUser(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, errors.UnauthorizedError(err.Error()))
		return
	}
	res := LoginResponse{Token: token}
	c.JSON(http.StatusOK, res)
}

func (h *UserHandler) GetMe(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, errors.ForbiddenError("user ID not found in context"))
		return
	}

	user, _ := h.service.GetUserByID(userID.(uint))
	userRespone := UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
		RoleID:   user.RoleID,
	}
	c.JSON(http.StatusOK, userRespone)
}

func (h *UserHandler) GetAllUsers(c *gin.Context) {
	users, err := h.service.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, errors.InternalError(err.Error()))
		return
	}
	var userResponses []UserResponse
	for _, user := range users {
		userResponses = append(userResponses, UserResponse{
			ID:       user.ID,
			Username: user.Username,
			Email:    user.Email,
			RoleID:   user.RoleID,
		})
	}
	c.JSON(http.StatusOK, userResponses)
}
