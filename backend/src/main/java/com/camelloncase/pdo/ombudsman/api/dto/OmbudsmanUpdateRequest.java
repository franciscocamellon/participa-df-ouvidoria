package com.camelloncase.pdo.ombudsman.api.dto;

import com.camelloncase.pdo.ombudsman.domain.enums.CaseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record OmbudsmanUpdateRequest(

		@NotBlank
		@Size(max = 30)
		String protocolNumber,

		@NotNull
		CaseStatus currentStatus,

		UUID destinationAgencyId,

		List<UUID> statusHistoryEntryIds

){}