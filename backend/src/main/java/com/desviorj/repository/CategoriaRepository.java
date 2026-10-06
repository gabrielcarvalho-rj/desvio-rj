package com.desviorj.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desviorj.entity.Categoria;


public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

}