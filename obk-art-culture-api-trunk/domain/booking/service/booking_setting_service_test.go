package service_test

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"testing"
	"time"

	artCEntity "example.com/art-culture-api/domain/act_c/entity"
	mockArtCRepo "example.com/art-culture-api/domain/act_c/mocks/repository"
	"example.com/art-culture-api/domain/booking/entity"
	mockRepository "example.com/art-culture-api/domain/booking/mocks/repository"
	mockSession "example.com/art-culture-api/domain/booking/mocks/session"
	"example.com/art-culture-api/domain/booking/model"
	"example.com/art-culture-api/domain/booking/service"
	"example.com/art-culture-api/domain/booking/session"
	programEntity "example.com/art-culture-api/domain/programs/entity"
	"example.com/art-culture-api/pkg"
	"example.com/art-culture-api/pkg/constants"
	"example.com/art-culture-api/pkg/contexts"
	"example.com/art-culture-api/testutil"

	mockProgramRepo "example.com/art-culture-api/domain/programs/mocks/repository"
	"github.com/jonboulle/clockwork"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type BookingSettingServiceTestSuite struct {
	suite.Suite
	mockClock               clockwork.Clock
	mockSession             *mockSession.MockSession
	mockBookingTicketRepo   *mockRepository.MockBookingTicketRepository
	mockBookingTxRepo       *mockRepository.MockBookingTxRepository
	mockBookingSlotTimeRepo *mockRepository.MockBookingSlotTimeRepository
	mockBookingSlotDateRepo *mockRepository.MockBookingSlotDateRepository
	mockBookingSettingRepo  *mockRepository.MockBookingSettingRepository
	mockProgramRepo         *mockProgramRepo.MockProgramRepository
	mockArtCTranslationRepo *mockArtCRepo.MockArtCTranslationRepository
	service                 service.BookingSettingService
	ctx                     context.Context
}

func (s *BookingSettingServiceTestSuite) SetupTest() {
	s.mockClock = clockwork.NewFakeClockAt(time.Date(2025, 1, 8, 20, 41, 58, 0, time.Local))
	s.mockSession = new(mockSession.MockSession)
	s.mockBookingTicketRepo = new(mockRepository.MockBookingTicketRepository)
	s.mockBookingTxRepo = new(mockRepository.MockBookingTxRepository)
	s.mockBookingSlotTimeRepo = new(mockRepository.MockBookingSlotTimeRepository)
	s.mockBookingSlotDateRepo = new(mockRepository.MockBookingSlotDateRepository)
	s.mockBookingSettingRepo = new(mockRepository.MockBookingSettingRepository)
	s.mockProgramRepo = new(mockProgramRepo.MockProgramRepository)
	s.mockArtCTranslationRepo = new(mockArtCRepo.MockArtCTranslationRepository)

	s.service = service.NewBookingSettingService(
		s.mockSession,
		s.mockClock,
		s.mockBookingTicketRepo,
		s.mockBookingTxRepo,
		s.mockBookingSlotTimeRepo,
		s.mockBookingSlotDateRepo,
		s.mockBookingSettingRepo,
		s.mockProgramRepo,
		s.mockArtCTranslationRepo,
	)
	s.ctx = context.Background()
}

func (s *BookingSettingServiceTestSuite) TearDownTest() {
	s.mockSession.AssertExpectations(s.T())
	s.mockBookingTicketRepo.AssertExpectations(s.T())
	s.mockBookingTxRepo.AssertExpectations(s.T())
	s.mockBookingSlotTimeRepo.AssertExpectations(s.T())
	s.mockBookingSlotDateRepo.AssertExpectations(s.T())
	s.mockBookingSettingRepo.AssertExpectations(s.T())
	s.mockProgramRepo.AssertExpectations(s.T())
	s.mockArtCTranslationRepo.AssertExpectations(s.T())
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_InvalidLocale() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "invalid"
	fields := []string{}

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Contains(err.Error(), "invalid")
	s.Empty(res)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_NotFound() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), mock.MatchedBy(func(fields []string) bool {
			return len(fields) == 0
		})).
		Return(entity.BookingSetting{}, gorm.ErrRecordNotFound)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.Error(err)
	s.Equal(http.StatusNotFound, code)
	s.Empty(res)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_CMSSuccess() {
	// Arrange
	client := contexts.NewClientTypeCMS()
	pid := uint(1)
	locale := "invalid"         // Should still work for CMS
	fields := make([]string, 0) // Change from []string{} to make([]string, 0)

	conditionEN := "English condition"
	conditionTH := "Thai condition"
	conditionCN := "Chinese condition"

	expectedBookingSetting := entity.BookingSetting{
		ID:                       "test-id",
		ProgramID:                pid,
		ConditionTextEN:          &conditionEN,
		ConditionTextTH:          &conditionTH,
		ConditionTextCN:          &conditionCN,
		TicketPrice:              100,
		MaxTicketsPerTransaction: 5,
		CreatedAt:                time.Now(),
		UpdatedAt:                time.Now(),
		OpenBookingTime:          time.Now(),
		CloseBookingTime:         time.Now().Add(24 * time.Hour),
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, "en", pid, (*time.Time)(nil), mock.MatchedBy(func(fields []string) bool {
			return len(fields) == 0
		})).
		Return(expectedBookingSetting, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(expectedBookingSetting.ID, res.ID)
	s.Equal(expectedBookingSetting.ProgramID, res.ProgramID)
	s.Equal(expectedBookingSetting.TicketPrice, res.TicketPrice)
	s.Equal(expectedBookingSetting.MaxTicketsPerTransaction, res.MaxTicketsPerTransaction)
	s.Equal(conditionEN, *res.ConditionTextEN)
	s.Equal(conditionTH, *res.ConditionTextTH)
	s.Equal(conditionCN, *res.ConditionTextCN)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_WithProgram() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{"program"}
	currentTime := s.mockClock.Now()

	artCTypeID := uint(1)
	artCCategoryID := uint(2)

	expectedBookingSetting := entity.BookingSetting{
		ID: "test-id",
		Program: programEntity.Program{
			ArtCTypeID:     artCTypeID,
			ArtCCategoryID: &artCCategoryID,
			PeriodAt:       &currentTime,
			PeriodEnd:      &[]time.Time{currentTime.Add(24 * time.Hour)}[0],
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale:    locale,
					Title:     "Program Title",
					Locations: []string{"Test Location"},
					Thumbnail: "thumb.jpg",
					Banner:    "banner.jpg",
				},
			},
		},
	}

	expectedArtCTranslation := artCEntity.ArtCTranslation{
		Title: "Art Title",
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), []string{"program"}).
		Return(expectedBookingSetting, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
		mock.Anything, &artCTypeID, &artCCategoryID, locale).
		Return(expectedArtCTranslation, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.NotNil(res.Program)
	s.Equal(expectedArtCTranslation.Title, res.Program.ArtCTitle)
	s.Equal(expectedBookingSetting.Program.ProgramTranslation[0].Title, res.Program.Title)
	s.Equal(expectedBookingSetting.Program.ProgramTranslation[0].Locations, res.Program.Locations)
	s.Equal(expectedBookingSetting.Program.ProgramTranslation[0].Thumbnail, res.Program.Thumbnail)
	s.Equal(expectedBookingSetting.Program.ProgramTranslation[0].Banner, res.Program.Banner)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_WithBookingSlotTimes() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{"bookingSlotTimes"}
	currentTime := s.mockClock.Now()

	slotTime := entity.BookingSlotTime{
		ID:                    "slot-1",
		BookingSettingID:      "setting-1",
		ProgramID:             pid,
		BookingSlotDateID:     "date-1",
		CreatedAt:             currentTime,
		UpdatedAt:             currentTime,
		BeginSlotTime:         currentTime,
		EndSlotTime:           currentTime.Add(2 * time.Hour),
		MaxTicketsPerSlotTime: 100,
		BookedTicketsCount:    50,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
	}

	expectedBookingSetting := entity.BookingSetting{
		ID: "test-id",
		BookingSlotDates: []entity.BookingSlotDate{
			{
				ID:               "date-1",
				ProgramID:        pid,
				BookingSettingID: "setting-1",
				CreatedAt:        currentTime,
				UpdatedAt:        currentTime,
				SlotDate:         currentTime,
				BookingSlotTimes: []entity.BookingSlotTime{slotTime},
			},
		},
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), []string{"bookingSlotTimes"}).
		Return(expectedBookingSetting, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.NotNil(res.BookingSlotDates)
	s.Len(*res.BookingSlotDates, 1)
	s.NotNil((*res.BookingSlotDates)[0].BookingSlotTimes)
	s.Len(*(*res.BookingSlotDates)[0].BookingSlotTimes, 1)

	actualSlotTime := (*(*res.BookingSlotDates)[0].BookingSlotTimes)[0]
	s.Equal(slotTime.ID, actualSlotTime.ID)
	s.Equal(slotTime.BookingSettingID, actualSlotTime.BookingSettingID)
	s.Equal(slotTime.ProgramID, actualSlotTime.ProgramID)
	s.Equal(slotTime.BookingSlotDateID, actualSlotTime.BookingSlotDateID)
	s.Equal(slotTime.MaxTicketsPerSlotTime, actualSlotTime.MaxTicketsPerSlotTime)
	s.Equal(slotTime.BookedTicketsCount, actualSlotTime.BookedTicketsCount)
	s.Equal(slotTime.BookingSlotTimeStatus.String(), actualSlotTime.Status)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_WithBookingSlotDates() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{"bookingSlotDates"}
	currentTime := s.mockClock.Now()

	expectedBookingSetting := entity.BookingSetting{
		ID: "test-id",
		BookingSlotDates: []entity.BookingSlotDate{
			{
				ID:               "date-1",
				ProgramID:        pid,
				BookingSettingID: "setting-1",
				CreatedAt:        currentTime,
				UpdatedAt:        currentTime,
				SlotDate:         currentTime,
			},
		},
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), []string{"bookingSlotDates"}).
		Return(expectedBookingSetting, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.NotNil(res.BookingSlotDates)
	s.Len(*res.BookingSlotDates, 1)
	s.Nil((*res.BookingSlotDates)[0].BookingSlotTimes)

	actualSlotDate := (*res.BookingSlotDates)[0]
	s.Equal(expectedBookingSetting.BookingSlotDates[0].ID, actualSlotDate.ID)
	s.Equal(expectedBookingSetting.BookingSlotDates[0].ProgramID, actualSlotDate.ProgramID)
	s.Equal(expectedBookingSetting.BookingSlotDates[0].BookingSettingID, actualSlotDate.BookingSettingID)
	s.Equal(expectedBookingSetting.BookingSlotDates[0].SlotDate, actualSlotDate.SlotDate)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_WithMinDate() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{}
	minDate := s.mockClock.Now()

	expectedBookingSetting := entity.BookingSetting{
		ID:        "test-id",
		ProgramID: pid,
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, &minDate, mock.MatchedBy(func(fields []string) bool {
			return len(fields) == 0
		})).
		Return(expectedBookingSetting, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, &minDate, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(expectedBookingSetting.ID, res.ID)
	s.Equal(expectedBookingSetting.ProgramID, res.ProgramID)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_ReturnProgramWithDefaultLocaleWhenArtCTranslationNotFound() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{"program"}
	currentTime := s.mockClock.Now()

	artCTypeID := uint(1)
	artCCategoryID := uint(2)

	expectedBookingSetting := entity.BookingSetting{
		ID: "test-id",
		Program: programEntity.Program{
			ArtCTypeID:     artCTypeID,
			ArtCCategoryID: &artCCategoryID,
			PeriodAt:       &currentTime,
			PeriodEnd:      &[]time.Time{currentTime.Add(24 * time.Hour)}[0],
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale:    locale,
					Title:     "Program Title",
					Locations: []string{"Test Location"},
					Thumbnail: "thumb.jpg",
					Banner:    "banner.jpg",
				},
			},
		},
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), []string{"program"}).
		Return(expectedBookingSetting, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
		mock.Anything, &artCTypeID, &artCCategoryID, locale).
		Return(artCEntity.ArtCTranslation{}, gorm.ErrRecordNotFound)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal("", res.Program.ArtCTitle)
	s.Equal("en", res.Program.Locale)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_ReturnProgramThatMatchedLocaleWhenArtCTranslationIsFoundWithMatchedLocale() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{"program"}
	currentTime := s.mockClock.Now()

	artCTypeID := uint(1)
	artCCategoryID := uint(2)

	artCTranslation := artCEntity.ArtCTranslation{
		Title: "ArtC Title",
		Locale: locale,
	}

	expectedBookingSetting := entity.BookingSetting{
		ID: "test-id",
		Program: programEntity.Program{
			ArtCTypeID:     artCTypeID,
			ArtCCategoryID: &artCCategoryID,
			PeriodAt:       &currentTime,
			PeriodEnd:      &[]time.Time{currentTime.Add(24 * time.Hour)}[0],
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale:    locale,
					Title:     "Program Title",
					Locations: []string{"Test Location"},
					Thumbnail: "thumb.jpg",
					Banner:    "banner.jpg",
				},
			},
		},
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), []string{"program"}).
		Return(expectedBookingSetting, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
		mock.Anything, &artCTypeID, &artCCategoryID, locale).
		Return(artCTranslation, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(artCTranslation.Title, res.Program.ArtCTitle)
	s.Equal(locale, res.Program.Locale)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_ReturnProgramWithDefaultLocaleWhenArtCTranslationIsFoundButNotMatchedRequestLocale() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	requestLocale := "th"
	locale := "en"
	fields := []string{"program"}
	currentTime := s.mockClock.Now()

	artCTypeID := uint(1)
	artCCategoryID := uint(2)

	artCTranslation := artCEntity.ArtCTranslation{
		Title: "ArtC Title",
		Locale: locale,
	}

	expectedBookingSetting := entity.BookingSetting{
		ID: "test-id",
		Program: programEntity.Program{
			ArtCTypeID:     artCTypeID,
			ArtCCategoryID: &artCCategoryID,
			PeriodAt:       &currentTime,
			PeriodEnd:      &[]time.Time{currentTime.Add(24 * time.Hour)}[0],
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale:    locale,
					Title:     "Program Title",
					Locations: []string{"Test Location"},
					Thumbnail: "thumb.jpg",
					Banner:    "banner.jpg",
				},
			},
		},
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, requestLocale, pid, (*time.Time)(nil), []string{"program"}).
		Return(expectedBookingSetting, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
		mock.Anything, &artCTypeID, &artCCategoryID, requestLocale).
		Return(artCTranslation, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, requestLocale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(artCTranslation.Title, res.Program.ArtCTitle)
	s.Equal(locale, res.Program.Locale)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_ReturnProgramThatMatchedRequestLocaleWhichIsNotDefaultLocaleWhenArtCTranslationIsFoundButNotMatchedRequestLocale() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	requestLocale := "th"
	locale := "th"
	fields := []string{"program"}
	currentTime := s.mockClock.Now()

	artCTypeID := uint(1)
	artCCategoryID := uint(2)

	artCTranslation := artCEntity.ArtCTranslation{
		Title: "ArtC Title",
		Locale: locale,
	}

	expectedBookingSetting := entity.BookingSetting{
		ID: "test-id",
		Program: programEntity.Program{
			ArtCTypeID:     artCTypeID,
			ArtCCategoryID: &artCCategoryID,
			PeriodAt:       &currentTime,
			PeriodEnd:      &[]time.Time{currentTime.Add(24 * time.Hour)}[0],
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale:    locale,
					Title:     "Program Title",
					Locations: []string{"Test Location"},
					Thumbnail: "thumb.jpg",
					Banner:    "banner.jpg",
				},
			},
		},
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, requestLocale, pid, (*time.Time)(nil), []string{"program"}).
		Return(expectedBookingSetting, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
		mock.Anything, &artCTypeID, &artCCategoryID, requestLocale).
		Return(artCTranslation, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, requestLocale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(artCTranslation.Title, res.Program.ArtCTitle)
	s.Equal(locale, res.Program.Locale)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_InternalServerError() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), mock.MatchedBy(func(fields []string) bool {
			return len(fields) == 0
		})).
		Return(entity.BookingSetting{}, errors.New("database error"))

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Contains(err.Error(), "can't find booking setting content")
	s.Empty(res)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_ArtCTranslationInternalError() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{"program"}
	currentTime := s.mockClock.Now()

	artCTypeID := uint(1)
	artCCategoryID := uint(2)

	expectedBookingSetting := entity.BookingSetting{
		ID: "test-id",
		Program: programEntity.Program{
			ArtCTypeID:     artCTypeID,
			ArtCCategoryID: &artCCategoryID,
			PeriodAt:       &currentTime,
			PeriodEnd:      &[]time.Time{currentTime.Add(24 * time.Hour)}[0],
			ProgramTranslation: []programEntity.ProgramTranslation{
				{
					Locale:    locale,
					Title:     "Program Title",
					Locations: []string{"Test Location"},
					Thumbnail: "thumb.jpg",
					Banner:    "banner.jpg",
				},
			},
		},
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), []string{"program"}).
		Return(expectedBookingSetting, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(
		mock.Anything, &artCTypeID, &artCCategoryID, locale).
		Return(artCEntity.ArtCTranslation{}, errors.New("database error"))

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Contains(err.Error(), "can't find art c translation content")
	s.Empty(res)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_NonCMSWithConditionText() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{}

	conditionEN := "English condition"
	conditionTH := "Thai condition"
	conditionCN := "Chinese condition"

	expectedBookingSetting := entity.BookingSetting{
		ID:              "test-id",
		ProgramID:       pid,
		ConditionTextEN: &conditionEN,
		ConditionTextTH: &conditionTH,
		ConditionTextCN: &conditionCN,
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), mock.MatchedBy(func(fields []string) bool {
			return len(fields) == 0
		})).
		Return(expectedBookingSetting, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(conditionEN, *res.ConditionText)
	s.Nil(res.ConditionTextEN)
	s.Nil(res.ConditionTextTH)
	s.Nil(res.ConditionTextCN)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_EmptyBookingSlotDates() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{"bookingSlotTimes"}

	expectedBookingSetting := entity.BookingSetting{
		ID:        "test-id",
		ProgramID: pid,
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), []string{"bookingSlotTimes"}).
		Return(expectedBookingSetting, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Nil(res.BookingSlotDates)
}

func (s *BookingSettingServiceTestSuite) TestFindByProgramIDWithPreloadFields_EmptyProgramTranslation() {
	// Arrange
	client := contexts.NewClientTypePublic()
	pid := uint(1)
	locale := "en"
	fields := []string{"program"}

	expectedBookingSetting := entity.BookingSetting{
		ID:      "test-id",
		Program: programEntity.Program{},
	}

	s.mockBookingSettingRepo.EXPECT().FindByProgramIDWithLocaleAndPreloadFields(
		mock.Anything, locale, pid, (*time.Time)(nil), []string{"program"}).
		Return(expectedBookingSetting, nil)

	// Act
	res, code, err := s.service.FindByProgramIDWithPreloadFields(s.ctx, client, pid, locale, nil, fields)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Nil(res.Program)
}

func (s *BookingSettingServiceTestSuite) TestGetAllWithPagination_InvalidTimezone() {
	// Arrange
	pagination := pkg.Pagination{}
	preloadFields := []string{}
	filterFields := make(map[string]any)
	locale := "en"
	tz := "Invalid/Timezone"

	// Act
	result, code, err := s.service.GetAllWithPagination(s.ctx, pagination, preloadFields, filterFields, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Empty(result)
}

func (s *BookingSettingServiceTestSuite) TestGetAllWithPagination_InvalidLocale() {
	// Arrange
	pagination := pkg.Pagination{}
	preloadFields := []string{}
	filterFields := make(map[string]any)
	locale := "invalid"
	tz := "UTC"

	// Act
	result, code, err := s.service.GetAllWithPagination(s.ctx, pagination, preloadFields, filterFields, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Empty(result)
}

func (s *BookingSettingServiceTestSuite) TestGetAllWithPagination_RepositoryError() {
	// Arrange
	pagination := pkg.Pagination{}
	preloadFields := []string{}
	filterFields := make(map[string]any)
	locale := "en"
	tz := "UTC"
	currentTime := s.mockClock.Now()
	y, m, d := currentTime.In(time.UTC).Date()
	truncatedDate := time.Date(y, m, d, 0, 0, 0, 0, time.UTC)

	s.mockBookingSettingRepo.EXPECT().FindAllWithPagination(mock.Anything, locale, pagination, filterFields, truncatedDate).
		Return(nil, nil, errors.New("database error"))

	// Act
	result, code, err := s.service.GetAllWithPagination(s.ctx, pagination, preloadFields, filterFields, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(result)
}

func (s *BookingSettingServiceTestSuite) TestGetAllWithPagination_NoResults() {
	// Arrange
	pagination := pkg.Pagination{}
	preloadFields := []string{}
	filterFields := make(map[string]any)
	locale := "en"
	tz := "UTC"
	currentTime := s.mockClock.Now()
	y, m, d := currentTime.In(time.UTC).Date()
	truncatedDate := time.Date(y, m, d, 0, 0, 0, 0, time.UTC)

	expectedPagination := &pkg.Pagination{
		Data: []model.BookingSettingPaginationResponse{},
	}
	s.mockBookingSettingRepo.EXPECT().FindAllWithPagination(mock.Anything, locale, pagination, filterFields, truncatedDate).
		Return([]entity.BookingSettingPagination{}, expectedPagination, nil)

	// Act
	result, code, err := s.service.GetAllWithPagination(s.ctx, pagination, preloadFields, filterFields, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(expectedPagination.Data, result.Data)
}

func (s *BookingSettingServiceTestSuite) TestGetAllWithPagination_WithResults() {
	// Arrange
	pagination := pkg.Pagination{}
	preloadFields := []string{"program"}
	filterFields := make(map[string]any)
	locale := "en"
	tz := "UTC"
	currentTime := s.mockClock.Now()
	y, m, d := currentTime.In(time.UTC).Date()
	truncatedDate := time.Date(y, m, d, 0, 0, 0, 0, time.UTC)

	artCTypeID := uint(1)
	artCCategoryID := uint(2)
	bookingSettings := []entity.BookingSettingPagination{
		{
			ID:                         "test-id",
			ProgramID:                  1,
			ArtCTypeID:                 artCTypeID,
			ArtCCategoryID:             &artCCategoryID,
			TicketPrice:                100,
			OpenBookingTime:            currentTime,
			CloseBookingTime:           currentTime.Add(24 * time.Hour),
			TotalMaxTicketsPerSlotTime: 50,
			BookedCount:                10,
			TotalCheckedIn:             5,
			ProgramPeriodAt:            &currentTime,
			ProgramPeriodEnd:           &currentTime,
			ProgramLocale:              locale,
			ProgramLocations:           []string{"Location 1"},
			ProgramTitle:               "Test Program",
		},
	}

	expectedPagination := &pkg.Pagination{}
	s.mockBookingSettingRepo.EXPECT().FindAllWithPagination(mock.Anything, locale, pagination, filterFields, truncatedDate).
		Return(bookingSettings, expectedPagination, nil)

	// Multiple art translations with same type and category
	artCTranslations := []artCEntity.ArtCTranslation{
		{
			ArtCTypeID:     &artCTypeID,
			ArtCCategoryID: &artCCategoryID,
			Locale:         locale,
			Title:          "Art Translation Title",
		},
	}

	s.mockArtCTranslationRepo.EXPECT().FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(mock.Anything, mock.Anything).
		Return(artCTranslations, nil)

	// Act
	result, code, err := s.service.GetAllWithPagination(s.ctx, pagination, preloadFields, filterFields, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.NotNil(result.Data)

	responses := result.Data.([]model.BookingSettingPaginationResponse)
	s.Len(responses, 1)
	s.Equal(bookingSettings[0].ID, responses[0].ID)
	s.Equal(bookingSettings[0].ProgramID, responses[0].ProgramID)
	s.Equal(bookingSettings[0].TicketPrice, responses[0].TicketPrice)
	s.Equal(int(bookingSettings[0].TotalMaxTicketsPerSlotTime), responses[0].MaxTickets)
	s.Equal(int(bookingSettings[0].BookedCount), responses[0].BookedCount)
	s.Equal(int(bookingSettings[0].TotalCheckedIn), responses[0].CheckedCount)

	s.NotNil(responses[0].Program)
	s.Equal(artCTranslations[0].Title, responses[0].Program.ArtCTitle)
	s.Equal(bookingSettings[0].ProgramLocale, responses[0].Program.Locale)
	s.Equal(bookingSettings[0].ProgramLocations, responses[0].Program.Locations)
	s.Equal(bookingSettings[0].ProgramTitle, responses[0].Program.Title)
}

func (s *BookingSettingServiceTestSuite) TestGetAllWithPagination_ArtCTranslationError() {
	// Arrange
	pagination := pkg.Pagination{}
	preloadFields := []string{"program"}
	filterFields := make(map[string]any)
	locale := "en"
	tz := "UTC"
	currentTime := s.mockClock.Now()
	y, m, d := currentTime.In(time.UTC).Date()
	truncatedDate := time.Date(y, m, d, 0, 0, 0, 0, time.UTC)

	bookingSettings := []entity.BookingSettingPagination{
		{
			ID:        "test-id",
			ProgramID: 1,
		},
	}

	expectedPagination := &pkg.Pagination{}
	s.mockBookingSettingRepo.EXPECT().FindAllWithPagination(mock.Anything, locale, pagination, filterFields, truncatedDate).
		Return(bookingSettings, expectedPagination, nil)

	s.mockArtCTranslationRepo.EXPECT().FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(mock.Anything, mock.Anything).
		Return(nil, errors.New("database error"))

	// Act
	result, code, err := s.service.GetAllWithPagination(s.ctx, pagination, preloadFields, filterFields, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(result)
}

func (s *BookingSettingServiceTestSuite) TestGetAllWithPagination_WithMultipleArtTranslations() {
	// Arrange
	pagination := pkg.Pagination{}
	preloadFields := []string{"program"}
	filterFields := make(map[string]any)
	locale := "en"
	tz := "UTC"
	currentTime := s.mockClock.Now()
	y, m, d := currentTime.In(time.UTC).Date()
	truncatedDate := time.Date(y, m, d, 0, 0, 0, 0, time.UTC)

	artCTypeID := uint(1)
	artCCategoryID := uint(2)
	bookingSettings := []entity.BookingSettingPagination{
		{
			ID:                         "test-id",
			ProgramID:                  1,
			ArtCTypeID:                 artCTypeID,
			ArtCCategoryID:             &artCCategoryID,
			TicketPrice:                100,
			OpenBookingTime:            currentTime,
			CloseBookingTime:           currentTime.Add(24 * time.Hour),
			TotalMaxTicketsPerSlotTime: 50,
			BookedCount:                10,
			TotalCheckedIn:             5,
			ProgramPeriodAt:            &currentTime,
			ProgramPeriodEnd:           &currentTime,
			ProgramLocale:              locale,
			ProgramLocations:           []string{"Location 1"},
			ProgramTitle:               "Test Program",
		},
	}

	expectedPagination := &pkg.Pagination{}
	s.mockBookingSettingRepo.EXPECT().FindAllWithPagination(mock.Anything, locale, pagination, filterFields, truncatedDate).
		Return(bookingSettings, expectedPagination, nil)

	// Multiple art translations with same type and category
	artCTranslations := []artCEntity.ArtCTranslation{
		{
			ArtCTypeID:     &artCTypeID,
			ArtCCategoryID: &artCCategoryID,
			Locale:         locale,
			Title:          "Art Translation Title 1",
		},
		{
			ArtCTypeID:     &artCTypeID,
			ArtCCategoryID: &artCCategoryID,
			Locale:         locale,
			Title:          "Art Translation Title 2", // This one should be ignored due to break
		},
	}

	s.mockArtCTranslationRepo.EXPECT().FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(mock.Anything, mock.Anything).
		Return(artCTranslations, nil)

	// Act
	result, code, err := s.service.GetAllWithPagination(s.ctx, pagination, preloadFields, filterFields, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.NotNil(result.Data)

	responses := result.Data.([]model.BookingSettingPaginationResponse)
	s.Len(responses, 1)
	s.Equal(bookingSettings[0].ID, responses[0].ID)
	s.NotNil(responses[0].Program)
	s.Equal(artCTranslations[0].Title, responses[0].Program.ArtCTitle) // Should use first matching translation
}

func (s *BookingSettingServiceTestSuite) TestCheckAvailability_EmptyProgramIDs() {
	// Arrange
	request := model.BookingSettingCheckAvailabilityRequest{
		ProgramIDs: []uint{},
		Time:       s.mockClock.Now(),
	}

	// Act
	result, code, err := s.service.CheckAvailability(s.ctx, request)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Empty(result)
	s.Contains(err.Error(), "programIds")
}

func (s *BookingSettingServiceTestSuite) TestCheckAvailability_DatabaseError() {
	// Arrange
	request := model.BookingSettingCheckAvailabilityRequest{
		ProgramIDs: []uint{1, 2},
		Time:       s.mockClock.Now(),
	}

	s.mockBookingSettingRepo.EXPECT().FindAllByProgramIDsWithBookingSlotDates(
		mock.Anything, request.ProgramIDs).
		Return(nil, errors.New("database error"))

	// Act
	result, code, err := s.service.CheckAvailability(s.ctx, request)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(result)
	s.Contains(err.Error(), "can't find booking setting contents")
}

func (s *BookingSettingServiceTestSuite) TestCheckAvailability_NoMatchingBookingSetting() {
	// Arrange
	request := model.BookingSettingCheckAvailabilityRequest{
		ProgramIDs: []uint{1},
		Time:       s.mockClock.Now(),
	}

	s.mockBookingSettingRepo.EXPECT().FindAllByProgramIDsWithBookingSlotDates(
		mock.Anything, request.ProgramIDs).
		Return([]entity.BookingSetting{}, nil)

	// Act
	result, code, err := s.service.CheckAvailability(s.ctx, request)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Len(result, 1)
	s.Equal(uint(1), result[0].ProgramID)
	s.False(result[0].IsAvailable)
}

func (s *BookingSettingServiceTestSuite) TestCheckAvailability_OutsideBookingTimeRange() {
	// Arrange
	currentTime := s.mockClock.Now()
	request := model.BookingSettingCheckAvailabilityRequest{
		ProgramIDs: []uint{1},
		Time:       currentTime,
	}

	bookingSettings := []entity.BookingSetting{
		{
			ProgramID:        1,
			OpenBookingTime:  currentTime.Add(1 * time.Hour), // Opens in future
			CloseBookingTime: currentTime.Add(2 * time.Hour),
		},
	}

	s.mockBookingSettingRepo.EXPECT().FindAllByProgramIDsWithBookingSlotDates(
		mock.Anything, request.ProgramIDs).
		Return(bookingSettings, nil)

	// Act
	result, code, err := s.service.CheckAvailability(s.ctx, request)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Len(result, 1)
	s.Equal(uint(1), result[0].ProgramID)
	s.False(result[0].IsAvailable)
}

func (s *BookingSettingServiceTestSuite) TestCheckAvailability_NoAvailableSlotDates() {
	// Arrange
	currentTime := s.mockClock.Now()
	request := model.BookingSettingCheckAvailabilityRequest{
		ProgramIDs: []uint{1},
		Time:       currentTime,
	}

	bookingSettings := []entity.BookingSetting{
		{
			ProgramID:        1,
			OpenBookingTime:  currentTime.Add(-1 * time.Hour), // Opened in past
			CloseBookingTime: currentTime.Add(1 * time.Hour),  // Closes in future
			BookingSlotDates: []entity.BookingSlotDate{
				{
					SlotDate: currentTime.Add(-24 * time.Hour), // Past date
				},
			},
		},
	}

	s.mockBookingSettingRepo.EXPECT().FindAllByProgramIDsWithBookingSlotDates(
		mock.Anything, request.ProgramIDs).
		Return(bookingSettings, nil)

	// Act
	result, code, err := s.service.CheckAvailability(s.ctx, request)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Len(result, 1)
	s.Equal(uint(1), result[0].ProgramID)
	s.False(result[0].IsAvailable)
}

func (s *BookingSettingServiceTestSuite) TestCheckAvailability_AvailableSlot() {
	// Arrange
	currentTime := s.mockClock.Now()
	request := model.BookingSettingCheckAvailabilityRequest{
		ProgramIDs: []uint{1},
		Time:       currentTime,
	}

	bookingSettings := []entity.BookingSetting{
		{
			ProgramID:        1,
			OpenBookingTime:  currentTime.Add(-1 * time.Hour), // Opened in past
			CloseBookingTime: currentTime.Add(1 * time.Hour),  // Closes in future
			BookingSlotDates: []entity.BookingSlotDate{
				{
					SlotDate: currentTime, // Current date
				},
			},
		},
	}

	s.mockBookingSettingRepo.EXPECT().FindAllByProgramIDsWithBookingSlotDates(
		mock.Anything, request.ProgramIDs).
		Return(bookingSettings, nil)

	// Act
	result, code, err := s.service.CheckAvailability(s.ctx, request)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Len(result, 1)
	s.Equal(uint(1), result[0].ProgramID)
	s.True(result[0].IsAvailable)
}

func (s *BookingSettingServiceTestSuite) TestCheckAvailability_MultiplePrograms() {
	// Arrange
	currentTime := s.mockClock.Now()
	request := model.BookingSettingCheckAvailabilityRequest{
		ProgramIDs: []uint{1, 2, 3},
		Time:       currentTime,
	}

	bookingSettings := []entity.BookingSetting{
		{
			// Available program
			ProgramID:        1,
			OpenBookingTime:  currentTime.Add(-1 * time.Hour),
			CloseBookingTime: currentTime.Add(1 * time.Hour),
			BookingSlotDates: []entity.BookingSlotDate{
				{
					SlotDate: currentTime,
				},
			},
		},
		{
			// Program with no available slots
			ProgramID:        2,
			OpenBookingTime:  currentTime.Add(-1 * time.Hour),
			CloseBookingTime: currentTime.Add(1 * time.Hour),
			BookingSlotDates: []entity.BookingSlotDate{
				{
					SlotDate: currentTime.Add(-24 * time.Hour),
				},
			},
		},
		// Program 3 doesn't exist in booking settings
	}

	s.mockBookingSettingRepo.EXPECT().FindAllByProgramIDsWithBookingSlotDates(
		mock.Anything, request.ProgramIDs).
		Return(bookingSettings, nil)

	// Act
	result, code, err := s.service.CheckAvailability(s.ctx, request)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Len(result, 3)

	// Program 1 should be available
	s.Equal(uint(1), result[0].ProgramID)
	s.True(result[0].IsAvailable)

	// Program 2 should be unavailable
	s.Equal(uint(2), result[1].ProgramID)
	s.False(result[1].IsAvailable)

	// Program 3 should be unavailable (not found)
	s.Equal(uint(3), result[2].ProgramID)
	s.False(result[2].IsAvailable)
}

func (s *BookingSettingServiceTestSuite) TestDelete_NotFound() {
	// Arrange
	id := "non-existent-id"

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().FindByIDWithBookingSlotDatesAndBookingSlotTimes(
		mock.Anything, id).
		Return(entity.BookingSetting{}, gorm.ErrRecordNotFound)

	// Act
	result, code, err := s.service.Delete(s.ctx, id)

	// Assert
	s.Error(err)
	s.Equal(http.StatusNotFound, code)
	s.Empty(result)
	s.Contains(err.Error(), "booking setting not found")
}

func (s *BookingSettingServiceTestSuite) TestDelete_InternalServerError() {
	// Arrange
	id := "test-id"

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().FindByIDWithBookingSlotDatesAndBookingSlotTimes(
		mock.Anything, id).
		Return(entity.BookingSetting{}, errors.New("database error"))

	// Act
	result, code, err := s.service.Delete(s.ctx, id)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(result)
	s.Contains(err.Error(), "can't find booking setting content")
}

func (s *BookingSettingServiceTestSuite) TestDelete_HasBookingTransactions() {
	// Arrange
	id := "test-id"
	bookingSetting := entity.BookingSetting{
		ID: id,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().FindByIDWithBookingSlotDatesAndBookingSlotTimes(
		mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingTxRepo.EXPECT().CountByBookingSettingIDs(
		mock.Anything, []string{id}).
		Return(int64(1), nil)

	// Act
	result, code, err := s.service.Delete(s.ctx, id)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, code)
	s.Empty(result)
	s.Contains(err.Error(), "Cannot delete Booking setting with existing purchased transactions.")
}

func (s *BookingSettingServiceTestSuite) TestDelete_CountTransactionError() {
	// Arrange
	id := "test-id"
	bookingSetting := entity.BookingSetting{
		ID: id,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().FindByIDWithBookingSlotDatesAndBookingSlotTimes(
		mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingTxRepo.EXPECT().CountByBookingSettingIDs(
		mock.Anything, []string{id}).
		Return(int64(0), errors.New("database error"))

	// Act
	result, code, err := s.service.Delete(s.ctx, id)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(result)
	s.Contains(err.Error(), "can't count booking transaction contents")
}

func (s *BookingSettingServiceTestSuite) TestDelete_WithBookingSlotTimesError() {
	// Arrange
	id := "test-id"
	slotTime := entity.BookingSlotTime{ID: "slot-1"}
	bookingSetting := entity.BookingSetting{
		ID: id,
		BookingSlotDates: []entity.BookingSlotDate{
			{
				ID:               "date-1",
				BookingSlotTimes: []entity.BookingSlotTime{slotTime},
			},
		},
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().FindByIDWithBookingSlotDatesAndBookingSlotTimes(
		mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingTxRepo.EXPECT().CountByBookingSettingIDs(
		mock.Anything, []string{id}).
		Return(int64(0), nil)

	s.mockBookingSlotTimeRepo.EXPECT().BulkDelete(
		mock.Anything, []entity.BookingSlotTime{slotTime}).
		Return(nil, errors.New("database error"))

	// Act
	result, code, err := s.service.Delete(s.ctx, id)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(result)
	s.Contains(err.Error(), "can't delete booking slot time contents")
}

func (s *BookingSettingServiceTestSuite) TestDelete_WithBookingSlotDatesError() {
	// Arrange
	id := "test-id"
	slotTime := entity.BookingSlotTime{ID: "slot-1"}
	slotDate := entity.BookingSlotDate{
		ID:               "date-1",
		BookingSlotTimes: []entity.BookingSlotTime{slotTime},
	}
	bookingSetting := entity.BookingSetting{
		ID:               id,
		BookingSlotDates: []entity.BookingSlotDate{slotDate},
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().FindByIDWithBookingSlotDatesAndBookingSlotTimes(
		mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingTxRepo.EXPECT().CountByBookingSettingIDs(
		mock.Anything, []string{id}).
		Return(int64(0), nil)

	s.mockBookingSlotTimeRepo.EXPECT().BulkDelete(
		mock.Anything, []entity.BookingSlotTime{slotTime}).
		Return([]entity.BookingSlotTime{slotTime}, nil)

	s.mockBookingSlotDateRepo.EXPECT().BulkDelete(
		mock.Anything, []entity.BookingSlotDate{slotDate}).
		Return(nil, errors.New("database error"))

	// Act
	result, code, err := s.service.Delete(s.ctx, id)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(result)
	s.Contains(err.Error(), "can't delete booking slot date contents")
}

func (s *BookingSettingServiceTestSuite) TestDelete_DeleteBookingSettingError() {
	// Arrange
	id := "test-id"
	slotTime := entity.BookingSlotTime{ID: "slot-1"}
	slotDate := entity.BookingSlotDate{
		ID:               "date-1",
		BookingSlotTimes: []entity.BookingSlotTime{slotTime},
	}
	bookingSetting := entity.BookingSetting{
		ID:               id,
		BookingSlotDates: []entity.BookingSlotDate{slotDate},
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().FindByIDWithBookingSlotDatesAndBookingSlotTimes(
		mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingTxRepo.EXPECT().CountByBookingSettingIDs(
		mock.Anything, []string{id}).
		Return(0, nil)

	s.mockBookingSlotTimeRepo.EXPECT().BulkDelete(
		mock.Anything, []entity.BookingSlotTime{slotTime}).
		Return([]entity.BookingSlotTime{slotTime}, nil)

	s.mockBookingSlotDateRepo.EXPECT().BulkDelete(
		mock.Anything, []entity.BookingSlotDate{slotDate}).
		Return([]entity.BookingSlotDate{slotDate}, nil)

	s.mockBookingSettingRepo.EXPECT().DeleteByID(
		mock.Anything, id).
		Return(errors.New("database error"))

	// Act
	result, code, err := s.service.Delete(s.ctx, id)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, code)
	s.Empty(result)
	s.Contains(err.Error(), "can't delete booking setting content")
}

func (s *BookingSettingServiceTestSuite) TestDelete_Success() {
	// Arrange
	id := "test-id"
	slotTime := entity.BookingSlotTime{ID: "slot-1"}
	slotDate := entity.BookingSlotDate{
		ID:               "date-1",
		BookingSlotTimes: []entity.BookingSlotTime{slotTime},
	}
	bookingSetting := entity.BookingSetting{
		ID:               id,
		BookingSlotDates: []entity.BookingSlotDate{slotDate},
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().FindByIDWithBookingSlotDatesAndBookingSlotTimes(
		mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingTxRepo.EXPECT().CountByBookingSettingIDs(
		mock.Anything, []string{id}).
		Return(0, nil)

	s.mockBookingSlotTimeRepo.EXPECT().BulkDelete(
		mock.Anything, []entity.BookingSlotTime{slotTime}).
		Return([]entity.BookingSlotTime{slotTime}, nil)

	s.mockBookingSlotDateRepo.EXPECT().BulkDelete(
		mock.Anything, []entity.BookingSlotDate{slotDate}).
		Return([]entity.BookingSlotDate{slotDate}, nil)

	s.mockBookingSettingRepo.EXPECT().DeleteByID(
		mock.Anything, id).
		Return(nil)

	// Act
	result, code, err := s.service.Delete(s.ctx, id)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(id, result["id"])
}

func (s *BookingSettingServiceTestSuite) TestCreate_InvalidLocale() {
	// Arrange
	locale := "invalid"
	tz := "Asia/Bangkok"
	request := model.BookingSettingCreateRequest{}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "invalid locale")
}

func (s *BookingSettingServiceTestSuite) TestCreate_InvalidTimezone() {
	// Arrange
	locale := "en"
	tz := "Invalid/Timezone"
	request := model.BookingSettingCreateRequest{}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "invalid Time-Zone")
}

func (s *BookingSettingServiceTestSuite) TestCreate_MissingRequiredFieldProgramID() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	request := model.BookingSettingCreateRequest{}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "programId is required")
}

func (s *BookingSettingServiceTestSuite) TestCreate_MissingRequiredFieldTicketPrice() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	request := model.BookingSettingCreateRequest{
		ProgramID: &programID,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "ticketPrice is required")
}

func (s *BookingSettingServiceTestSuite) TestCreate_InvalidTicketPrice() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(-100)
	request := model.BookingSettingCreateRequest{
		ProgramID:   &programID,
		TicketPrice: &ticketPrice,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "ticketPrice should be greater than 0")
}

func (s *BookingSettingServiceTestSuite) TestCreate_MissingRequiredFieldMaxTicketPerTransaction() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	request := model.BookingSettingCreateRequest{
		ProgramID:   &programID,
		TicketPrice: &ticketPrice,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "maxTicketsPerTransaction is required")
}

func (s *BookingSettingServiceTestSuite) TestCreate_MissingRequiredFieldOpenBookingTime() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	maxTicketsPerTransaction := 5
	request := model.BookingSettingCreateRequest{
		ProgramID:                &programID,
		TicketPrice:              &ticketPrice,
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "openBookingTime is required")
}

func (s *BookingSettingServiceTestSuite) TestCreate_MissingRequiredFieldCloseBookingTime() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	maxTicketsPerTransaction := 5
	currentTime := s.mockClock.Now()
	openBookingTime := currentTime.Add(24 * time.Hour)
	request := model.BookingSettingCreateRequest{
		ProgramID:                &programID,
		TicketPrice:              &ticketPrice,
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
		OpenBookingTime:          &openBookingTime,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "closeBookingTime is required")
}

func (s *BookingSettingServiceTestSuite) TestCreate_CloseBookingTimeLessThanCurrentDate() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	maxTicketsPerTransaction := 5
	currentTime := s.mockClock.Now()
	openBookingTime := currentTime.Add(24 * time.Hour)
	closeBookingTime := currentTime.Add(-48 * time.Hour)
	request := model.BookingSettingCreateRequest{
		ProgramID:                &programID,
		TicketPrice:              &ticketPrice,
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
		OpenBookingTime:          &openBookingTime,
		CloseBookingTime:         &closeBookingTime,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "closeBookingTime less than current date")
}

func (s *BookingSettingServiceTestSuite) TestCreate_MissingRequiredFieldBookingSlotDates() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	maxTicketsPerTransaction := 5
	currentTime := s.mockClock.Now()
	openBookingTime := currentTime.Add(24 * time.Hour)
	closeBookingTime := currentTime.Add(48 * time.Hour)
	request := model.BookingSettingCreateRequest{
		ProgramID:                &programID,
		TicketPrice:              &ticketPrice,
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
		OpenBookingTime:          &openBookingTime,
		CloseBookingTime:         &closeBookingTime,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "bookingSlotDates is required")
}

func (s *BookingSettingServiceTestSuite) TestCreate_DatabaseErrorFindingProgram() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	maxTicketsPerTransaction := 5
	currentTime := s.mockClock.Now()
	openBookingTime := currentTime.Add(24 * time.Hour)
	closeBookingTime := currentTime.Add(48 * time.Hour)
	slotDate := currentTime.Add(36 * time.Hour)
	maxTicketsPerSlotTime := 10
	beginSlotTime := slotDate.Add(9 * time.Hour)
	endSlotTime := slotDate.Add(10 * time.Hour)

	request := model.BookingSettingCreateRequest{
		ProgramID:                &programID,
		TicketPrice:              &ticketPrice,
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
		OpenBookingTime:          &openBookingTime,
		CloseBookingTime:         &closeBookingTime,
		BookingSlotDates: &[]model.BookingSettingSlotDateCreateRequest{
			{
				SlotDate: &slotDate,
				BookingSlotTimes: &[]model.BookingSettingSlotTimeCreateRequest{
					{
						BeginSlotTime:         &beginSlotTime,
						EndSlotTime:           &endSlotTime,
						MaxTicketsPerSlotTime: &maxTicketsPerSlotTime,
					},
				},
			},
		},
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(programEntity.Program{}, errors.New("database error"))

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "program")
}

func (s *BookingSettingServiceTestSuite) TestCreate_ProgramNotFound() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	maxTicketsPerTransaction := 5
	currentTime := s.mockClock.Now()
	openBookingTime := currentTime.Add(24 * time.Hour)
	closeBookingTime := currentTime.Add(48 * time.Hour)
	slotDate := currentTime.Add(36 * time.Hour)
	maxTicketsPerSlotTime := 10
	beginSlotTime := slotDate.Add(9 * time.Hour)
	endSlotTime := slotDate.Add(10 * time.Hour)

	request := model.BookingSettingCreateRequest{
		ProgramID:                &programID,
		TicketPrice:              &ticketPrice,
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
		OpenBookingTime:          &openBookingTime,
		CloseBookingTime:         &closeBookingTime,
		BookingSlotDates: &[]model.BookingSettingSlotDateCreateRequest{
			{
				SlotDate: &slotDate,
				BookingSlotTimes: &[]model.BookingSettingSlotTimeCreateRequest{
					{
						BeginSlotTime:         &beginSlotTime,
						EndSlotTime:           &endSlotTime,
						MaxTicketsPerSlotTime: &maxTicketsPerSlotTime,
					},
				},
			},
		},
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(programEntity.Program{}, gorm.ErrRecordNotFound)

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusNotFound, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "not found")
}

func (s *BookingSettingServiceTestSuite) TestCreate_DuplicateProgramID() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	maxTicketsPerTransaction := 5
	currentTime := s.mockClock.Now()
	openBookingTime := currentTime.Add(24 * time.Hour)
	closeBookingTime := currentTime.Add(48 * time.Hour)
	slotDate := currentTime.Add(36 * time.Hour)
	maxTicketsPerSlotTime := 10
	beginSlotTime := slotDate.Add(9 * time.Hour)
	endSlotTime := slotDate.Add(10 * time.Hour)

	request := model.BookingSettingCreateRequest{
		ProgramID:                &programID,
		TicketPrice:              &ticketPrice,
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
		OpenBookingTime:          &openBookingTime,
		CloseBookingTime:         &closeBookingTime,
		BookingSlotDates: &[]model.BookingSettingSlotDateCreateRequest{
			{
				SlotDate: &slotDate,
				BookingSlotTimes: &[]model.BookingSettingSlotTimeCreateRequest{
					{
						BeginSlotTime:         &beginSlotTime,
						EndSlotTime:           &endSlotTime,
						MaxTicketsPerSlotTime: &maxTicketsPerSlotTime,
					},
				},
			},
		},
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(programEntity.Program{ID: programID}, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(entity.BookingSetting{}, nil)

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "already exists")
}

func (s *BookingSettingServiceTestSuite) TestCreate_DatabaseError() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	maxTicketsPerTransaction := 5
	currentTime := s.mockClock.Now()
	openBookingTime := currentTime.Add(24 * time.Hour)
	closeBookingTime := currentTime.Add(48 * time.Hour)

	request := model.BookingSettingCreateRequest{
		ProgramID:                &programID,
		TicketPrice:              &ticketPrice,
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
		OpenBookingTime:          &openBookingTime,
		CloseBookingTime:         &closeBookingTime,
		BookingSlotDates:         &[]model.BookingSettingSlotDateCreateRequest{},
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(programEntity.Program{ID: programID}, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(entity.BookingSetting{}, gorm.ErrRecordNotFound)

	s.mockBookingSettingRepo.EXPECT().
		Insert(mock.Anything, mock.AnythingOfType("entity.BookingSetting")).
		Return(entity.BookingSetting{}, errors.New("database error"))

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(response)
	s.Contains(err.Error(), "something went wrong")
}

func (s *BookingSettingServiceTestSuite) TestCreate_Success() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	maxTicketsPerTransaction := 5
	currentTime := s.mockClock.Now()
	openBookingTime := currentTime.Add(24 * time.Hour)
	closeBookingTime := currentTime.Add(48 * time.Hour)
	slotDate := currentTime.Add(36 * time.Hour)
	maxTicketsPerSlotTime := 10
	beginSlotTime := slotDate.Add(9 * time.Hour)
	endSlotTime := slotDate.Add(10 * time.Hour)

	request := model.BookingSettingCreateRequest{
		ProgramID:                &programID,
		TicketPrice:              &ticketPrice,
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
		OpenBookingTime:          &openBookingTime,
		CloseBookingTime:         &closeBookingTime,
		BookingSlotDates: &[]model.BookingSettingSlotDateCreateRequest{
			{
				SlotDate: &slotDate,
				BookingSlotTimes: &[]model.BookingSettingSlotTimeCreateRequest{
					{
						BeginSlotTime:         &beginSlotTime,
						EndSlotTime:           &endSlotTime,
						MaxTicketsPerSlotTime: &maxTicketsPerSlotTime,
					},
				},
			},
		},
	}

	expectedBookingSetting := entity.BookingSetting{
		ID:                       "setting1",
		ProgramID:                programID,
		TicketPrice:              ticketPrice,
		MaxTicketsPerTransaction: maxTicketsPerTransaction,
		OpenBookingTime:          openBookingTime,
		CloseBookingTime:         closeBookingTime,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(programEntity.Program{ID: programID}, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(entity.BookingSetting{}, gorm.ErrRecordNotFound)

	s.mockBookingSettingRepo.EXPECT().
		Insert(mock.Anything, mock.AnythingOfType("entity.BookingSetting")).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		BulkUpsert(mock.Anything, mock.AnythingOfType("[]entity.BookingSlotDate")).
		Return([]entity.BookingSlotDate{{ID: "date1"}}, nil)

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal("setting1", response["id"])
}

func (s *BookingSettingServiceTestSuite) TestCreate_SuccessWithoutBookingSlotTimes() {
	// Arrange
	locale := "en"
	tz := "Asia/Bangkok"
	programID := uint(1)
	ticketPrice := float64(100)
	maxTicketsPerTransaction := 5
	currentTime := s.mockClock.Now()
	openBookingTime := currentTime.Add(24 * time.Hour)
	closeBookingTime := currentTime.Add(48 * time.Hour)
	slotDate := currentTime.Add(36 * time.Hour)

	request := model.BookingSettingCreateRequest{
		ProgramID:                &programID,
		TicketPrice:              &ticketPrice,
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
		OpenBookingTime:          &openBookingTime,
		CloseBookingTime:         &closeBookingTime,
		BookingSlotDates: &[]model.BookingSettingSlotDateCreateRequest{
			{
				SlotDate: &slotDate,
			},
		},
	}

	expectedBookingSetting := entity.BookingSetting{
		ID:                       "setting1",
		ProgramID:                programID,
		TicketPrice:              ticketPrice,
		MaxTicketsPerTransaction: maxTicketsPerTransaction,
		OpenBookingTime:          openBookingTime,
		CloseBookingTime:         closeBookingTime,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockProgramRepo.EXPECT().
		FindOneByID(mock.Anything, programID, mock.AnythingOfType("string")).
		Return(programEntity.Program{ID: programID}, nil)

	s.mockBookingSettingRepo.EXPECT().
		FindByProgramID(mock.Anything, programID).
		Return(entity.BookingSetting{}, gorm.ErrRecordNotFound)

	s.mockBookingSettingRepo.EXPECT().
		Insert(mock.Anything, mock.AnythingOfType("entity.BookingSetting")).
		Return(expectedBookingSetting, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		BulkUpsert(mock.Anything, mock.AnythingOfType("[]entity.BookingSlotDate")).
		Return([]entity.BookingSlotDate{{ID: "date1"}}, nil)

	// Act
	response, statusCode, err := s.service.Create(s.ctx, request, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.NotEmpty(response)
	s.Equal("setting1", response["id"])
}

func (s *BookingSettingServiceTestSuite) TestPatch_InvalidLocale() {
	// Arrange
	id := "test-id"
	locale := "invalid"
	tz := "Asia/Bangkok"
	request := model.BookingSettingPatchRequest{}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "invalid locale")
}

func (s *BookingSettingServiceTestSuite) TestPatch_InvalidTimezone() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Invalid/Timezone"
	request := model.BookingSettingPatchRequest{}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), constants.TimeZone)
}

func (s *BookingSettingServiceTestSuite) TestPatch_BookingSettingNotFound() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	request := model.BookingSettingPatchRequest{}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(entity.BookingSetting{}, gorm.ErrRecordNotFound)

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusNotFound, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "booking setting not found")
}

func (s *BookingSettingServiceTestSuite) TestPatch_BookingSettingFindError() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	request := model.BookingSettingPatchRequest{}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(entity.BookingSetting{}, errors.New("database error"))

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "can't find booking setting content")
}

func (s *BookingSettingServiceTestSuite) TestPatch_TicketPriceWithOpenedSale() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()
	ticketPrice := float64(200)

	// OpenBookingTime is in the past
	openBookingTime := currentTime.Add(-24 * time.Hour)

	bookingSetting := entity.BookingSetting{
		ID:              id,
		TicketPrice:     100,
		OpenBookingTime: openBookingTime,
	}

	request := model.BookingSettingPatchRequest{
		TicketPrice: &ticketPrice,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "ticketPrice cannot be edited because the sale is already opened")
}

func (s *BookingSettingServiceTestSuite) TestPatch_NegativeTicketPrice() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()
	ticketPrice := float64(-50)

	// OpenBookingTime is in the future
	openBookingTime := currentTime.Add(24 * time.Hour)

	bookingSetting := entity.BookingSetting{
		ID:              id,
		TicketPrice:     100,
		OpenBookingTime: openBookingTime,
	}

	request := model.BookingSettingPatchRequest{
		TicketPrice: &ticketPrice,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "ticketPrice should be greater than 0")
}

func (s *BookingSettingServiceTestSuite) TestPatch_TicketPriceWithExistingBookings() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()
	ticketPrice := float64(200)

	// OpenBookingTime is in the future
	openBookingTime := currentTime.Add(24 * time.Hour)

	bookingSetting := entity.BookingSetting{
		ID:              id,
		TicketPrice:     100,
		OpenBookingTime: openBookingTime,
	}

	request := model.BookingSettingPatchRequest{
		TicketPrice: &ticketPrice,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingTicketRepo.EXPECT().
		FindAllByBookingSettingID(mock.Anything, id).
		Return([]entity.BookingTicket{{ID: "ticket-1"}}, nil)

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "ticketPrice cannot be edited because the sale is already booked")
}

func (s *BookingSettingServiceTestSuite) TestPatch_BookingTicketFindError() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()
	ticketPrice := float64(200)

	// OpenBookingTime is in the future
	openBookingTime := currentTime.Add(24 * time.Hour)

	bookingSetting := entity.BookingSetting{
		ID:              id,
		TicketPrice:     100,
		OpenBookingTime: openBookingTime,
	}

	request := model.BookingSettingPatchRequest{
		TicketPrice: &ticketPrice,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingTicketRepo.EXPECT().
		FindAllByBookingSettingID(mock.Anything, id).
		Return(nil, errors.New("database error"))

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "can't find booking ticket contents")
}

func (s *BookingSettingServiceTestSuite) TestPatch_SuccessfulUpdateWithSlotDatesAndTimes() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()
	loc, _ := time.LoadLocation(tz)

	// Create test data
	slotDate1 := currentTime.Add(24 * time.Hour).In(loc)
	slotDate2 := currentTime.Add(48 * time.Hour).In(loc)
	maxTickets := 10

	// Existing booking setting
	bookingSetting := entity.BookingSetting{
		ID:              id,
		ProgramID:       1,
		OpenBookingTime: currentTime.Add(-1 * time.Hour),
	}

	// Create request with new slot dates and times
	request := model.BookingSettingPatchRequest{
		BookingSlotDates: &[]model.BookingSettingSlotDatePatchRequest{
			{
				SlotDate: &slotDate1,
				BookingSlotTimes: &[]model.BookingSettingSlotTimePatchRequest{
					{
						BeginSlotTime:         &slotDate1,
						EndSlotTime:           &[]time.Time{slotDate1.Add(2 * time.Hour)}[0],
						MaxTicketsPerSlotTime: &maxTickets,
					},
				},
			},
			{
				SlotDate: &slotDate2,
				BookingSlotTimes: &[]model.BookingSettingSlotTimePatchRequest{
					{
						BeginSlotTime:         &slotDate2,
						EndSlotTime:           &[]time.Time{slotDate2.Add(2 * time.Hour)}[0],
						MaxTicketsPerSlotTime: &maxTickets,
					},
				},
			},
		},
	}

	// Mock expectations
	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingSettingRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, mock.Anything, mock.Anything).
		Return(nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindAllByBookingSettingIDWithBookingSlotTimes(mock.Anything, id).
		Return([]entity.BookingSlotDate{}, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		BulkUpsert(mock.Anything, mock.MatchedBy(func(dates []entity.BookingSlotDate) bool {
			return len(dates) == 2
		})).
		Return([]entity.BookingSlotDate{
			{ID: "date-1", BookingSlotTimes: []entity.BookingSlotTime{{ID: "time-1"}}},
			{ID: "date-2", BookingSlotTimes: []entity.BookingSlotTime{{ID: "time-2"}}},
		}, nil)

	s.mockBookingSlotTimeRepo.EXPECT().
		BulkUpsert(mock.Anything, mock.MatchedBy(func(times []entity.BookingSlotTime) bool {
			return len(times) == 2
		})).
		Return([]entity.BookingSlotTime{
			{ID: "time-1"},
			{ID: "time-2"},
		}, nil)

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.Equal(map[string]any{"id": id}, result)
}

func (s *BookingSettingServiceTestSuite) TestPatch_SuccessfulUpdateWithSlotDates() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()
	loc, _ := time.LoadLocation(tz)

	// Create test data
	slotDate1 := currentTime.Add(24 * time.Hour).In(loc)
	slotDate2 := currentTime.Add(48 * time.Hour).In(loc)
	slotDate3 := currentTime.Add(72 * time.Hour).In(loc)

	// Existing booking setting
	bookingSetting := entity.BookingSetting{
		ID:              id,
		ProgramID:       1,
		OpenBookingTime: currentTime.Add(-1 * time.Hour),
	}

	// Create request with new slot dates
	request := model.BookingSettingPatchRequest{
		BookingSlotDates: &[]model.BookingSettingSlotDatePatchRequest{
			{
				SlotDate: &slotDate1,
			},
			{
				SlotDate: &slotDate2,
			},
			{
				ID:       &[]string{"date-3"}[0],
				SlotDate: &slotDate3,
			},
		},
	}

	// Mock expectations
	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingSettingRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, mock.Anything, mock.Anything).
		Return(nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindAllByBookingSettingIDWithBookingSlotTimes(mock.Anything, id).
		Return([]entity.BookingSlotDate{
			{ID: "date-4"},
		}, nil)

	s.mockBookingTxRepo.EXPECT().
		CountByBookingSlotDateIDs(mock.Anything, mock.Anything).
		Return(0, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		BulkDelete(mock.Anything, mock.MatchedBy(func(dates []entity.BookingSlotDate) bool {
			return len(dates) == 1
		})).
		Return([]entity.BookingSlotDate{
			{ID: "date-4"},
		}, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		BulkUpsert(mock.Anything, mock.MatchedBy(func(dates []entity.BookingSlotDate) bool {
			return len(dates) == 1
		})).
		Return([]entity.BookingSlotDate{
			{ID: "date-3"},
		}, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		BulkUpsert(mock.Anything, mock.MatchedBy(func(dates []entity.BookingSlotDate) bool {
			return len(dates) == 2
		})).
		Return([]entity.BookingSlotDate{
			{
				BookingSettingID: "test-id",
			},
			{
				BookingSettingID: "test-id",
			},
		}, nil)

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.Equal(map[string]any{"id": id}, result)
}

func (s *BookingSettingServiceTestSuite) TestPatch_SuccessfulUpdateWithoutSlotDates() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()

	// OpenBookingTime is in the future
	openBookingTime := currentTime.Add(24 * time.Hour)
	closeBookingTime := currentTime.Add(48 * time.Hour)
	maxTicketsPerTransaction := 10

	bookingSetting := entity.BookingSetting{
		ID:                       id,
		TicketPrice:              100,
		OpenBookingTime:          openBookingTime,
		CloseBookingTime:         currentTime.Add(36 * time.Hour),
		MaxTicketsPerTransaction: 5,
	}

	request := model.BookingSettingPatchRequest{
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
		CloseBookingTime:         &closeBookingTime,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingSettingRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, mock.Anything, mock.Anything).
		Return(nil)

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.Equal(map[string]any{"id": id}, result)
}

func (s *BookingSettingServiceTestSuite) TestPatch_UpdateConditionText() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()

	conditionTextEN := "New English condition"
	conditionTextTH := "New Thai condition"
	conditionTextCN := "New Chinese condition"

	bookingSetting := entity.BookingSetting{
		ID:              id,
		OpenBookingTime: currentTime.Add(24 * time.Hour),
	}

	request := model.BookingSettingPatchRequest{
		ConditionTextEN: &conditionTextEN,
		ConditionTextTH: &conditionTextTH,
		ConditionTextCN: &conditionTextCN,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingSettingRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, mock.Anything, mock.Anything).
		Return(nil)

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.Equal(map[string]any{"id": id}, result)
}

func (s *BookingSettingServiceTestSuite) TestPatch_UpdateBookingSettingError() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()
	maxTicketsPerTransaction := 10

	bookingSetting := entity.BookingSetting{
		ID:                       id,
		OpenBookingTime:          currentTime.Add(24 * time.Hour),
		MaxTicketsPerTransaction: 5,
	}

	request := model.BookingSettingPatchRequest{
		MaxTicketsPerTransaction: &maxTicketsPerTransaction,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingSettingRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, mock.Anything, mock.Anything).
		Return(errors.New("database error"))

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "can't update booking setting content")
}

func (s *BookingSettingServiceTestSuite) TestPatch_UpdateWithEmptyRequest() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"

	bookingSetting := entity.BookingSetting{
		ID: id,
	}

	request := model.BookingSettingPatchRequest{}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingSettingRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, mock.Anything, mock.Anything).
		Return(nil)

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, statusCode)
	s.Equal(map[string]any{"id": id}, result)
}

func (s *BookingSettingServiceTestSuite) TestPatch_CloseBookingTimeBeforeCurrentTime() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()

	// CloseBookingTime is in the past
	closeBookingTime := currentTime.Add(-24 * time.Hour)

	bookingSetting := entity.BookingSetting{
		ID:               id,
		OpenBookingTime:  currentTime.Add(-48 * time.Hour),
		CloseBookingTime: currentTime.Add(48 * time.Hour),
	}

	request := model.BookingSettingPatchRequest{
		CloseBookingTime: &closeBookingTime,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusBadRequest, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "closeBookingTime less than current date")
}

func (s *BookingSettingServiceTestSuite) TestPatch_UpdateSlotDatesError() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()
	loc, _ := time.LoadLocation(tz)

	slotDate := currentTime.Add(24 * time.Hour).In(loc)
	maxTickets := 10

	bookingSetting := entity.BookingSetting{
		ID:              id,
		OpenBookingTime: currentTime.Add(1 * time.Hour),
	}

	request := model.BookingSettingPatchRequest{
		BookingSlotDates: &[]model.BookingSettingSlotDatePatchRequest{
			{
				SlotDate: &slotDate,
				BookingSlotTimes: &[]model.BookingSettingSlotTimePatchRequest{
					{
						BeginSlotTime:         &slotDate,
						EndSlotTime:           &[]time.Time{slotDate.Add(2 * time.Hour)}[0],
						MaxTicketsPerSlotTime: &maxTickets,
					},
				},
			},
		},
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingSettingRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, mock.Anything, mock.Anything).
		Return(nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindAllByBookingSettingIDWithBookingSlotTimes(mock.Anything, id).
		Return(nil, errors.New("database error"))

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "can't find booking slot date contents")
}

func (s *BookingSettingServiceTestSuite) TestPatch_BulkUpsertSlotDatesError() {
	// Arrange
	id := "test-id"
	locale := "en"
	tz := "Asia/Bangkok"
	currentTime := s.mockClock.Now()
	loc, _ := time.LoadLocation(tz)

	slotDate := currentTime.Add(24 * time.Hour).In(loc)
	maxTickets := 10

	bookingSetting := entity.BookingSetting{
		ID:              id,
		OpenBookingTime: currentTime.Add(1 * time.Hour),
	}

	request := model.BookingSettingPatchRequest{
		BookingSlotDates: &[]model.BookingSettingSlotDatePatchRequest{
			{
				SlotDate: &slotDate,
				BookingSlotTimes: &[]model.BookingSettingSlotTimePatchRequest{
					{
						BeginSlotTime:         &slotDate,
						EndSlotTime:           &[]time.Time{slotDate.Add(2 * time.Hour)}[0],
						MaxTicketsPerSlotTime: &maxTickets,
					},
				},
			},
		},
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockBookingSettingRepo.EXPECT().
		FindByIDWithBookingSlotDatesAndBookingSlotTimes(mock.Anything, id).
		Return(bookingSetting, nil)

	s.mockBookingSettingRepo.EXPECT().
		UpdateByIDWithSelectedFields(mock.Anything, id, mock.Anything, mock.Anything).
		Return(nil)

	s.mockBookingSlotDateRepo.EXPECT().
		FindAllByBookingSettingIDWithBookingSlotTimes(mock.Anything, id).
		Return([]entity.BookingSlotDate{}, nil)

	s.mockBookingSlotDateRepo.EXPECT().
		BulkUpsert(mock.Anything, mock.MatchedBy(func(dates []entity.BookingSlotDate) bool {
			return len(dates) == 1
		})).
		Return(nil, errors.New("database error"))

	// Act
	result, statusCode, err := s.service.Patch(s.ctx, id, request, locale, tz)

	// Assert
	s.Error(err)
	s.Equal(http.StatusInternalServerError, statusCode)
	s.Empty(result)
	s.Contains(err.Error(), "can't insert booking slot date contents")
}

func TestBookingSettingServiceTestSuite(t *testing.T) {
	suite.Run(t, new(BookingSettingServiceTestSuite))
}
