package com.camelloncase.pdo.ombudsman.domain;

import com.camelloncase.pdo.ombudsman.domain.enums.CaseCategory;
import com.camelloncase.pdo.ombudsman.domain.enums.CaseStatus;
import com.camelloncase.pdo.ombudsman.domain.enums.UrgencyLevel;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ombudsman")
public class Ombudsman {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id", nullable = false, columnDefinition = "uuid")
	private UUID id;

	@Column(name = "protocol_number", nullable = false, unique = true, length = 20)
	private String protocolNumber;

	@Enumerated(EnumType.STRING)
	@Column(name = "category", nullable = false, length = 50)
	private CaseCategory category;

	@Column(name = "description", nullable = false, length = 4000)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(name = "urgency", length = 50)
	private UrgencyLevel urgency;

	@Enumerated(EnumType.STRING)
	@Column(name = "current_status", length = 50)
	private CaseStatus currentStatus;

	@Column(name = "anonymous")
	private Boolean anonymous;

	@Column(name = "privacy_consent", nullable = false)
	private Boolean privacyConsent;

	@Column(name = "destination_agency_id")
	private UUID destinationAgencyId;

	@Column(name = "reporter_identity_id")
	private UUID reporterIdentityId;

	@ElementCollection
	@CollectionTable(name = "ombudsman_attachment_ids", joinColumns = @JoinColumn(name = "ombudsman_id"))
	@Column(name = "attachment_id")
	private List<UUID> attachmentIds = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name="ombudsman_status_history", joinColumns=@JoinColumn(name="ombudsman_id"))
	@OrderColumn(name="stage")
	private List<StatusHistoryEntry> statusHistory = new ArrayList<>();

	@Embedded
	private IzaTriageResult izaTriageResult;

	@Embedded
	private Location location;

	@Column(name = "created_at", nullable = false)
	private OffsetDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private OffsetDateTime updatedAt;

	public Ombudsman() {}

	@PrePersist
	void prePersist() {
		OffsetDateTime now = OffsetDateTime.now();
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	void preUpdate() {
		updatedAt = OffsetDateTime.now();
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getProtocolNumber() {
		return protocolNumber;
	}

	public void setProtocolNumber(String protocolNumber) {
		this.protocolNumber = protocolNumber;
	}

	public CaseCategory getCategory() {
		return category;
	}

	public void setCategory(CaseCategory category) {
		this.category = category;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public UrgencyLevel getUrgency() {
		return urgency;
	}

	public void setUrgency(UrgencyLevel urgency) {
		this.urgency = urgency;
	}

	public CaseStatus getCurrentStatus() {
		return currentStatus;
	}

	public void setCurrentStatus(CaseStatus currentStatus) {
		this.currentStatus = currentStatus;
	}

	public Boolean getAnonymous() {
		return anonymous;
	}

	public void setAnonymous(Boolean anonymous) {
		this.anonymous = anonymous;
	}

	public Boolean getPrivacyConsent() {
		return privacyConsent;
	}

	public void setPrivacyConsent(Boolean privacyConsent) {
		this.privacyConsent = privacyConsent;
	}

	public UUID getDestinationAgencyId() {
		return destinationAgencyId;
	}

	public void setDestinationAgencyId(UUID destinationAgencyId) {
		this.destinationAgencyId = destinationAgencyId;
	}

	public UUID getReporterIdentityId() {
		return reporterIdentityId;
	}

	public void setReporterIdentityId(UUID reporterIdentityId) {
		this.reporterIdentityId = reporterIdentityId;
	}

	public List<UUID> getAttachmentIds() {
		return attachmentIds;
	}

	public void setAttachmentIds(List<UUID> attachmentIds) {
		this.attachmentIds = (attachmentIds == null) ? new ArrayList<>() : new ArrayList<>(attachmentIds);
	}

	public List<StatusHistoryEntry> getStatusHistory() {
		return statusHistory;
	}

	public void setStatusHistory(List<StatusHistoryEntry> statusHistoryEntryIds) {
		this.statusHistory = (statusHistoryEntryIds == null) ? new ArrayList<>() : new ArrayList<>(statusHistoryEntryIds);
	}

	public IzaTriageResult getIzaTriageResultId() {
		return izaTriageResult;
	}

	public void setIzaTriageResultId(IzaTriageResult izaTriageResult) {
		this.izaTriageResult = izaTriageResult;
	}

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
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

	public void changeStatus(CaseStatus newStatus, String note, UUID changedByUserId) {
		if (newStatus == null) return;
		if (this.currentStatus == newStatus) return;

		this.currentStatus = newStatus;

		if (this.statusHistory == null) {
			this.statusHistory = new ArrayList<>();
		}

		this.statusHistory.add(new StatusHistoryEntry(
				newStatus,
				OffsetDateTime.now(),
				note,
				changedByUserId
		));
	}

}
