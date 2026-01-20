package com.camelloncase.pdo.ombudsman.application.usecase;

import com.camelloncase.pdo.ombudsman.api.dto.OmbudsmanUpdateRequest;
import com.camelloncase.pdo.ombudsman.application.OmbudsmanRules;
import com.camelloncase.pdo.ombudsman.domain.Ombudsman;
import com.camelloncase.pdo.ombudsman.infrastructure.OmbudsmanRepository;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

import com.camelloncase.pdo.shared.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateOmbudsmanUseCase {

	private final OmbudsmanRepository repository;
	private final OmbudsmanRules rules;

	public UpdateOmbudsmanUseCase(OmbudsmanRepository repository, OmbudsmanRules rules) {
		this.repository = repository;
		this.rules = rules;
	}

	@Transactional
	public Ombudsman execute(UUID id, OmbudsmanUpdateRequest req) {
		Ombudsman existing = repository.findById(id)
				.orElseThrow(() -> new NotFoundException("Ombudsman not found: " + id));

		String note = rules.normalizeOptionalText(req.statusNote());
		if (note == null || note.isBlank()) {
			note = rules.defaultNoteForStatus(req.currentStatus());
		}

		existing.changeStatus(req.currentStatus(), note, null);
		existing.setDestinationAgencyId(req.destinationAgencyId());

		rules.validateLocation(existing.getLocation());

		existing.setUpdatedAt(OffsetDateTime.now());
		return repository.save(existing);
	}
}
