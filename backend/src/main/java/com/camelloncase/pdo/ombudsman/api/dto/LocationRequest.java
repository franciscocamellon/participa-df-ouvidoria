package com.camelloncase.pdo.ombudsman.api.dto;

import com.camelloncase.pdo.ombudsman.domain.Location;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class LocationRequest {

	@NotNull
	@Digits(integer = 9, fraction = 6)
	private BigDecimal longitude;

	@NotNull
	@Digits(integer = 9, fraction = 6)
	private BigDecimal latitude;

	@Size(max = 255)
	private String approxAddress;

	public BigDecimal getLongitude() {
		return longitude;
	}

	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}

	public BigDecimal getLatitude() {
		return latitude;
	}

	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}

	public String getApproxAddress() {
		return approxAddress;
	}

	public void setApproxAddress(String approxAddress) {
		this.approxAddress = approxAddress;
	}

	public Location toDomain() {
		return new Location(longitude, latitude, approxAddress);
	}
}
