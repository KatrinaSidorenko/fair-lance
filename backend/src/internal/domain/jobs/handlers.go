package jobs

import (
	"errors"
	"net/http"
	"strconv"

	"fairlance/internal/helpers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// todo: text errors change on code based
type JobHandler struct {
	service JobService
}

func NewJobHandler(service JobService) *JobHandler {
	return &JobHandler{service: service}
}

// budget is stored in db in wei
// return budget in ETH

func (h *JobHandler) CreateJob(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user id not found in context"})
		return
	}

	var req CreateJobDto
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// todo: extract validation logic
	parsedDueTime, err := helpers.ParseISO8601Date(req.DueDate)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid due date format"})
		return
	}

	parsedStatus, err := ParseJobStatus(req.Status)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid job status"})
		return
	}

	// todo: create mappers
	job := Job{
		Title:       req.Title,
		Description: req.Description,
		DueDate:     parsedDueTime,
		Budget:      req.Budget,
		Currency:    *req.Currency,
		Status:      parsedStatus,
		EmployerID:  userID.(uint),
	}

	if err := h.service.CreateJob(&job); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, gin.H{
		"job_id": job.ID,
	})
}

func (h *JobHandler) GetJob(c *gin.Context) {
	idStr := c.Param("job_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid job id"})
		return
	}

	job, err := h.service.GetJobByID(uint(id))
	if err != nil || job == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
		return
	}

	c.JSON(http.StatusOK, job)
}

func (h *JobHandler) UpdateJob(c *gin.Context) {
	var dto UpdateJobDto
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateJob(&dto); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "job updated successfully"})
}

func (h *JobHandler) DeleteJob(c *gin.Context) {
	idStr := c.Param("job_id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid job id"})
		return
	}
	if err := h.service.DeleteJob(uint(id)); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusNoContent, gin.H{"message": "job deleted successfully"})
}

func (h *JobHandler) GetPublichedJobs(c *gin.Context) {
	jobs, err := h.service.GetPublishedJobs()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, jobs)
}

func (h *JobHandler) GetUserJobs(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user id not found in context"})
		return
	}
	jobs, err := h.service.GetAllUserJobs(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, jobs)
}
