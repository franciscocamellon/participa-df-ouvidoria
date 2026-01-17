package com.camelloncase.pdo.auth.api.dto;


import com.camelloncase.pdo.user.api.dto.UserResponse;

public record LoginResponse(
		String token,
		String tokenType,
		long expiresIn,
		UserResponse user
) {}
