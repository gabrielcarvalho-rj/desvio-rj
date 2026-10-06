package com.desviorj.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.desviorj.entity.Lugar;
import com.desviorj.repository.DicaRepository;
import com.desviorj.repository.FavoritoRepository;
import com.desviorj.repository.ItemRoteiroRepository;
import com.desviorj.repository.LugarRepository;

@Service
public class LugarService {

    private final LugarRepository lugarRepository;

    private final FavoritoRepository favoritoRepository;

    private final ItemRoteiroRepository itemRoteiroRepository;

    private final DicaRepository dicaRepository;

    public LugarService(
            LugarRepository lugarRepository,
            FavoritoRepository favoritoRepository,
            ItemRoteiroRepository itemRoteiroRepository,
            DicaRepository dicaRepository
    ) {

        this.lugarRepository = lugarRepository;
        this.favoritoRepository = favoritoRepository;
        this.itemRoteiroRepository = itemRoteiroRepository;
        this.dicaRepository = dicaRepository;

    }

    /**
     * Remove o lugar e tudo que depende dele (favoritos, itens de roteiro
     * e dicas), evitando erro de chave estrangeira.
     */
    @Transactional
    public void excluir(Long id) {

        Lugar lugar = lugarRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Lugar não encontrado: " + id
                ));

        favoritoRepository.deleteByLugar(lugar);

        itemRoteiroRepository.deleteByLugar(lugar);

        dicaRepository.deleteByLugar(lugar);

        lugarRepository.delete(lugar);

    }

}
