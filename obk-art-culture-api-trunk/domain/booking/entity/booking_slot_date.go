package entity

import (
	"time"

	programEntity "example.com/art-culture-api/domain/programs/entity"
)

type BookingSlotDate struct {
	ID               string                `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt        time.Time             `json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt        time.Time             `json:"updatedAt" gorm:"autoUpdateTime;not null"`
	ProgramID        uint                  `json:"programId" gorm:"type:uint;not null"`
	BookingSettingID string                `json:"bookingSettingId" gorm:"type:string;not null;uniqueIndex:idx_booking_setting_id_slot_date"`
	SlotDate         time.Time             `json:"slotDate" gorm:"type:time;not null;uniqueIndex:idx_booking_setting_id_slot_date"`
	Program          programEntity.Program `json:"program" gorm:"foreignKey:ProgramID"`
	BookingSetting   BookingSetting        `json:"bookingSetting" gorm:"foreignKey:BookingSettingID"`
	BookingSlotTimes []BookingSlotTime     `json:"bookingSlotTimes" gorm:"foreignKey:BookingSlotDateID"`
}

func (BookingSlotDate) TableName() string {
	return "booking_slot_dates"
}
