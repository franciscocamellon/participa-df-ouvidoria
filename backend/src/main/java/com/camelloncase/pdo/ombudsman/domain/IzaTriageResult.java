package com.camelloncase.pdo.ombudsman.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Entity
@Table(
		name = "iza_triage_results",
		indexes = {
				@Index(name = "idx_iza_triage_results_suggested_category", columnList = "suggested_category"),
				@Index(name = "idx_iza_triage_results_confidence", columnList = "confidence")
		}
)
public class IzaTriageResult {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(name = "case_id", nullable = false)
	private UUID caseId;

	@Enumerated(EnumType.STRING)
	@Column(name = "suggested_category")
	private CaseCategory suggestedCategory;

	@Column(name = "suggested_agency_id")
	private UUID suggestedAgencyId;

	@Column(name = "confidence", precision = 5, scale = 4)
	private BigDecimal confidence;

	@Column(name = "rationale", length = 2000)
	private String rationale;

	@Column(name = "created_at", nullable = false)
	private OffsetDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private OffsetDateTime updatedAt;

	@PrePersist
	public void prePersist() {
		OffsetDateTime now = OffsetDateTime.now();
		this.createdAt = now;
		this.updatedAt = now;
	}

	@PreUpdate
	public void preUpdate() {
		this.updatedAt = OffsetDateTime.now();
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public UUID getCaseId() {
		return caseId;
	}

	public void setCaseId(UUID caseId) {
		this.caseId = caseId;
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

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}

	/**
	 * Placeholder enum for suggestedCategory.
	 * Add/adjust values to match your domain taxonomy.
	 */
	public enum CaseCategory {
		UNKNOWN,
		OTHER
	}
}

