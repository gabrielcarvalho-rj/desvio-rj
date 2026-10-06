package com.desviorj.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desviorj.entity.ItemRoteiro;
import com.desviorj.entity.Lugar;
import com.desviorj.entity.Roteiro;

public interface ItemRoteiroRepository extends JpaRepository<ItemRoteiro, Long> {

    List<ItemRoteiro> findByRoteiro(Roteiro roteiro);

    List<ItemRoteiro> findByRoteiroOrderByHorarioAscIdAsc(Roteiro roteiro);

    void deleteByLugar(Lugar lugar);

}
