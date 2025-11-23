package jobsubmit

import (
	"github.com/gin-gonic/gin"

	"fairlance/internal/auth"
	"fairlance/internal/domain/roles"
)

func RegisterJobSubmitRoutes(rg *gin.RouterGroup, handler *JobSubmitHandler, tokenManager *auth.TokenManager) {
	api := rg.Group("/job_submits")

	protected := api.Group("")
	protected.Use(auth.JWTAuthMiddleware(tokenManager))

	{
		// freelancer endpoints
		freelancer := protected.Group("")
		freelancer.Use(roles.RequireRoles(roles.FREELANCER, roles.ADMIN))
		{
			freelancer.POST("", handler.CreateSubmit)
			freelancer.GET("/:id", handler.GetSubmitByID)
			freelancer.GET("/:application_id", handler.GetAllByApplicationID)
		}
	}

	{
		// employer endpoints
		employer := protected.Group("")
		employer.Use(roles.RequireRoles(roles.EMPLOYER, roles.ADMIN))
		{
			employer.GET("/job/:job_id", handler.GetAllByJobID)
			employer.GET("/:application_id", handler.GetAllByApplicationID)
		}
	}
}
