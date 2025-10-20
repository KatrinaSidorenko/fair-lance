package jobs

import (
	"fairlance/internal/auth"
	"fairlance/internal/domain/roles"

	"github.com/gin-gonic/gin"
)

func RegisterJobRoutes(r *gin.Engine, handler *JobHandler, tokenManager *auth.TokenManager) {
	api := r.Group("/jobs")
	api.GET("/:job_id", handler.GetJob)

	protected := api.Group("")
	protected.Use(auth.JWTAuthMiddleware(tokenManager))
	{
		employer := protected.Group("")
		employer.Use(roles.RequireRoles(roles.EMPLOYER, roles.ADMIN))
		{
			employer.POST("", handler.CreateJob)
			employer.PUT("", handler.UpdateJob)
			employer.DELETE("/:job_id", handler.DeleteJob)
		}
	}
}
