package com.camelloncase.pdo.ombudsman.api.dto;

import com.camelloncase.pdo.ombudsman.domain.IzaTriageResult;
import com.camelloncase.pdo.ombudsman.domain.StatusHistoryEntry;
import com.camelloncase.pdo.ombudsman.domain.enums.CaseCategory;
import com.camelloncase.pdo.ombudsman.domain.enums.CaseStatus;
import com.camelloncase.pdo.ombudsman.domain.enums.UrgencyLevel;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record OmbudsmanCreateRequest (

	@Size(max = 30)
	String protocolNumber,

	@NotNull
	CaseCategory category,

	@NotBlank
	@Size(max = 4000)
	String description,

	UrgencyLevel urgency,

	CaseStatus currentStatus,

	Boolean anonymous,

	@NotNull
	Boolean privacyConsent,

	UUID destinationAgencyId,

	UUID reporterIdentityId,

	@Size(max = 4)
	List<@Size(max = 500) String> attachmentUrls,

	List<StatusHistoryEntry> statusHistory,

	IzaTriageResult izaTriageResult,

	@Valid
	LocationRequest location
){}