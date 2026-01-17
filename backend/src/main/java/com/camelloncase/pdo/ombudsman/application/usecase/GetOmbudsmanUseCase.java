package com.camelloncase.pdo.ombudsman.application.usecase;

import com.camelloncase.pdo.ombudsman.domain.Ombudsman;
import com.camelloncase.pdo.ombudsman.infrastructure.OmbudsmanRepository;
import java.util.UUID;

import com.camelloncase.pdo.shared.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetOmbudsmanUseCase {

	private final OmbudsmanRepository repository;

	public GetOmbudsmanUseCase(OmbudsmanRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public Ombudsman execute(UUID id) {
		return repository.findById(id)
				.orElseThrow(() -> new NotFoundException("Ombudsman not found: " + id));
	}
}
