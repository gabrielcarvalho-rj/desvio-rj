package com.desviorj.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.desviorj.entity.Interesse;
import com.desviorj.repository.InteresseRepository;
import com.desviorj.service.InteresseService;



@RestController
@RequestMapping("/interesses")
@CrossOrigin("*")
public class InteresseController {


    private final InteresseRepository repository;

    private final InteresseService service;



    public InteresseController(
            InteresseRepository repository,
            InteresseService service
    ){

        this.repository = repository;
        this.service = service;

    }



    @PostMapping
    public ResponseEntity<Interesse> criar(
            @RequestBody Interesse interesse
    ){

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    repository.save(interesse)
                );

    }




    @GetMapping
    public List<Interesse> listar(){

        return repository.findAll();

    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id
    ){

        service.excluir(id);

        return ResponseEntity.noContent().build();

    }


}
