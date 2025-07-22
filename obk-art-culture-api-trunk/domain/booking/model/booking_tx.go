package model

import (
	"time"
)

type BookingTxResponse struct {
	ID                string             `json:"id"`
	CreatedAt         time.Time          `json:"createdAt"`
	UpdatedAt         time.Time          `json:"updatedAt"`
	UserID            string             `json:"userId"`
	ProgramID         uint               `json:"programId"`
	BookingSlotDateID string             `json:"bookingSlotDateId"`
	BookingSlotTimeID string             `json:"bookingSlotTimeId"`
	OrderId           string             `json:"orderId"`
	BookerName        string             `json:"bookerName"`
	BookerEmail       *string            `json:"bookerEmail"`
	BookerPhoneNumber *string            `json:"bookerPhoneNumber"`
	TicketsCount      int                `json:"ticketsCount"`
	ShowingStatus     string             `json:"showingStatus,omitempty"`
	SlotDate          time.Time          `json:"slotDate"`
	BeginSlotTime     time.Time          `json:"beginSlotTime"`
	EndSlotTime       time.Time          `json:"endSlotTime"`
	Price             float64            `json:"price"`
	Program           *BookingTxProgram  `json:"program,omitempty"`
	BookingTickets    *[]BookingTxTicket `json:"bookingTickets,omitempty"`
}

type BookingTxProgram struct {
	PeriodAt  *time.Time `json:"periodAt"`
	PeriodEnd *time.Time `json:"periodEnd"`
	ArtCTitle string     `json:"artCTitle"`
	Locale    string     `json:"locale"`
	Locations []string   `json:"locations"`
	Title     string     `json:"title"`
	Thumbnail string     `json:"thumbnail"`
	Banner    string     `json:"banner"`
}

type BookingTxTicket struct {
	ID          string     `json:"id"`
	TicketNo    string     `json:"ticketNo"`
	Status      string     `json:"status"`
	CheckedInAt *time.Time `json:"checkedInAt"`
}

type BookingTxCMSResponse struct {
	ID                string    `json:"id"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
	UserID            string    `json:"userId"`
	ProgramID         uint      `json:"programId"`
	OrderId           string    `json:"orderId"`
	BookingSlotDateID string    `json:"bookingSlotDateId"`
	BookingSlotTimeID string    `json:"bookingSlotTimeId"`
	BookerName        string    `json:"bookerName"`
	BookerEmail       *string   `json:"bookerEmail"`
	BookerPhoneNumber *string   `json:"bookerPhoneNumber"`
	TicketsCount      int       `json:"ticketsCount"`
	ShowingStatus     string    `json:"showingStatus,omitempty"`
	SlotDate          time.Time `json:"slotDate"`
	BeginSlotTime     time.Time `json:"beginSlotTime"`
	EndSlotTime       time.Time `json:"endSlotTime"`
	Price             float64   `json:"price"`
}

type BookingTxCreateRequest struct {
	ProgramID         uint    `json:"programId"`
	BookingSlotDateID string  `json:"bookingSlotDateId"`
	BookingSlotTimeID string  `json:"bookingSlotTimeId"`
	BookerName        *string `json:"bookerName"`
	BookerEmail       *string `json:"bookerEmail"`
	BookerPhoneNumber *string `json:"bookerPhoneNumber"`
	TicketsCount      *int    `json:"ticketsCount"`
}
