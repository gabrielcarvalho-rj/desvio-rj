import { useCallback, useEffect, useState } from "react";

import api from "../api/api";
import { mensagemErro } from "../api/erros";

// Busca dados com GET e controla loading / erro.
//
//   const { dados, carregando, erro, recarregar } = useApi("/lugares");
//
// Passe null como caminho para não buscar (útil quando falta o usuário logado).
export default function useApi(caminho) {
    const [tentativa, setTentativa] = useState(0);
    const [resultado, setResultado] = useState({
        chave: null,
        caminho: null,
        dados: null,
        erro: null,
    });

    const chave = `${caminho}#${tentativa}`;

    useEffect(() => {
        if (!caminho) return undefined;

        let cancelado = false;

        api.get(caminho)
            .then((resposta) => {
                if (!cancelado) {
                    setResultado({ chave, caminho, dados: resposta.data, erro: null });
                }
            })
            .catch((erro) => {
                if (!cancelado) {
                    setResultado({ chave, caminho, dados: null, erro: mensagemErro(erro) });
                }
            });

        return () => {
            cancelado = true;
        };
    }, [caminho, chave]);

    const recarregar = useCallback(() => setTentativa((n) => n + 1), []);

    // Só usamos o resultado se ele pertence ao caminho atual.
    const doCaminho = resultado.caminho === caminho;

    return {
        dados: doCaminho ? resultado.dados : null,
        erro: doCaminho ? resultado.erro : null,
        carregando: !!caminho && resultado.chave !== chave,
        recarregar,
    };
}
