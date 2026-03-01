// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package auth

import (
	"context"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/repository"
	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/service/jwt"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuthRepo struct {
	dbpool *pgxpool.Pool
	jwt    *jwt.JwtAuthorizator
}

func NewAuthRepo(dsn string, jwtAuthorizator *jwt.JwtAuthorizator) (*AuthRepo, error) {
	pool, err := repository.PgPool(dsn)
	if err != nil {
		return nil, err
	}

	return &AuthRepo{
		dbpool: pool,
		jwt:    jwtAuthorizator}, nil
}

func (r *AuthRepo) AuthCreate(ctx context.Context, user_id int64, login, password string) error {
	passwordHash := hashPassword(password)
	fmt.Printf("password hash %s\n", passwordHash)

	_, err := r.dbpool.Exec(ctx,
		`INSERT INTO auth_passwords (user_id, login, password_hash) VALUES ($1, $2, $3)`,
		user_id, login, passwordHash)

	return err
}
func (r *AuthRepo) AuthUpdatePassword(ctx context.Context, user_id int64, password string) error {
	passwordHash := hashPassword(password)
	fmt.Printf("password hash %s\n", passwordHash)

	_, err := r.dbpool.Exec(ctx,
		`UPDATE auth_passwords SET password_hash = $2 WHERE user_id = $1`, // TODO: upsert
		user_id, passwordHash)

	return err
}
func (r *AuthRepo) Login(ctx context.Context, login, password string) (access, refresh string, err error) {
	userId, err := r.checkLoginPassword(ctx, login, password)
	if err != nil {
		return "", "", err
	}

	accessToken, refreshToken, refreshUuid, err := r.createTokens(int64(userId))
	if err != nil {
		return "", "", err
	}

	fmt.Printf("access token: %s\n", accessToken)
	fmt.Printf("refresh token: %s\n", refreshToken)

	_, err = r.dbpool.Exec(ctx, `INSERT INTO sessions (jwt_id, user_id) VALUES ($1, $2)`, refreshUuid, userId)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func (r *AuthRepo) Logout(ctx context.Context, refreshToken string) error {
	uu, err := r.jwt.JwtID(refreshToken)
	if err != nil {
		return err
	}
	_, err = r.dbpool.Exec(ctx, `DELETE FROM sessions WHERE uuid = $1`, uu)

	return err
}

func (r *AuthRepo) Refresh(ctx context.Context, refreshToken string) (access, newRefresh string, err error) {
	claims, err := r.jwt.ValidateToken(refreshToken)
	if err != nil {
		return "", "", err
	}

	oldJwtId, err := r.jwt.JwtID(refreshToken)
	if err != nil {
		return "", "", err
	}

	userId := claims.UserID
	newAccess, newRefresh, refreshJwtId, err := r.createTokens(int64(userId))
	if err != nil {
		return "", "", err
	}

	cmdTag, err := r.dbpool.Exec(ctx,
		`UPDATE sessions SET jwt_id = $1 WHERE user_id = $2 AND jwt_id = $3`,
		refreshJwtId, userId, oldJwtId)
	if err != nil {
		return "", "", err
	}
	if cmdTag.RowsAffected() == 1 {
		return newAccess, newRefresh, nil
	}
	// session already refreshed, probubly by hacker, removing all sessions for user
	log.Printf("session not found or already refreshed, removing all sessions for user %d with old jwt id %s\n",
		userId, oldJwtId.String())

	_, err = r.dbpool.Exec(ctx, `DELETE FROM sessions WHERE user_id = $1`, userId)

	return "", "", fmt.Errorf("session not found or already refreshed")
}

func (r *AuthRepo) createTokens(userId int64) (access, refresh string, refreshUuid uuid.UUID, err error) {
	accessToken, err := r.jwt.CreateAccessToken(uint32(userId))
	if err != nil {
		return "", "", uuid.UUID{}, err
	}
	refreshUuid, refreshToken, err := r.jwt.CreateRefreshToken(uint32(userId))
	if err != nil {
		return "", "", uuid.UUID{}, err
	}
	return accessToken, refreshToken, refreshUuid, nil
}

func (r *AuthRepo) checkLoginPassword(ctx context.Context, login, password string) (int, error) {
	row := r.dbpool.QueryRow(ctx,
		`SELECT user_id, password_hash FROM auth_passwords WHERE login = $1`,
		login)

	var currentHash string
	var userId int64
	err := row.Scan(&userId, &currentHash)
	if err != nil {
		return 0, err
	}
	fmt.Printf("stored hash %s\n", currentHash)

	err = authenticateUser(currentHash, password)
	if err != nil {
		return 0, err
	}
	return int(userId), nil
}
