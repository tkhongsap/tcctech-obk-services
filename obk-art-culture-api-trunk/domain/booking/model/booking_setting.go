package model

import (
	"time"
)

type BookingSettingResponse struct {
	ID                       string                    `json:"id"`
	ProgramID                uint                      `json:"programId"`
	CreatedAt                time.Time                 `json:"createdAt"`
	UpdatedAt                time.Time                 `json:"updatedAt"`
	ConditionText            *string                   `json:"conditionText,omitempty"`
	ConditionTextEN          *string                   `json:"conditionTextEn,omitempty"`
	ConditionTextTH          *string                   `json:"conditionTextTh,omitempty"`
	ConditionTextCN          *string                   `json:"conditionTextCn,omitempty"`
	TicketPrice              float64                   `json:"ticketPrice"`
	MaxTicketsPerTransaction int                       `json:"maxTicketsPerTransaction"`
	OpenBookingTime          time.Time                 `json:"openBookingTime"`
	CloseBookingTime         time.Time                 `json:"closeBookingTime"`
	Program                  *BookingSettingProgram    `json:"program,omitempty"`
	BookingSlotDates         *[]BookingSettingSlotDate `json:"bookingSlotDates,omitempty"`
}

type BookingSettingProgram struct {
	PeriodAt  *time.Time `json:"periodAt"`
	PeriodEnd *time.Time `json:"periodEnd"`
	ArtCTitle string     `json:"artCTitle"`
	Locale    string     `json:"locale"`
	Locations []string   `json:"locations"`
	Title     string     `json:"title"`
	Thumbnail string     `json:"thumbnail"`
	Banner    string     `json:"banner"`
}

type BookingSettingSlotDate struct {
	ID               string                    `json:"id"`
	ProgramID        uint                      `json:"programId"`
	BookingSettingID string                    `json:"bookingSettingId"`
	CreatedAt        time.Time                 `json:"createdAt"`
	UpdatedAt        time.Time                 `json:"updatedAt"`
	SlotDate         time.Time                 `json:"slotDate"`
	BookingSlotTimes *[]BookingSettingSlotTime `json:"bookingSlotTimes,omitempty"`
}

type BookingSettingSlotTime struct {
	ID                    string    `json:"id"`
	BookingSettingID      string    `json:"bookingSettingId"`
	ProgramID             uint      `json:"programId"`
	BookingSlotDateID     string    `json:"bookingSlotDateId"`
	CreatedAt             time.Time `json:"createdAt"`
	UpdatedAt             time.Time `json:"updatedAt"`
	BeginSlotTime         time.Time `json:"beginSlotTime"`
	EndSlotTime           time.Time `json:"endSlotTime"`
	MaxTicketsPerSlotTime int       `json:"maxTicketsPerSlotTime"`
	BookedTicketsCount    int       `json:"bookedTicketsCount"`
	Status                string    `json:"status"`
}

type BookingSettingPaginationResponse struct {
	ID               string                           `json:"id"`
	ProgramID        uint                             `json:"programId"`
	TicketPrice      float64                          `json:"ticketPrice"`
	OpenBookingTime  time.Time                        `json:"openBookingTime"`
	CloseBookingTime time.Time                        `json:"closeBookingTime"`
	MaxTickets       int                              `json:"maxTickets"`   // Sum max_tickets_per_slot_time
	BookedCount      int                              `json:"bookedCount"`  // Sum booked_tickets_count
	CheckedCount     int                              `json:"checkedCount"` // Count of booking_tickets.status which is "checked_in"
	Program          *BookingSettingPaginationProgram `json:"program,omitempty"`
}

type BookingSettingPaginationProgram struct {
	PeriodAt  *time.Time `json:"periodAt"`
	PeriodEnd *time.Time `json:"periodEnd"`
	ArtCTitle string     `json:"artCTitle"`
	Locale    string     `json:"locale"`
	Locations []string   `json:"locations"`
	Title     string     `json:"title"`
}

type BookingSettingCreateRequest struct {
	ProgramID                *uint                                  `json:"programId"`
	ConditionTextEN          *string                                `json:"conditionTextEn"`
	ConditionTextTH          *string                                `json:"conditionTextTh"`
	ConditionTextCN          *string                                `json:"conditionTextCn"`
	TicketPrice              *float64                               `json:"ticketPrice"`
	MaxTicketsPerTransaction *int                                   `json:"maxTicketsPerTransaction"`
	OpenBookingTime          *time.Time                             `json:"openBookingTime"`
	CloseBookingTime         *time.Time                             `json:"closeBookingTime"`
	BookingSlotDates         *[]BookingSettingSlotDateCreateRequest `json:"bookingSlotDates"`
}

type BookingSettingSlotDateCreateRequest struct {
	SlotDate         *time.Time                             `json:"slotDate"`
	BookingSlotTimes *[]BookingSettingSlotTimeCreateRequest `json:"bookingSlotTimes"`
}

type BookingSettingSlotTimeCreateRequest struct {
	BeginSlotTime         *time.Time `json:"beginSlotTime"`
	EndSlotTime           *time.Time `json:"endSlotTime"`
	MaxTicketsPerSlotTime *int       `json:"maxTicketsPerSlotTime"`
}

type BookingSettingPatchRequest struct {
	ProgramID                *uint                                 `json:"programId"`
	ConditionTextEN          *string                               `json:"conditionTextEn"`
	ConditionTextTH          *string                               `json:"conditionTextTh"`
	ConditionTextCN          *string                               `json:"conditionTextCn"`
	TicketPrice              *float64                              `json:"ticketPrice"`
	MaxTicketsPerTransaction *int                                  `json:"maxTicketsPerTransaction"`
	OpenBookingTime          *time.Time                            `json:"openBookingTime"`
	CloseBookingTime         *time.Time                            `json:"closeBookingTime"`
	BookingSlotDates         *[]BookingSettingSlotDatePatchRequest `json:"bookingSlotDates"`
}

type BookingSettingSlotDatePatchRequest struct {
	ID               *string                               `json:"id"`
	SlotDate         *time.Time                            `json:"slotDate"`
	BookingSlotTimes *[]BookingSettingSlotTimePatchRequest `json:"bookingSlotTimes"`
}

type BookingSettingSlotTimePatchRequest struct {
	ID                    *string    `json:"id"`
	BeginSlotTime         *time.Time `json:"beginSlotTime"`
	EndSlotTime           *time.Time `json:"endSlotTime"`
	MaxTicketsPerSlotTime *int       `json:"maxTicketsPerSlotTime"`
}

func (b BookingSettingPatchRequest) ToQueryParams() ([]string, map[string]any) {
	var fields []string = make([]string, 0)
	var m map[string]any = make(map[string]any)

	if b.ProgramID != nil {
		fields = append(fields, "program_id")
		m["program_id"] = *b.ProgramID
	}
	if b.ConditionTextEN != nil {
		fields = append(fields, "condition_text_en")
		m["condition_text_en"] = *b.ConditionTextEN
	}
	if b.ConditionTextTH != nil {
		fields = append(fields, "condition_text_th")
		m["condition_text_th"] = *b.ConditionTextTH
	}
	if b.ConditionTextCN != nil {
		fields = append(fields, "condition_text_cn")
		m["condition_text_cn"] = *b.ConditionTextCN
	}
	if b.TicketPrice != nil {
		fields = append(fields, "ticket_price")
		m["ticket_price"] = *b.TicketPrice
	}
	if b.MaxTicketsPerTransaction != nil {
		fields = append(fields, "max_tickets_per_transaction")
		m["max_tickets_per_transaction"] = *b.MaxTicketsPerTransaction
	}
	if b.OpenBookingTime != nil {
		fields = append(fields, "open_booking_time")
		m["open_booking_time"] = *b.OpenBookingTime
	}
	if b.CloseBookingTime != nil {
		fields = append(fields, "close_booking_time")
		m["close_booking_time"] = *b.CloseBookingTime
	}

	return fields, m
}

type BookingSettingPaginationRequest struct {
	Page         *int       `json:"page"`
	Limit        *int       `json:"limit"`
	Fields       *string    `json:"fields"`
	ProgramTitle *string    `json:"programTitle"`
	BeginDate    *time.Time `json:"beginDate"`
	EndDate      *time.Time `json:"endDate"`
	Status       *string    `json:"status"`
}

type BookingSettingPaginationStatus string

const (
	WaitingStatus   BookingSettingPaginationStatus = "waiting"
	OnGoingStatus   BookingSettingPaginationStatus = "on_going"
	CompletedStatus BookingSettingPaginationStatus = "completed"
	SoldOutStatus   BookingSettingPaginationStatus = "sold_out"
)

type BookingSettingCheckAvailabilityRequest struct {
	ProgramIDs []uint    `json:"programIds"`
	Time       time.Time `json:"time"`
}

type BookingSettingCheckAvailabilityResponse struct {
	ProgramID   uint `json:"programId"`
	IsAvailable bool `json:"isAvailable"`
}
