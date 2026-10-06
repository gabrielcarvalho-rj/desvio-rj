package com.desviorj.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.desviorj.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findFirstByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    // Usuarios que escolheram um determinado interesse (usado ao excluir o interesse)
    List<Usuario> findByInteressesId(Long interesseId);

}
