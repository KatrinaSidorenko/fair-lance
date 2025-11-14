package jobapplications

import (
	"fairlance/internal/domain/jobs"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type JobApplicationHandler struct {
	service    JobApplicationService
	jobService jobs.JobService
}

func NewJobApplicationHandler(service JobApplicationService, jobService jobs.JobService) *JobApplicationHandler {
	return &JobApplicationHandler{
		service:    service,
		jobService: jobService,
	}
}

func (h *JobApplicationHandler) CreateJobApplication(c *gin.Context) {
	var dto CreateJobApplicationDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user id not found in context"})
		return
	}

	app := ToJobApplication(&dto, userIDValue.(uint))
	_, err := h.jobService.GetJobByID(app.JobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Job not found"})
		return
	}

	if err := h.service.CreateApplication(app); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create job application"})
		return
	}

	c.JSON(http.StatusCreated, ToJobApplicationResponseDTO(app))
}

func (h *JobApplicationHandler) GetJobApplicationByID(c *gin.Context) {
	idStr := c.Param("id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	jobApplication, err := h.service.GetApplicationByID(uint(id64))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job application not found"})
		return
	}

	c.JSON(http.StatusOK, ToJobApplicationResponseDTO(jobApplication))
}

func (h *JobApplicationHandler) GetAllApplicationsByJobID(c *gin.Context) {
	idStr := c.Param("job_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid job id"})
		return
	}
	applications, err := h.service.GetAllApplicationsByJobID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get job applications"})
		return
	}
	var responseDTOs []JobApplicationResponseDTO
	for _, app := range applications {
		responseDTOs = append(responseDTOs, *ToJobApplicationResponseDTO(app))
	}

	c.JSON(http.StatusOK, responseDTOs)
}
