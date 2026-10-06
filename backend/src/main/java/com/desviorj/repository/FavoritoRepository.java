package com.desviorj.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desviorj.entity.Favorito;
import com.desviorj.entity.Lugar;
import com.desviorj.entity.Usuario;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuario(Usuario usuario);

    Optional<Favorito> findFirstByUsuarioAndLugar(Usuario usuario, Lugar lugar);

    void deleteByLugar(Lugar lugar);

}
