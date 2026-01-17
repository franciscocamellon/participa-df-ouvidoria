package com.camelloncase.pdo.auth.api.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record RegisterResponse(
		UUID id,
		String fullName,
	    String email,
	    String phoneE164,
	    OffsetDateTime createdAt,
	    OffsetDateTime updatedAt
) {}
