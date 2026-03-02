// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package posts

import (
	"context"
	"database/sql"

	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/repository"
	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/service/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostsRepo struct {
	dbpool *pgxpool.Pool
}

func NewPostsRepo(dsn string) (*PostsRepo, error) {
	pool, err := repository.PgPool(dsn)
	if err != nil {
		return nil, err
	}
	return &PostsRepo{dbpool: pool}, nil
}

// create post in thread
func (r *PostsRepo) Create(ctx context.Context, post model.PostCreate) (model.Post, error) {
	row := r.dbpool.QueryRow(ctx,
		`INSERT INTO posts (thread_id, user_id, content) VALUES ($1, $2, $3)
		RETURNING id, thread_id, user_id, content, created_at`,
		post.ThreadID, post.UserID, post.Content)

	var id int
	var threadID int
	var userID int
	var content string
	var createdAt sql.NullTime
	if err := row.Scan(&id, &threadID, &userID, &content, &createdAt); err != nil {
		return model.Post{}, err
	}
	return model.Post{
		ID:        id,
		ThreadID:  threadID,
		UserID:    userID,
		Content:   content,
		CreatedAt: createdAt.Time,
	}, nil
}

// list posts by thread id
func (r *PostsRepo) List(ctx context.Context, threadId int) ([]model.Post, error) {
	rows, err := r.dbpool.Query(ctx,
		`SELECT id, thread_id, user_id, content, created_at FROM posts WHERE thread_id = $1`, threadId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var id int
		var threadID int
		var userID int
		var content string
		if err := rows.Scan(&id, &threadID, &userID, &content); err != nil {
			return nil, err
		}
		posts = append(posts, model.Post{
			ID:       id,
			ThreadID: threadID,
			UserID:   userID,
			Content:  content,
		})
	}
	return posts, nil
}
