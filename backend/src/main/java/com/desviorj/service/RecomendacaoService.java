package com.desviorj.service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.desviorj.entity.Lugar;
import com.desviorj.entity.Usuario;
import com.desviorj.repository.LugarRepository;
import com.desviorj.repository.UsuarioRepository;

@Service
public class RecomendacaoService {

    private final UsuarioRepository usuarioRepository;

    private final LugarRepository lugarRepository;

    public RecomendacaoService(
            UsuarioRepository usuarioRepository,
            LugarRepository lugarRepository
    ){

        this.usuarioRepository = usuarioRepository;
        this.lugarRepository = lugarRepository;

    }

    /**
     * Recomenda lugares cuja categoria tenha o mesmo nome de
     * algum interesse do usuario (ex.: interesse "Praias" -> categoria "Praias").
     */
    @Transactional(readOnly = true)
    public List<Lugar> recomendar(Long usuarioId){

        Usuario usuario =
                usuarioRepository
                .findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado: " + usuarioId
                ));

        Set<String> interesses = usuario.getInteresses()
                .stream()
                .map(interesse -> interesse.getNome())
                .filter(Objects::nonNull)
                .map(nome -> nome.trim().toLowerCase())
                .collect(Collectors.toSet());

        if (interesses.isEmpty()) {
            return List.of();
        }

        return lugarRepository.findAll()
                .stream()
                .filter(lugar ->
                        lugar.getCategoria() != null
                        && lugar.getCategoria().getNome() != null
                        && interesses.contains(
                            lugar.getCategoria().getNome().trim().toLowerCase()
                        )
                )
                .toList();

    }

}
