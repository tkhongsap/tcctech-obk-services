package model_test

import (
	"reflect"
	"testing"
	"time"

	"example.com/art-culture-api/domain/booking/model"
)

func TestBookingSettingPatchRequest_ToQueryParams(t *testing.T) {
	// Test empty request
	request := model.BookingSettingPatchRequest{}
	fields, params := request.ToQueryParams()
	if len(fields) != 0 || len(params) != 0 {
		t.Errorf("Expected empty fields and params, got %v and %v", fields, params)
	}

	// Test non-nil values
	baseTime := time.Now()
	t1 := baseTime
	t2 := baseTime.AddDate(0, 0, 1)

	request = model.BookingSettingPatchRequest{
		ProgramID:                &[]uint{1}[0],
		ConditionTextEN:          &[]string{"test condition text EN"}[0],
		ConditionTextTH:          &[]string{"test condition text TH"}[0],
		ConditionTextCN:          &[]string{"test condition text CN"}[0],
		TicketPrice:              &[]float64{10.5}[0],
		MaxTicketsPerTransaction: &[]int{5}[0],
		OpenBookingTime:          &[]time.Time{t1}[0],
		CloseBookingTime:         &[]time.Time{t2}[0],
	}
	fields, params = request.ToQueryParams()
	expectedFields := []string{
		"program_id",
		"condition_text_en",
		"condition_text_th",
		"condition_text_cn",
		"ticket_price",
		"max_tickets_per_transaction",
		"open_booking_time",
		"close_booking_time",
	}
	expectedParams := map[string]interface{}{
		"program_id":                  uint(1),
		"condition_text_en":           "test condition text EN",
		"condition_text_th":           "test condition text TH",
		"condition_text_cn":           "test condition text CN",
		"ticket_price":                float64(10.5),
		"max_tickets_per_transaction": int(5),
		"open_booking_time":           t1,
		"close_booking_time":          t2,
	}
	if len(fields) != len(expectedFields) || len(params) != len(expectedParams) {
		t.Errorf("Expected fields %v and params %v, got %v and %v", expectedFields, expectedParams, fields, params)
	}
	for i, field := range fields {
		if field != expectedFields[i] {
			t.Errorf("Expected field %v, got %v", expectedFields[i], field)
		}
	}
	for key, value := range params {
		expectedValue := expectedParams[key]
		if !reflect.DeepEqual(value, expectedValue) {
			t.Errorf("Expected param %v:%v, got %v:%v", key, expectedValue, key, value)
		}
	}
}
