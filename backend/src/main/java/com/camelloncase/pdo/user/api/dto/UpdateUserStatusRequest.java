package com.camelloncase.pdo.user.api.dto;

import com.camelloncase.pdo.user.domain.enums.Status;
import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
		@NotNull
		Status status
) {}
