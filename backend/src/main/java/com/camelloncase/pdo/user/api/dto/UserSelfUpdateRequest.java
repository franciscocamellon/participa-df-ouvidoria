package com.camelloncase.pdo.user.api.dto;

import jakarta.validation.constraints.NotBlank;

public record UserSelfUpdateRequest(

		@NotBlank
		String fullName,

		@NotBlank
		String phoneE164
) {}
