package jobsubmit

import (
	"github.com/gin-gonic/gin"

	"fairlance/internal/auth"
	"fairlance/internal/domain/roles"
)

func RegisterJobSubmitRoutes(rg *gin.RouterGroup, handler *JobSubmitHandler, tokenManager *auth.TokenManager) {
	api := rg.Group("/jobsubmits")

	protected := api.Group("")
	protected.GET("/application/:application_id", handler.GetAllByApplicationID)

	protected.Use(auth.JWTAuthMiddleware(tokenManager))
	{
		// freelancer endpoints
		freelancer := protected.Group("")
		freelancer.Use(roles.RequireRoles(roles.FREELANCER, roles.ADMIN))
		{
			freelancer.POST("", handler.CreateSubmit)
			freelancer.GET("/:id", handler.GetSubmitByID)
		}
	}

	{
		// employer endpoints
		employer := protected.Group("")
		employer.Use(roles.RequireRoles(roles.EMPLOYER, roles.ADMIN))
		{
			employer.GET("/job/:job_id", handler.GetAllByJobID)
		}
	}
}
