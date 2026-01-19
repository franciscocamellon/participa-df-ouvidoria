package com.camelloncase.pdo.ombudsman.application;

import com.camelloncase.pdo.ombudsman.api.OmbudsmanMapper;
import com.camelloncase.pdo.ombudsman.api.dto.OmbudsmanCreateRequest;
import com.camelloncase.pdo.ombudsman.api.dto.OmbudsmanResponse;
import com.camelloncase.pdo.ombudsman.api.dto.OmbudsmanUpdateRequest;
import com.camelloncase.pdo.ombudsman.application.usecase.*;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OmbudsmanFacade {

	private final CreateOmbudsmanUseCase createUseCase;
	private final GetOmbudsmanUseCase getUseCase;
	private final GetOmbudsmanByProtocolUseCase getOmbudsmanByProtocolUseCase;
	private final ListOmbudsmansUseCase listUseCase;
	private final UpdateOmbudsmanUseCase updateUseCase;
	private final DeleteOmbudsmanUseCase deleteUseCase;
	private final OmbudsmanMapper mapper;

	public OmbudsmanFacade(
			CreateOmbudsmanUseCase createUseCase,
			GetOmbudsmanUseCase getUseCase,
			GetOmbudsmanByProtocolUseCase getOmbudsmanByProtocolUseCase,
			ListOmbudsmansUseCase listUseCase,
			UpdateOmbudsmanUseCase updateUseCase,
			DeleteOmbudsmanUseCase deleteUseCase,
			OmbudsmanMapper mapper
	) {
		this.createUseCase = createUseCase;
		this.getUseCase = getUseCase;
		this.getOmbudsmanByProtocolUseCase = getOmbudsmanByProtocolUseCase;
		this.listUseCase = listUseCase;
		this.updateUseCase = updateUseCase;
		this.deleteUseCase = deleteUseCase;
		this.mapper = mapper;
	}

	public OmbudsmanResponse create(OmbudsmanCreateRequest req) {
		return mapper.toResponse(createUseCase.execute(req));
	}

	public OmbudsmanResponse get(UUID id) {
		return mapper.toResponse(getUseCase.execute(id));
	}

	public OmbudsmanResponse getByProtocol(String protocolNumber) {
		return mapper.toResponse(getOmbudsmanByProtocolUseCase.execute(protocolNumber));
	}

	public Page<OmbudsmanResponse> list(
			UUID reporterIdentityId,
			String protocolNumber,
			String category,
			String urgency,
			String currentStatus,
			Pageable pageable
	) {
		return listUseCase.execute(reporterIdentityId, protocolNumber, category, urgency, currentStatus, pageable)
				.map(mapper::toResponse);
	}

	public OmbudsmanResponse update(UUID id, OmbudsmanUpdateRequest req) {
		return mapper.toResponse(updateUseCase.execute(id, req));
	}

	public void delete(UUID id) {
		deleteUseCase.execute(id);
	}
}
