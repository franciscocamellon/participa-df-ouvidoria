package com.camelloncase.pdo.ombudsman.api;

import com.camelloncase.pdo.ombudsman.api.dto.LocationResponse;
import com.camelloncase.pdo.ombudsman.api.dto.OmbudsmanResponse;
import com.camelloncase.pdo.ombudsman.domain.Location;
import com.camelloncase.pdo.ombudsman.domain.Ombudsman;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OmbudsmanMapper {

	OmbudsmanResponse toResponse(Ombudsman entity);

	LocationResponse toResponse(Location location);
}
