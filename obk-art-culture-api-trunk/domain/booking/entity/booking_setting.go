package entity

import (
	"time"

	programEntity "example.com/art-culture-api/domain/programs/entity"
)

type BookingSetting struct {
	ID                       string                `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt                time.Time             `json:"createdAt" gorm:"autoCreateTime;not null"`
	UpdatedAt                time.Time             `json:"updatedAt" gorm:"autoUpdateTime;not null"`
	ProgramID                uint                  `json:"programId" gorm:"type:uint;not null;uniqueIndex:idx_program_id"`
	ConditionTextEN          *string               `json:"conditionTextEn" gorm:"type:text"`
	ConditionTextTH          *string               `json:"conditionTextTh" gorm:"type:text"`
	ConditionTextCN          *string               `json:"conditionTextCn" gorm:"type:text"`
	TicketPrice              float64               `json:"ticketPrice" gorm:"type:decimal(8,2);not null"` // edit this data type
	MaxTicketsPerTransaction int                   `json:"maxTicketsPerTransaction" gorm:"type:int;not null"`
	OpenBookingTime          time.Time             `json:"openBookingTime" gorm:"type:time;not null"`
	CloseBookingTime         time.Time             `json:"closeBookingTime" gorm:"type:time;not null"`
	Program                  programEntity.Program `json:"program" gorm:"foreignKey:ProgramID"`
	BookingSlotDates         []BookingSlotDate     `json:"bookingSlotDates" gorm:"foreignKey:BookingSettingID"`
}

func (BookingSetting) TableName() string {
	return "booking_settings"
}

type BookingSettingPagination struct {
	ID                         string     `gorm:"column:id;->"`                                // Booking Setting ID
	ProgramID                  uint       `gorm:"column:program_id;->"`                        // Program ID
	ArtCTypeID                 uint       `gorm:"column:art_c_type_id;->"`                     // Art C Type ID
	ArtCCategoryID             *uint      `gorm:"column:art_c_category_id;->"`                 // Art C Category ID
	TicketPrice                float64    `gorm:"column:ticket_price;->"`                      // Ticket Price
	OpenBookingTime            time.Time  `gorm:"column:open_booking_time;->"`                 // Open Booking Time
	CloseBookingTime           time.Time  `gorm:"column:close_booking_time;->"`                // Close Booking Time
	ProgramTitle               string     `gorm:"column:program_title;->"`                     // Program Title
	ProgramLocations           []string   `gorm:"column:program_locations;serializer:json;->"` // Program Locations
	ProgramPeriodAt            *time.Time `gorm:"column:program_period_at;->"`                 // Program Period At
	ProgramPeriodEnd           *time.Time `gorm:"column:program_period_end;->"`                // Program Period End
	ProgramLocale              string     `gorm:"column:program_locale;->"`                    // Program Locale
	BookedCount                int64      `gorm:"column:booked_count;->"`                      // Count of booked tickets
	TotalMaxTicketsPerSlotTime int64      `gorm:"column:total_max_tickets_per_slot_time;->"`   // Read-only: Sum of max tickets
	TotalCheckedIn             int64      `gorm:"column:total_checked_in;->"`                  // Read-only: Count of booking_tickets.status which is "checked_in"
}
