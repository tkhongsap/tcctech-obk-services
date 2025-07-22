package middlewares

import (
	"example.com/art-culture-api/pkg/contexts"
	"github.com/gofiber/fiber/v2"
)

func NewClientTypeMiddleware(clientType contexts.ClientType) func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		c.Locals(contexts.ClientType{}, clientType)
		return c.Next()
	}
}
