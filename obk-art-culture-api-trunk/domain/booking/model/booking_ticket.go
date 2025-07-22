package model

import "time"

type BookingTicketDetailResponse struct {
	ID          string                `json:"id"`
	Status      string                `json:"status"`
	CheckedInAt *time.Time            `json:"checkedInAt"`
	TicketNo    string                `json:"ticketNo"`
	BookingTx   *BookingTicketTx      `json:"bookingTransaction,omitempty"`
	Program     *BookingTicketProgram `json:"program,omitempty"`
}
type BookingTicketTx struct {
	BookerName        string    `json:"bookerName"`
	BookerEmail       *string   `json:"bookerEmail"`
	BookerPhoneNumber *string   `json:"bookerPhoneNumber"`
	SlotDate          time.Time `json:"slotDate"`
	BeginSlotTime     time.Time `json:"beginSlotTime"`
	EndSlotTime       time.Time `json:"endSlotTime"`
}
type BookingTicketProgram struct {
	PeriodAt  *time.Time `json:"periodAt"`
	PeriodEnd *time.Time `json:"periodEnd"`
	ArtCTitle string     `json:"artCTitle"`
	Locale    string     `json:"locale"`
	Locations []string   `json:"locations"`
	Title     string     `json:"title"`
	Thumbnail string     `json:"thumbnail"`
	Banner    string     `json:"banner"`
}

type BookingTicketResponse struct {
	ID                    string `json:"id"`
	BookedTicketsCount    int    `json:"bookedTicketsCount"`
	CheckedInTicketsCount int    `json:"checkedInTicketsCount"`
}
