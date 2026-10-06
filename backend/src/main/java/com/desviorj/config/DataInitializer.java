package com.desviorj.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.desviorj.entity.Usuario;
import com.desviorj.repository.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log =
            LoggerFactory.getLogger(DataInitializer.class);

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder encoder;

    private final String adminNome;

    private final String adminEmail;

    private final String adminSenha;

    private final boolean sincronizarSenha;

    public DataInitializer(
            UsuarioRepository usuarioRepository,
            PasswordEncoder encoder,
            @Value("${app.admin.nome:Administrador}") String adminNome,
            @Value("${app.admin.email:admin@desviorj.com}") String adminEmail,
            @Value("${app.admin.senha:admin123}") String adminSenha,
            @Value("${app.admin.sincronizar-senha:true}") boolean sincronizarSenha
    ) {

        this.usuarioRepository = usuarioRepository;
        this.encoder = encoder;
        this.adminNome = adminNome;
        this.adminEmail = adminEmail.trim().toLowerCase();
        this.adminSenha = adminSenha;
        this.sincronizarSenha = sincronizarSenha;

    }

    @Override
    public void run(String... args) {

        Usuario admin = usuarioRepository
                .findFirstByEmailIgnoreCase(adminEmail)
                .orElse(null);

        if (admin == null) {

            admin = new Usuario();
            admin.setNome(adminNome);
            admin.setEmail(adminEmail);
            admin.setSenha(encoder.encode(adminSenha));
            admin.setRole("ADMIN");
            admin.setMoradorRio(true);

            usuarioRepository.save(admin);

            log.info("Usuario ADMIN inicial criado: {}", adminEmail);

            return;
        }

        boolean alterado = false;

        if (!"ADMIN".equals(admin.getRole())) {
            admin.setRole("ADMIN");
            alterado = true;
        }

        String hash = admin.getSenha();

        boolean hashInvalido = hash == null || !hash.startsWith("$2");

        if (hashInvalido
                || (sincronizarSenha && !encoder.matches(adminSenha, hash))) {

            admin.setSenha(encoder.encode(adminSenha));
            alterado = true;

        }

        if (alterado) {

            usuarioRepository.save(admin);

            log.info("Usuario ADMIN ajustado: {}", adminEmail);

        }

    }

}
