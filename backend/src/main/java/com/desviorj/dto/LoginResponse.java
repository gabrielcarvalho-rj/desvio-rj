package com.desviorj.dto;


public class LoginResponse {


    private String token;


    private Long id;


    private String nome;


    private String email;


    private String role;



    public LoginResponse(
            String token,
            Long id,
            String nome,
            String email,
            String role
    ) {

        this.token = token;
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.role = role;
    }



    public String getToken() {
        return token;
    }


    public Long getId() {
        return id;
    }


    public String getNome() {
        return nome;
    }


    public String getEmail() {
        return email;
    }


    public String getRole() {
        return role;
    }

}