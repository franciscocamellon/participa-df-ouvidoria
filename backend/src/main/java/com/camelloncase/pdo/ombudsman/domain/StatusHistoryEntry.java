package com.camelloncase.pdo.ombudsman.domain;

import com.camelloncase.pdo.ombudsman.domain.enums.CaseStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.OffsetDateTime;
import java.util.UUID;

@Embeddable
public class StatusHistoryEntry {

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 50)
	private CaseStatus status;

	@Column(name = "changed_at", nullable = false)
	private OffsetDateTime changedAt;

	@Column(name = "note", length = 1000)
	private String note;

	@Column(name = "changed_by_user_id", columnDefinition = "uuid")
	private UUID changedByUserId;

	protected StatusHistoryEntry() {}

	public StatusHistoryEntry(CaseStatus status, OffsetDateTime changedAt, String note, UUID changedByUserId) {
		this.status = status;
		this.changedAt = changedAt;
		this.note = note;
		this.changedByUserId = changedByUserId;
	}

	public CaseStatus getStatus() {
		return status;
	}

	public void setStatus(CaseStatus status) {
		this.status = status;
	}

	public OffsetDateTime getChangedAt() {
		return changedAt;
	}

	public void setChangedAt(OffsetDateTime changedAt) {
		this.changedAt = changedAt;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public UUID getChangedByUserId() {
		return changedByUserId;
	}

	public void setChangedByUserId(UUID changedByUserId) {
		this.changedByUserId = changedByUserId;
	}
}
