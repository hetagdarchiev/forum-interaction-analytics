// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package threads

import (
	"context"
	"time"

	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/repository"
	"github.com/hetagdarchiev/forum-interaction-analytics/backend/internal/service/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ThreadsRepo struct {
	dbpool *pgxpool.Pool
}

func NewThreadsRepo(dsn string) (*ThreadsRepo, error) {
	pool, err := repository.PgPool(dsn)
	if err != nil {
		return nil, err
	}
	return &ThreadsRepo{dbpool: pool}, nil
}

// create thread
func (r *ThreadsRepo) Create(ctx context.Context, thread model.ThreadCreate) (model.ThreadRepoInfo, error) {
	row := r.dbpool.QueryRow(ctx,
		`INSERT INTO threads (title, content, user_id, posts_count) VALUES ($1, $2, $3, $4)
		RETURNING id, title, content, posts_count, user_id, created_at`,
		thread.Title, thread.Content, thread.UserID, 1)

	var id int
	var userID int
	var content string
	var title string
	var postsCount int
	var createdAt time.Time
	if err := row.Scan(&id, &title, &content, &postsCount, &userID, &createdAt); err != nil {
		return model.ThreadRepoInfo{}, err
	}
	return model.ThreadRepoInfo{
		ID:         id,
		UserID:     userID,
		Title:      title,
		Content:    content,
		PostsCount: postsCount,
		CreatedAt:  createdAt,
	}, nil
}

// list threads page
func (r *ThreadsRepo) PageByPageID(ctx context.Context, page, limit int) (model.ThreadListRepo, error) {
	rows, err := r.dbpool.Query(ctx,
		`SELECT id, title, content, user_id, posts_count, created_at
		FROM threads
		ORDER BY id DESC LIMIT $1 OFFSET $2`, limit, (page-1)*limit)
	if err != nil {
		return model.ThreadListRepo{}, err
	}
	defer rows.Close()

	threads := make([]model.ThreadRepoInfo, 0, limit)
	for rows.Next() {
		var id int
		var userID int
		var content string
		var title string
		var postsCount int
		var createdAt time.Time
		if err := rows.Scan(&id, &title, &content, &userID, &postsCount, &createdAt); err != nil {
			return model.ThreadListRepo{}, err
		}
		threads = append(threads, model.ThreadRepoInfo{
			ID:         id,
			UserID:     userID,
			Title:      title,
			Content:    content,
			PostsCount: postsCount,
			CreatedAt:  createdAt,
		})
	}
	res, err := r.threadListInfo(ctx, threads[len(threads)-1].ID, threads[0].ID)
	if err != nil {
		return model.ThreadListRepo{}, err
	}
	res.Threads = threads

	return res, nil
}

// list threads page by page id, with next and prev page info
func (r *ThreadsRepo) PageByOffset(ctx context.Context, threadId, limit int, before bool) (model.ThreadListRepo, error) {
	getBeforeQuery := `SELECT id, title, content, user_id, posts_count, created_at
		FROM threads
		WHERE id < $1
		ORDER BY id DESC LIMIT $2`
	getAfterQuery := `SELECT id, title, content, user_id, posts_count, created_at
		FROM threads
		WHERE id > $1
		ORDER BY id DESC LIMIT $2`
	var query string
	if before {
		query = getBeforeQuery
	} else {
		query = getAfterQuery
	}
	rows, err := r.dbpool.Query(ctx, query, threadId, limit)
	if err != nil {
		return model.ThreadListRepo{}, err
	}
	defer rows.Close()

	threads := make([]model.ThreadRepoInfo, 0, limit)
	for rows.Next() {
		var id int
		var userID int
		var content string
		var title string
		var postsCount int
		var createdAt time.Time
		if err := rows.Scan(&id, &title, &content, &userID, &postsCount, &createdAt); err != nil {
			return model.ThreadListRepo{}, err
		}
		threads = append(threads, model.ThreadRepoInfo{
			ID:         id,
			UserID:     userID,
			Title:      title,
			Content:    content,
			PostsCount: postsCount,
			CreatedAt:  createdAt,
		})
	}
	res, err := r.threadListInfo(ctx, threads[len(threads)-1].ID, threads[0].ID)
	if err != nil {
		return model.ThreadListRepo{}, err
	}
	res.Threads = threads

	return res, nil
}

func (r *ThreadsRepo) threadListInfo(ctx context.Context, minId, maxId int) (model.ThreadListRepo, error) {
	row := r.dbpool.QueryRow(ctx,
		`SELECT COUNT(*) FROM threads`)

	var count int
	if err := row.Scan(&count); err != nil {
		return model.ThreadListRepo{}, err
	}
	res := model.ThreadListRepo{
		TotalCountEstimated: count,
	}
	row = r.dbpool.QueryRow(ctx,
		`SELECT id FROM threads WHERE id < $1 LIMIT 1`, minId)
	var prevId int
	if err := row.Scan(&prevId); err != nil {
		if err.Error() == "no rows in result set" { // FIXME: this is not a good way to check for no rows, but pgx does not export the error type
			res.HaveNext = false
		} else {
			return model.ThreadListRepo{}, err
		}
	} else {
		res.HaveNext = true
	}

	row = r.dbpool.QueryRow(ctx,
		`SELECT id FROM threads WHERE id > $1 LIMIT 1`, maxId)
	var nextId int
	if err := row.Scan(&nextId); err != nil {
		if err.Error() == "no rows in result set" { // FIXME: this is not a good way to check for no rows, but pgx does not export the error type
			res.HavePrev = false
		} else {
			return model.ThreadListRepo{}, err
		}
	} else {
		res.HavePrev = true
	}

	return res, nil
}

func (r *ThreadsRepo) Get(ctx context.Context, threadId int) (*model.ThreadRepoInfo, error) {
	row := r.dbpool.QueryRow(ctx,
		`SELECT id, title, content, user_id, posts_count, created_at FROM threads WHERE id = $1`, threadId)

	var id int
	var userID int
	var content string
	var title string
	var postsCount int
	var createdAt time.Time
	if err := row.Scan(&id, &title, &content, &userID, &postsCount, &createdAt); err != nil {
		return nil, err
	}
	return &model.ThreadRepoInfo{
		ID:         id,
		UserID:     userID,
		Title:      title,
		Content:    content,
		PostsCount: postsCount,
		CreatedAt:  createdAt,
	}, nil
}
