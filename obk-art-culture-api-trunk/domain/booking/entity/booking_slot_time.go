package entity

import (
	"database/sql/driver"
	"errors"
	"fmt"
	"time"

	programEntity "example.com/art-culture-api/domain/programs/entity"
)

type BookingSlotTimeStatus string

const (
	BookingSlotTimeAvailable BookingSlotTimeStatus = "available"
	BookingSlotTimeSoldOut   BookingSlotTimeStatus = "sold_out"
)

// Scan validate enum on reading from database
func (s *BookingSlotTimeStatus) Scan(value interface{}) error {
	var bs BookingSlotTimeStatus
	if value == nil {
		*s = ""
		return nil
	}
	st, ok := value.(string)
	if !ok {
		return errors.New("invalid data for booking status")
	}
	bs = BookingSlotTimeStatus(st) //convert type from bytes to BookingSlotTimeStatus
	switch bs {
	case BookingSlotTimeAvailable, BookingSlotTimeSoldOut:
		*s = bs
		return nil
	}
	return fmt.Errorf("invalid booking status value :%s", st)
}

// Value validate enum when sending data to database
func (s BookingSlotTimeStatus) Value() (driver.Value, error) {
	switch s {
	case BookingSlotTimeAvailable, BookingSlotTimeSoldOut:
		return string(s), nil
	}
	return nil, errors.New("invalid booking status value")
}

func (s BookingSlotTimeStatus) String() string {
	return string(s)
}

type BookingSlotTime struct {
	ID                    string                `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt             time.Time             `json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt             time.Time             `json:"updatedAt" gorm:"autoUpdateTime;not null"`
	ProgramID             uint                  `json:"programId" gorm:"type:uint;not null"`
	BookingSettingID      string                `json:"bookingSettingId" gorm:"type:string;not null"`
	BookingSlotDateID     string                `json:"bookingSlotDateId" gorm:"type:string;not null"`
	BeginSlotTime         time.Time             `json:"beginSlotTime" gorm:"type:time;index;not null"`
	EndSlotTime           time.Time             `json:"endSlotTime" gorm:"type:time;index;not null"`
	MaxTicketsPerSlotTime int                   `json:"maxTicketsPerSlotTime" gorm:"type:int;not null"`
	BookedTicketsCount    int                   `json:"bookedTicketsCount" gorm:"type:int;not null;default:0"`
	CheckedInTicketsCount int                   `json:"checkedInTicketsCount" gorm:"type:int;not null;default:0"`
	BookingSlotTimeStatus BookingSlotTimeStatus `json:"status" gorm:"not null;column:status;type:booking_slot_times_status;default:'available'"`
	Program               programEntity.Program `json:"program" gorm:"foreignKey:ProgramID"`
	BookingSetting        BookingSetting        `json:"bookingSetting" gorm:"foreignKey:BookingSettingID"`
	BookingSlotDate       BookingSlotDate       `json:"bookingSlotDate" gorm:"foreignKey:BookingSlotDateID"`
}

func (BookingSlotTime) TableName() string {
	return "booking_slot_times"
}
