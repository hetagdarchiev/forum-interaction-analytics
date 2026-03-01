// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package handler

import (
	"fmt"
	"net/http"
)

type UserHandler interface {
	Get(w http.ResponseWriter, r *http.Request)
	Me(w http.ResponseWriter, r *http.Request)
	Create(w http.ResponseWriter, r *http.Request)
	Update(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
}
type AuthHandler interface {
	Login(w http.ResponseWriter, r *http.Request)
	Logout(w http.ResponseWriter, r *http.Request)
	Refresh(w http.ResponseWriter, r *http.Request)
}

func RegisterRoutes(mux *http.ServeMux, userH UserHandler, authH AuthHandler) {
	// Auth
	mux.HandleFunc("POST /api/auth/login", authH.Login)
	mux.HandleFunc("POST /api/auth/logout", authH.Logout)
	mux.HandleFunc("POST /api/auth/refresh", authH.Refresh)
	// User
	mux.HandleFunc("GET /api/user/{userId}", userH.Get)
	mux.HandleFunc("GET /api/user/me", userH.Me)
	mux.HandleFunc("POST /api/user", userH.Create)
	mux.HandleFunc("POST /api/user/{userId}", userH.Update)
	mux.HandleFunc("DELETE /api/user/{userId}", userH.Delete)

	mux.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		_, _ = w.Write([]byte(fmt.Sprintf("users repo: %+v\n", userH)))
	})
}
