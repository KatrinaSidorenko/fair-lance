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
