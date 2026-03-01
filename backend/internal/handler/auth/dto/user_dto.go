// SPDX-License-Identifier: MIT
// Copyright 2025 Alex Syrnikov <alex19srv@gmail.com>

package dto

type AuthLoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type JwtTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}
