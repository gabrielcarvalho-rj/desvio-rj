import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";
import { mensagemErro } from "../api/erros";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useApi from "./useApi";

// Favoritos do usuário logado, sempre vindos do backend.
//   GET    /favoritos/{usuarioId}
//   POST   /favoritos/{usuarioId}/{lugarId}
//   DELETE /favoritos/{id}
export default function useFavoritos() {
    const { usuario, autenticado } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const { dados, carregando, erro, recarregar } = useApi(
        autenticado ? `/favoritos/${usuario.id}` : null
    );

    const favoritos = useMemo(() => dados || [], [dados]);

    // Devolve o id do favorito (ou null) para um lugar.
    const favoritoDe = useCallback(
        (lugarId) => favoritos.find((f) => f.lugar.id === lugarId)?.id ?? null,
        [favoritos]
    );

    // Favorita se ainda não é favorito; remove se já é.
    const alternar = useCallback(
        async (lugarId) => {
            if (!autenticado) {
                toast.erro("Entre na sua conta para favoritar lugares.");
                navigate("/login");
                return;
            }

            const existente = favoritoDe(lugarId);

            try {
                if (existente) {
                    await api.delete(`/favoritos/${existente}`);
                    toast.sucesso("Lugar removido dos favoritos.");
                } else {
                    await api.post(`/favoritos/${usuario.id}/${lugarId}`);
                    toast.sucesso("Lugar salvo nos favoritos.");
                }

                recarregar();
            } catch (e) {
                toast.erro(mensagemErro(e, "Não foi possível atualizar os favoritos."));
            }
        },
        [autenticado, favoritoDe, navigate, recarregar, toast, usuario]
    );

    return { favoritos, carregando, erro, favoritoDe, alternar };
}
