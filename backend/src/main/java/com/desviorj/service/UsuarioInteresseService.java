package com.desviorj.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.desviorj.entity.Interesse;
import com.desviorj.entity.Usuario;
import com.desviorj.repository.InteresseRepository;
import com.desviorj.repository.UsuarioRepository;

@Service
public class UsuarioInteresseService {

    private final UsuarioRepository usuarioRepository;

    private final InteresseRepository interesseRepository;

    public UsuarioInteresseService(
            UsuarioRepository usuarioRepository,
            InteresseRepository interesseRepository
    ){

        this.usuarioRepository = usuarioRepository;
        this.interesseRepository = interesseRepository;

    }

    @Transactional
    public Usuario adicionar(
            Long usuarioId,
            Long interesseId
    ){

        Usuario usuario =
                usuarioRepository
                .findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado: " + usuarioId
                ));

        Interesse interesse =
                interesseRepository
                .findById(interesseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Interesse não encontrado: " + interesseId
                ));

        boolean jaTem = usuario.getInteresses()
                .stream()
                .anyMatch(i -> i.getId().equals(interesse.getId()));

        if (!jaTem) {
            usuario.getInteresses().add(interesse);
        }

        return usuarioRepository.save(usuario);

    }

    @Transactional(readOnly = true)
    public List<Interesse> listar(Long usuarioId){

        Usuario usuario = buscarUsuario(usuarioId);

        return List.copyOf(usuario.getInteresses());

    }

    @Transactional
    public void remover(
            Long usuarioId,
            Long interesseId
    ){

        Usuario usuario = buscarUsuario(usuarioId);

        Interesse interesse =
                interesseRepository
                .findById(interesseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Interesse não encontrado: " + interesseId
                ));

        usuario.getInteresses()
                .removeIf(i -> i.getId().equals(interesse.getId()));

        usuarioRepository.save(usuario);

    }

    private Usuario buscarUsuario(Long usuarioId){

        return usuarioRepository
                .findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado: " + usuarioId
                ));

    }

}
