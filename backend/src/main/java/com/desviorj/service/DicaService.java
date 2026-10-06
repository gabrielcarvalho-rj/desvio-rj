package com.desviorj.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.desviorj.entity.Dica;
import com.desviorj.entity.Lugar;
import com.desviorj.entity.Usuario;
import com.desviorj.repository.DicaRepository;
import com.desviorj.repository.LugarRepository;
import com.desviorj.repository.UsuarioRepository;

@Service
public class DicaService {

    private final DicaRepository dicaRepository;

    private final UsuarioRepository usuarioRepository;

    private final LugarRepository lugarRepository;

    public DicaService(
            DicaRepository dicaRepository,
            UsuarioRepository usuarioRepository,
            LugarRepository lugarRepository
    ) {

        this.dicaRepository = dicaRepository;
        this.usuarioRepository = usuarioRepository;
        this.lugarRepository = lugarRepository;

    }

    @Transactional
    public Dica criar(
            Long usuarioId,
            Long lugarId,
            Integer nota,
            String titulo,
            String texto
    ) {

        if (nota == null || nota < 1 || nota > 5) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A nota deve ser um número inteiro entre 1 e 5."
            );
        }

        if (titulo == null || titulo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O título da dica é obrigatório."
            );
        }

        if (texto == null || texto.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O texto da dica é obrigatório."
            );
        }

        if (texto.length() > 1000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O texto da dica deve ter no máximo 1000 caracteres."
            );
        }

        Usuario usuario =
                usuarioRepository
                .findById(usuarioId)
                .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Usuário não encontrado: " + usuarioId
                    )
                );

        Lugar lugar =
                lugarRepository
                .findById(lugarId)
                .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Lugar não encontrado: " + lugarId
                    )
                );

        Dica dica = new Dica();

        dica.setUsuario(usuario);

        dica.setLugar(lugar);

        dica.setNota(nota);

        dica.setTitulo(titulo.trim());

        dica.setTexto(texto.trim());

        return dicaRepository.save(dica);

    }

    @Transactional(readOnly = true)
    public List<Dica> listar(Long lugarId){

        if (lugarId == null) {
            return dicaRepository.findAllByOrderByCriadoEmDesc();
        }

        return dicaRepository.findByLugarIdOrderByCriadoEmDesc(lugarId);

    }

}
