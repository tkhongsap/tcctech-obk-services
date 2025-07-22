package entity

import (
	"time"

	programEntity "example.com/art-culture-api/domain/programs/entity"
)

type BookingTx struct {
	ID                string                `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt         time.Time             `json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt         time.Time             `json:"updatedAt" gorm:"autoUpdateTime;not null"`
	UserID            string                `json:"userId" gorm:"type:varchar(255);index;not null"`
	BookingSettingID  string                `json:"bookingSettingId" gorm:"type:string;not null"`
	ProgramID         uint                  `json:"programId" gorm:"type:uint;not null"`
	BookingSlotDateID string                `json:"bookingSlotDateId" gorm:"type:string;not null"`
	BookingSlotTimeID string                `json:"bookingSlotTimeId" gorm:"type:string;not null"`
	BookerName        string                `json:"bookerName" gorm:"type:varchar(255);not null"`
	BookerEmail       *string               `json:"bookerEmail" gorm:"type:varchar(255)"`
	BookerPhoneNumber *string               `json:"bookerPhoneNumber" gorm:"type:varchar(255)"`
	TicketsCount      int                   `json:"ticketsCount" gorm:"type:int;not null"`
	BookingSetting    BookingSetting        `json:"bookingSetting" gorm:"foreignKey:BookingSettingID"`
	Program           programEntity.Program `json:"program" gorm:"foreignKey:ProgramID"`
	BookingSlotDate   BookingSlotDate       `json:"bookingSlotDate" gorm:"foreignKey:BookingSlotDateID"`
	BookingSlotTime   BookingSlotTime       `json:"bookingSlotTime" gorm:"foreignKey:BookingSlotTimeID"`
	BookingTickets    []BookingTicket       `json:"bookingTickets" gorm:"foreignKey:BookingTxID"`
	OrderNo           int                   `json:"orderNo" gorm:"type:int;default:nextval('booking_transactions_order_no_seq')"`
}

func (BookingTx) TableName() string {
	return "booking_transactions"
}
