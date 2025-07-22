package errs

import (
	"errors"
	"fmt"
	"strings"
)

var (
	ErrInternalServer = errors.New("something went wrong")
	ErrIsRequired     = errors.New("is required")
	ErrInvalid        = errors.New("invalid")
	ErrNotFound       = errors.New("not found")
	ErrAlreadyExists  = errors.New("already exists")
)

// BuildCommonErrorInternalServerMsg returns an error with the message in the format of
// "something went wrong" + appenders. If appenders is empty, it returns an error with the
// message "something went wrong".
func BuildCommonErrorInternalServerMsg(appenders ...string) error {
	msg := ErrInternalServer.Error()
	for _, appender := range appenders {
		msg = msg + appender
	}

	return errors.New(msg)
}

// BuildCommonErrorNotFoundMsg returns an error with the message in the format of
// "<domain> not found". This can be used to create an error that indicates that
// the requested resource is not found.
func BuildCommonErrorNotFoundMsg(domain string) error {
	return fmt.Errorf("%s %s", domain, ErrNotFound.Error())
}

// BuildCommonErrorInvalidMsg returns an error with the message in the format of
// "invalid <param>". This can be used to create an error that indicates that
// the given param is invalid.
func BuildCommonErrorInvalidMsg(param string) error {
	return fmt.Errorf("%s %s", ErrInvalid.Error(), param)
}

// BuildCommonErrorIsRequiredMsg returns an error with the message in the format of
// "<param> is required". This can be used to create an error that indicates that
// the given param is required but not provided.
func BuildCommonErrorIsRequiredMsg(param string) error {
	return fmt.Errorf("%s %s", param, ErrIsRequired.Error())
}

// BuildCommonErrorAlreadyExistsMsg returns an error with the message in the format of
// "<param> already exists". This can be used to create an error that indicates that
// the given param already exists in the database.
func BuildCommonErrorAlreadyExistsMsg(param string, relatedParam ...string) error {
	if len(relatedParam) == 0 {
		return fmt.Errorf("%s %s", param, ErrAlreadyExists.Error())
	}

	if len(relatedParam) == 1 {
		return fmt.Errorf("%s %s in %s", param, ErrAlreadyExists.Error(), relatedParam[0])
	}

	var sb strings.Builder
	_, _ = sb.WriteString(fmt.Sprintf("%s %s in ", param, ErrAlreadyExists.Error()))
	for i, v := range relatedParam {
		if i > 0 {
			if i+1 == len(relatedParam) {
				_, _ = sb.WriteString(" and ")
			} else {
				_, _ = sb.WriteString(", ")
			}
		}
		_, _ = sb.WriteString(v)
	}
	
	// Avoid passing a dynamic string as the format argument
	return fmt.Errorf("%s", sb.String())
}
