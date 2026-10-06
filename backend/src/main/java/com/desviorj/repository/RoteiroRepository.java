package com.desviorj.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desviorj.entity.Roteiro;
import com.desviorj.entity.Usuario;


public interface RoteiroRepository extends JpaRepository<Roteiro, Long> {


    List<Roteiro> findByUsuario(Usuario usuario);


}