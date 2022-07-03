package com.diploma.ufpa.repository;

import com.diploma.ufpa.domain.Processo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Processo entity.
 */
@Repository
public interface ProcessoRepository extends JpaRepository<Processo, Long> {
    default Optional<Processo> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Processo> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Processo> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct processo from Processo processo left join fetch processo.turma left join fetch processo.entregaDiploma",
        countQuery = "select count(distinct processo) from Processo processo"
    )
    Page<Processo> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct processo from Processo processo left join fetch processo.turma left join fetch processo.entregaDiploma")
    List<Processo> findAllWithToOneRelationships();

    @Query(
        "select processo from Processo processo left join fetch processo.turma left join fetch processo.entregaDiploma where processo.id =:id"
    )
    Optional<Processo> findOneWithToOneRelationships(@Param("id") Long id);
}
