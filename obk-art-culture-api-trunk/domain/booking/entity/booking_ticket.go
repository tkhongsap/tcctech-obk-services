package entity

import (
	"database/sql/driver"
	"errors"
	"fmt"
	"time"

	programEntity "example.com/art-culture-api/domain/programs/entity"
)

type BookingTicketStatus string

const (
	Booked    BookingTicketStatus = "booked"
	CheckedIn BookingTicketStatus = "checked_in"
)

// Scan validate enum on reading from database
func (s *BookingTicketStatus) Scan(value interface{}) error {
	var bs BookingTicketStatus
	if value == nil {
		*s = ""
		return nil
	}
	st, ok := value.(string)
	if !ok {
		return errors.New("invalid data for booking ticket status")
	}
	bs = BookingTicketStatus(st) //convert type from bytes to BookingTicketStatus
	switch bs {
	case Booked, CheckedIn:
		*s = bs
		return nil
	}
	return fmt.Errorf("invalid booking ticket status value :%s", st)
}

// Value validate enum when sending data to database
func (s BookingTicketStatus) Value() (driver.Value, error) {
	switch s {
	case Booked, CheckedIn:
		return string(s), nil
	}
	return nil, errors.New("invalid booking status value")
}

func (s BookingTicketStatus) String() string {
	return string(s)
}

type BookingTicket struct {
	ID               string                `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt        time.Time             `json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt        time.Time             `json:"updatedAt" gorm:"autoUpdateTime;not null"`
	ProgramID        uint                  `json:"programId" gorm:"type:bigint;not null;index"`
	BookingSettingID string                `json:"bookingSettingId" gorm:"type:string;not null;index"`
	BookingTxID      string                `json:"bookingTransactionId" gorm:"type:string;not null;index;column:booking_transaction_id"`
	TicketNo         int                   `json:"ticketNo" gorm:"default:nextval('ticket_no_seq');not null"`
	Status           BookingTicketStatus   `json:"status" gorm:"not null;column:status;type:booking_tickets_status;default:'booked'"`
	CheckedInAt      *time.Time            `json:"checkedInAt" gorm:"type:time;null"`
	Program          programEntity.Program `json:"program" gorm:"foreignKey:ProgramID"`
	BookingSetting   BookingSetting        `json:"bookingSetting" gorm:"foreignKey:BookingSettingID"`
	BookingTx        BookingTx             `json:"bookingTransaction" gorm:"foreignKey:BookingTxID"`
}

func (BookingTicket) TableName() string {
	return "booking_tickets"
}
