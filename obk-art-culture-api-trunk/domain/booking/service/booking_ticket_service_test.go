package service_test

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"testing"
	"time"

	artCEntity "example.com/art-culture-api/domain/act_c/entity"
	mockArtCRepository "example.com/art-culture-api/domain/act_c/mocks/repository"
	"example.com/art-culture-api/domain/booking/entity"
	mockRepository "example.com/art-culture-api/domain/booking/mocks/repository"
	mockSession "example.com/art-culture-api/domain/booking/mocks/session"
	"example.com/art-culture-api/domain/booking/service"
	"example.com/art-culture-api/domain/booking/session"
	programEntity "example.com/art-culture-api/domain/programs/entity"
	"example.com/art-culture-api/testutil"
	"github.com/jonboulle/clockwork"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type BookingTicketServiceTestSuite struct {
	suite.Suite
	mockClock               clockwork.Clock
	mockSession             *mockSession.MockSession
	mockTicketRepo          *mockRepository.MockBookingTicketRepository
	mockSlotTimeRepo        *mockRepository.MockBookingSlotTimeRepository
	mockArtCTranslationRepo *mockArtCRepository.MockArtCTranslationRepository
	service                 service.BookingTicketService
	ctx                     context.Context
	loc                     *time.Location
}

func (s *BookingTicketServiceTestSuite) SetupTest() {
	loc, _ := time.LoadLocation("Asia/Bangkok")
	s.mockClock = clockwork.NewFakeClockAt(time.Date(2025, 1, 8, 9, 30, 0, 0, loc))
	s.mockSession = new(mockSession.MockSession)
	s.mockTicketRepo = new(mockRepository.MockBookingTicketRepository)
	s.mockSlotTimeRepo = new(mockRepository.MockBookingSlotTimeRepository)
	s.mockArtCTranslationRepo = new(mockArtCRepository.MockArtCTranslationRepository)
	s.service = service.NewBookingTicketService(
		s.mockSession,
		s.mockClock,
		s.mockTicketRepo,
		s.mockSlotTimeRepo,
		s.mockArtCTranslationRepo,
	)
	s.ctx = context.Background()
	s.loc = loc
}

func (s *BookingTicketServiceTestSuite) TearDownTest() {
	s.mockSession.AssertExpectations(s.T())
	s.mockTicketRepo.AssertExpectations(s.T())
	s.mockSlotTimeRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTicketServiceTestSuite) TestGetTicket_Success() {
	// Arrange
	id := "test-id"
	locale := "th"
	email := "john@example.com"
	phone := "1234567890"
	ticket := entity.BookingTicket{
		ID:          id,
		Status:      entity.Booked,
		TicketNo:    123,
		CheckedInAt: nil,
		Program: programEntity.Program{
			ArtCTypeID:     1,
			ArtCCategoryID: func() *uint { u := uint(2); return &u }(),
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale:    "th",
					Locations: []string{"location1", "location2"},
					Title:     "Program Title",
					Thumbnail: "thumbnail.jpg",
					Banner:    "banner.jpg",
				},
			},
		},
		BookingTx: entity.BookingTx{
			BookerName:        "John Doe",
			BookerEmail:       &email,
			BookerPhoneNumber: &phone,
			BookingSlotDate: entity.BookingSlotDate{
				SlotDate: time.Date(2025, 1, 9, 0, 0, 0, 0, time.UTC),
			},
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: time.Date(2025, 1, 9, 9, 0, 0, 0, time.UTC),
				EndSlotTime:   time.Date(2025, 1, 9, 10, 0, 0, 0, time.UTC),
			},
		},
	}

	artCTranslation := artCEntity.ArtCTranslation{
		Title: "Art C Title",
	}

	s.mockTicketRepo.EXPECT().FindByIDWithPreloadedFields(
		mock.Anything,
		id,
		[]string{"program", "bookingTx", "bookingSlotDate", "bookingSlotTime"},
		locale,
	).Return(ticket, nil)
	s.mockArtCTranslationRepo.EXPECT().FindByArtCTypeIdAndArtCCategoryIdAndLocale(
		mock.Anything,
		mock.AnythingOfType("*uint"),
		mock.AnythingOfType("*uint"),
		locale,
	).Return(artCTranslation, nil)

	// Act
	res, code, err := s.service.GetTicket(s.ctx, id, locale)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(id, res.ID)
	s.Equal(entity.Booked.String(), res.Status)
	s.Nil(res.CheckedInAt)
	s.NotEmpty(res.TicketNo)
	s.NotNil(res.BookingTx)
	s.Equal("John Doe", res.BookingTx.BookerName)
	s.Equal(email, *res.BookingTx.BookerEmail)
	s.Equal(phone, *res.BookingTx.BookerPhoneNumber)
	s.Equal(time.Date(2025, 1, 9, 0, 0, 0, 0, time.UTC), res.BookingTx.SlotDate)
	s.Equal(time.Date(2025, 1, 9, 9, 0, 0, 0, time.UTC), res.BookingTx.BeginSlotTime)
	s.Equal(time.Date(2025, 1, 9, 10, 0, 0, 0, time.UTC), res.BookingTx.EndSlotTime)
	s.NotNil(res.Program)
	s.Equal("Art C Title", res.Program.ArtCTitle)
	s.Equal("th", res.Program.Locale)
	s.Equal([]string{"location1", "location2"}, res.Program.Locations)
	s.Equal("Program Title", res.Program.Title)
	s.Equal("thumbnail.jpg", res.Program.Thumbnail)
	s.Equal("banner.jpg", res.Program.Banner)
}

func (s *BookingTicketServiceTestSuite) TestGetTicket_InvalidLocale() {
	// Arrange
	id := "test-id"
	locale := "invalid"

	// Act
	res, code, err := s.service.GetTicket(s.ctx, id, locale)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestGetTicket_NotFound() {
	// Arrange
	id := "test-id"
	locale := "th"
	s.mockTicketRepo.EXPECT().FindByIDWithPreloadedFields(
		mock.Anything,
		id,
		[]string{"program", "bookingTx", "bookingSlotDate", "bookingSlotTime"},
		locale,
	).Return(entity.BookingTicket{}, gorm.ErrRecordNotFound)

	// Act
	res, code, err := s.service.GetTicket(s.ctx, id, locale)

	// Assert
	s.Error(err)
	s.Equal(http.StatusNotFound, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestGetTicket_DatabaseError() {
	// Arrange
	id := "test-id"
	locale := "th"
	s.mockTicketRepo.EXPECT().FindByIDWithPreloadedFields(
		mock.Anything,
		id,
		[]string{"program", "bookingTx", "bookingSlotDate", "bookingSlotTime"},
		locale,
	).Return(entity.BookingTicket{}, errors.New("database error"))

	// Act
	res, code, err := s.service.GetTicket(s.ctx, id, locale)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestGetTicket_ArtCTranslationNotFound() {
	// Arrange
	id := "test-id"
	locale := "th"
	ticket := entity.BookingTicket{
		Program: programEntity.Program{
			ArtCTypeID:     1,
			ArtCCategoryID: func() *uint { u := uint(2); return &u }(),
			ProgramTranslation: []programEntity.ProgramTranslation{
				{Locale: "th"},
			},
		},
		BookingTx: entity.BookingTx{},
	}

	s.mockTicketRepo.EXPECT().FindByIDWithPreloadedFields(
		mock.Anything,
		id,
		[]string{"program", "bookingTx", "bookingSlotDate", "bookingSlotTime"},
		locale,
	).Return(ticket, nil)
	s.mockArtCTranslationRepo.EXPECT().FindByArtCTypeIdAndArtCCategoryIdAndLocale(
		mock.Anything,
		mock.AnythingOfType("*uint"),
		mock.AnythingOfType("*uint"),
		locale,
	).Return(artCEntity.ArtCTranslation{}, gorm.ErrRecordNotFound)

	// Act
	res, code, err := s.service.GetTicket(s.ctx, id, locale)

	// Assert
	s.Error(err)
	s.Equal(http.StatusNotFound, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestGetTicket_DatabaseErrorFindingTicket() {
	// Arrange
	id := "test-id"
	locale := "en"

	s.mockTicketRepo.EXPECT().FindByIDWithPreloadedFields(
		mock.Anything,
		id,
		[]string{"program", "bookingTx", "bookingSlotDate", "bookingSlotTime"},
		locale,
	).Return(entity.BookingTicket{}, errors.New("database error"))

	// Act
	res, code, err := s.service.GetTicket(s.ctx, id, locale)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
	s.Equal("something went wrong, can't find booking ticket content", err.Error())
}

func (s *BookingTicketServiceTestSuite) TestGetTicket_DatabaseErrorFindingArtCTranslation() {
	// Arrange
	id := "test-id"
	locale := "en"
	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.Booked,
		BookingTx: entity.BookingTx{
			BookerName:        "John Doe",
			BookerEmail:       &locale,
			BookerPhoneNumber: &locale,
			BookingSlotDate: entity.BookingSlotDate{
				SlotDate: time.Date(2025, 1, 9, 0, 0, 0, 0, time.UTC),
			},
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: time.Date(2025, 1, 9, 9, 0, 0, 0, time.UTC),
				EndSlotTime:   time.Date(2025, 1, 9, 10, 0, 0, 0, time.UTC),
			},
		},
		Program: programEntity.Program{
			ArtCTypeID:     1,
			ArtCCategoryID: func() *uint { u := uint(2); return &u }(),
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale: locale,
				},
			},
		},
	}

	s.mockTicketRepo.EXPECT().FindByIDWithPreloadedFields(
		mock.Anything,
		id,
		[]string{"program", "bookingTx", "bookingSlotDate", "bookingSlotTime"},
		locale,
	).Return(ticket, nil)
	s.mockArtCTranslationRepo.EXPECT().FindByArtCTypeIdAndArtCCategoryIdAndLocale(
		mock.Anything,
		mock.AnythingOfType("*uint"),
		mock.AnythingOfType("*uint"),
		locale,
	).Return(artCEntity.ArtCTranslation{}, errors.New("database error"))

	// Act
	res, code, err := s.service.GetTicket(s.ctx, id, locale)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
	s.Equal("something went wrong, can't find art c translation content", err.Error())
}

func (s *BookingTicketServiceTestSuite) TestCheckIn_Success() {
	// Arrange
	id := "test-id"
	currentTime := s.mockClock.Now()
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.Booked,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	slotTime := entity.BookingSlotTime{
		ID:                    "slot-1",
		BookedTicketsCount:    10,
		CheckedInTicketsCount: 5,
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotDate", "bookingSlotTime"}, "").
		Return(ticket, nil)
	s.mockTicketRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, []string{"status", "checked_in_at"}, map[string]interface{}{
			"status":        entity.CheckedIn,
			"checked_in_at": currentTime,
		}).Return(nil)
	s.mockSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, "slot-1").
		Return(slotTime, nil)
	s.mockSlotTimeRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, "slot-1", []string{"checked_in_tickets_count"}, map[string]interface{}{
			"checked_in_tickets_count": slotTime.CheckedInTicketsCount + 1,
		}).Return(nil)

	// Act
	res, code, err := s.service.CheckIn(s.ctx, id, s.loc)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(id, res.ID)
	s.Equal(slotTime.BookedTicketsCount, res.BookedTicketsCount)
	s.Equal(slotTime.CheckedInTicketsCount+1, res.CheckedInTicketsCount)
}

func (s *BookingTicketServiceTestSuite) TestCheckIn_DatabaseErrorDuringFindByIDWithReadLockInvocation() {
	// Arrange
	id := "test-id"
	currentTime := s.mockClock.Now()
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.Booked,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotDate", "bookingSlotTime"}, "").
		Return(ticket, nil)

	s.mockTicketRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, []string{"status", "checked_in_at"}, map[string]interface{}{
			"status":        entity.CheckedIn,
			"checked_in_at": currentTime,
		}).Return(nil)

	s.mockSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, "slot-1").
		Return(entity.BookingSlotTime{}, errors.New("database error"))

	// Act
	res, code, err := s.service.CheckIn(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal("something went wrong, can't find booking slot time content", err.Error())
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestCheckIn_DatabaseErrorFindingTicket() {
	// Arrange
	id := "test-id"
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotDate", "bookingSlotTime"}, "").
		Return(entity.BookingTicket{}, errors.New("database error"))
	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	res, code, err := s.service.CheckIn(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal("something went wrong, can't find booking ticket content", err.Error())
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestCheckIn_TicketNotFound() {
	// Arrange
	id := "test-id"
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotDate", "bookingSlotTime"}, "").
		Return(entity.BookingTicket{}, gorm.ErrRecordNotFound)
	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	res, code, err := s.service.CheckIn(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal(http.StatusNotFound, code)
	s.Empty(res)
	s.Equal("booking ticket not found", err.Error())
}

func (s *BookingTicketServiceTestSuite) TestCheckIn_TicketAlreadyUsed() {
	// Arrange
	id := "test-id"
	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.CheckedIn,
		BookingTx: entity.BookingTx{
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc),
				EndSlotTime:   time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc),
			},
		},
	}

	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotDate", "bookingSlotTime"}, "").
		Return(ticket, nil)
	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	res, code, err := s.service.CheckIn(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Empty(res)
	s.Equal("ticket already used", err.Error())
}

func (s *BookingTicketServiceTestSuite) TestCheckIn_ShowtimePassed() {
	// Arrange
	id := "test-id"
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 9, 15, 0, 0, s.loc) // Set end time before current time (9:30)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.Booked,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotDate", "bookingSlotTime"}, "").
		Return(ticket, nil)

	// Act
	res, code, err := s.service.CheckIn(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Empty(res)
	s.Equal("this ticket is past its showtime", err.Error())
}

func (s *BookingTicketServiceTestSuite) TestCheckIn_NotInCurrentShowtime() {
	// Arrange
	id := "test-id"
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 12, 0, 0, 0, s.loc)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.Booked,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
			BookingSlotDate: entity.BookingSlotDate{
				ID: "slot-date-1",
				SlotDate: time.Date(2025, 1, 9, 0, 0, 0, 0, s.loc),
			},
		},
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotDate", "bookingSlotTime"}, "").
		Return(ticket, nil)

	// Act
	res, code, err := s.service.CheckIn(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Empty(res)
	s.Equal("this ticket is not valid for today's showtime", err.Error())
}

func (s *BookingTicketServiceTestSuite) TestCheckIn_ErrorUpdatingTicket() {
	// Arrange
	id := "test-id"
	currentTime := s.mockClock.Now()
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.Booked,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotDate", "bookingSlotTime"}, "").
		Return(ticket, nil)
	s.mockTicketRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, []string{"status", "checked_in_at"}, map[string]interface{}{
			"status":        entity.CheckedIn,
			"checked_in_at": currentTime,
		}).Return(errors.New("database error"))

	// Act
	res, code, err := s.service.CheckIn(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal("something went wrong, can't update booking ticket content", err.Error())
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestCheckIn_SlotTimeNotFound() {
	// Arrange
	id := "test-id"
	currentTime := s.mockClock.Now()
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.Booked,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotDate", "bookingSlotTime"}, "").
		Return(ticket, nil)
	s.mockTicketRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, []string{"status", "checked_in_at"}, map[string]interface{}{
			"status":        entity.CheckedIn,
			"checked_in_at": currentTime,
		}).Return(nil)
	s.mockSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, "slot-1").
		Return(entity.BookingSlotTime{}, gorm.ErrRecordNotFound)

	// Act
	res, code, err := s.service.CheckIn(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal(http.StatusNotFound, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestCheckIn_ErrorUpdatingSlotTime() {
	// Arrange
	id := "test-id"
	currentTime := s.mockClock.Now()
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc)
	expectedError := errors.New("database error")

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.Booked,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	slotTime := entity.BookingSlotTime{
		ID:                    "slot-1",
		BookedTicketsCount:    10,
		CheckedInTicketsCount: 5,
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotDate", "bookingSlotTime"}, "").
		Return(ticket, nil)
	s.mockTicketRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, []string{"status", "checked_in_at"}, map[string]interface{}{
			"status":        entity.CheckedIn,
			"checked_in_at": currentTime,
		}).Return(nil)
	s.mockSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, "slot-1").
		Return(slotTime, nil)
	s.mockSlotTimeRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, "slot-1", []string{"checked_in_tickets_count"}, map[string]interface{}{
			"checked_in_tickets_count": slotTime.CheckedInTicketsCount + 1,
		}).Return(expectedError)

	// Act
	res, code, err := s.service.CheckIn(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestResetTicket_Success() {
	// Arrange
	id := "test-id"
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.CheckedIn,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	slotTime := entity.BookingSlotTime{
		ID:                    "slot-1",
		BookedTicketsCount:    10,
		CheckedInTicketsCount: 5,
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotTime"}, "").
		Return(ticket, nil)
	s.mockTicketRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, []string{"status", "checked_in_at"}, map[string]interface{}{
			"status":        entity.Booked,
			"checked_in_at": nil,
		}).Return(nil)
	s.mockSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, "slot-1").
		Return(slotTime, nil)
	s.mockSlotTimeRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, "slot-1", []string{"checked_in_tickets_count"}, map[string]interface{}{
			"checked_in_tickets_count": slotTime.CheckedInTicketsCount - 1,
		}).Return(nil)

	// Act
	res, code, err := s.service.ResetTicket(s.ctx, id, s.loc)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(id, res.ID)
	s.Equal(slotTime.BookedTicketsCount, res.BookedTicketsCount)
	s.Equal(slotTime.CheckedInTicketsCount-1, res.CheckedInTicketsCount)
}

func (s *BookingTicketServiceTestSuite) TestResetTicket_DatabaseErrorFindingTicket() {
	// Arrange
	id := "test-id"
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotTime"}, "").
		Return(entity.BookingTicket{}, errors.New("database error"))
	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	res, code, err := s.service.ResetTicket(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal("something went wrong, can't find booking ticket content", err.Error())
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestResetTicket_ErrorUpdatingTicket() {
	// Arrange
	id := "test-id"
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.CheckedIn,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotTime"}, "").
		Return(ticket, nil)
	s.mockTicketRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, []string{"status", "checked_in_at"}, map[string]interface{}{
			"status":        entity.Booked,
			"checked_in_at": nil,
		}).Return(errors.New("database error"))

	// Act
	res, code, err := s.service.ResetTicket(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal("something went wrong, can't update booking ticket content", err.Error())
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestResetTicket_TransactionError() {
	// Arrange
	id := "test-id"

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.CheckedIn,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				EndSlotTime: time.Date(2025, 1, 8, 10, 30, 0, 0, s.loc),
			},
		},
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotTime"}, "").
		Return(ticket, nil)

	s.mockTicketRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, []string{"status", "checked_in_at"}, map[string]interface{}{
			"status":        entity.Booked,
			"checked_in_at": nil,
		}).Return(nil)

	s.mockSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, "slot-1").
		Return(entity.BookingSlotTime{}, errors.New("database error"))

	// Act
	res, code, err := s.service.ResetTicket(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal("something went wrong, can't find booking slot time content", err.Error())
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestResetTicket_TicketNotCheckedIn() {
	// Arrange
	id := "test-id"
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.Booked,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotTime"}, "").
		Return(ticket, nil)

	// Act
	res, code, err := s.service.ResetTicket(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Empty(res)
	s.Equal("not allow to reset tickets that are already booked", err.Error())
}

func (s *BookingTicketServiceTestSuite) TestResetTicket_SlotTimeNotFound() {
	// Arrange
	id := "test-id"
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.CheckedIn,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotTime"}, "").
		Return(ticket, nil)
	s.mockTicketRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, []string{"status", "checked_in_at"}, map[string]interface{}{
			"status":        entity.Booked,
			"checked_in_at": nil,
		}).Return(nil)
	s.mockSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, "slot-1").
		Return(entity.BookingSlotTime{}, gorm.ErrRecordNotFound)

	// Act
	res, code, err := s.service.ResetTicket(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal(http.StatusNotFound, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestResetTicket_ErrorUpdatingSlotTime() {
	// Arrange
	id := "test-id"
	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 10, 0, 0, 0, s.loc)
	expectedError := errors.New("database error")

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.CheckedIn,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	slotTime := entity.BookingSlotTime{
		ID:                    "slot-1",
		BookedTicketsCount:    10,
		CheckedInTicketsCount: 5,
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})
	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotTime"}, "").
		Return(ticket, nil)
	s.mockTicketRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, []string{"status", "checked_in_at"}, map[string]interface{}{
			"status":        entity.Booked,
			"checked_in_at": nil,
		}).Return(nil)
	s.mockSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, "slot-1").
		Return(slotTime, nil)
	s.mockSlotTimeRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, "slot-1", []string{"checked_in_tickets_count"}, map[string]interface{}{
			"checked_in_tickets_count": slotTime.CheckedInTicketsCount - 1,
		}).Return(expectedError)

	// Act
	res, code, err := s.service.ResetTicket(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestResetTicket_TicketNotFound() {
	// Arrange
	id := "test-id"

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotTime"}, "").
		Return(entity.BookingTicket{}, gorm.ErrRecordNotFound)

	// Act
	res, code, err := s.service.ResetTicket(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal("booking ticket not found", err.Error())
	s.Equal(http.StatusNotFound, code)
	s.Empty(res)
}

func (s *BookingTicketServiceTestSuite) TestResetTicket_ShowtimePassed() {
	// Arrange
	id := "test-id"

	beginSlotTime := time.Date(2025, 1, 8, 9, 0, 0, 0, s.loc)
	endSlotTime := time.Date(2025, 1, 8, 9, 25, 0, 0, s.loc)

	ticket := entity.BookingTicket{
		ID:     id,
		Status: entity.CheckedIn,
		BookingTx: entity.BookingTx{
			BookingSlotTimeID: "slot-1",
			BookingSlotTime: entity.BookingSlotTime{
				BeginSlotTime: beginSlotTime,
				EndSlotTime:   endSlotTime,
			},
		},
	}

	s.mockSession.EXPECT().
		Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockTicketRepo.EXPECT().
		FindByIDWithPreloadedFields(mock.Anything, id, []string{"bookingSlotTime"}, "").
		Return(ticket, nil)

	// Act
	res, code, err := s.service.ResetTicket(s.ctx, id, s.loc)

	// Assert
	s.Error(err)
	s.Equal("ticket's showtime has already passed", err.Error())
	s.Equal(http.StatusBadRequest, code)
	s.Empty(res)
}

func TestBookingTicketServiceTestSuite(t *testing.T) {
	suite.Run(t, new(BookingTicketServiceTestSuite))
}
