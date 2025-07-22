package middlewares_test

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"example.com/art-culture-api/middlewares"
	"example.com/art-culture-api/pkg/contexts"
	"example.com/art-culture-api/pkg/enums"
	"example.com/art-culture-api/pkg/enums/permission"
	"github.com/go-redis/redismock/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

type gatewayResponse struct {
	ExpiresIn   int    `json:"expires_in"`
	TokenType   string `json:"token_type"`
	AccessToken string `json:"access_token"`
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

func TestNewPermissionMiddleware(t *testing.T) {
	t.Setenv("ENVIRONMENT", "test")

	tests := []struct {
		Name                   string
		Permissions            []enums.CMSPermission
		UserToken              string
		CMSAuthUrl             string
		StubPreferredUsername  string
		StubGatewayResponse    gatewayResponse
		StubPermissionResponse permissionResponse
		ExpectedStatusCode     int
		ExpectedMessage        string
	}{
		{
			Name:                  "Sufficient permission",
			Permissions:           []enums.CMSPermission{permission.CreateBookingSettings},
			UserToken:             "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJNZjMtM0FLTHJFYy1ZSnIzYjFMeFVnd1EtSlBnWTdEcWNaQVR1b3FQVERBIn0.eyJleHAiOjE3MzE3NTU4NDUsImlhdCI6MTczMTc1NTU0NSwianRpIjoiMTY2ZGY1NjEtNTA2Ny00ZDUxLTg2MWQtNmQ1NmMxYzU3ZGUwIiwiaXNzIjoiaHR0cDovL2VjMi0xOC0xNDAtNjctMjU1LmFwLXNvdXRoZWFzdC0xLmNvbXB1dGUuYW1hem9uYXdzLmNvbTo4MDgwL3JlYWxtcy9PQktPcGVyYXRpb24iLCJzdWIiOiI1ZDYxZGYxNS0wNzlmLTQ0NjUtYWE1Yi1hYmU1ZmIyZWFhZDQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJzZXNzaW9uX3N0YXRlIjoiODZjMTNjZWUtYzExNi00NTI5LWJkYTQtNzQ1Y2YyOTIwYjBlIiwiYWNyIjoiMSIsInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6Ijg2YzEzY2VlLWMxMTYtNDUyOS1iZGE0LTc0NWNmMjkyMGIwZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU3VwZXJBZG1pbkFjYyBDTVMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJjZjM1MjY4Mi00MjNhLTRhMzAtYWFiNy1lOWY1NTU5ZjNmMWIiLCJnaXZlbl9uYW1lIjoiU3VwZXJBZG1pbkFjYyIsImZhbWlseV9uYW1lIjoiQ01TIn0.JIGyONGqMXLV2lzB139X6TDncUiKEAsHy0NwFEHPbkDOrnBVDsL-Rx99rhF7I3tlGIpzMw5JbO4owyEENaAaOK97i4wh9WggrFgENQ6EHO-3t9lE0wtBYTWIoYRgRkCEIt81oVTH92LR-o26RvHWAfCwXUDVQBC4EsJLmie4vJ8jsWjjLxcDoSzNNRWyTRKA5mAVJZQb2ua84zSDG5-ueN2Zq-VlZKTTeK7lPWdoJcZzQT0DtgLS_Rr6fZTtKS6R4E2kBanV77tGHcoIqXiDURGxVGTs00wjHOo8YgSCnWXXdva-Tjg7Bx8m3h5z-5Y762KTWAaWKahZm7o1Bvbi0A",
			CMSAuthUrl:            "http://localhost:8081",
			StubPreferredUsername: "cf352682-423a-4a30-aab7-e9f5559f3f1b",
			StubGatewayResponse: gatewayResponse{
				ExpiresIn:   7200,
				TokenType:   "bearer",
				AccessToken: "qK0LIHZqzqdxLeyYZ0lUx58B33CZobhc",
			},
			StubPermissionResponse: permissionResponse{
				Mid:   "test",
				Email: "test@mail.com",
				Roles: []roles{
					{
						Rid:      "test",
						RoleName: "Super Admin",
						PrivilegeItems: []privilegeItems{
							{
								Ptid: "test",
								Name: "Create Booking Settings",
								Code: "AC021",
							},
						},
					},
				},
				UpdatedDate:        "test",
				UpdatedByName:      "test",
				Status:             1,
				CreatedDate:        "test",
				CreatedDateDisplay: "test",
				Name:               "test",
				KeyCloakUserID:     "test",
			},
			ExpectedStatusCode: http.StatusOK,
			ExpectedMessage:    http.StatusText(http.StatusOK),
		},
		{
			Name:                  "Insufficient permission",
			Permissions:           []enums.CMSPermission{permission.ScanTicket},
			UserToken:             "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1mMy0zQUtMckVjLVlKcjNiMUx4VWd3US1KUGdZN0RxY1pBVHVvcVBUREEifQ.eyJleHAiOjE3MzE3NTU4NDUsImlhdCI6MTczMTc1NTU0NSwianRpIjoiMTY2ZGY1NjEtNTA2Ny00ZDUxLTg2MWQtNmQ1NmMxYzU3ZGUwIiwiaXNzIjoiaHR0cDovL2VjMi0xOC0xNDAtNjctMjU1LmFwLXNvdXRoZWFzdC0xLmNvbXB1dGUuYW1hem9uYXdzLmNvbTo4MDgwL3JlYWxtcy9PQktPcGVyYXRpb24iLCJzdWIiOiI1ZDYxZGYxNS0wNzlmLTQ0NjUtYWE1Yi1hYmU1ZmIyZWFhZDQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJzZXNzaW9uX3N0YXRlIjoiODZjMTNjZWUtYzExNi00NTI5LWJkYTQtNzQ1Y2YyOTIwYjBlIiwiYWNyIjoiMSIsInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6Ijg2YzEzY2VlLWMxMTYtNDUyOS1iZGE0LTc0NWNmMjkyMGIwZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU3VwZXJBZG1pbkFjYyBDTVMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ0ZXN0IiwiZ2l2ZW5fbmFtZSI6IlN1cGVyQWRtaW5BY2MiLCJmYW1pbHlfbmFtZSI6IkNNUyJ9.W_9mDZI0kRmMrVsiDTpQXXXCyRCsU8WyfCZua65N-Qwd7lfeOJg2KZD4RtUQUS80FfAjQP082L_meg4MIdVrXtMfbh-xAaEttIJw8UMWF0Jc7IgMtt76d4BCDGjZ0tPe2B9RO07RO3NBI7MTljnuctKGB4LlCjBNzw_QylTY54pVf7kvS9DOJ5ESMARRyoU1cBILIFm3-yjV4P0Q-YyQtEulPZ9hHKAPLYhRVojmsyiSzEdgAykUjRaqPN9Xn5BMD1ckXj7BbXliERODE1Plzhsl3fz-6UF7WwcfLQK36KuIJM7pCvrTYByDLBynNBoSi-NBtxxIKTErYxN5MM2f1Q",
			CMSAuthUrl:            "http://localhost:8081",
			StubPreferredUsername: "test",
			StubGatewayResponse: gatewayResponse{
				ExpiresIn:   7200,
				TokenType:   "bearer",
				AccessToken: "qK0LIHZqzqdxLeyYZ0lUx58B33CZobhc",
			},
			StubPermissionResponse: permissionResponse{
				Mid:                "test",
				Email:              "test@mail.com",
				Roles:              nil,
				UpdatedDate:        "test",
				UpdatedByName:      "test",
				Status:             1,
				CreatedDate:        "test",
				CreatedDateDisplay: "test",
				Name:               "test",
				KeyCloakUserID:     "test",
			},
			ExpectedStatusCode: http.StatusForbidden,
			ExpectedMessage:    "Forbidden, insufficient permission",
		},
	}

	for _, tt := range tests {
		t.Run(tt.Name, func(t *testing.T) {
			// Arrange

			// Mock auth server
			t.Setenv("CMS_AUTH_URL", tt.CMSAuthUrl)
			mockAuth := fiber.New()
			go func(mockAuth *fiber.App) {
				mockAuth.Get("/obkcms/api/v1/Member/KeyCloakId/"+tt.StubPreferredUsername, func(c *fiber.Ctx) error {
					return c.Status(http.StatusOK).JSON(tt.StubPermissionResponse)
				})
				mockAuth.Post("/obk/api/oauth2/token", func(c *fiber.Ctx) error {
					return c.Status(http.StatusOK).JSON(tt.StubGatewayResponse)
				})
				_ = mockAuth.Listen(":8081")
			}(mockAuth)

			// Init app server
			app := fiber.New()
			redis, mock := redismock.NewClientMock()

			// Mock redis Get()
			mock.ExpectGet("cms-gateway-token").RedisNil()

			app.Use(middlewares.NewClientTypeMiddleware(contexts.NewClientTypeCMS()))
			app.Use(middlewares.NewJWTMiddleware())

			permissionGuard := middlewares.NewPermissionMiddleware(redis)
			app.Get("/",
				permissionGuard.Verify(tt.Permissions...),
				func(c *fiber.Ctx) error {
					return c.SendStatus(http.StatusOK)
				},
			)

			// Act
			req := httptest.NewRequest("GET", "/", nil)
			req.Header.Set("User-Token", middlewares.AuthSchemePrefix+tt.UserToken)
			res, err := app.Test(req, -1)

			// Assert
			assert.NoError(t, err)

			bodyBytes, err := io.ReadAll(res.Body)
			assert.NoError(t, err)
			defer res.Body.Close()

			assert.NoError(t, mock.ExpectationsWereMet())
			assert.Equal(t, tt.ExpectedStatusCode, res.StatusCode)
			assert.Contains(t, string(bodyBytes), tt.ExpectedMessage)
			assert.NoError(t, mockAuth.Shutdown())
		})
	}
}
