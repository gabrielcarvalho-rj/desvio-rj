package com.desviorj.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.desviorj.dto.CategoriaRequest;
import com.desviorj.dto.CategoriaResponse;
import com.desviorj.entity.Categoria;
import com.desviorj.repository.CategoriaRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/categorias")
@CrossOrigin("*")
public class CategoriaController {

    private final CategoriaRepository repository;

    public CategoriaController(CategoriaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CategoriaResponse> listar() {

        return repository.findAll()
                .stream()
                .map(CategoriaResponse::new)
                .toList();

    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> criar(
            @Valid @RequestBody CategoriaRequest dados
    ) {

        Categoria categoria = new Categoria();

        categoria.setNome(dados.getNome().trim());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    new CategoriaResponse(
                        repository.save(categoria)
                    )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequest dados
    ) {

        Categoria categoria = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Categoria não encontrada: " + id
                ));

        categoria.setNome(dados.getNome().trim());

        return ResponseEntity.ok(
                new CategoriaResponse(
                    repository.save(categoria)
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id
    ) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Categoria não encontrada: " + id
            );
        }

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

}
