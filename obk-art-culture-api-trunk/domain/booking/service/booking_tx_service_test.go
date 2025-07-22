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
	mockService "example.com/art-culture-api/domain/booking/mocks/service"
	mockSession "example.com/art-culture-api/domain/booking/mocks/session"
	"example.com/art-culture-api/domain/booking/model"
	"example.com/art-culture-api/domain/booking/service"
	"example.com/art-culture-api/domain/booking/session"
	programEntity "example.com/art-culture-api/domain/programs/entity"
	mockProgramRepository "example.com/art-culture-api/domain/programs/mocks/repository"
	"example.com/art-culture-api/testutil"
	"github.com/jonboulle/clockwork"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type BookingTxServiceTestSuite struct {
	suite.Suite
	mockClock                      clockwork.Clock
	mockSession                    *mockSession.MockSession
	mockBookingTicketRepo          *mockRepository.MockBookingTicketRepository
	mockBookingTxRepo              *mockRepository.MockBookingTxRepository
	mockBookingSlotTimeRepo        *mockRepository.MockBookingSlotTimeRepository
	mockBookingSlotDateRepo        *mockRepository.MockBookingSlotDateRepository
	mockBookingSettingRepo         *mockRepository.MockBookingSettingRepository
	mockProgramRepo                *mockProgramRepository.MockProgramRepository
	mockArtCTranslationRepo        *mockArtCRepository.MockArtCTranslationRepository
	mockBookingNotificationService *mockService.MockBookingNotificationService
	service                        service.BookingTxService
	ctx                            context.Context
	loc                            *time.Location
}

func (s *BookingTxServiceTestSuite) SetupTest() {
	loc, _ := time.LoadLocation("Asia/Bangkok")
	s.mockClock = clockwork.NewFakeClockAt(time.Date(2025, 1, 8, 9, 30, 0, 0, loc))
	s.mockSession = new(mockSession.MockSession)
	s.mockBookingTicketRepo = new(mockRepository.MockBookingTicketRepository)
	s.mockBookingTxRepo = new(mockRepository.MockBookingTxRepository)
	s.mockBookingSlotTimeRepo = new(mockRepository.MockBookingSlotTimeRepository)
	s.mockBookingSlotDateRepo = new(mockRepository.MockBookingSlotDateRepository)
	s.mockBookingSettingRepo = new(mockRepository.MockBookingSettingRepository)
	s.mockProgramRepo = new(mockProgramRepository.MockProgramRepository)
	s.mockArtCTranslationRepo = new(mockArtCRepository.MockArtCTranslationRepository)
	s.mockBookingNotificationService = new(mockService.MockBookingNotificationService)
	s.service = service.NewBookingTxService(
		s.mockSession,
		s.mockClock,
		s.mockBookingTicketRepo,
		s.mockBookingTxRepo,
		s.mockBookingSlotTimeRepo,
		s.mockBookingSlotDateRepo,
		s.mockBookingSettingRepo,
		s.mockProgramRepo,
		s.mockArtCTranslationRepo,
		s.mockBookingNotificationService,
	)
	s.ctx = context.Background()
	s.loc = loc
}

func (s *BookingTxServiceTestSuite) TearDownTest() {
	s.mockSession.AssertExpectations(s.T())
	s.mockBookingTicketRepo.AssertExpectations(s.T())
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockBookingSlotTimeRepo.AssertExpectations(s.T())
	s.mockBookingSlotDateRepo.AssertExpectations(s.T())
	s.mockBookingSettingRepo.AssertExpectations(s.T())
	s.mockProgramRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindAllByUserID_Success() {
	userID := "user123"
	locale := "en"
	fields := []string{"program"}
	showingStatus := "upcoming"

	expectedTx := []entity.BookingTx{
		{
			ID:        "tx-123",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			Program: programEntity.Program{
				ID:          1,
				IsPublished: true,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().FindAllByUserID(mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(expectedTx, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(mock.Anything, mock.Anything).
		Return([]artCEntity.ArtCTranslation{}, nil)

	response, statusCode, err := s.service.FindAllByUserID(s.ctx, locale, fields, showingStatus, userID)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindAllByUserID_SuccessWithShowingAllStatuses() {
	userID := "user123"
	locale := "en"
	fields := []string{"program"}

	expectedTx := []entity.BookingTx{
		{
			ID:        "tx-1",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			Program: programEntity.Program{
				ID:          1,
				IsPublished: true,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
			},
			BookingSlotTime: entity.BookingSlotTime{
				ID:                    "time-1",
				BeginSlotTime:         time.Date(2025, 4, 1, 9, 0, 0, 0, time.UTC),
				EndSlotTime:           time.Date(2025, 4, 1, 10, 0, 0, 0, time.UTC),
				MaxTicketsPerSlotTime: 10,
				BookedTicketsCount:    5,
				BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
			},
		},
		{
			ID:        "tx-2",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			Program: programEntity.Program{
				ID:          1,
				IsPublished: true,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
			},
			BookingSlotTime: entity.BookingSlotTime{
				ID:                    "time-2",
				BeginSlotTime:         time.Date(2024, 1, 1, 9, 0, 0, 0, time.UTC),
				EndSlotTime:           time.Date(2024, 1, 1, 10, 0, 0, 0, time.UTC),
				MaxTicketsPerSlotTime: 10,
				BookedTicketsCount:    5,
				BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().FindAllByUserID(mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(expectedTx, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(mock.Anything, mock.Anything).
		Return([]artCEntity.ArtCTranslation{}, nil)

	response, statusCode, err := s.service.FindAllByUserID(s.ctx, locale, fields, "", userID)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindAllByUserID_SuccessWithShowingAllStatusesAndContainsProgramWithTranslation() {
	userID := "user123"
	locale := "en"
	fields := []string{"program"}

	expectedTx := []entity.BookingTx{
		{
			ID:        "tx-1",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			Program: programEntity.Program{
				ID:             1,
				IsPublished:    true,
				CreatedAt:      time.Now(),
				UpdatedAt:      time.Now(),
				ArtCTypeID:     uint(1),
				ArtCCategoryID: &[]uint{1}[0],
				ProgramTranslation: []programEntity.ProgramTranslation{
					{
						ID:     1,
						Locale: "th",
						Locations: []string{
							"",
						},
						Title:     "",
						Banner:    "",
						Thumbnail: "",
					},
					{
						ID:     2,
						Locale: "en",
						Locations: []string{
							"",
						},
						Title:     "",
						Banner:    "",
						Thumbnail: "",
					},
				},
			},
			BookingSlotTime: entity.BookingSlotTime{
				ID:                    "time-1",
				BeginSlotTime:         time.Date(2025, 4, 1, 9, 0, 0, 0, time.UTC),
				EndSlotTime:           time.Date(2025, 4, 1, 10, 0, 0, 0, time.UTC),
				MaxTicketsPerSlotTime: 10,
				BookedTicketsCount:    5,
				BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
			},
		},
		{
			ID:        "tx-2",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			Program: programEntity.Program{
				ID:          1,
				IsPublished: true,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
			},
			BookingSlotTime: entity.BookingSlotTime{
				ID:                    "time-2",
				BeginSlotTime:         time.Date(2024, 1, 1, 9, 0, 0, 0, time.UTC),
				EndSlotTime:           time.Date(2024, 1, 1, 10, 0, 0, 0, time.UTC),
				MaxTicketsPerSlotTime: 10,
				BookedTicketsCount:    5,
				BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().FindAllByUserID(mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(expectedTx, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(mock.Anything, mock.Anything).
		Return([]artCEntity.ArtCTranslation{
			{
				ID:             1,
				ArtCTypeID:     &[]uint{1}[0],
				ArtCCategoryID: &[]uint{1}[0],
				Locale:         "en",
				Locations: []string{
					"",
				},
				Title:     "",
				Banner:    "",
				Thumbnail: "",
			},
			{
				ID:             2,
				ArtCTypeID:     &[]uint{2}[0],
				ArtCCategoryID: &[]uint{2}[0],
				Locale:         "th",
				Locations: []string{
					"",
				},
				Title:     "",
				Banner:    "",
				Thumbnail: "",
			},
		}, nil)

	response, statusCode, err := s.service.FindAllByUserID(s.ctx, locale, fields, "", userID)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindAllByUserID_InvalidLocale() {
	userID := "user123"
	locale := "invalid"
	fields := []string{"program"}
	showingStatus := "upcoming"

	response, statusCode, err := s.service.FindAllByUserID(s.ctx, locale, fields, showingStatus, userID)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
}

func (s *BookingTxServiceTestSuite) TestFindAllByUserID_DatabaseError() {
	userID := "user123"
	locale := "en"
	fields := []string{"program"}
	showingStatus := "upcoming"

	s.mockBookingTxRepo.EXPECT().FindAllByUserID(mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(nil, errors.New("database error"))

	response, statusCode, err := s.service.FindAllByUserID(s.ctx, locale, fields, showingStatus, userID)

	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindAllByUserID_EmptyResult() {
	userID := "user123"
	locale := "en"
	fields := []string{"program"}
	showingStatus := "upcoming"

	s.mockBookingTxRepo.EXPECT().FindAllByUserID(mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return([]entity.BookingTx{}, nil)

	response, statusCode, err := s.service.FindAllByUserID(s.ctx, locale, fields, showingStatus, userID)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.Empty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindAllByUserID_ArtCTranslationError() {
	userID := "user123"
	locale := "en"
	fields := []string{"program"}
	showingStatus := "upcoming"

	expectedTx := []entity.BookingTx{
		{
			ID:        "tx-123",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			Program: programEntity.Program{
				ID:          1,
				IsPublished: true,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().FindAllByUserID(mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).
		Return(expectedTx, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(mock.Anything, mock.Anything).
		Return(nil, errors.New("art translation error"))

	response, statusCode, err := s.service.FindAllByUserID(s.ctx, locale, fields, showingStatus, userID)

	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestGetTransactions_SuccessWithEmptyResult() {
	programID := uint(1)
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	bookingSlotTimeID := "123"

	expectedTx := []entity.BookingTx{}

	s.mockBookingTxRepo.EXPECT().FindAllByProgramIDOrBookerNameOrBookerEmailOrBookingSlotTimeID(mock.Anything, &programID, &bookerName, &bookerEmail, &bookingSlotTimeID).
		Return(expectedTx, nil)

	response, statusCode, err := s.service.GetTransactions(s.ctx, &programID, &bookerName, &bookerEmail, &bookingSlotTimeID)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.Empty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestGetTransactions_SuccessWithShowingStatusEqualToUpcomming() {
	programID := uint(1)
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	bookingSlotTimeID := "123"

	expectedTx := []entity.BookingTx{
		{
			ID:        "tx-1",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			Program: programEntity.Program{
				ID:          1,
				IsPublished: true,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
			},
			BookingSlotTime: entity.BookingSlotTime{
				ID:                    "123",
				BeginSlotTime:         time.Date(2025, 4, 1, 9, 0, 0, 0, time.UTC),
				EndSlotTime:           time.Date(2025, 4, 1, 10, 0, 0, 0, time.UTC),
				MaxTicketsPerSlotTime: 10,
				BookedTicketsCount:    5,
				BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().FindAllByProgramIDOrBookerNameOrBookerEmailOrBookingSlotTimeID(mock.Anything, &programID, &bookerName, &bookerEmail, &bookingSlotTimeID).
		Return(expectedTx, nil)

	response, statusCode, err := s.service.GetTransactions(s.ctx, &programID, &bookerName, &bookerEmail, &bookingSlotTimeID)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestGetTransactions_SuccessWithShowingStatusEqualToPast() {
	programID := uint(1)
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	bookingSlotTimeID := "123"

	expectedTx := []entity.BookingTx{
		{
			ID:        "tx-1",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			Program: programEntity.Program{
				ID:          1,
				IsPublished: true,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
			},
			BookingSlotTime: entity.BookingSlotTime{
				ID:                    "123",
				BeginSlotTime:         time.Date(2024, 4, 1, 9, 0, 0, 0, time.UTC),
				EndSlotTime:           time.Date(2024, 4, 1, 10, 0, 0, 0, time.UTC),
				MaxTicketsPerSlotTime: 10,
				BookedTicketsCount:    5,
				BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().FindAllByProgramIDOrBookerNameOrBookerEmailOrBookingSlotTimeID(mock.Anything, &programID, &bookerName, &bookerEmail, &bookingSlotTimeID).
		Return(expectedTx, nil)

	response, statusCode, err := s.service.GetTransactions(s.ctx, &programID, &bookerName, &bookerEmail, &bookingSlotTimeID)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestGetTransactions_DatabaseError() {
	programID := uint(1)
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	bookingSlotTimeID := "123"

	s.mockBookingTxRepo.EXPECT().FindAllByProgramIDOrBookerNameOrBookerEmailOrBookingSlotTimeID(mock.Anything, &programID, &bookerName, &bookerEmail, &bookingSlotTimeID).
		Return(nil, errors.New("database error"))

	response, statusCode, err := s.service.GetTransactions(s.ctx, &programID, &bookerName, &bookerEmail, &bookingSlotTimeID)

	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_Success() {
	txID := "tx123"
	locale := "en"
	currentTime := s.mockClock.Now()

	expectedTx := entity.BookingTx{
		ID:        txID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		OrderNo:   12345,
		BookingSlotTime: entity.BookingSlotTime{
			BeginSlotTime: currentTime.Add(1 * time.Hour),
			EndSlotTime:   currentTime.Add(2 * time.Hour),
		},
		BookingSetting: entity.BookingSetting{
			TicketPrice: 100,
		},
		TicketsCount: 2,
		BookingTickets: []entity.BookingTicket{
			{
				ID:       "ticket1",
				TicketNo: 1,
				Status:   entity.Booked,
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().
		FindByID(mock.Anything, txID, locale).
		Return(expectedTx, nil)

	response, statusCode, err := s.service.FindByID(s.ctx, txID, locale)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal(txID, response.ID)
	s.Equal("upcoming", response.ShowingStatus)
	s.Equal(float64(200), response.Price)
	s.Nil(response.Program)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_SuccessWithoutProgram() {
	txID := "tx123"
	locale := "en"
	currentTime := s.mockClock.Now()
	expectedCreatedAt := time.Now()
	expectedUpdatedAt := time.Now()

	expectedTx := entity.BookingTx{
		ID:                txID,
		CreatedAt:         expectedCreatedAt,
		UpdatedAt:         expectedUpdatedAt,
		OrderNo:           12345,
		UserID:            "user123",
		BookingSlotTimeID: "time1",
		BookingSlotTime: entity.BookingSlotTime{
			ID:            "time1",
			BeginSlotTime: currentTime.Add(1 * time.Hour),
			EndSlotTime:   currentTime.Add(2 * time.Hour),
		},
		BookingSetting: entity.BookingSetting{
			TicketPrice: 100,
		},
		TicketsCount: 2,
	}

	s.mockBookingTxRepo.EXPECT().
		FindByID(mock.Anything, txID, locale).
		Return(expectedTx, nil)

	response, statusCode, err := s.service.FindByID(s.ctx, txID, locale)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal(txID, response.ID)
	s.Equal(expectedCreatedAt, response.CreatedAt)
	s.Equal(expectedUpdatedAt, response.UpdatedAt)
	s.Equal("user123", response.UserID)
	s.Equal("upcoming", response.ShowingStatus)
	s.Equal(float64(200), response.Price)
	s.Nil(response.Program)
	s.Equal("time1", response.BookingSlotTimeID)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_SuccessWithEmptyProgramTranslation() {
	txID := "tx123"
	locale := "en"
	currentTime := s.mockClock.Now()

	expectedTx := entity.BookingTx{
		ID:        txID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Program: programEntity.Program{
			ID:                 1,
			ProgramTranslation: []programEntity.ProgramTranslation{},
		},
		BookingSlotTime: entity.BookingSlotTime{
			BeginSlotTime: currentTime.Add(1 * time.Hour),
			EndSlotTime:   currentTime.Add(2 * time.Hour),
		},
	}

	s.mockBookingTxRepo.EXPECT().
		FindByID(mock.Anything, txID, locale).
		Return(expectedTx, nil)

	response, statusCode, err := s.service.FindByID(s.ctx, txID, locale)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal(txID, response.ID)
	s.Equal("upcoming", response.ShowingStatus)
	s.Nil(response.Program)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_SuccessPastShow() {
	txID := "tx123"
	locale := "en"
	currentTime := s.mockClock.Now()

	expectedTx := entity.BookingTx{
		ID:        txID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Program: programEntity.Program{
			ID: 1,
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale: locale,
					Title:  "Test Program",
				},
			},
		},
		BookingSlotTime: entity.BookingSlotTime{
			BeginSlotTime: currentTime.Add(-2 * time.Hour),
			EndSlotTime:   currentTime.Add(-1 * time.Hour),
		},
	}

	expectedArtCTranslation := artCEntity.ArtCTranslation{
		Title: "Art Title",
	}

	s.mockBookingTxRepo.EXPECT().
		FindByID(mock.Anything, txID, locale).
		Return(expectedTx, nil)

	s.mockArtCTranslationRepo.EXPECT().
		FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
			mock.Anything,
			mock.Anything,
			mock.Anything,
			locale,
		).
		Return(expectedArtCTranslation, nil)

	response, statusCode, err := s.service.FindByID(s.ctx, txID, locale)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.Equal("past", response.ShowingStatus)
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_ReturnProgramWithDefaultLocaleWhenArtCTranslationNotFound() {
	txID := "tx123"
	locale := "en"

	expectedTx := entity.BookingTx{
		ID: txID,
		Program: programEntity.Program{
			ID: 1,
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale: locale,
					Title:  "Test Program",
				},
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().
		FindByID(mock.Anything, txID, locale).
		Return(expectedTx, nil)

	s.mockArtCTranslationRepo.EXPECT().
		FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
			mock.Anything,
			mock.Anything,
			mock.Anything,
			locale,
		).
		Return(artCEntity.ArtCTranslation{}, gorm.ErrRecordNotFound)

	response, statusCode, err := s.service.FindByID(s.ctx, txID, locale)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal("", response.Program.ArtCTitle)
	s.Equal("en", response.Program.Locale)
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_ReturnProgramThatMatchedLocaleWhenArtCTranslationIsFoundWithMatchedLocale() {
	txID := "tx123"
	locale := "en"

	artCTranslation := artCEntity.ArtCTranslation{
		Title: "ArtC Title",
		Locale: locale,
	}

	expectedTx := entity.BookingTx{
		ID: txID,
		Program: programEntity.Program{
			ID: 1,
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale: locale,
					Title:  "Test Program",
				},
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().
		FindByID(mock.Anything, txID, locale).
		Return(expectedTx, nil)

	s.mockArtCTranslationRepo.EXPECT().
		FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
			mock.Anything,
			mock.Anything,
			mock.Anything,
			locale,
		).
		Return(artCTranslation, nil)

	response, statusCode, err := s.service.FindByID(s.ctx, txID, locale)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal(artCTranslation.Title, response.Program.ArtCTitle)
	s.Equal(locale, response.Program.Locale)
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_ReturnProgramWithDefaultLocaleWhenArtCTranslationIsFoundButNotMatchedRequestLocale() {
	txID := "tx123"
	requestLocale := "th"
	locale := "en"

	artCTranslation := artCEntity.ArtCTranslation{
		Title: "ArtC Title",
		Locale: locale,
	}

	expectedTx := entity.BookingTx{
		ID: txID,
		Program: programEntity.Program{
			ID: 1,
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale: locale,
					Title:  "Test Program",
				},
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().
		FindByID(mock.Anything, txID, requestLocale).
		Return(expectedTx, nil)

	s.mockArtCTranslationRepo.EXPECT().
		FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
			mock.Anything,
			mock.Anything,
			mock.Anything,
			requestLocale,
		).
		Return(artCTranslation, nil)

	response, statusCode, err := s.service.FindByID(s.ctx, txID, requestLocale)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal(artCTranslation.Title, response.Program.ArtCTitle)
	s.Equal(locale, response.Program.Locale)
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_ReturnProgramThatMatchedRequestLocaleWhichIsNotDefaultLocaleWhenArtCTranslationIsFoundButNotMatchedRequestLocale() {
	txID := "tx123"
	requestLocale := "th"
	locale := "th"

	artCTranslation := artCEntity.ArtCTranslation{
		Title: "ArtC Title",
		Locale: locale,
	}

	expectedTx := entity.BookingTx{
		ID: txID,
		Program: programEntity.Program{
			ID: 1,
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale: locale,
					Title:  "Test Program",
				},
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().
		FindByID(mock.Anything, txID, requestLocale).
		Return(expectedTx, nil)

	s.mockArtCTranslationRepo.EXPECT().
		FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
			mock.Anything,
			mock.Anything,
			mock.Anything,
			requestLocale,
		).
		Return(artCTranslation, nil)

	response, statusCode, err := s.service.FindByID(s.ctx, txID, requestLocale)

	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal(artCTranslation.Title, response.Program.ArtCTitle)
	s.Equal(locale, response.Program.Locale)
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_InvalidLocale() {
	txID := "tx123"
	locale := "invalid"

	response, statusCode, err := s.service.FindByID(s.ctx, txID, locale)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
}

func (s *BookingTxServiceTestSuite) TestFindByID_NotFound() {
	txID := "tx123"
	locale := "en"

	s.mockBookingTxRepo.EXPECT().FindByID(mock.Anything, txID, locale).Return(entity.BookingTx{}, gorm.ErrRecordNotFound)

	response, statusCode, err := s.service.FindByID(s.ctx, txID, locale)

	s.Error(err)
	s.Equal(http.StatusNotFound, statusCode)
	s.Empty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_DatabaseError() {
	txID := "tx123"
	locale := "en"

	s.mockBookingTxRepo.EXPECT().FindByID(mock.Anything, txID, locale).Return(entity.BookingTx{}, errors.New("database error"))

	response, statusCode, err := s.service.FindByID(s.ctx, txID, locale)

	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.mockBookingTxRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestFindByID_ArtCTranslationError() {
	txID := "tx123"
	locale := "en"
	currentTime := s.mockClock.Now()

	expectedTx := entity.BookingTx{
		ID:        txID,
		CreatedAt: currentTime,
		UpdatedAt: currentTime,
		UserID:    "user123",
		ProgramID: 1,
		Program: programEntity.Program{
			ID:             1,
			PeriodAt:       &currentTime,
			PeriodEnd:      &[]time.Time{currentTime.Add(24 * time.Hour)}[0],
			ArtCTypeID:     1,
			ArtCCategoryID: &[]uint{1}[0],
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale:    "en",
					Title:     "Test Program",
					Locations: []string{"Location 1"},
					Thumbnail: "thumbnail.jpg",
					Banner:    "banner.jpg",
				},
			},
		},
		BookingSlotDate: entity.BookingSlotDate{
			ID:       "date1",
			SlotDate: time.Now().Add(24 * time.Hour),
		},
		BookingSlotTime: entity.BookingSlotTime{
			ID:            "time1",
			BeginSlotTime: currentTime.Add(1 * time.Hour),
			EndSlotTime:   currentTime.Add(2 * time.Hour),
		},
		BookingSetting: entity.BookingSetting{
			ID:          "1",
			TicketPrice: 100,
		},
		TicketsCount: 2,
		BookingTickets: []entity.BookingTicket{
			{
				ID:          "ticket1",
				TicketNo:    1001,
				Status:      entity.Booked,
				CheckedInAt: nil,
			},
			{
				ID:          "ticket2",
				TicketNo:    1002,
				Status:      entity.CheckedIn,
				CheckedInAt: &currentTime,
			},
		},
	}

	s.mockBookingTxRepo.EXPECT().
		FindByID(mock.Anything, txID, locale).
		Return(expectedTx, nil)

	s.mockArtCTranslationRepo.EXPECT().
		FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
			mock.Anything,
			&expectedTx.Program.ArtCTypeID,
			expectedTx.Program.ArtCCategoryID,
			locale,
		).
		Return(artCEntity.ArtCTranslation{}, errors.New("database error"))

	// Act
	response, statusCode, err := s.service.FindByID(s.ctx, txID, locale)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "can't find art c translation content")

	// Verify mock expectations
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingTxServiceTestSuite) TestCreate_Success() {
	// Arrange
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 2
	programID := uint(1)
	bookingSlotTimeID := "time1"
	bookingSlotDateID := "date1"
	bookerPhoneNumber := "0812345678"
	currentTime := s.mockClock.Now()

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotDateID: bookingSlotDateID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
		BookerPhoneNumber: &bookerPhoneNumber,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		ID:                       "setting1",
		MaxTicketsPerTransaction: 5,
		TicketPrice:              100,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BookingSlotDateID:     bookingSlotDateID,
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    0,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	expectedBookingSlotDate := entity.BookingSlotDate{
		ID:       bookingSlotDateID,
		SlotDate: currentTime.Add(24 * time.Hour),
	}

	expectedBookingTx := entity.BookingTx{
		ID: "tx1",
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindByID(mock.Anything, bookingSlotDateID).
		Return(expectedBookingSlotDate, nil)

	s.mockBookingTxRepo.EXPECT().
		Insert(mock.Anything, mock.AnythingOfType("entity.BookingTx")).
		Return(expectedBookingTx, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		Update(mock.Anything, mock.AnythingOfType("entity.BookingSlotTime")).
		Return(nil)

	s.mockBookingTicketRepo.EXPECT().
		BulkInsert(mock.Anything, mock.AnythingOfType("[]entity.BookingTicket")).
		Return([]entity.BookingTicket{}, nil)

	s.mockBookingNotificationService.EXPECT().
		SendBookingConfirm(
			locale,
			userID,
			expectedProgram,
			mock.AnythingOfType("time.Time"),
			mock.AnythingOfType("time.Time")).
		Return(nil)

	// Act
	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal("tx1", response["id"])
}

func (s *BookingTxServiceTestSuite) TestCreate_SuccessUpdatingSlotTimeStatusToSoldOut() {
	// Arrange
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 2
	programID := uint(1)
	bookingSlotTimeID := "time1"
	bookingSlotDateID := "date1"
	bookerPhoneNumber := "0812345678"
	currentTime := s.mockClock.Now()

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotDateID: bookingSlotDateID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
		BookerPhoneNumber: &bookerPhoneNumber,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		ID:                       "setting1",
		MaxTicketsPerTransaction: 5,
		TicketPrice:              100,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BookingSlotDateID:     bookingSlotDateID,
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    8,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	expectedBookingSlotDate := entity.BookingSlotDate{
		ID:       bookingSlotDateID,
		SlotDate: currentTime.Add(24 * time.Hour),
	}

	expectedBookingTx := entity.BookingTx{
		ID: "tx1",
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindByID(mock.Anything, bookingSlotDateID).
		Return(expectedBookingSlotDate, nil)

	s.mockBookingTxRepo.EXPECT().
		Insert(mock.Anything, mock.AnythingOfType("entity.BookingTx")).
		Return(expectedBookingTx, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		Update(mock.Anything, mock.AnythingOfType("entity.BookingSlotTime")).
		Return(nil)

	s.mockBookingTicketRepo.EXPECT().
		BulkInsert(mock.Anything, mock.AnythingOfType("[]entity.BookingTicket")).
		Return([]entity.BookingTicket{}, nil)

	s.mockBookingNotificationService.EXPECT().
		SendBookingConfirm(
			locale,
			userID,
			expectedProgram,
			mock.AnythingOfType("time.Time"),
			mock.AnythingOfType("time.Time")).
		Return(nil)

	// Act
	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal("tx1", response["id"])
}

func (s *BookingTxServiceTestSuite) TestCreate_DatabaseErrorBookingCustomerTickets() {
	// Arrange
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 2
	programID := uint(1)
	bookingSlotTimeID := "time1"
	bookingSlotDateID := "date1"
	bookerPhoneNumber := "0812345678"
	currentTime := s.mockClock.Now()

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotDateID: bookingSlotDateID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
		BookerPhoneNumber: &bookerPhoneNumber,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		ID:                       "setting1",
		MaxTicketsPerTransaction: 5,
		TicketPrice:              100,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BookingSlotDateID:     bookingSlotDateID,
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    8,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	expectedBookingSlotDate := entity.BookingSlotDate{
		ID:       bookingSlotDateID,
		SlotDate: currentTime.Add(24 * time.Hour),
	}

	expectedBookingTx := entity.BookingTx{
		ID: "tx1",
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindByID(mock.Anything, bookingSlotDateID).
		Return(expectedBookingSlotDate, nil)

	s.mockBookingTxRepo.EXPECT().
		Insert(mock.Anything, mock.AnythingOfType("entity.BookingTx")).
		Return(expectedBookingTx, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		Update(mock.Anything, mock.AnythingOfType("entity.BookingSlotTime")).
		Return(nil)

	s.mockBookingTicketRepo.EXPECT().
		BulkInsert(mock.Anything, mock.AnythingOfType("[]entity.BookingTicket")).
		Return([]entity.BookingTicket{}, errors.New("database error"))

	// Act
	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "something went wrong")
}

func (s *BookingTxServiceTestSuite) TestCreate_DatabaseErrorUpdatingSlotTime() {
	// Arrange
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 2
	programID := uint(1)
	bookingSlotTimeID := "time1"
	bookingSlotDateID := "date1"
	bookerPhoneNumber := "0812345678"
	currentTime := s.mockClock.Now()

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotDateID: bookingSlotDateID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
		BookerPhoneNumber: &bookerPhoneNumber,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		ID:                       "setting1",
		MaxTicketsPerTransaction: 5,
		TicketPrice:              100,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BookingSlotDateID:     bookingSlotDateID,
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    8,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	expectedBookingSlotDate := entity.BookingSlotDate{
		ID:       bookingSlotDateID,
		SlotDate: currentTime.Add(24 * time.Hour),
	}

	expectedBookingTx := entity.BookingTx{
		ID: "tx1",
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindByID(mock.Anything, bookingSlotDateID).
		Return(expectedBookingSlotDate, nil)

	s.mockBookingTxRepo.EXPECT().
		Insert(mock.Anything, mock.AnythingOfType("entity.BookingTx")).
		Return(expectedBookingTx, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		Update(mock.Anything, mock.AnythingOfType("entity.BookingSlotTime")).
		Return(errors.New("database error"))

	// Act
	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "something went wrong")
}

func (s *BookingTxServiceTestSuite) TestCreate_DatabaseErrorCreatingTransaction() {
	// Arrange
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 2
	programID := uint(1)
	bookingSlotTimeID := "time1"
	bookingSlotDateID := "date1"
	bookerPhoneNumber := "0812345678"
	currentTime := s.mockClock.Now()

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotDateID: bookingSlotDateID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
		BookerPhoneNumber: &bookerPhoneNumber,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		ID:                       "setting1",
		MaxTicketsPerTransaction: 5,
		TicketPrice:              100,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BookingSlotDateID:     bookingSlotDateID,
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    8,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	expectedBookingSlotDate := entity.BookingSlotDate{
		ID:       bookingSlotDateID,
		SlotDate: currentTime.Add(24 * time.Hour),
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindByID(mock.Anything, bookingSlotDateID).
		Return(expectedBookingSlotDate, nil)

	s.mockBookingTxRepo.EXPECT().
		Insert(mock.Anything, mock.AnythingOfType("entity.BookingTx")).
		Return(entity.BookingTx{}, errors.New("database error"))

	// Act
	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "something went wrong")
}

func (s *BookingTxServiceTestSuite) TestCreate_BookingSlotDateNotFound() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 2
	programID := uint(1)
	bookingSlotTimeID := "time1"
	bookingSlotDateID := "date1"
	currentTime := s.mockClock.Now()

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotDateID: bookingSlotDateID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		MaxTicketsPerTransaction: 5,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BookingSlotDateID:     bookingSlotDateID,
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    0,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindByID(mock.Anything, bookingSlotDateID).
		Return(entity.BookingSlotDate{}, gorm.ErrRecordNotFound)

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusNotFound, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "not found")
}

func (s *BookingTxServiceTestSuite) TestCreate_DatabaseErrorFindingSlotDate() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 2
	programID := uint(1)
	bookingSlotTimeID := "time1"
	bookingSlotDateID := "date1"
	currentTime := s.mockClock.Now()

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotDateID: bookingSlotDateID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		MaxTicketsPerTransaction: 5,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BookingSlotDateID:     bookingSlotDateID,
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    0,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindByID(mock.Anything, bookingSlotDateID).
		Return(entity.BookingSlotDate{}, errors.New("database error"))

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "something went wrong")
}

func (s *BookingTxServiceTestSuite) TestCreate_BookingSlotDateMismatch() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 2
	programID := uint(1)
	bookingSlotTimeID := "time1"
	bookingSlotDateID := "date1"
	currentTime := s.mockClock.Now()

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotDateID: bookingSlotDateID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		MaxTicketsPerTransaction: 5,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BookingSlotDateID:     "different_date_id", // Mismatch date ID
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    0,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	expectedBookingSlotDate := entity.BookingSlotDate{
		ID:       bookingSlotDateID,
		SlotDate: currentTime.Add(24 * time.Hour),
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindByID(mock.Anything, bookingSlotDateID).
		Return(expectedBookingSlotDate, nil)

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "invalid")
}

func (s *BookingTxServiceTestSuite) TestCreate_PastBookingDate() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 2
	programID := uint(1)
	bookingSlotTimeID := "time1"
	bookingSlotDateID := "date1"
	currentTime := s.mockClock.Now()

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotDateID: bookingSlotDateID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		MaxTicketsPerTransaction: 5,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BookingSlotDateID:     bookingSlotDateID,
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    0,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	expectedBookingSlotDate := entity.BookingSlotDate{
		ID:       bookingSlotDateID,
		SlotDate: currentTime.Add(-24 * time.Hour), // Past date
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindByID(mock.Anything, bookingSlotDateID).
		Return(expectedBookingSlotDate, nil)

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "bookingSlotDate less than current date")
}

func (s *BookingTxServiceTestSuite) TestCreate_InvalidLocale() {
	userID := "user123"
	locale := "invalid"
	tz := "Asia/Bangkok"
	request := model.BookingTxCreateRequest{}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
}

func (s *BookingTxServiceTestSuite) TestCreate_InvalidTimezone() {
	userID := "user123"
	locale := "en"
	tz := "Invalid/Timezone"
	request := model.BookingTxCreateRequest{}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
}

func (s *BookingTxServiceTestSuite) TestCreate_MissingBookerName() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	request := model.BookingTxCreateRequest{
		BookerEmail: &[]string{"john@example.com"}[0],
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "bookerName is required")
}

func (s *BookingTxServiceTestSuite) TestCreate_MissingContactInfo() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	request := model.BookingTxCreateRequest{
		BookerName: &bookerName,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "Either bookerPhoneNumber or bookerEmail is required")
}

func (s *BookingTxServiceTestSuite) TestCreate_RequiredTicketsCount() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	request := model.BookingTxCreateRequest{
		BookerName:   &bookerName,
		BookerEmail:  &bookerEmail,
		TicketsCount: nil,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "required")
}

func (s *BookingTxServiceTestSuite) TestCreate_InvalidTicketsCount() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 0
	request := model.BookingTxCreateRequest{
		BookerName:   &bookerName,
		BookerEmail:  &bookerEmail,
		TicketsCount: &ticketsCount,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "invalid")
}

func (s *BookingTxServiceTestSuite) TestCreate_ProgramNotFound() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 1
	programID := uint(1)
	request := model.BookingTxCreateRequest{
		ProgramID:    programID,
		BookerName:   &bookerName,
		BookerEmail:  &bookerEmail,
		TicketsCount: &ticketsCount,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(programEntity.Program{}, gorm.ErrRecordNotFound)

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusNotFound, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "program not found")
}

func (s *BookingTxServiceTestSuite) TestCreate_DatabaseErrorFindingProgram() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 1
	programID := uint(1)
	request := model.BookingTxCreateRequest{
		ProgramID:    programID,
		BookerName:   &bookerName,
		BookerEmail:  &bookerEmail,
		TicketsCount: &ticketsCount,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(programEntity.Program{}, errors.New("database error"))

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "something went wrong")
}

func (s *BookingTxServiceTestSuite) TestCreate_BookingSettingNotFound() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 6
	programID := uint(1)
	request := model.BookingTxCreateRequest{
		ProgramID:    programID,
		BookerName:   &bookerName,
		BookerEmail:  &bookerEmail,
		TicketsCount: &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(entity.BookingSetting{}, gorm.ErrRecordNotFound)

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusNotFound, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "not found")
}

func (s *BookingTxServiceTestSuite) TestCreate_DatabaseErrorFindingBookingSetting() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 6
	programID := uint(1)
	request := model.BookingTxCreateRequest{
		ProgramID:    programID,
		BookerName:   &bookerName,
		BookerEmail:  &bookerEmail,
		TicketsCount: &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(entity.BookingSetting{}, errors.New("database error"))

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "something went wrong")
}

func (s *BookingTxServiceTestSuite) TestCreate_ExceedMaxTicketsPerTransaction() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 6
	programID := uint(1)
	request := model.BookingTxCreateRequest{
		ProgramID:    programID,
		BookerName:   &bookerName,
		BookerEmail:  &bookerEmail,
		TicketsCount: &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		MaxTicketsPerTransaction: 5,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "ticketsCount greater than 5")
}

func (s *BookingTxServiceTestSuite) TestCreate_SlotTimeNotFound() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 1
	programID := uint(1)
	bookingSlotTimeID := "time1"

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		MaxTicketsPerTransaction: 5,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(entity.BookingSlotTime{}, gorm.ErrRecordNotFound)

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusNotFound, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "not found")
}

func (s *BookingTxServiceTestSuite) TestCreate_DatabaseErrorFindingSlotTime() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 1
	programID := uint(1)
	bookingSlotTimeID := "time1"

	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		MaxTicketsPerTransaction: 5,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(entity.BookingSlotTime{}, errors.New("database error"))

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "something went wrong")
}

func (s *BookingTxServiceTestSuite) TestCreate_SlotTimeLessThanCurrentTime() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 1
	programID := uint(1)
	bookingSlotTimeID := "time1"
	currentTime := s.mockClock.Now()
	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		MaxTicketsPerTransaction: 5,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:            bookingSlotTimeID,
		BeginSlotTime: currentTime.Add(-1 * time.Hour),
		EndSlotTime:   currentTime.Add(-2 * time.Hour),
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "bookingSlotTime less than current time")
}

func (s *BookingTxServiceTestSuite) TestCreate_SlotTimeSoldOut() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 1
	programID := uint(1)
	bookingSlotTimeID := "time1"
	currentTime := s.mockClock.Now()
	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		MaxTicketsPerTransaction: 5,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		BookingSlotTimeStatus: entity.BookingSlotTimeSoldOut,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "status not available")
}

func (s *BookingTxServiceTestSuite) TestCreate_ExceedMaxTicketsPerSlotTime() {
	userID := "user123"
	locale := "en"
	tz := "Asia/Bangkok"
	bookerName := "John Doe"
	bookerEmail := "john@example.com"
	ticketsCount := 2
	programID := uint(1)
	bookingSlotTimeID := "time1"
	currentTime := s.mockClock.Now()
	request := model.BookingTxCreateRequest{
		ProgramID:         programID,
		BookingSlotTimeID: bookingSlotTimeID,
		BookerName:        &bookerName,
		BookerEmail:       &bookerEmail,
		TicketsCount:      &ticketsCount,
	}

	expectedProgram := programEntity.Program{
		ID: programID,
	}

	expectedBookingSetting := entity.BookingSetting{
		MaxTicketsPerTransaction: 5,
	}

	expectedBookingSlotTime := entity.BookingSlotTime{
		ID:                    bookingSlotTimeID,
		BeginSlotTime:         currentTime.Add(1 * time.Hour),
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 1,
		BookedTicketsCount:    0,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(expectedProgram, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		FindByIDWithReadLock(mock.Anything, bookingSlotTimeID).
		Return(expectedBookingSlotTime, nil)

	response, statusCode, err := s.service.Create(s.ctx, userID, request, locale, tz)

	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "ticketsCount greater than maxTicketsPerSlotTime")
}

func TestBookingTxServiceTestSuite(t *testing.T) {
	suite.Run(t, new(BookingTxServiceTestSuite))
}
