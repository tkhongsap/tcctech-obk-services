package middlewares

import (
	"net/http"
	"strings"

	"example.com/art-culture-api/pkg/contexts"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

const (
	AuthSchemePrefix = "Bearer "
)

func NewJWTMiddleware() func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		clientType, ok := c.Locals(contexts.ClientType{}).(contexts.ClientType)
		if !ok || clientType.String() == "" {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": "Unable to parse client type"})
		}

		var authorizationHeader string
		if clientType.IsCMS() {
			authorizationHeader = c.Get("User-Token")
		} else {
			authorizationHeader = c.Get("Authorization")
		}

		if authorizationHeader == "" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"message": "Unauthorized, Authorization header is missing"})
		}

		// Validate "Bearer" authentication scheme
		if !strings.HasPrefix(authorizationHeader, AuthSchemePrefix) {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"message": "Unauthorized, invalid authentication scheme"})
		}

		accessToken := strings.TrimPrefix(authorizationHeader, AuthSchemePrefix)

		claims := jwt.MapClaims{}
		_, _, err := jwt.NewParser().ParseUnverified(accessToken, &claims)
		if err != nil {
			// Unable to parse claims / Malformed token
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"message": "Unauthorized, unable to parse claims / malformed token"})
		}

		c.Locals(contexts.UserContextKey{}, contexts.User{
			MapClaims: claims,
		})

		return c.Next()
	}
}