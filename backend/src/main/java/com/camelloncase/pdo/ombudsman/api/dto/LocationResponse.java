package com.camelloncase.pdo.ombudsman.api.dto;

import java.math.BigDecimal;

public class LocationResponse {

	private BigDecimal longitude;
	private BigDecimal latitude;
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
