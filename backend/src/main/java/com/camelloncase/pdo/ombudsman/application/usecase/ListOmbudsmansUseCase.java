package com.camelloncase.pdo.ombudsman.application.usecase;

import com.camelloncase.pdo.ombudsman.api.OmbudsmanMapper;
import com.camelloncase.pdo.ombudsman.application.OmbudsmanRules;
import com.camelloncase.pdo.ombudsman.domain.Ombudsman;
import com.camelloncase.pdo.ombudsman.infrastructure.OmbudsmanRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListOmbudsmansUseCase {

	private final OmbudsmanRepository repository;
	private final OmbudsmanMapper mapper;
	private final OmbudsmanRules rules;

	public ListOmbudsmansUseCase(OmbudsmanRepository repository, OmbudsmanMapper mapper, OmbudsmanRules rules) {
		this.repository = repository;
		this.mapper = mapper;
		this.rules = rules;
	}

	@Transactional(readOnly = true)
	public Page<Ombudsman> execute(
			String protocolNumber,
			String category,
			String urgency,
			String currentStatus,
			Pageable pageable
	) {
		return repository.search(
				rules.normalizeProtocolNumber(protocolNumber),
				rules.normalizeOptionalText(category),
				rules.normalizeOptionalText(urgency),
				rules.normalizeOptionalText(currentStatus),
				pageable
		);
	}

}
