package errors

type ErrorResult struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func NewErrorResult(code, message string) *ErrorResult {
	return &ErrorResult{
		Code:    code,
		Message: message,
	}
}

func NotFoundError(message string) *ErrorResult {
	e := &ErrorResult{}
	e.Code = ErrCodeNotFound
	e.Message = message
	return e
}

func InvalidInputError(message string) *ErrorResult {
	e := &ErrorResult{}
	e.Code = ErrCodeInvalidInput
	e.Message = message
	return e
}

func InternalError(message string) *ErrorResult {
	e := &ErrorResult{}
	e.Code = ErrCodeInternal
	e.Message = message
	return e
}