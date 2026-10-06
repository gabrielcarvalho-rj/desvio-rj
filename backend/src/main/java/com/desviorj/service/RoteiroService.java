package com.desviorj.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.desviorj.entity.Roteiro;
import com.desviorj.entity.Usuario;
import com.desviorj.repository.LugarRepository;
import com.desviorj.repository.RoteiroRepository;
import com.desviorj.repository.UsuarioRepository;

@Service
public class RoteiroService {

    private final RoteiroRepository roteiroRepository;

    private final UsuarioRepository usuarioRepository;

    private final LugarRepository lugarRepository;

    public RoteiroService(
            RoteiroRepository roteiroRepository,
            UsuarioRepository usuarioRepository,
            LugarRepository lugarRepository
    ) {

        this.roteiroRepository = roteiroRepository;
        this.usuarioRepository = usuarioRepository;
        this.lugarRepository = lugarRepository;

    }

    @Transactional
    public Roteiro criar(
            Long usuarioId,
            String titulo,
            String descricao,
            boolean publico
    ) {

        if (titulo == null || titulo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O título do roteiro é obrigatório."
            );
        }

        Usuario usuario = buscarUsuario(usuarioId);

        Roteiro roteiro = new Roteiro();

        roteiro.setTitulo(titulo.trim());

        roteiro.setDescricao(descricao);

        roteiro.setPublico(publico);

        roteiro.setUsuario(usuario);

        return roteiroRepository.save(roteiro);

    }

    @Transactional(readOnly = true)
    public List<Roteiro> listarUsuario(
            Long usuarioId
    ) {

        Usuario usuario = buscarUsuario(usuarioId);

        return roteiroRepository.findByUsuario(usuario);

    }

    @Transactional(readOnly = true)
    public Roteiro buscar(Long id){

        return roteiroRepository
                .findById(id)
                .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Roteiro não encontrado: " + id
                    )
                );

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
