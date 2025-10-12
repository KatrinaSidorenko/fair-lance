package roles

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequireRoles(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleID, exists := c.Get("role_id")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": ROLE_NOT_FOUND_IN_TOKEN})
			c.Abort()
			return
		}

		roleIDStr := roleID.(string)
		for _, allowedRole := range allowedRoles {
			if roleIDStr == allowedRole {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": ACCESS_DENIED})
		c.Abort()
	}
}
