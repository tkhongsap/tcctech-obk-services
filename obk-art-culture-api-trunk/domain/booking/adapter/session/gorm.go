package session

import (
	"context"
	"database/sql"

	"example.com/art-culture-api/domain/booking/session"
	"gorm.io/gorm"
)

// Gorm session implementation.
type Gorm struct {
	db *gorm.DB
}

// New create a new root session for Gorm.
func New(db *gorm.DB) Gorm {
	return Gorm{
		db: db,
	}
}

// dbKey the key used to store the database in the context.
type dbKey struct{}

// Transact executes a transaction. If the given function returns an error, the transaction
// is rolled back. Otherwise it is automatically committed before `Transact()` returns.
//
// The Gorm DB associated with this session is injected into the context as a value so `session.DB()`
// can be used to retrieve it.
func (s Gorm) Transact(ctx context.Context, f session.TransactFunc, opts ...*sql.TxOptions) error {
	return DB(ctx, s.db).WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		c := context.WithValue(ctx, dbKey{}, tx)
		return f(c)
	}, opts...)
}

// DB returns the Gorm instance stored in the given context. Returns the given fallback
// if no Gorm DB could be found in the context.
func DB(ctx context.Context, fallback *gorm.DB) *gorm.DB {
	db := ctx.Value(dbKey{})
	if db == nil {
		return fallback
	}
	return db.(*gorm.DB)
}
