package com.camelloncase.pdo.ombudsman.api.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class LocationPatchRequest {

	@Digits(integer = 3, fraction = 6)
	private BigDecimal longitude;

	@Digits(integer = 3, fraction = 6)
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
}
