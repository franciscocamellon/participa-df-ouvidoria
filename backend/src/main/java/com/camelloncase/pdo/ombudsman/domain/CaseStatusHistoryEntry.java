package com.camelloncase.pdo.ombudsman.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Entity
@Table(name = "case_status_history_entries")
public class CaseStatusHistoryEntry {

	@Id
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id;

	@Column(name = "case_id", nullable = false)
	private UUID caseId;

	@Column(name = "status", nullable = false, length = 30)
	private String status;

	@Column(name = "changed_at", nullable = false)
	private OffsetDateTime changedAt;

	@Column(name = "note", length = 1000)
	private String note;

	@Column(name = "changed_by_user_id")
	private UUID changedByUserId;

	@Column(name = "created_at", nullable = false, updatable = false)
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
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

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(OffsetDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(OffsetDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

}

