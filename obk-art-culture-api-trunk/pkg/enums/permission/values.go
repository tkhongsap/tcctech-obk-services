package permission

import "example.com/art-culture-api/pkg/enums"

const (
	CreateBookingSettings enums.CMSPermission = "AC021"
	EditBookingSettings   enums.CMSPermission = "AC022"
	ViewBookingHistory    enums.CMSPermission = "AC023"
	ViewBookingStatus     enums.CMSPermission = "AC024"
	EditBookingStatus     enums.CMSPermission = "AC025"
	ScanTicket            enums.CMSPermission = "AC026"
	ResetTicket           enums.CMSPermission = "AC027"
)
