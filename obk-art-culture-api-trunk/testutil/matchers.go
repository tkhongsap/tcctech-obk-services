package testutil

import (
	"example.com/art-culture-api/domain/booking/session"
	"github.com/stretchr/testify/mock"
)

// matchedByTransactFunc is a custom matcher for TransactFunc
func MatchedByTransactFunc() interface{} {
	return mock.MatchedBy(func(f session.TransactFunc) bool {
		return f != nil
	})
}
