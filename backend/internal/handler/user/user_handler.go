// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package user

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/handler/user/dto"
	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/service/jwt"
	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/service/model"
)

type UserService interface {
	Get(ctx context.Context, userId int) (*model.User, error)
	Create(ctx context.Context, name, email, password string) (*model.User, error)
	Update(ctx context.Context, userId int, name, email string) (*model.User, error)
	Delete(ctx context.Context, userId int) error
}

type UserHandler struct {
	userService UserService
	jwtService  *jwt.JwtAuthorizator
}

func NewUserHandler(userService UserService, jwtService *jwt.JwtAuthorizator) *UserHandler {
	return &UserHandler{userService: userService, jwtService: jwtService}
}

func (u *UserHandler) Get(w http.ResponseWriter, r *http.Request) {
	userId := r.PathValue("userId")
	if userId == "" {
		http.Error(w, "userId is required in path /api/user/{userId}", http.StatusBadRequest)
		return
	}

	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		http.Error(w, "userId is not a valid integer", http.StatusBadRequest)
		return
	}

	user, err := u.userService.Get(r.Context(), userIdInt)
	if err != nil {
		http.Error(w, "failed to get user: "+userId+": "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := dto.UserCreateResponse{
		Id:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "failed to encode response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}
func (u *UserHandler) Me(w http.ResponseWriter, r *http.Request) {
	httpAuth := r.Header.Get("Authorization")
	if len(httpAuth) == 0 {
		http.Error(w, "no Authorization header", http.StatusUnauthorized)
		return
	}
	if !strings.HasPrefix(httpAuth, "Bearer ") {
		http.Error(w, "invalid Authorization header", http.StatusUnauthorized)
		return
	}
	tokenStr := strings.TrimSpace(strings.TrimPrefix(httpAuth, "Bearer "))
	jwtClaims, err := u.jwtService.ValidateToken(tokenStr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	userId := jwtClaims.UserID
	user, err := u.userService.Get(r.Context(), int(userId))
	if err != nil {
		userIdStr := strconv.FormatUint(uint64(userId), 10)
		http.Error(w, "failed to get user: "+userIdStr+": "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := dto.UserCreateResponse{
		Id:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "failed to encode response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}
func (u *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req dto.UserCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "failed to decode expected JSON in body: "+err.Error(), http.StatusBadRequest)
		return
	}

	user, err := u.userService.Create(r.Context(), req.Name, req.Email, req.Password)
	if err != nil {
		http.Error(w, "failed to create user: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	resp := dto.UserCreateResponse{
		Id:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "failed to encode response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}
func (u *UserHandler) Update(w http.ResponseWriter, r *http.Request) {
	var req dto.UserUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "failed to decode expected JSON in body: "+err.Error(), http.StatusBadRequest)
		return
	}

	userId := r.PathValue("userId")
	if userId == "" {
		http.Error(w, "userId is required in path /api/user/{userId}", http.StatusBadRequest)
		return
	}
	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		http.Error(w, "userId is not a valid integer", http.StatusBadRequest)
		return
	}

	user, err := u.userService.Update(r.Context(), userIdInt, req.Name, req.Email)
	if err != nil {
		http.Error(w, "failed to update user: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := dto.UserCreateResponse{
		Id:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "failed to encode response: "+err.Error(), http.StatusInternalServerError)
		return
	}
}
func (u *UserHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userId := r.PathValue("userId")
	if userId == "" {
		http.Error(w, "userId is required in path", http.StatusBadRequest)
		return
	}

	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		http.Error(w, "userId is not a valid integer", http.StatusBadRequest)
		return
	}

	err = u.userService.Delete(r.Context(), userIdInt)
	if err != nil {
		http.Error(w, "failed to delete user: "+userId+": "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}
