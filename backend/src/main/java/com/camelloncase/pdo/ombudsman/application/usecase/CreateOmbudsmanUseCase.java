package com.camelloncase.pdo.ombudsman.application.usecase;

import com.camelloncase.pdo.ombudsman.api.dto.OmbudsmanCreateRequest;
import com.camelloncase.pdo.ombudsman.application.OmbudsmanRules;
import com.camelloncase.pdo.ombudsman.domain.Ombudsman;
import com.camelloncase.pdo.ombudsman.infrastructure.OmbudsmanRepository;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateOmbudsmanUseCase {

	private final OmbudsmanRepository repository;
	private final OmbudsmanRules rules;

	public CreateOmbudsmanUseCase(OmbudsmanRepository repository, OmbudsmanRules rules) {
		this.repository = repository;
		this.rules = rules;
	}

	@Transactional
	public Ombudsman execute(OmbudsmanCreateRequest req) {

		var urls = Optional.ofNullable(req.attachmentUrls())
				.orElseGet(List::of)
				.stream()
				.map(String::trim)
				.filter(s -> !s.isBlank())
				.distinct()
				.limit(4)
				.toList();

		Ombudsman o = new Ombudsman();

		o.setProtocolNumber(rules.nextProtocol());
		o.setCategory(req.category());
		o.setDescription(req.description());
		o.setUrgency(req.urgency());
		o.setCurrentStatus(req.currentStatus());
		o.setAnonymous(req.anonymous());
		o.setPrivacyConsent(req.privacyConsent());
		o.setDestinationAgencyId(req.destinationAgencyId());
		o.setReporterIdentityId(req.reporterIdentityId());
		o.setAttachmentUrls(new ArrayList<>(urls));
		o.setIzaTriageResultId(req.izaTriageResult());
		o.setLocation(req.location().toDomain());

		o.changeStatus(o.getCurrentStatus(), "Solicitação recebida.", o.getReporterIdentityId());

		rules.validateLocation(o.getLocation());

		OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
		o.setCreatedAt(now);
		o.setUpdatedAt(now);

		return repository.save(o);
	}
}
