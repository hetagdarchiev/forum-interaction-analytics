// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package config

import (
	"flag"
	"fmt"
	"log"
	"os"
	"strconv"

	toml "github.com/pelletier/go-toml/v2"
)

type CmdConfig struct {
	Config *string

	DbHost     *string
	DbPort     *int
	DbUser     *string
	DbPassword *string
	DbName     *string
}

// CmdParse parses command-line arguments and returns a CmdConfig struct.
func CmdParse() *CmdConfig {
	configPath := flag.String("config", "", "path to config file")
	dbHost := flag.String("db-host", "", "database host")
	dbPort := flag.Int("db-port", 0, "database port")
	dbUser := flag.String("db-user", "", "database user")
	dbPassword := flag.String("db-password", "", "database password")
	dbName := flag.String("db-name", "", "database name")

	flag.Parse()

	return &CmdConfig{
		Config:     configPath,
		DbHost:     dbHost,
		DbPort:     dbPort,
		DbUser:     dbUser,
		DbPassword: dbPassword,
		DbName:     dbName,
	}
}

type DbConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Name     string
}

func (db *DbConfig) check(cmd *CmdConfig) error {
	db.Host = mergeCmdEnvCurrentDefaultString(cmd.DbHost, "FORUM_DB_HOST", db.Host, "localhost")
	db.Port = mergeCmdEnvCurrentDefaultInt(cmd.DbPort, "FORUM_DB_PORT", db.Port, 5432)
	db.User = mergeCmdEnvCurrentDefaultString(cmd.DbUser, "FORUM_DB_USER", db.User, "")
	db.Password = mergeCmdEnvCurrentDefaultString(cmd.DbPassword, "FORUM_DB_PASSWORD", db.Password, "")
	db.Name = mergeCmdEnvCurrentDefaultString(cmd.DbName, "FORUM_DB_NAME", db.Name, "")

	if db.Host == "" {
		return fmt.Errorf("db host is empty")
	}
	if db.Port <= 0 {
		return fmt.Errorf("db port is zero or negative")
	}
	if db.User == "" {
		return fmt.Errorf("db user is empty")
	}
	if db.Password == "" {
		return fmt.Errorf("db password is empty")
	}
	if db.Name == "" {
		return fmt.Errorf("db name is empty")
	}
	return nil
}

func (db *DbConfig) DSN() string {
	// dsn := "postgres://username:password@localhost:5432/database_name"
	return fmt.Sprintf("postgres://%s:%s@%s:%d/%s", db.User, db.Password, db.Host, db.Port, db.Name)
}

type AppConfig struct {
	Db DbConfig `toml:"db"`
}

// MustReadAppConfig reads the application configuration.
// If there is an error during reading or parsing the configuration, it panics.
func MustReadAppConfig(cmdConfig *CmdConfig) *AppConfig {
	cfgPath := configPath(cmdConfig)

	cfgBin, err := os.ReadFile(cfgPath)
	if err != nil {
		log.Fatalf("failed read config from \"%s\": %v", cfgPath, err)
	}

	var appConfig AppConfig
	err = toml.Unmarshal(cfgBin, &appConfig)
	if err != nil {
		log.Fatalf("failed parse config from \"%s\": %v", cfgPath, err)
	}

	err = appConfig.Db.check(cmdConfig)
	if err != nil {
		log.Fatalf("invalid db config from file \"%s\", environment or command-line: %v", cfgPath, err)
	}

	return &appConfig
}

// get config path from command-line argument, environment variable or default value
func configPath(cmdConfig *CmdConfig) string {
	return mergeCmdEnvDefault(cmdConfig.Config, "FORUM_CONFIG", "./config.toml")
}

// mergeCmdEnvDefault merges command-line argument (most prioritive), environment and default
func mergeCmdEnvDefault(cmd *string, envName string, def string) string {
	var res string

	if cmd != nil && len(*cmd) > 0 {
		res = *cmd
	} else {
		res = os.Getenv(envName)
	}
	if res == "" {
		res = def
	}

	return res
}

// return first non empty value from command-line argument, environment variable, current or default value
func mergeCmdEnvCurrentDefaultString(cmd *string, envName string, current string, def string) string {
	if cmd != nil && len(*cmd) > 0 {
		return *cmd
	}
	env := os.Getenv(envName)
	if len(env) > 0 {
		return env
	}
	if len(current) > 0 {
		return current
	}
	return def
}

// return first non zero value from command-line argument, environment variable, current or default value
func mergeCmdEnvCurrentDefaultInt(cmd *int, envName string, current int, def int) int {
	if cmd != nil && *cmd != 0 {
		return *cmd
	}
	env := os.Getenv(envName)
	if len(env) > 0 {
		envInt, err := strconv.Atoi(env)
		if err == nil {
			return envInt
		}
	}
	if current != 0 {
		return current
	}
	return def
}
