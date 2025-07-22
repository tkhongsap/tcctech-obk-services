package middlewares

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"example.com/art-culture-api/pkg/contexts"
	"example.com/art-culture-api/pkg/enums"
	"github.com/expr-lang/expr"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
)

type loginRequest struct {
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	GrantType    string `json:"grant_type"`
}

type loginResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   uint   `json:"expires_in"`
}

type permissionResponse struct {
	Mid                string  `json:"mid"`
	Email              string  `json:"email"`
	Roles              []roles `json:"roles"`
	UpdatedDate        string  `json:"updatedDate"`
	UpdatedByName      string  `json:"updatedByName"`
	Status             int     `json:"status"`
	CreatedDate        string  `json:"createdDate"`
	CreatedDateDisplay string  `json:"createdDateDisplay"`
	Name               string  `json:"name"`
	KeyCloakUserID     any     `json:"keyCloakUserId"`
}

type gatewayResponse struct {
	ExpiresIn   int    `json:"expires_in"`
	TokenType   string `json:"token_type"`
	AccessToken string `json:"access_token"`
}

type privilegeItems struct {
	Ptid string `json:"ptid"`
	Name string `json:"name"`
	Code string `json:"code"`
}

type roles struct {
	Rid            string           `json:"rid"`
	RoleName       string           `json:"roleName"`
	PrivilegeItems []privilegeItems `json:"privilegeItems"`
}

type env struct {
	RequiredPermissions []string
	UserPermissions     []string
}

type permissionMiddleware struct {
	cache *redis.Client
}

func NewPermissionMiddleware(redis *redis.Client) *permissionMiddleware {
	return &permissionMiddleware{cache: redis}
}

func (p *permissionMiddleware) Verify(permissions ...enums.CMSPermission) func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		user, err := contexts.GetUserContext(c)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		preferredUsername, _ := user.GetClaimString("preferred_username")

		ctx := c.UserContext()

		token, err := p.getGatewayToken(ctx)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		pr, err := p.getPermissions(preferredUsername, token)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		result, err := p.checkPermission(pr, permissions)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}
		if !result {
			return c.Status(http.StatusForbidden).JSON(fiber.Map{"message": "Forbidden, insufficient permission"})
		}

		return c.Next()
	}
}

func (p *permissionMiddleware) checkPermission(
	userPermissionResponse permissionResponse,
	permissions []enums.CMSPermission,
) (bool, error) {
	var userPermissions []string
	if len(userPermissionResponse.Roles) > 0 {
		for _, r := range userPermissionResponse.Roles {
			for _, pi := range r.PrivilegeItems {
				userPermissions = append(userPermissions, pi.Code)
			}
		}
	} else {
		userPermissions = make([]string, 0)
	}

	requiredPermissions := make([]string, 0, len(permissions))
	for _, p := range permissions {
		requiredPermissions = append(requiredPermissions, string(p))
	}

	program, err := expr.Compile(`any(RequiredPermissions, # in UserPermissions)`, expr.Env(env{}), expr.AsBool())
	if err != nil {
		return false, err
	}

	output, err := expr.Run(program, env{RequiredPermissions: requiredPermissions, UserPermissions: userPermissions})
	if err != nil {
		return false, err
	}

	// It is safe to assert the output to bool, if the expression is type checked as bool.
	result := output.(bool)
	return result, nil
}

func (p *permissionMiddleware) getPermissions(
	preferredUsername string,
	gatewayToken string,
) (permissionResponse, error) {
	agent := fiber.Get(os.Getenv("CMS_AUTH_URL") + "/obkcms/api/v1/Member/KeyCloakId/" + preferredUsername)
	agent.InsecureSkipVerify()
	agent.Set("Content-Type", "application/json")
	agent.Set("Authorization", "Bearer "+gatewayToken)
	statusCode, data, errs := agent.Bytes()
	if len(errs) > 0 {
		return permissionResponse{}, errs[0]
	}
	if statusCode != http.StatusOK {
		return permissionResponse{}, errors.New(string(data))
	}

	var res permissionResponse
	if err := json.Unmarshal(data, &res); err != nil {
		return permissionResponse{}, err
	}

	return res, nil
}

func (p *permissionMiddleware) getGatewayToken(ctx context.Context) (string, error) {
	cacheKey := "cms-gateway-token"
	if val, err := p.cache.Get(ctx, cacheKey).Result(); err == nil {
		return val, nil
	}

	payload := []byte(fmt.Sprintf(
		`{
			"client_id": "%s",
			"client_secret": "%s",
			"grant_type": "client_credentials"
		}`,
		os.Getenv("CMS_AUTH_CLIENT_ID"), os.Getenv("CMS_AUTH_CLIENT_SECRET"),
	))

	agent := fiber.Post(os.Getenv("CMS_AUTH_URL") + "/obk/api/oauth2/token")
	agent.InsecureSkipVerify()
	agent.Set("Content-Type", "application/json")
	agent.Body(payload)

	statusCode, data, errs := agent.Bytes()
	if len(errs) > 0 {
		return "", errs[0]
	}
	if statusCode != http.StatusOK {
		return "", errors.New(string(data))
	}

	var res gatewayResponse
	if err := json.Unmarshal(data, &res); err != nil {
		return "", err
	}

	p.cache.Set(ctx, cacheKey, res.AccessToken, time.Duration(res.ExpiresIn)*time.Second)
	return res.AccessToken, nil
}
