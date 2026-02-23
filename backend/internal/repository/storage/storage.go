// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package storage

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Storage struct {
	dbpool *pgxpool.Pool
}

func New(dsn string) (*Storage, error) {
	dbpool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		return nil, fmt.Errorf("Unable to create connection pool: %v", err)
	}

	return &Storage{dbpool: dbpool}, nil
}

func (s *Storage) Close() {
	s.dbpool.Close()
}
