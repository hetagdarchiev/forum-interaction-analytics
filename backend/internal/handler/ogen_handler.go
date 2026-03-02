// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package handler

import (
	"context"
	"fmt"
	"net/http"

	forumApi "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/handler/generated"
	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/handler/threads"

	threadsHandler "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/handler/threads"
	postsRepo "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/repository/posts"
	threadsRepo "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/repository/threads"
	userRepo "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/repository/user"
	threadsService "github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/service/threads"
)

// OgenHandler implements forumApi.Handler.
type OgenHandler struct {
	threadsHandler *threads.ThreadsHandler
	forumApi.UnimplementedHandler
}

func NewOgenHandler(threadsHandler *threads.ThreadsHandler) *OgenHandler {
	return &OgenHandler{
		threadsHandler: threadsHandler,
	}
}

type securityHandler struct {
}

func (h *securityHandler) HandleCookieAuth(
	ctx context.Context, operationName forumApi.OperationName, t forumApi.CookieAuth) (context.Context, error) {

	fmt.Printf("Cookie Auth with operation name %s and APIKey %s\n", operationName, t.APIKey)
	return ctx, nil
}
func (h *securityHandler) HandleJwtAuth(
	ctx context.Context, operationName forumApi.OperationName, t forumApi.JwtAuth) (context.Context, error) {

	fmt.Printf("JWT Auth with operation name %s and token %s\n", operationName, t.Token)
	return ctx, nil
}

func RegisterOgenRoutes(mux *http.ServeMux, dsn string, userR *userRepo.UserRepo) {
	postR, err := postsRepo.NewPostsRepo(dsn)
	if err != nil {
		panic(err)
	}
	threadR, err := threadsRepo.NewThreadsRepo(dsn)
	if err != nil {
		panic(err)
	}

	threadsS := threadsService.NewThreadsService(threadR, postR, userR)
	threadsH := threadsHandler.NewThreadsHandler(threadsS)
	ogenHandler := NewOgenHandler(threadsH)
	secHandler := &securityHandler{}
	srv, err := forumApi.NewServer(ogenHandler, secHandler)
	if err != nil {
		panic(err)
	}
	mux.Handle("/api/threads/", srv)
}

func (h *OgenHandler) ThreadAddPost(ctx context.Context, req *forumApi.ThreadCreatePostRequest, params forumApi.ThreadAddPostParams) (forumApi.ThreadAddPostRes, error) {
	return h.threadsHandler.ThreadAddPost(ctx, req, params)
}

func (h *OgenHandler) ThreadCreate(ctx context.Context, req *forumApi.ThreadCreateRequest) (forumApi.ThreadCreateRes, error) {
	return h.threadsHandler.ThreadCreate(ctx, req)
}

func (h *OgenHandler) ThreadGet(ctx context.Context, params forumApi.ThreadGetParams) (forumApi.ThreadGetRes, error) {
	return h.threadsHandler.ThreadGet(ctx, params)
}

func (h *OgenHandler) ThreadsList(ctx context.Context, params forumApi.ThreadsListParams) (forumApi.ThreadsListRes, error) {
	return h.threadsHandler.ThreadsList(ctx, params)
}
