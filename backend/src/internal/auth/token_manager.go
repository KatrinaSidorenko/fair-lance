package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type TokenManager struct {
	secret []byte
}

func NewJWTManager(secret string) *TokenManager {
	return &TokenManager{secret: []byte(secret)}
}

type Claims struct {
	UserID uint `json:"user_id"`
	RoleID uint `json:"role_id"`
	jwt.RegisteredClaims
}

func (m *TokenManager) GenerateToken(userID, roleId uint) (string, error) {
	claims := &Claims{
		UserID: userID,
		RoleID: roleId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // 1 day expiry
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(m.secret)
}

func (m *TokenManager) ParseToken(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return m.secret, nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrTokenInvalidClaims
}
