package com.camelloncase.pdo.ombudsman.domain;

import com.camelloncase.pdo.ombudsman.domain.enums.CaseCategory;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.math.BigDecimal;
import java.util.UUID;

@Embeddable
public class IzaTriageResult {

	@Enumerated(EnumType.STRING)
	@Column(name = "iza_suggested_category", length = 50)
	private CaseCategory suggestedCategory;

	@Column(name = "iza_suggested_agency_id", columnDefinition = "uuid")
	private UUID suggestedAgencyId;

	@Column(name = "iza_confidence", precision = 5, scale = 4)
	private BigDecimal confidence;

	@Column(name = "iza_rationale", length = 2000)
	private String rationale;

	protected IzaTriageResult() {}

	public IzaTriageResult(
			CaseCategory suggestedCategory,
			UUID suggestedAgencyId,
			BigDecimal confidence,
			String rationale
	) {
		this.suggestedCategory = suggestedCategory;
		this.suggestedAgencyId = suggestedAgencyId;
		this.confidence = confidence;
		this.rationale = rationale;
	}

	public CaseCategory getSuggestedCategory() {
		return suggestedCategory;
	}

	public void setSuggestedCategory(CaseCategory suggestedCategory) {
		this.suggestedCategory = suggestedCategory;
	}

	public UUID getSuggestedAgencyId() {
		return suggestedAgencyId;
	}

	public void setSuggestedAgencyId(UUID suggestedAgencyId) {
		this.suggestedAgencyId = suggestedAgencyId;
	}

	public BigDecimal getConfidence() {
		return confidence;
	}

	public void setConfidence(BigDecimal confidence) {
		this.confidence = confidence;
	}

	public String getRationale() {
		return rationale;
	}

	public void setRationale(String rationale) {
		this.rationale = rationale;
	}
}
