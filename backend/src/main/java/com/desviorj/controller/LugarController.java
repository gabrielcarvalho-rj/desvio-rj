package com.desviorj.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.desviorj.dto.LugarRequest;
import com.desviorj.dto.LugarResponse;
import com.desviorj.entity.Categoria;
import com.desviorj.entity.Lugar;
import com.desviorj.repository.CategoriaRepository;
import com.desviorj.repository.LugarRepository;
import com.desviorj.service.LugarService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/lugares")
@CrossOrigin("*")
public class LugarController {

    private final LugarRepository lugarRepository;

    private final CategoriaRepository categoriaRepository;

    private final LugarService lugarService;

    public LugarController(
            LugarRepository lugarRepository,
            CategoriaRepository categoriaRepository,
            LugarService lugarService
    ) {
        this.lugarRepository = lugarRepository;
        this.categoriaRepository = categoriaRepository;
        this.lugarService = lugarService;
    }

    @GetMapping
    public List<LugarResponse> listar() {

        return lugarRepository.findAll()
                .stream()
                .map(LugarResponse::new)
                .toList();

    }

    @GetMapping("/{id}")
    public ResponseEntity<LugarResponse> buscar(
            @PathVariable Long id
    ) {

        return lugarRepository.findById(id)
                .map(lugar -> ResponseEntity.ok(
                        new LugarResponse(lugar)
                ))
                .orElse(ResponseEntity.notFound().build());

    }

    // ADMIN
    @PostMapping
    public ResponseEntity<LugarResponse> criar(
            @Valid @RequestBody LugarRequest dados
    ) {

        Lugar lugar = new Lugar();

        preencherDados(lugar, dados);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    new LugarResponse(
                        lugarRepository.save(lugar)
                    )
                );
    }

    // ADMIN
    @PutMapping("/{id}")
    public ResponseEntity<LugarResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody LugarRequest dados
    ) {

        Lugar lugar = lugarRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Lugar não encontrado: " + id
                ));

        preencherDados(lugar, dados);

        return ResponseEntity.ok(
                new LugarResponse(
                        lugarRepository.save(lugar)
                )
        );
    }

    // ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id
    ) {

        lugarService.excluir(id);

        return ResponseEntity.noContent().build();
    }

    private void preencherDados(
            Lugar lugar,
            LugarRequest dados
    ) {

        lugar.setNome(dados.getNome().trim());
        lugar.setDescricao(dados.getDescricao());
        lugar.setCidade(dados.getCidade());
        lugar.setBairro(dados.getBairro());
        lugar.setEndereco(dados.getEndereco());
        lugar.setLatitude(dados.getLatitude());
        lugar.setLongitude(dados.getLongitude());
        lugar.setFotoUrl(dados.getFotoUrl());
        lugar.setGratuito(dados.isGratuito());
        lugar.setPrecoInicial(dados.getPrecoInicial());
        lugar.setDuracaoMinutos(dados.getDuracaoMinutos());
        lugar.setDificuldade(dados.getDificuldade());
        lugar.setSiteExterno(dados.getSiteExterno());

        if(dados.getCategoriaId() != null){

            Categoria categoria =
                    categoriaRepository
                    .findById(dados.getCategoriaId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Categoria não encontrada: " + dados.getCategoriaId()
                    ));

            lugar.setCategoria(categoria);
        }

    }

}
