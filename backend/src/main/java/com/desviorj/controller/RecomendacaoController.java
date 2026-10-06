package com.desviorj.controller;


import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.desviorj.dto.LugarResponse;
import com.desviorj.service.RecomendacaoService;



@RestController
@RequestMapping("/recomendacoes")
@CrossOrigin("*")
public class RecomendacaoController {



    private final RecomendacaoService service;



    public RecomendacaoController(
            RecomendacaoService service
    ){

        this.service = service;

    }




    @GetMapping("/{usuarioId}")
    public List<LugarResponse> recomendar(

            @PathVariable Long usuarioId

    ){

        return service.recomendar(usuarioId)
                .stream()
                .map(LugarResponse::new)
                .toList();

    }


}