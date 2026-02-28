// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package user

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/handler/auth/dto"
)

type AuthService interface {
	Login(ctx context.Context, login, password string) (access, refresh string, err error)
	Refresh(ctx context.Context, refreshToken string) (newAccess, newRefresh string, err error)
	Logout(ctx context.Context, refreshToken string) error
}

type AuthHandler struct {
	authService AuthService
}

func NewAuthHandler(authService AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (u *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req dto.AuthLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "failed to decode expected JSON in body: "+err.Error(), http.StatusBadRequest)
		return
	}

	access, refresh, err := u.authService.Login(r.Context(), req.Login, req.Password)
	if err != nil {
		http.Error(w, "failed to login: "+err.Error(), http.StatusUnauthorized)
		return
	}

	setRefreshCookie(w, refresh, time.Now().Add(65*24*time.Hour-time.Minute))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := dto.JwtTokenResponse{
		AccessToken:  access,
		RefreshToken: refresh,
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "failed to encode response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}
func (u *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refreshToken")
	if err != nil {
		http.Error(w, "refresh token is required in cookie refreshToken", http.StatusUnauthorized)
		return
	}
	refreshToken := cookie.Value
	if refreshToken == "" {
		http.Error(w, "refresh token is required in cookie refreshToken", http.StatusUnauthorized)
		return
	}

	newAccess, newRefresh, err := u.authService.Refresh(r.Context(), refreshToken)
	if err != nil {
		http.Error(w, "failed to refresh token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	setRefreshCookie(w, newRefresh, time.Now().Add(65*24*time.Hour-time.Minute))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := dto.JwtTokenResponse{
		AccessToken:  newAccess,
		RefreshToken: newRefresh,
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "failed to encode response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}
func (u *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refreshToken")
	if err != nil {
		http.Error(w, "refresh token is required in cookie refreshToken", http.StatusUnauthorized)
		return
	}
	refreshToken := cookie.Value
	if refreshToken == "" {
		http.Error(w, "refresh token is required in cookie refreshToken", http.StatusUnauthorized)
		return
	}

	if err := u.authService.Logout(r.Context(), refreshToken); err != nil {
		http.Error(w, "failed to logout: "+err.Error(), http.StatusInternalServerError)
		return
	}

	setRefreshCookie(w, "", time.Unix(0, 0))
	w.WriteHeader(http.StatusOK)
}
func setRefreshCookie(w http.ResponseWriter, refreshToken string, expires time.Time) {
	cookie := &http.Cookie{
		Name:     "refreshToken",
		Value:    refreshToken,
		Expires:  expires,
		HttpOnly: true,
		Path:     "/api/auth", // FIXME: get from config
	}
	http.SetCookie(w, cookie)
}
