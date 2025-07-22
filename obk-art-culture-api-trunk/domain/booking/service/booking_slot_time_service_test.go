package service_test

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"testing"

	"example.com/art-culture-api/domain/booking/entity"
	"example.com/art-culture-api/domain/booking/errs"
	mockRepository "example.com/art-culture-api/domain/booking/mocks/repository"
	mockSession "example.com/art-culture-api/domain/booking/mocks/session"
	"example.com/art-culture-api/domain/booking/service"
	"example.com/art-culture-api/domain/booking/session"
	"example.com/art-culture-api/testutil"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type BookingSlotTimeServiceTestSuite struct {
	suite.Suite
	mockSession *mockSession.MockSession
	mockRepo    *mockRepository.MockBookingSlotTimeRepository
	service     service.BookingSlotTimeService
	ctx         context.Context
}

func (s *BookingSlotTimeServiceTestSuite) SetupTest() {
	s.mockSession = new(mockSession.MockSession)
	s.mockRepo = new(mockRepository.MockBookingSlotTimeRepository)
	s.service = service.NewBookingSlotTimeService(s.mockSession, s.mockRepo)
	s.ctx = context.Background()
}

func (s *BookingSlotTimeServiceTestSuite) TearDownTest() {
	s.mockSession.AssertExpectations(s.T())
	s.mockRepo.AssertExpectations(s.T())
}

func (s *BookingSlotTimeServiceTestSuite) TestPatchStatus_SuccessToAvailable() {
	// Arrange
	id := "test-id"
	status := entity.BookingSlotTimeAvailable
	slotTime := entity.BookingSlotTime{
		ID:                    id,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    5,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockRepo.EXPECT().FindByIDWithReadLock(mock.Anything, id).Return(slotTime, nil)
	s.mockRepo.EXPECT().Update(mock.Anything, mock.MatchedBy(func(bt entity.BookingSlotTime) bool {
		return bt.ID == id && bt.BookingSlotTimeStatus == status
	})).Return(nil)

	// Act
	res, code, err := s.service.PatchStatus(s.ctx, id, status)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(map[string]any{"id": id}, res)
}

func (s *BookingSlotTimeServiceTestSuite) TestPatchStatus_SuccessToSoldOut() {
	// Arrange
	id := "test-id"
	status := entity.BookingSlotTimeSoldOut
	slotTime := entity.BookingSlotTime{
		ID:                    id,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    5,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(nil).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockRepo.EXPECT().FindByIDWithReadLock(mock.Anything, id).Return(slotTime, nil)
	s.mockRepo.EXPECT().Update(mock.Anything, mock.MatchedBy(func(bt entity.BookingSlotTime) bool {
		return bt.ID == id && bt.BookingSlotTimeStatus == status
	})).Return(nil)

	// Act
	res, code, err := s.service.PatchStatus(s.ctx, id, status)

	// Assert
	s.NoError(err)
	s.Equal(http.StatusOK, code)
	s.Equal(map[string]any{"id": id}, res)
}

func (s *BookingSlotTimeServiceTestSuite) TestPatchStatus_ErrorRecordNotFound() {
	// Arrange
	id := "non-existent-id"
	status := entity.BookingSlotTimeAvailable

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(gorm.ErrRecordNotFound).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockRepo.EXPECT().FindByIDWithReadLock(mock.Anything, id).Return(entity.BookingSlotTime{}, gorm.ErrRecordNotFound)

	// Act
	res, code, err := s.service.PatchStatus(s.ctx, id, status)

	// Assert
	s.EqualError(err, errs.BuildCommonErrorNotFoundMsg("booking slot time").Error())
	s.Equal(http.StatusNotFound, code)
	s.Equal(map[string]any{}, res)
}

func (s *BookingSlotTimeServiceTestSuite) TestPatchStatus_ErrorDatabaseOnFind() {
	// Arrange
	id := "test-id"
	status := entity.BookingSlotTimeAvailable

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(errors.New("database error")).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockRepo.EXPECT().FindByIDWithReadLock(mock.Anything, id).Return(entity.BookingSlotTime{}, errors.New("database error"))

	// Act
	res, code, err := s.service.PatchStatus(s.ctx, id, status)

	// Assert
	s.EqualError(err, errs.BuildCommonErrorInternalServerMsg(", ", "can't find booking slot time content").Error())
	s.Equal(http.StatusInternalServerError, code)
	s.Equal(map[string]any{}, res)
}

func (s *BookingSlotTimeServiceTestSuite) TestPatchStatus_ErrorDatabaseOnUpdate() {
	// Arrange
	id := "test-id"
	status := entity.BookingSlotTimeAvailable
	slotTime := entity.BookingSlotTime{
		ID:                    id,
		BookingSlotTimeStatus: entity.BookingSlotTimeAvailable,
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    5,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(errors.New("database error")).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockRepo.EXPECT().FindByIDWithReadLock(mock.Anything, id).Return(slotTime, nil)
	s.mockRepo.EXPECT().Update(mock.Anything, mock.MatchedBy(func(bt entity.BookingSlotTime) bool {
		return bt.ID == id && bt.BookingSlotTimeStatus == status
	})).Return(errors.New("database error"))

	// Act
	res, code, err := s.service.PatchStatus(s.ctx, id, status)

	// Assert
	s.EqualError(err, errs.BuildCommonErrorInternalServerMsg(", ", "can't update booking slot time content").Error())
	s.Equal(http.StatusInternalServerError, code)
	s.Equal(map[string]any{}, res)
}

func (s *BookingSlotTimeServiceTestSuite) TestPatchStatus_ErrorInvalidStatusChangeToAvailable() {
	// Arrange
	id := "test-id"
	status := entity.BookingSlotTimeAvailable
	slotTime := entity.BookingSlotTime{
		ID:                    id,
		BookingSlotTimeStatus: entity.BookingSlotTimeSoldOut,
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    10,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(errors.New("invalid status")).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockRepo.EXPECT().FindByIDWithReadLock(mock.Anything, id).Return(slotTime, nil)

	// Act
	res, code, err := s.service.PatchStatus(s.ctx, id, status)

	// Assert
	s.EqualError(err, errs.BuildCommonErrorInvalidMsg("status").Error())
	s.Equal(http.StatusBadRequest, code)
	s.Equal(map[string]any{}, res)
}

func (s *BookingSlotTimeServiceTestSuite) TestPatchStatus_ErrorInvalidStatusChangeToSoldOut() {
	// Arrange
	id := "test-id"
	status := entity.BookingSlotTimeSoldOut
	slotTime := entity.BookingSlotTime{
		ID:                    id,
		BookingSlotTimeStatus: entity.BookingSlotTimeSoldOut,
		MaxTicketsPerSlotTime: 10,
		BookedTicketsCount:    10,
	}

	s.mockSession.EXPECT().Transact(mock.Anything, testutil.MatchedByTransactFunc(), mock.Anything).
		Return(errors.New("invalid status")).
		Run(func(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) {
			f(ctx)
		})

	s.mockRepo.EXPECT().FindByIDWithReadLock(mock.Anything, id).Return(slotTime, nil)

	// Act
	res, code, err := s.service.PatchStatus(s.ctx, id, status)

	// Assert
	s.EqualError(err, errs.BuildCommonErrorInvalidMsg("status").Error())
	s.Equal(http.StatusBadRequest, code)
	s.Equal(map[string]any{}, res)
}

func TestBookingSlotTimeServiceTestSuite(t *testing.T) {
	suite.Run(t, new(BookingSlotTimeServiceTestSuite))
}
