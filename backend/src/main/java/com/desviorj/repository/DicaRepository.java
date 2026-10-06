package com.desviorj.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desviorj.entity.Dica;
import com.desviorj.entity.Lugar;

public interface DicaRepository extends JpaRepository<Dica, Long> {

    List<Dica> findAllByOrderByCriadoEmDesc();

    List<Dica> findByLugarIdOrderByCriadoEmDesc(Long lugarId);

    void deleteByLugar(Lugar lugar);

}
