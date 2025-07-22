package service

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"example.com/art-culture-api/domain/booking/utils"
	programEntity "example.com/art-culture-api/domain/programs/entity"
	"github.com/gofiber/fiber/v2"
)

type BookingNotificationService interface {
	SendBookingConfirm(
		locale string,
		accountID string,
		program programEntity.Program,
		showTimeDate time.Time,
		showTimeTime time.Time,
	) error
}

type bookingNotificationService struct{}

func NewBookingNotificationService() BookingNotificationService {
	return &bookingNotificationService{}
}

func (s *bookingNotificationService) SendBookingConfirm(
	locale string,
	accountID string,
	program programEntity.Program,
	showTimeDate time.Time,
	showTimeTime time.Time,
) error {
	messageTemplateID := os.Getenv("NOTIFICATION_TEMPLATE_ID_BOOKING_CONFIRM")
	if messageTemplateID == "" {
		return fmt.Errorf("missing required environment variable: NOTIFICATION_TEMPLATE_ID_BOOKING_CONFIRM")
	}
	emailTemplateName := "ob-bms.art_c_booking.confirmed"
	programTitle := utils.GetProgramTitleByLocale(program, locale)
	valueMessage := map[string]string{
		"program_title": programTitle,
		"showtime_date": showTimeDate.Format("2006-01-02"),
		"showtime_time": showTimeTime.Format("15:04"),
	}

	return sendNotification(accountID, valueMessage, messageTemplateID, emailTemplateName)
}

func sendNotification(accountID string, valueMessage map[string]string, messageTemplateID string, emailTemplateName string) error {
	notificationURL := os.Getenv("NOTIFICATION_SERVICE_URL")
	if notificationURL == "" {
		return fmt.Errorf("missing required environment variable: NOTIFICATION_SERVICE_URL")
	}

	requestBody := map[string]any{
		"message_template_id": messageTemplateID,
		"account_id":          accountID,
		"email_template_name": emailTemplateName,
		"value_message":       valueMessage,
	}

	jsonData, _ := json.Marshal(requestBody)
	agent := fiber.Post(notificationURL + "/notifications/send")
	agent.Set("Content-Type", "application/json")
	agent.Body(jsonData)
	statusCode, body, errs := agent.Bytes()
	if len(errs) > 0 {
		return fmt.Errorf("failed to send notification request: %v", errs)
	}

	log.Printf("Notification sent with body: %s", string(jsonData))
	log.Printf("Notification sent with status code: %d", statusCode)
	log.Printf("Notification Response body: %s", body)

	return nil
}
