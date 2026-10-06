package com.desviorj.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.desviorj.entity.Favorito;
import com.desviorj.entity.Lugar;
import com.desviorj.entity.Usuario;
import com.desviorj.repository.FavoritoRepository;
import com.desviorj.repository.LugarRepository;
import com.desviorj.repository.UsuarioRepository;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;

    private final LugarRepository lugarRepository;

    private final UsuarioRepository usuarioRepository;

    public FavoritoService(
            FavoritoRepository favoritoRepository,
            LugarRepository lugarRepository,
            UsuarioRepository usuarioRepository
    ) {

        this.favoritoRepository = favoritoRepository;
        this.lugarRepository = lugarRepository;
        this.usuarioRepository = usuarioRepository;

    }

    @Transactional
    public Favorito adicionar(
            Long usuarioId,
            Long lugarId
    ) {

        Usuario usuario = buscarUsuario(usuarioId);

        Lugar lugar = lugarRepository
                .findById(lugarId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Lugar não encontrado: " + lugarId
                ));

        // Evita favorito duplicado: devolve o que ja existe
        return favoritoRepository
                .findFirstByUsuarioAndLugar(usuario, lugar)
                .orElseGet(() -> {

                    Favorito favorito = new Favorito();

                    favorito.setUsuario(usuario);

                    favorito.setLugar(lugar);

                    return favoritoRepository.save(favorito);

                });

    }

    @Transactional(readOnly = true)
    public List<Favorito> listar(Long usuarioId) {

        Usuario usuario = buscarUsuario(usuarioId);

        return favoritoRepository.findByUsuario(usuario);

    }

    @Transactional
    public void remover(Long id) {

        if (favoritoRepository.existsById(id)) {

            favoritoRepository.deleteById(id);

        }

    }

    private Usuario buscarUsuario(Long usuarioId) {

        return usuarioRepository
                .findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado: " + usuarioId
                ));

    }

}
