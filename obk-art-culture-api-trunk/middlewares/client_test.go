package middlewares_test

import (
	"net/http"
	"testing"

	"example.com/art-culture-api/middlewares"
	"example.com/art-culture-api/pkg/contexts"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestNewClientTypeMiddleware(t *testing.T) {
	type testCase struct {
		Name           string
		ClientType        contexts.ClientType
		ExpectedStatus int
	}

	testCases := []testCase{
		{"Invalid client type", contexts.ClientType{}, http.StatusInternalServerError},
		{"Valid CMS client type", contexts.NewClientTypeCMS(), http.StatusOK},
		{"Valid Mobile client type", contexts.NewClientTypeMobile(), http.StatusOK},
		{"Valid Public client type", contexts.NewClientTypePublic(), http.StatusOK},
	}

	for _, tc := range testCases {
		t.Run(tc.Name, func(t *testing.T) {
			app := fiber.New()
			app.Use(middlewares.NewClientTypeMiddleware(tc.ClientType))

			app.Get("/", func(c *fiber.Ctx) error {
				if tc.ExpectedStatus != http.StatusOK {
					return c.Status(tc.ExpectedStatus).SendString("test")
				}

				clientType, ok := c.Locals(contexts.ClientType{}).(contexts.ClientType)

				assert.Equal(t, true, ok)
				assert.Equal(t, tc.ClientType, clientType)

				return c.SendString("test")
			})

			req, err := http.NewRequest("GET", "/", nil)
			if err != nil {
				assert.Fail(t, err.Error())
			}

			resp, err := app.Test(req)
			if err != nil {
				assert.Fail(t, err.Error())
			}

			assert.Equal(t, tc.ExpectedStatus, resp.StatusCode)
		})
	}
}

