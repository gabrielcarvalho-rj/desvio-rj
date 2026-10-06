package com.desviorj.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.desviorj.entity.ItemRoteiro;
import com.desviorj.entity.Lugar;
import com.desviorj.entity.Roteiro;
import com.desviorj.repository.ItemRoteiroRepository;
import com.desviorj.repository.LugarRepository;
import com.desviorj.repository.RoteiroRepository;

@Service
public class ItemRoteiroService {

    private final ItemRoteiroRepository itemRepository;

    private final RoteiroRepository roteiroRepository;

    private final LugarRepository lugarRepository;

    public ItemRoteiroService(
            ItemRoteiroRepository itemRepository,
            RoteiroRepository roteiroRepository,
            LugarRepository lugarRepository
    ) {

        this.itemRepository = itemRepository;
        this.roteiroRepository = roteiroRepository;
        this.lugarRepository = lugarRepository;

    }

    @Transactional
    public ItemRoteiro adicionar(
            Long roteiroId,
            Long lugarId,
            String horario,
            String observacao
    ) {

        Roteiro roteiro = buscarRoteiro(roteiroId);

        Lugar lugar =
                lugarRepository
                .findById(lugarId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Lugar não encontrado: " + lugarId
                ));

        ItemRoteiro item = new ItemRoteiro();

        item.setRoteiro(roteiro);
        item.setLugar(lugar);
        item.setHorario(horario);
        item.setObservacao(observacao);

        return itemRepository.save(item);

    }

    @Transactional(readOnly = true)
    public List<ItemRoteiro> listar(Long roteiroId){

        Roteiro roteiro = buscarRoteiro(roteiroId);

        return itemRepository.findByRoteiroOrderByHorarioAscIdAsc(roteiro);

    }

    private Roteiro buscarRoteiro(Long roteiroId) {

        return roteiroRepository
                .findById(roteiroId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Roteiro não encontrado: " + roteiroId
                ));

    }

}
