package model

import "time"

type BookingSlotDateResponse struct {
	ID               string                    `json:"id"`
	CreatedAt        time.Time                 `json:"createdAt"`
	UpdatedAt        time.Time                 `json:"updatedAt"`
	ProgramID        uint                      `json:"programId"`
	BookingSettingID string                    `json:"bookingSettingId"`
	SlotDate         time.Time                 `json:"slotDate"`
	BookingSlotTimes []BookingSlotDateSlotTime `json:"bookingSlotTimes"`
}

type BookingSlotDatePaginationRequest struct {
	Page             *int       `json:"page"`
	Limit            *int       `json:"limit"`
	BookingSettingID *string    `json:"bookingSettingId"`
	BeginDate        *time.Time `json:"beginDate"`
	EndDate          *time.Time `json:"endDate"`
	Status           *string    `json:"status"`
}

type BookingSlotDatePaginationStatus string

const (
	Waiting   BookingSettingPaginationStatus = "waiting"
	OnGoing   BookingSettingPaginationStatus = "on_going"
	Completed BookingSettingPaginationStatus = "completed"
	SoldOut   BookingSettingPaginationStatus = "sold_out"
)

type BookingSlotDateSlotTime struct {
	ID                    string    `json:"id"`
	BeginSlotTime         time.Time `json:"beginSlotTime"`
	EndSlotTime           time.Time `json:"endSlotTime"`
	MaxTicketsPerSlotTime int       `json:"maxTicketsPerSlotTime"`
	BookedTicketsCount    int       `json:"bookedTicketsCount"`
	Status                string    `json:"status"`
}

type BookingSlotDatePaginationResponse struct {
	ID               string                               `json:"id"`
	CreatedAt        time.Time                            `json:"createdAt"`
	UpdatedAt        time.Time                            `json:"updatedAt"`
	ProgramID        uint                                 `json:"programId"`
	BookingSettingID string                               `json:"bookingSettingId"`
	SlotDate         time.Time                            `json:"slotDate"`
	BookingSlotTimes *[]BookingSlotDatePaginationSlotTime `json:"bookingSlotTimes,omitempty"`
}

type BookingSlotDatePaginationSlotTime struct {
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
	CheckedInTicketsCount int       `json:"checkedInTicketsCount"`
}
