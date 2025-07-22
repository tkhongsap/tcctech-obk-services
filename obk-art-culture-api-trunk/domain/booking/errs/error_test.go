package errs_test

import (
	"testing"

	"example.com/art-culture-api/domain/booking/errs"
)

func TestBuildCommonErrorInternalServerMsg(t *testing.T) {
	tests := []struct {
		appenders []string
		expected  string
	}{
		{appenders: []string{}, expected: "something went wrong"},
		{appenders: []string{"a"}, expected: "something went wronga"},
		{appenders: []string{"a", "b"}, expected: "something went wrongab"},
	}

	for _, test := range tests {
		actual := errs.BuildCommonErrorInternalServerMsg(test.appenders...).Error()
		if actual != test.expected {
			t.Errorf("expected %s, but got %s", test.expected, actual)
		}
	}
}

func TestBuildCommonErrorNotFoundMsg(t *testing.T) {
	tests := []struct {
		domain   string
		expected string
	}{
		{domain: "User", expected: "User not found"},
		{domain: "Program", expected: "Program not found"},
	}

	for _, test := range tests {
		actual := errs.BuildCommonErrorNotFoundMsg(test.domain).Error()
		if actual != test.expected {
			t.Errorf("expected %s, but got %s", test.expected, actual)
		}
	}
}

func TestBuildCommonErrorInvalidMsg(t *testing.T) {
	tests := []struct {
		param    string
		expected string
	}{
		{param: "email", expected: "invalid email"},
		{param: "password", expected: "invalid password"},
	}

	for _, test := range tests {
		actual := errs.BuildCommonErrorInvalidMsg(test.param).Error()
		if actual != test.expected {
			t.Errorf("expected %s, but got %s", test.expected, actual)
		}
	}
}

func TestBuildCommonErrorIsRequiredMsg(t *testing.T) {
	tests := []struct {
		param    string
		expected string
	}{
		{param: "email", expected: "email is required"},
		{param: "password", expected: "password is required"},
	}

	for _, test := range tests {
		actual := errs.BuildCommonErrorIsRequiredMsg(test.param).Error()
		if actual != test.expected {
			t.Errorf("expected %s, but got %s", test.expected, actual)
		}
	}
}

func TestBuildCommonErrorAlreadyExistsMsg(t *testing.T) {
	tests := []struct {
		param        string
		relatedParam []string
		expected     string
	}{
		{param: "email", relatedParam: []string{}, expected: "email already exists"},
		{param: "email", relatedParam: []string{"user"}, expected: "email already exists in user"},
		{param: "email", relatedParam: []string{"user", "program"}, expected: "email already exists in user and program"},
		{param: "email", relatedParam: []string{"user", "program", "booking_setting"},
			expected: "email already exists in user, program and booking_setting"},
	}

	for _, test := range tests {
		actual := errs.BuildCommonErrorAlreadyExistsMsg(test.param, test.relatedParam...).Error()
		if actual != test.expected {
			t.Errorf("expected %s, but got %s", test.expected, actual)
		}
	}
}
