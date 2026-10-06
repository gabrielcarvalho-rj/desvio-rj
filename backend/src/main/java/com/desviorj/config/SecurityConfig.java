package com.desviorj.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.desviorj.repository.UsuarioRepository;
import com.desviorj.security.JwtAuthFilter;
import com.desviorj.security.JwtService;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtService jwtService,
            UsuarioRepository usuarioRepository
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) ->
                    escrever(res, 401,
                        "Não autenticado. Faça login e envie o token Bearer.")
                )
                .accessDeniedHandler((req, res, e) ->
                    escrever(res, 403,
                        "Acesso negado. Apenas administradores.")
                )
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(
                    "/auth/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()

                // Usuario comum apenas visualiza lugares e categorias
                .requestMatchers(HttpMethod.GET, "/lugares/**", "/categorias/**").permitAll()

                // Somente ADMIN cadastra, edita e remove
                .requestMatchers(HttpMethod.POST, "/lugares/**", "/categorias/**", "/interesses/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/lugares/**", "/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/lugares/**", "/categorias/**", "/interesses/**").hasRole("ADMIN")

                // Demais rotas continuam abertas para nao quebrar o React atual
                .anyRequest().permitAll()
            )
            .addFilterBefore(
                new JwtAuthFilter(jwtService, usuarioRepository),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    private static void escrever(
            HttpServletResponse res,
            int status,
            String mensagem
    ) throws IOException {

        res.setStatus(status);
        res.setContentType("application/json;charset=UTF-8");
        res.setCharacterEncoding(StandardCharsets.UTF_8.name());

        res.getWriter().write(
            "{\"status\":" + status
            + ",\"mensagem\":\"" + mensagem
            + "\",\"message\":\"" + mensagem + "\"}"
        );

    }

}
