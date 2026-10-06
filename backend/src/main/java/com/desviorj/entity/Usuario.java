package com.desviorj.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    private String senha;

    private String role;

    private boolean moradorRio;

    private LocalDateTime criadoEm;
    
    @ManyToMany
    @JoinTable(
            name = "usuario_interesses",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "interesse_id")
    )
    private List<Interesse> interesses = new ArrayList<>();


    public Usuario() {
        this.criadoEm = LocalDateTime.now();
        this.role = "USER";
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getNome() {
        return nome;
    }


    public void setNome(String nome) {
        this.nome = nome;
    }


    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public String getSenha() {
        return senha;
    }


    public void setSenha(String senha) {
        this.senha = senha;
    }


    public String getRole() {
        return role;
    }


    public void setRole(String role) {
        this.role = role;
    }


    public boolean isMoradorRio() {
        return moradorRio;
    }


    public void setMoradorRio(boolean moradorRio) {
        this.moradorRio = moradorRio;
    }


    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }


    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
    
    public List<Interesse> getInteresses() {
        return interesses;
    }


    public void setInteresses(List<Interesse> interesses) {
        this.interesses = interesses;
    }
}