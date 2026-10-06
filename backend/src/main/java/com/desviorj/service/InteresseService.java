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
public class InteresseService {

    private final InteresseRepository interesseRepository;

    private final UsuarioRepository usuarioRepository;

    public InteresseService(
            InteresseRepository interesseRepository,
            UsuarioRepository usuarioRepository
    ){

        this.interesseRepository = interesseRepository;
        this.usuarioRepository = usuarioRepository;

    }

    /**
     * Exclui o interesse. Antes, remove a associacao dele de todos os
     * usuarios (tabela usuario_interesses), para nao violar a chave
     * estrangeira. Tudo na mesma transacao.
     */
    @Transactional
    public void excluir(Long id){

        Interesse interesse =
                interesseRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Interesse não encontrado: " + id
                ));

        List<Usuario> usuarios = usuarioRepository.findByInteressesId(id);

        for (Usuario usuario : usuarios) {

            usuario.getInteresses()
                    .removeIf(i -> i.getId().equals(id));

        }

        usuarioRepository.saveAll(usuarios);

        // Garante que as associacoes saiam do banco antes de apagar o interesse
        usuarioRepository.flush();

        interesseRepository.delete(interesse);

    }

}
