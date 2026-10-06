package com.desviorj.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.desviorj.dto.LoginRequest;
import com.desviorj.dto.LoginResponse;
import com.desviorj.dto.RegisterRequest;
import com.desviorj.dto.UsuarioResponse;
import com.desviorj.entity.Usuario;
import com.desviorj.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {

        this.service = service;

    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponse> registrar(
            @Valid @RequestBody RegisterRequest dados
    ) {

        Usuario usuario = service.registrar(dados);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    new UsuarioResponse(usuario)
                );

    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest dados
    ) {

        return ResponseEntity.ok(
                service.login(dados)
        );

    }

}
