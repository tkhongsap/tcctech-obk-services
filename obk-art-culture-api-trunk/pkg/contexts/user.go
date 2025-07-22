package contexts

import (
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type UserContextKey struct{}

type User struct {
	jwt.MapClaims
}

// GetClaimString tries to parse a key in the map claims type as a [string] type.
// If the key does not exist, an empty string is returned. If the key has the
// wrong type, an error is returned.
func (u User) GetClaimString(key string) (string, error) {
	var (
		ok  bool
		raw interface{}
		s   string
	)
	raw, ok = u.MapClaims[key]
	if !ok {
		return "", nil
	}

	s, ok = raw.(string)
	if !ok {
		return "", errors.New(fmt.Sprintf("%s is invalid type for claim", key))
	}

	return s, nil
}

// GetUserContext retrieves the user context from the fiber context.
//
// It returns an error if the user context is not set or has an invalid type.
func GetUserContext(c *fiber.Ctx) (User, error) {
	user, ok := c.Locals(UserContextKey{}).(User)
	if !ok {
		return User{}, errors.New("unable to parse user context")
	}

	return user, nil
}
