package middlewares_test

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"example.com/art-culture-api/middlewares"
	"example.com/art-culture-api/pkg/contexts"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestNewJWTMiddleware(t *testing.T) {
	type testCase struct {
		Name           string
		ClientType        contexts.ClientType
		Authorization  string
		ExpectedStatus int
		ExpectedError  string
	}

	testCases := []testCase{
		{
			Name:           "Unable to parse client type",
			ClientType:        contexts.ClientType{},
			Authorization:  "",
			ExpectedStatus: http.StatusInternalServerError,
			ExpectedError:  "Unable to parse client type",
		},
		{
			Name:           "Missing Authorization Header",
			ClientType:        contexts.NewClientTypeCMS(),
			Authorization:  "",
			ExpectedStatus: http.StatusUnauthorized,
			ExpectedError:  "Unauthorized, Authorization header is missing",
		},
		{
			Name:           "Invalid Auth Scheme",
			ClientType:        contexts.NewClientTypeCMS(),
			Authorization:  "Basic token",
			ExpectedStatus: http.StatusUnauthorized,
			ExpectedError:  "Unauthorized, invalid authentication scheme",
		},
		{
			Name:           "Malformed Token",
			ClientType:        contexts.NewClientTypeCMS(),
			Authorization:  middlewares.AuthSchemePrefix + "malformed_token",
			ExpectedStatus: http.StatusUnauthorized,
			ExpectedError:  "Unauthorized, unable to parse claims / malformed token",
		},
		{
			Name:           "Valid Token for CMS client type",
			ClientType:        contexts.NewClientTypeCMS(),
			Authorization:  middlewares.AuthSchemePrefix + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			ExpectedStatus: http.StatusOK,
			ExpectedError:  "",
		},
		{
			Name:           "Valid Token for Mobile client type",
			ClientType:        contexts.NewClientTypeMobile(),
			Authorization:  middlewares.AuthSchemePrefix + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
			ExpectedStatus: http.StatusOK,
			ExpectedError:  "",
		},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			app := fiber.New()
			// Required ClientType Middleware to determine if client sent "Authorization" or "User-Token" header
			app.Use(middlewares.NewClientTypeMiddleware(tc.ClientType))
			app.Use(middlewares.NewJWTMiddleware())

			app.Get("/", func(c *fiber.Ctx) error {
				if tc.ExpectedStatus != http.StatusOK {
					return c.Status(tc.ExpectedStatus).SendString("test")
				}

				userContext, ok := c.Locals(contexts.UserContextKey{}).(contexts.User)
				assert.Equal(t, true, ok)
				assert.NotEmpty(t, userContext.MapClaims)

				return c.SendString("test")
			})

			req := httptest.NewRequest("GET", "/", nil)
			if tc.ClientType.IsMobile() {
				// Mobile client type use "Authorization" header
				req.Header.Set("Authorization", tc.Authorization)
			} else {
				// CMS client type use "User-Token" header
				req.Header.Set("User-Token", tc.Authorization)
			}

			resp, err := app.Test(req)
			assert.NoError(t, err)

			assert.Equal(t, tc.ExpectedStatus, resp.StatusCode)

			if tc.ExpectedError != "" {
				body, _ := io.ReadAll(resp.Body)
				assert.Contains(t, string(body), tc.ExpectedError)
			}
		})
	}
}
