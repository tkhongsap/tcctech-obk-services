package session

import (
	"context"
	"database/sql"
)

// Session aims at facilitating business transactions while abstracting the underlying mechanism,
// be it a database transaction or another transaction mechanism. This allows services to execute
// multiple business use-cases and easily rollback changes in case of error, without creating a
// dependency to the database layer.
//
// Sessions should be constituted of a root session created with a "New"-type constructor and allow
// the creation of child sessions with `Begin()` and `Transaction()`. Nested transactions should be supported
// as well.

// TransactFunc is the type of function passed to Transact
type TransactFunc func(context.Context) error

type Session interface {
	// Transact executes a transaction. If the given function returns an error, the transaction
	// is rolled back. Otherwise it is automatically committed before `Transact()` returns.
	// The underlying transaction mechanism is injected into the context as a value.
	Transact(ctx context.Context, f TransactFunc, opts ...*sql.TxOptions) error
}
