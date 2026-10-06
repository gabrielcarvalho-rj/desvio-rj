package com.desviorj.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.desviorj.entity.ItemRoteiro;
import com.desviorj.service.ItemRoteiroService;
import com.desviorj.dto.ItemRoteiroResponse;



@RestController
@RequestMapping("/roteiros/itens")
@CrossOrigin("*")
public class ItemRoteiroController {


    private final ItemRoteiroService service;



    public ItemRoteiroController(
            ItemRoteiroService service
    ) {

        this.service = service;

    }




    @PostMapping("/{roteiroId}/{lugarId}")
    public ResponseEntity<ItemRoteiroResponse> adicionar(
            @PathVariable Long roteiroId,
            @PathVariable Long lugarId,
            @RequestParam(required = false) String horario,
            @RequestParam(required = false) String observacao
    ) {


    	return ResponseEntity
    	        .status(HttpStatus.CREATED)
    	        .body(
    	            new ItemRoteiroResponse(
    	                service.adicionar(
    	                    roteiroId,
    	                    lugarId,
    	                    horario,
    	                    observacao
    	                )
    	            )
    	        );

    }




    @GetMapping("/{roteiroId}")
    public List<ItemRoteiroResponse> listar(
            @PathVariable Long roteiroId
    ) {

    	return service.listar(roteiroId)
    	        .stream()
    	        .map(ItemRoteiroResponse::new)
    	        .toList();

    }


}