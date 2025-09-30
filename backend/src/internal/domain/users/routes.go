package users

import (
	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(r *gin.Engine, handler *UserHandler) {
	api := r.Group("/users")
	{
		api.POST("/", handler.RegisterUser)
	}
}
