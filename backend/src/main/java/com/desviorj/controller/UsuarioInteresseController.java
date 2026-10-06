package com.desviorj.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.desviorj.dto.UsuarioResponse;
import com.desviorj.entity.Interesse;
import com.desviorj.entity.Usuario;
import com.desviorj.service.UsuarioInteresseService;



@RestController
@RequestMapping("/usuarios")
@CrossOrigin("*")
public class UsuarioInteresseController {



    private final UsuarioInteresseService service;



    public UsuarioInteresseController(
            UsuarioInteresseService service
    ){

        this.service = service;

    }




    @PostMapping("/{usuarioId}/interesses/{interesseId}")
    public ResponseEntity<UsuarioResponse> adicionar(

            @PathVariable Long usuarioId,

            @PathVariable Long interesseId

    ){

        Usuario usuario = service.adicionar(
                usuarioId,
                interesseId
        );


        return ResponseEntity.ok(
                new UsuarioResponse(usuario)
        );

    }




    @GetMapping("/{usuarioId}/interesses")
    public List<Interesse> listar(
            @PathVariable Long usuarioId
    ){

        return service.listar(usuarioId);

    }




    @DeleteMapping("/{usuarioId}/interesses/{interesseId}")
    public ResponseEntity<Void> remover(

            @PathVariable Long usuarioId,

            @PathVariable Long interesseId

    ){

        service.remover(usuarioId, interesseId);

        return ResponseEntity.noContent().build();

    }


}
