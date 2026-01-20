package com.camelloncase.pdo.ombudsman.application;

import com.camelloncase.pdo.ombudsman.domain.Location;
import com.camelloncase.pdo.ombudsman.domain.enums.CaseStatus;
import com.camelloncase.pdo.shared.exception.BadRequestException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Year;

@Component
public class OmbudsmanRules {

	private final JdbcTemplate jdbc;

	public OmbudsmanRules(JdbcTemplate jdbc) {
		this.jdbc = jdbc;
	}

	public void validateLocation(Location location) {
		if (location == null) {
			throw new BadRequestException("location is required");
		}
		if (location.getLongitude() == null) {
			throw new BadRequestException("location.longitude is required");
		}
		if (location.getLatitude() == null) {
			throw new BadRequestException("location.latitude is required");
		}

		BigDecimal lon = location.getLongitude();
		BigDecimal lat = location.getLatitude();

		if (lon.compareTo(new BigDecimal("-180")) < 0 || lon.compareTo(new BigDecimal("180")) > 0) {
			throw new BadRequestException("location.longitude must be between -180 and 180");
		}
		if (lat.compareTo(new BigDecimal("-90")) < 0 || lat.compareTo(new BigDecimal("90")) > 0) {
			throw new BadRequestException("location.latitude must be between -90 and 90");
		}
	}

	public String normalizeProtocolNumber(String protocolNumber) {
		return normalizeTrimmed(protocolNumber);
	}

	public String normalizeOptionalText(String value) {
		return normalizeTrimmed(value);
	}

	private String normalizeTrimmed(String value) {
		return value == null ? "" : value.trim();
	}

	public String nextProtocol() {
		Long seq = jdbc.queryForObject("select nextval('ombudsman_protocol_seq')", Long.class);
		int year = Year.now().getValue();
		return "DF-" + year + "-" + String.format("%06d", seq);
	}

	public String defaultNoteForStatus(CaseStatus status) {
		return switch (status) {
			case RECEIVED -> "Solicitação recebida.";
			case TRIAGE -> "Em triagem.";
			case FORWARDED -> "Encaminhada ao órgão responsável.";
			case IN_EXECUTION -> "Em execução.";
			case SCHEDULED -> "Agendada.";
			case COMPLETED -> "Concluída.";
		};
	}

}
