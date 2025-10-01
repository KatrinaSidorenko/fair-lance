package users

import (
	"github.com/gin-gonic/gin"

	"fairlance/internal/auth"
)

func RegisterUserRoutes(r *gin.Engine, handler *UserHandler, tokenManager *auth.TokenManager) {
	api := r.Group("/users")

	api.POST("/register", handler.RegisterUser)
	api.POST("/login", handler.LoginUser)

	protected := api.Group("")
	protected.Use(auth.JWTAuthMiddleware(tokenManager))
	{
		protected.GET("/me", handler.GetMe)
	}
}
