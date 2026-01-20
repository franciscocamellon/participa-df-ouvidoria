package com.camelloncase.pdo.ombudsman.application.usecase;

import com.camelloncase.pdo.ombudsman.application.OmbudsmanRules;
import com.camelloncase.pdo.ombudsman.domain.Ombudsman;
import com.camelloncase.pdo.ombudsman.infrastructure.OmbudsmanRepository;
import com.camelloncase.pdo.shared.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetOmbudsmanByProtocolUseCase {

	private final OmbudsmanRepository repository;
	private final OmbudsmanRules rules;

	public GetOmbudsmanByProtocolUseCase(OmbudsmanRepository repository, OmbudsmanRules rules) {
		this.repository = repository;
		this.rules = rules;
	}

	@Transactional(readOnly = true)
	public Ombudsman execute(String protocolNumber) {
		String normalized = rules.normalizeProtocolNumber(protocolNumber);
		return repository.findByProtocolNumber(normalized)
				.orElseThrow(() -> new NotFoundException("Ombudsman not found: protocol=" + normalized));
	}
}

