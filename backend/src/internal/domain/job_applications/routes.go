package jobapplications

import (
	"github.com/gin-gonic/gin"

	"fairlance/internal/auth"
	"fairlance/internal/domain/roles"
)

func RegiaterJobApplicationRoutes(rg *gin.Engine, handler *JobApplicationHandler, tokenManager *auth.TokenManager) {
	api := rg.Group("/job_applications")

	protected := api.Group("")
	protected.Use(auth.JWTAuthMiddleware(tokenManager))
	{
		freelancer := protected.Group("")
		freelancer.Use(roles.RequireRoles(roles.FREELANCER, roles.ADMIN))
		{
			freelancer.POST("", handler.CreateJobApplication)
			freelancer.GET("/:id", handler.GetJobApplicationByID)
		}
	}
	employer := protected.Group("")
	employer.Use(roles.RequireRoles(roles.EMPLOYER, roles.ADMIN))
	{
		employer.GET("/:job_id", handler.GetAllApplicationsByJobID)
		employer.POST("/accept/:id", handler.AcceptJobApplication)
	}
}
