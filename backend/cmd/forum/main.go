// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package main

import (
	"fmt"

	"github.com/hetagdarchiev/forum-interaction-analytics/tree/main/backend/internal/lib/config"
	"github.com/hetagdarchiev/forum-interaction-analytics/tree/main/backend/internal/repository/storage"
)

func main() {
	cfg := config.CmdParse()

	appConfig := config.MustReadAppConfig(cfg)

	storage, err := storage.New(appConfig.Db.DSN())
	if err != nil {
		fmt.Printf("Failed to create storage: %v\n", err)
		return
	}
	defer storage.Close()
}
