package service_test

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"example.com/art-culture-api/domain/booking/service"
	programEntity "example.com/art-culture-api/domain/programs/entity" // Import the program entity
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type BookingNotificationServiceTestSuite struct {
	suite.Suite
	service service.BookingNotificationService
	ctx     context.Context
}

func (s *BookingNotificationServiceTestSuite) SetupTest() {
	s.service = service.NewBookingNotificationService()
	s.ctx = context.Background()
}

func (s *BookingNotificationServiceTestSuite) TearDownTest() {
	// No specific mocks to assert for this service
}

type expectedRequestBody struct {
	MessageTemplateID string            `json:"message_template_id"`
	AccountID         string            `json:"account_id"`
	EmailTemplateName string            `json:"email_template_name"`
	ValueMessage      map[string]string `json:"value_message"`
}

func (s *BookingNotificationServiceTestSuite) setupMockNotificationServer() *httptest.Server {
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var receivedBody expectedRequestBody
		err := json.NewDecoder(r.Body).Decode(&receivedBody)
		assert.NoError(s.T(), err, "Failed to decode request body")
		w.WriteHeader(http.StatusOK)
		response := map[string]any{
			"data": map[string]any{
				"result": true,
			},
		}
		responseData, _ := json.Marshal(response)
		_, _ = w.Write(responseData)
	}))
	return mockServer
}

// --- Common Test Data ---
var (
	testTemplateID = "test-booking-confirm-template-id"
	testLocale     = "en"
	testAccountID  = "test-account-id-123"
	testProgram    = programEntity.Program{
		ProgramTranslation: []programEntity.ProgramTranslation{
			{
				Locale: "en",
				Title:  "Test Program Title EN",
			},
			{
				Locale: "th",
				Title:  "Test Program Title TH",
			},
		},
	}
	testShowTimeDate = time.Date(2024, 12, 25, 0, 0, 0, 0, time.UTC)
	testShowTimeTime = time.Date(0, 1, 1, 10, 30, 0, 0, time.UTC)
)

func (s *BookingNotificationServiceTestSuite) TestSendBookingConfirm_Success() {
	mockServer := s.setupMockNotificationServer()
	defer mockServer.Close()

	s.T().Setenv("NOTIFICATION_SERVICE_URL", mockServer.URL)
	s.T().Setenv("NOTIFICATION_TEMPLATE_ID_BOOKING_CONFIRM", testTemplateID)
	err := s.service.SendBookingConfirm(testLocale, testAccountID, testProgram, testShowTimeDate, testShowTimeTime)

	assert.NoError(s.T(), err, "SendBookingConfirm should not return an error on success")
}

func (s *BookingNotificationServiceTestSuite) TestSendBookingConfirm_Error_MissingTemplateID() {
	mockServer := s.setupMockNotificationServer()
	defer mockServer.Close()

	s.T().Setenv("NOTIFICATION_SERVICE_URL", mockServer.URL)
	err := s.service.SendBookingConfirm(testLocale, testAccountID, testProgram, testShowTimeDate, testShowTimeTime)

	assert.Error(s.T(), err, "Expected an error")
	assert.Contains(s.T(), err.Error(), "missing required environment variable: NOTIFICATION_TEMPLATE_ID_BOOKING_CONFIRM", "Error message mismatch.")
}

func (s *BookingNotificationServiceTestSuite) TestSendBookingConfirm_Error_MissingNotificationURL() {
	mockServer := s.setupMockNotificationServer()
	defer mockServer.Close()

	s.T().Setenv("NOTIFICATION_TEMPLATE_ID_BOOKING_CONFIRM", testTemplateID)
	err := s.service.SendBookingConfirm(testLocale, testAccountID, testProgram, testShowTimeDate, testShowTimeTime)

	assert.Error(s.T(), err, "Expected an error")
	assert.Contains(s.T(), err.Error(), "missing required environment variable: NOTIFICATION_SERVICE_URL", "Error message mismatch.")
}

func (s *BookingNotificationServiceTestSuite) TestSendBookingConfirm_Error_NetworkTransportFailure() {
	mockServer := s.setupMockNotificationServer()
	defer mockServer.Close()

	s.T().Setenv("NOTIFICATION_SERVICE_URL", "http://127.0.0.1:9999")
	s.T().Setenv("NOTIFICATION_TEMPLATE_ID_BOOKING_CONFIRM", testTemplateID)
	err := s.service.SendBookingConfirm(testLocale, testAccountID, testProgram, testShowTimeDate, testShowTimeTime)

	assert.Error(s.T(), err, "Expected an error due to network failure")
	assert.Contains(s.T(), err.Error(), "failed to send notification request", "Error message mismatch")
}

func TestBookingNotificationServiceTestSuite(t *testing.T) {
	suite.Run(t, new(BookingNotificationServiceTestSuite))
}
