package auth

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func JWTAuthMiddleware(tokenManger *TokenManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": AUTH_HEADER_MISSING})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": INVALID_FORMAT})
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims, err := tokenManger.ParseToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": INVALID_OR_EXPIRED_TOKEN})
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("role_id", fmt.Sprint(claims.RoleID))
		c.Next()
	}
}
