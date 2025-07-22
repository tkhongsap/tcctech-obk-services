package contexts_test

import (
	"errors"
	"net/http/httptest"
	"testing"

	"example.com/art-culture-api/pkg/contexts"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestGetClaimString(t *testing.T) {
	testCases := []struct {
		Name        string
		Claims      map[string]interface{}
		Key         string
		Expected    string
		ExpectedErr error
	}{
		{
			Name:        "Key does not exist",
			Claims:      map[string]interface{}{},
			Key:         "foo",
			Expected:    "",
			ExpectedErr: nil,
		},
		{
			Name: "Key exists",
			Claims: map[string]interface{}{
				"foo": "bar",
			},
			Key:         "foo",
			Expected:    "bar",
			ExpectedErr: nil,
		},
		{
			Name: "Key exists with wrong type",
			Claims: map[string]interface{}{
				"foo": 123,
			},
			Key:         "foo",
			Expected:    "",
			ExpectedErr: errors.New("foo is invalid type for claim"),
		},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			u := contexts.User{MapClaims: tc.Claims}
			actual, actualErr := u.GetClaimString(tc.Key)
			assert.Equal(t, tc.Expected, actual)
			assert.Equal(t, tc.ExpectedErr, actualErr)
		})
	}
}

func TestGetUserContext(t *testing.T) {
	testCases := []struct {
		Name         string
		ContextKey   interface{}
		ContextValue interface{}
		Expected     interface{}
		ExpectedErr  error
	}{
		{
			Name:         "User context exists",
			ContextKey:   contexts.UserContextKey{},
			ContextValue: contexts.User{},
			Expected:     contexts.User{},
			ExpectedErr:  nil,
		},
		{
			Name:         "User context does not exist",
			ContextKey:   nil,
			ContextValue: nil,
			Expected:     contexts.User{},
			ExpectedErr:  errors.New("unable to parse user context"),
		},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			app := fiber.New()

			app.Use(func(c *fiber.Ctx) error {
				c.Locals(tc.ContextKey, tc.ContextValue)
				return c.Next()
			})

			app.Get("/", func(c *fiber.Ctx) error {
				actual, actualErr := contexts.GetUserContext(c)
				assert.Equal(t, tc.Expected, actual)
				assert.Equal(t, tc.ExpectedErr, actualErr)

				return c.SendString("test")
			})

			req := httptest.NewRequest("GET", "/", nil)
			_, err := app.Test(req)
			assert.NoError(t, err)
		})
	}
}
