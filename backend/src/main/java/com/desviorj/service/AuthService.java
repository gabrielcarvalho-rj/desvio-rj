package com.desviorj.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.desviorj.dto.LoginRequest;
import com.desviorj.dto.LoginResponse;
import com.desviorj.dto.RegisterRequest;
import com.desviorj.entity.Usuario;
import com.desviorj.repository.UsuarioRepository;
import com.desviorj.security.JwtService;

@Service
public class AuthService {

    private final UsuarioRepository repository;

    private final JwtService jwtService;

    private final PasswordEncoder encoder;

    public AuthService(
            UsuarioRepository repository,
            JwtService jwtService,
            PasswordEncoder encoder
    ) {

        this.repository = repository;
        this.jwtService = jwtService;
        this.encoder = encoder;

    }

    public Usuario registrar(RegisterRequest dados) {

        String email = dados.getEmail().trim().toLowerCase();

        if (repository.existsByEmailIgnoreCase(email)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "E-mail já cadastrado."
            );

        }

        Usuario usuario = new Usuario();

        usuario.setNome(dados.getNome().trim());

        usuario.setEmail(email);

        usuario.setSenha(
                encoder.encode(dados.getSenha())
        );

        usuario.setMoradorRio(
                dados.isMoradorRio()
        );

        // Cadastro publico sempre cria usuario comum
        usuario.setRole("USER");

        return repository.save(usuario);

    }

    public LoginResponse login(LoginRequest dados) {

        String email = dados.getEmail().trim().toLowerCase();

        Usuario usuario = repository
                .findFirstByEmailIgnoreCase(email)
                .orElseThrow(this::credenciaisInvalidas);

        if (usuario.getSenha() == null
                || !encoder.matches(dados.getSenha(), usuario.getSenha())) {

            throw credenciaisInvalidas();

        }

        String token = jwtService.gerarToken(usuario.getEmail());

        return new LoginResponse(
                token,
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole()
        );

    }

    private ResponseStatusException credenciaisInvalidas() {

        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "E-mail ou senha inválidos."
        );

    }

}
