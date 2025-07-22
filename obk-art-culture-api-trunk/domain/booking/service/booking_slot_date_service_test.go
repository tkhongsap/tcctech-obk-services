package service_test

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"testing"
	"time"

	"example.com/art-culture-api/domain/booking/entity"
	mockRepository "example.com/art-culture-api/domain/booking/mocks/repository"
	"example.com/art-culture-api/domain/booking/model"
	"example.com/art-culture-api/domain/booking/service"
	"example.com/art-culture-api/pkg"
	"github.com/jonboulle/clockwork"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type BookingSlotDateServiceTestSuite struct {
	suite.Suite
	mockClock clockwork.Clock
	mockRepo  *mockRepository.MockBookingSlotDateRepository
	service   service.BookingSlotDateService
	ctx       context.Context
}

func (s *BookingSlotDateServiceTestSuite) SetupTest() {
	s.mockClock = clockwork.NewFakeClockAt(time.Date(2025, 1, 8, 20, 41, 58, 0, time.Local))
	s.mockRepo = new(mockRepository.MockBookingSlotDateRepository)
	s.service = service.NewBookingSlotDateService(s.mockClock, s.mockRepo)
	s.ctx = context.Background()
}

func (s *BookingSlotDateServiceTestSuite) TearDownTest() {
	s.mockRepo.AssertExpectations(s.T())
}

func (s *BookingSlotDateServiceTestSuite) TestFindByIDWithBookingSlotTimes_Success() {
	// Arrange
	id := "test-id"
	slotDate := entity.BookingSlotDate{
		ID:              id,
		ProgramID:       uint(1),
		BookingSettingID: "setting-1",
		SlotDate:        time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC),
		BookingSlotTimes: []entity.BookingSlotTime{
			{
				ID:                    "time-1",
				BeginSlotTime:         time.Date(2025, 1, 1, 9, 0, 0, 0, time.UTC),
				EndSlotTime:           time.Date(2025, 1, 1, 10, 0, 0, 0, time.UTC),
				MaxTicketsPerSlotTime: 10,
				BookedTicketsCount:    5,
				BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
			},
		},
	}

	s.mockRepo.EXPECT().FindByIDWithBookingSlotTimes(mock.Anything, id).Return(slotDate, nil)

	// Act
	res, code, err := s.service.FindByIDWithBookingSlotTimes(s.ctx, id)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(id, res.ID)
	s.Equal(uint(1), res.ProgramID)
	s.Equal("setting-1", res.BookingSettingID)
	s.Equal(slotDate.SlotDate, res.SlotDate)
	s.Len(res.BookingSlotTimes, 1)
	s.Equal("time-1", res.BookingSlotTimes[0].ID)
	s.Equal(strings.ToUpper(entity.BookingSlotTimeAvailable.String()), strings.ToUpper(res.BookingSlotTimes[0].Status))
}

func (s *BookingSlotDateServiceTestSuite) TestFindByIDWithBookingSlotTimes_EmptySlotTimes() {
	// Arrange
	id := "test-id"
	slotDate := entity.BookingSlotDate{
		ID:              id,
		ProgramID:       uint(1),
		BookingSettingID: "setting-1",
		SlotDate:        time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC),
		BookingSlotTimes: []entity.BookingSlotTime{},
	}

	s.mockRepo.EXPECT().FindByIDWithBookingSlotTimes(mock.Anything, id).Return(slotDate, nil)

	// Act
	res, code, err := s.service.FindByIDWithBookingSlotTimes(s.ctx, id)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(id, res.ID)
	s.Equal(uint(1), res.ProgramID)
	s.Equal("setting-1", res.BookingSettingID)
	s.Equal(slotDate.SlotDate, res.SlotDate)
	s.Empty(res.BookingSlotTimes)
}

func (s *BookingSlotDateServiceTestSuite) TestFindByIDWithBookingSlotTimes_NotFound() {
	// Arrange
	id := "test-id"
	s.mockRepo.EXPECT().FindByIDWithBookingSlotTimes(mock.Anything, id).Return(entity.BookingSlotDate{}, gorm.ErrRecordNotFound)

	// Act
	res, code, err := s.service.FindByIDWithBookingSlotTimes(s.ctx, id)

	// Assert
	s.Error(err)
	s.Equal(http.StatusNotFound, code)
	s.Empty(res)
}

func (s *BookingSlotDateServiceTestSuite) TestFindByIDWithBookingSlotTimes_DatabaseError() {
	// Arrange
	id := "test-id"
	s.mockRepo.EXPECT().FindByIDWithBookingSlotTimes(mock.Anything, id).Return(entity.BookingSlotDate{}, errors.New("database error"))

	// Act
	res, code, err := s.service.FindByIDWithBookingSlotTimes(s.ctx, id)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
}

func (s *BookingSlotDateServiceTestSuite) TestGetAllWithPagination_Success() {
	// Arrange
	pagination := pkg.Pagination{
		Page:  1,
		Limit: 10,
	}
	filterFields := map[string]any{"program_id": uint(1)}
	tz := "Asia/Bangkok"
	loc, _ := time.LoadLocation(tz)

	expectedSlotDates := []entity.BookingSlotDate{
		{
			ID:              "date-1",
			ProgramID:       uint(1),
			BookingSettingID: "setting-1",
			SlotDate:        time.Date(2025, 1, 9, 0, 0, 0, 0, loc),
			BookingSlotTimes: []entity.BookingSlotTime{
				{
					ID:                    "time-1",
					BookingSettingID:      "setting-1",
					ProgramID:             uint(1),
					BookingSlotDateID:     "date-1",
					BeginSlotTime:         time.Date(2025, 1, 9, 9, 0, 0, 0, loc),
					EndSlotTime:           time.Date(2025, 1, 9, 10, 0, 0, 0, loc),
					MaxTicketsPerSlotTime: 10,
					BookedTicketsCount:    5,
					BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
					CheckedInTicketsCount: 3,
				},
			},
		},
	}

	s.mockRepo.EXPECT().FindAllWithPagination(mock.Anything, pagination, filterFields, mock.Anything).
		Run(func(ctx context.Context, p pkg.Pagination, f map[string]any, t time.Time) {
			s.Equal(pagination.Page, p.Page)
			s.Equal(pagination.Limit, p.Limit)
			s.Equal(time.Date(2025, 1, 8, 0, 0, 0, 0, loc), t)
		}).
		Return(expectedSlotDates, &pagination, nil)

	// Act
	resultPagination, code, err := s.service.GetAllWithPagination(s.ctx, pagination, filterFields, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(pagination, resultPagination)
	data := resultPagination.Data.([]model.BookingSlotDatePaginationResponse)
	s.Len(data, 1)
	s.Equal("date-1", data[0].ID)
	s.Equal(uint(1), data[0].ProgramID)
	s.Equal("setting-1", data[0].BookingSettingID)
	s.NotNil(data[0].BookingSlotTimes)
	slotTimes := *data[0].BookingSlotTimes
	s.Len(slotTimes, 1)
	s.Equal("time-1", slotTimes[0].ID)
	s.Equal(3, slotTimes[0].CheckedInTicketsCount)
}

func (s *BookingSlotDateServiceTestSuite) TestGetAllWithPagination_EmptyResult() {
	// Arrange
	pagination := pkg.Pagination{
		Page:  1,
		Limit: 10,
	}
	filterFields := map[string]any{"program_id": uint(1)}
	tz := "Asia/Bangkok"
	loc, _ := time.LoadLocation(tz)

	s.mockRepo.EXPECT().FindAllWithPagination(mock.Anything, pagination, filterFields, mock.Anything).
		Run(func(ctx context.Context, p pkg.Pagination, f map[string]any, t time.Time) {
			s.Equal(pagination.Page, p.Page)
			s.Equal(pagination.Limit, p.Limit)
			s.Equal(time.Date(2025, 1, 8, 0, 0, 0, 0, loc), t)
		}).
		Return([]entity.BookingSlotDate{}, &pagination, nil)

	// Act
	resultPagination, code, err := s.service.GetAllWithPagination(s.ctx, pagination, filterFields, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(pagination, resultPagination)
	data := resultPagination.Data.([]model.BookingSlotDatePaginationResponse)
	s.Empty(data)
}

func (s *BookingSlotDateServiceTestSuite) TestGetAllWithPagination_EmptySlotTimes() {
	// Arrange
	pagination := pkg.Pagination{
		Page:  1,
		Limit: 10,
	}
	filterFields := map[string]any{"program_id": uint(1)}
	tz := "Asia/Bangkok"
	loc, _ := time.LoadLocation(tz)

	expectedSlotDates := []entity.BookingSlotDate{
		{
			ID:              "date-1",
			ProgramID:       uint(1),
			BookingSettingID: "setting-1",
			SlotDate:        time.Date(2025, 1, 9, 0, 0, 0, 0, loc),
			BookingSlotTimes: []entity.BookingSlotTime{},
		},
	}

	s.mockRepo.EXPECT().FindAllWithPagination(mock.Anything, pagination, filterFields, mock.Anything).
		Run(func(ctx context.Context, p pkg.Pagination, f map[string]any, t time.Time) {
			s.Equal(pagination.Page, p.Page)
			s.Equal(pagination.Limit, p.Limit)
			s.Equal(time.Date(2025, 1, 8, 0, 0, 0, 0, loc), t)
		}).
		Return(expectedSlotDates, &pagination, nil)

	// Act
	resultPagination, code, err := s.service.GetAllWithPagination(s.ctx, pagination, filterFields, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(pagination, resultPagination)
	data := resultPagination.Data.([]model.BookingSlotDatePaginationResponse)
	s.Len(data, 1)
	s.Equal("date-1", data[0].ID)
	s.NotNil(data[0].BookingSlotTimes)
	s.Empty(*data[0].BookingSlotTimes)
}

func (s *BookingSlotDateServiceTestSuite) TestGetAllWithPagination_InvalidTimezone() {
	// Arrange
	pagination := pkg.Pagination{
		Page:  1,
		Limit: 10,
	}
	filterFields := map[string]any{"program_id": uint(1)}
	tz := "Invalid/Timezone"

	// Act
	resultPagination, code, err := s.service.GetAllWithPagination(s.ctx, pagination, filterFields, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Empty(resultPagination)
}

func (s *BookingSlotDateServiceTestSuite) TestGetAllWithPagination_DatabaseError() {
	// Arrange
	pagination := pkg.Pagination{
		Page:  1,
		Limit: 10,
	}
	filterFields := map[string]any{"program_id": uint(1)}
	tz := "Asia/Bangkok"
	loc, _ := time.LoadLocation(tz)

	s.mockRepo.EXPECT().FindAllWithPagination(mock.Anything, pagination, filterFields, mock.Anything).
		Run(func(ctx context.Context, p pkg.Pagination, f map[string]any, t time.Time) {
			s.Equal(pagination.Page, p.Page)
			s.Equal(pagination.Limit, p.Limit)
			s.Equal(time.Date(2025, 1, 8, 0, 0, 0, 0, loc), t)
		}).
		Return(nil, &pkg.Pagination{}, errors.New("database error"))

	// Act
	resultPagination, code, err := s.service.GetAllWithPagination(s.ctx, pagination, filterFields, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(resultPagination)
}

func TestBookingSlotDateServiceTestSuite(t *testing.T) {
	suite.Run(t, new(BookingSlotDateServiceTestSuite))
}
