package jobsubmit

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type JobSubmitHandler struct {
	service JobSubmitService
}

func NewJobSubmitHandler(service JobSubmitService) *JobSubmitHandler {
	return &JobSubmitHandler{service: service}
}

func (h *JobSubmitHandler) CreateSubmit(c *gin.Context) {
	var dto CreateJobSubmitDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sub := ToJobSubmit(&dto)

	if err := h.service.CreateSubmit(sub); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create submit"})
		return
	}

	c.JSON(http.StatusCreated, ToJobSubmitResponseDTO(sub))
}

func (h *JobSubmitHandler) GetSubmitByID(c *gin.Context) {
	idStr := c.Param("id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	sub, err := h.service.GetSubmitByID(uint(id64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch submit"})
		return
	}
	if sub == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "submit not found"})
		return
	}

	c.JSON(http.StatusOK, ToJobSubmitResponseDTO(sub))
}

func (h *JobSubmitHandler) GetAllByApplicationID(c *gin.Context) {
	idStr := c.Param("application_id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid application id"})
		return
	}

	subs, err := h.service.GetAllByApplicationID(uint(id64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch submits"})
		return
	}

	resp := make([]*JobSubmitResponseDTO, 0, len(subs))
	for _, s := range subs {
		resp = append(resp, ToJobSubmitResponseDTO(s))
	}
	c.JSON(http.StatusOK, resp)
}

func (h *JobSubmitHandler) GetAllByJobID(c *gin.Context) {
	idStr := c.Param("job_id")
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid job id"})
		return
	}

	subs, err := h.service.GetAllByJobID(uint(id64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch submits"})
		return
	}

	resp := make([]*JobSubmitResponseDTO, 0, len(subs))
	for _, s := range subs {
		resp = append(resp, ToJobSubmitResponseDTO(s))
	}
	c.JSON(http.StatusOK, resp)
}
