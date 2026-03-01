// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/handler"
	authHandler "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/handler/auth"
	userHandler "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/handler/user"
	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/lib/config"

	jwtService "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/service/jwt"

	authRepo "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/repository/auth"
	userRepo "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/repository/user"

	authService "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/service/auth"
	userService "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/service/user"
)

func main() {
	cfg := config.CmdParse()

	appConfig := config.MustReadAppConfig(cfg)

	jwtS := jwtService.NewJwtService(appConfig.Server.JwtSecret)

	authR, err := authRepo.NewAuthRepo(appConfig.Database.DSN(), jwtS)
	if err != nil {
		fmt.Printf("Failed to create auth repo: %v\n", err)
		return
	}
	userR, err := userRepo.NewUserRepo(appConfig.Database.DSN())
	if err != nil {
		fmt.Printf("Failed to create storage: %v\n", err)
		return
	}

	userS := userService.NewUserService(userR, authR)
	authS := authService.NewAuthService(authR)

	authH := authHandler.NewAuthHandler(authS)
	userH := userHandler.NewUserHandler(userS, jwtS)

	addr := net.JoinHostPort(appConfig.Server.Host, strconv.Itoa(appConfig.Server.Port))
	if addr == "" {
		addr = ":8080"
	}

	mux := http.NewServeMux()
	handler.RegisterRoutes(mux, userH, authH)
	handler.RegisterOgenRoutes(mux, appConfig.Database.DSN(), userR)

	srv := &http.Server{
		Addr:    addr,
		Handler: mux,
	}

	go func() {
		log.Printf("starting server on %s", addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGHUP, syscall.SIGINT, syscall.SIGQUIT, syscall.SIGTERM)
	sig := <-quit
	log.Printf("got signal \"%s\" shutting down server...", sig)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("server forced to shutdown: %v", err)
	}
	log.Println("server stopped")
}
