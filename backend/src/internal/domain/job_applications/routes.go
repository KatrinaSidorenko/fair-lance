package jobapplications

import (
	"github.com/gin-gonic/gin"

	"fairlance/internal/auth"
	"fairlance/internal/domain/roles"
)

func RegisterJobApplicationRoutes(rg *gin.RouterGroup, handler *JobApplicationHandler, tokenManager *auth.TokenManager) {
	api := rg.Group("/jobapplications")

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

	{
		employer := protected.Group("")
		employer.Use(roles.RequireRoles(roles.EMPLOYER, roles.ADMIN))
		{
			employer.GET("/job/:job_id", handler.GetAllApplicationsByJobID)
			//employer.POST("/accept/:id", handler.AcceptJobApplication)
		}
	}
}
