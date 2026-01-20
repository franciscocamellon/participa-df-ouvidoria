package com.camelloncase.pdo.ombudsman.api.dto;

import com.camelloncase.pdo.ombudsman.domain.enums.CaseStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record OmbudsmanUpdateRequest(

		@NotNull
		CaseStatus currentStatus,

		UUID destinationAgencyId,

		@Size(max=1000)
		String statusNote
){}