package auth

const (
	AUTH_HEADER_MISSING      = "AE0"
	INVALID_FORMAT           = "AE1" // Bearer {token}
	INVALID_OR_EXPIRED_TOKEN = "AE2"
)
