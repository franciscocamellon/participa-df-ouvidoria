package com.camelloncase.pdo.ombudsman.api;

import com.camelloncase.pdo.ombudsman.api.dto.OmbudsmanCreateRequest;
import com.camelloncase.pdo.ombudsman.api.dto.OmbudsmanResponse;
import com.camelloncase.pdo.ombudsman.api.dto.OmbudsmanUpdateRequest;
import com.camelloncase.pdo.ombudsman.application.OmbudsmanFacade;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ombudsmans")
public class OmbudsmanController {

	private final OmbudsmanFacade facade;

	public OmbudsmanController(OmbudsmanFacade facade) {
		this.facade = facade;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<OmbudsmanResponse> create(@Valid @RequestBody OmbudsmanCreateRequest request) {
		OmbudsmanResponse response = facade.create(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/{id}")
	public ResponseEntity<OmbudsmanResponse> get(@PathVariable UUID id) {
		OmbudsmanResponse response = facade.get(id);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<Page<OmbudsmanResponse>> list(
			@RequestParam(required = false) String protocolNumber,
			@RequestParam(required = false) String category,
			@RequestParam(required = false) String urgency,
			@RequestParam(required = false) String currentStatus,
			@ParameterObject Pageable pageable
	) {
		Page<OmbudsmanResponse> response = facade.list(protocolNumber, category, urgency, currentStatus, pageable);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<OmbudsmanResponse> update(@PathVariable UUID id, @Valid @RequestBody OmbudsmanUpdateRequest req) {
		OmbudsmanResponse response = facade.update(id, req);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public ResponseEntity<Void> delete(@PathVariable UUID id) {
		facade.delete(id);
		return ResponseEntity.noContent().build();
	}
}
