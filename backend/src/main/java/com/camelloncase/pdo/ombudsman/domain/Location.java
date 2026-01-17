package com.camelloncase.pdo.ombudsman.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.math.BigDecimal;

@Embeddable
public class Location {

	@Column(name = "longitude", nullable = false, precision = 9, scale = 6)
	private BigDecimal longitude;

	@Column(name = "latitude", nullable = false, precision = 9, scale = 6)
	private BigDecimal latitude;

	@Column(name = "approx_address", length = 255)
	private String approxAddress;

	protected Location() {}

	public Location(BigDecimal longitude, BigDecimal latitude, String approxAddress) {
		this.longitude = longitude;
		this.latitude = latitude;
		this.approxAddress = approxAddress;
	}

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
