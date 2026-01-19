package com.camelloncase.pdo.ombudsman.infrastructure;

import com.camelloncase.pdo.ombudsman.domain.Ombudsman;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OmbudsmanRepository extends JpaRepository<Ombudsman, UUID> {

	@Query("""
      select o from Ombudsman o
      where (:reporterIdentityId is null or o.reporterIdentityId = :reporterIdentityId)
      	and (:protocolNumber is null or lower(o.protocolNumber) like lower(concat('%', :protocolNumber, '%')))
        and (:category is null or lower(str(o.category)) like lower(concat('%', :category, '%')))
        and (:urgency is null or (o.urgency is not null and lower(str(o.urgency)) like lower(concat('%', :urgency, '%'))))
        and (:currentStatus is null or lower(str(o.currentStatus)) like lower(concat('%', :currentStatus, '%')))
      """)
	Page<Ombudsman> search(
			@Param("reporterIdentityId") UUID reporterIdentityId,
			@Param("protocolNumber") String protocolNumber,
			@Param("category") String category,
			@Param("urgency") String urgency,
			@Param("currentStatus") String currentStatus,
			Pageable pageable
	);

	Optional<Ombudsman> findByProtocolNumber(String protocolNumber);
}
