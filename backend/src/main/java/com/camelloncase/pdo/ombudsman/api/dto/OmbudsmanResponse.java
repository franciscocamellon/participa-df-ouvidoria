package com.camelloncase.pdo.ombudsman.api.dto;

import com.camelloncase.pdo.ombudsman.domain.enums.CaseCategory;
import com.camelloncase.pdo.ombudsman.domain.enums.CaseStatus;
import com.camelloncase.pdo.ombudsman.domain.enums.UrgencyLevel;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record OmbudsmanResponse(
		UUID id,
		String protocolNumber,
		CaseCategory category,
		String description,
		UrgencyLevel urgency,
		CaseStatus currentStatus,
		Boolean anonymous,
		Boolean privacyConsent,
		UUID destinationAgencyId,
		UUID reporterIdentityId,
		List<UUID> attachmentIds,
		List<UUID> statusHistoryEntryIds,
		UUID izaTriageResultId,
		LocationResponse location,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt
){}