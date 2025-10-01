package users

const (
	USER_NOT_FOUND      = "UE0"
	INVLID_USERNAME     = "UE1" // username should be at least 3 characters long
	INVALD_EMAIL        = "UE2" // invalid email format
	INVLID_PASSWORD     = "UE3" // password should be at least 6 characters long
	USER_ALREADY_EXISTS = "UE4" // user with given email or username already exists
	IVALID_CREDENTIALS  = "UE5" // invalid credentials
)
