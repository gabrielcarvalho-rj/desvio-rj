package com.desviorj.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.desviorj.repository.UsuarioRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UsuarioRepository usuarioRepository;

    public JwtAuthFilter(
            JwtService jwtService,
            UsuarioRepository usuarioRepository
    ) {

        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;

    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null
                && header.startsWith("Bearer ")
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            try {

                String email = jwtService.extrairEmail(header.substring(7));

                usuarioRepository.findFirstByEmailIgnoreCase(email)
                        .ifPresent(usuario -> {

                            String role = usuario.getRole() == null
                                    ? "USER"
                                    : usuario.getRole().toUpperCase();

                            UsernamePasswordAuthenticationToken auth =
                                    new UsernamePasswordAuthenticationToken(
                                            usuario.getEmail(),
                                            null,
                                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                                    );

                            SecurityContextHolder.getContext().setAuthentication(auth);

                        });

            } catch (Exception e) {

                // Token invalido ou expirado: segue como anonimo.
                SecurityContextHolder.clearContext();

            }

        }

        chain.doFilter(request, response);

    }

}
