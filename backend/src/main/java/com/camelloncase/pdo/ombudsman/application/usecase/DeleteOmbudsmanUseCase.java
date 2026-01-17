package com.camelloncase.pdo.ombudsman.application.usecase;

import com.camelloncase.pdo.ombudsman.infrastructure.OmbudsmanRepository;
import java.util.UUID;

import com.camelloncase.pdo.shared.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeleteOmbudsmanUseCase {

	private final OmbudsmanRepository repository;

	public DeleteOmbudsmanUseCase(OmbudsmanRepository repository) {
		this.repository = repository;
	}

	@Transactional
	public void execute(UUID id) {
		if (!repository.existsById(id)) {
			throw new NotFoundException("Ombudsman not found: " + id);
		}
		repository.deleteById(id);
	}
}
