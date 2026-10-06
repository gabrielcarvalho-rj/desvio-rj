import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { Carregando, Erro, Vazio } from "../components/Estados";
import Icone from "../components/Icone";
import LugarCard from "../components/LugarCard";
import useApi from "../hooks/useApi";
import useFavoritos from "../hooks/useFavoritos";
import { nomeCategoria } from "../utils/formatar";

function semAcento(texto) {
    return (texto || "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
}

// Não existe endpoint de busca no backend: a filtragem é feita aqui, sobre GET /lugares.
function Lugares() {
    const lugares = useApi("/lugares");
    const categorias = useApi("/categorias");
    const { favoritoDe, alternar } = useFavoritos();

    // A Home pode abrir esta página já com uma categoria escolhida (<Link state={{ categoriaId }}>).
    const location = useLocation();

    // Os três filtros são estados simples e independentes.
    const [busca, setBusca] = useState("");
    const [categoriaId, setCategoriaId] = useState(location.state?.categoriaId || "");
    const [soGratuitos, setSoGratuitos] = useState(false);

    // useMemo (Aula 03): só refaz o filtro quando a lista ou algum filtro mudar.
    const filtrados = useMemo(() => {
        const termo = semAcento(busca.trim());

        return (lugares.dados || []).filter((lugar) => {
            if (categoriaId && String(lugar.categoria?.id) !== categoriaId) return false;
            if (soGratuitos && !lugar.gratuito) return false;

            if (termo) {
                const texto = semAcento(
                    `${lugar.nome} ${lugar.bairro || ""} ${lugar.cidade || ""} ${nomeCategoria(lugar)}`
                );
                if (!texto.includes(termo)) return false;
            }

            return true;
        });
    }, [lugares.dados, busca, categoriaId, soGratuitos]);

    const temFiltro = busca || categoriaId || soGratuitos;

    function limparFiltros() {
        setBusca("");
        setCategoriaId("");
        setSoGratuitos(false);
    }

    return (
        <div className="container pagina">
            <header className="pagina-cabecalho">
                <h1>Lugares</h1>
                <p>Escolha um lugar para ver detalhes, dicas e adicioná-lo a um roteiro.</p>
            </header>

            <div className="filtros">
                <label className="filtro-busca">
                    <Icone nome="busca" tamanho={18} />
                    <input
                        type="search"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar por nome ou bairro"
                        aria-label="Buscar por nome ou bairro"
                    />
                </label>

                <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    aria-label="Filtrar por categoria"
                >
                    <option value="">Todas as categorias</option>
                    {(categorias.dados || []).map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nome}
                        </option>
                    ))}
                </select>

                <label className="campo-check">
                    <input
                        type="checkbox"
                        checked={soGratuitos}
                        onChange={(e) => setSoGratuitos(e.target.checked)}
                    />
                    <span>Só gratuitos</span>
                </label>

                {temFiltro && (
                    <button
                        type="button"
                        className="botao botao-fantasma"
                        onClick={limparFiltros}
                    >
                        Limpar filtros
                    </button>
                )}
            </div>

            {lugares.carregando && !lugares.dados && <Carregando texto="Carregando lugares..." />}
            {lugares.erro && <Erro mensagem={lugares.erro} aoTentarDeNovo={lugares.recarregar} />}

            {lugares.dados && lugares.dados.length === 0 && (
                <Vazio titulo="Ainda não há lugares cadastrados">
                    <p>Um administrador pode cadastrar lugares na área de administração.</p>
                </Vazio>
            )}

            {lugares.dados && lugares.dados.length > 0 && filtrados.length === 0 && (
                <Vazio titulo="Nenhum lugar encontrado com esses filtros">
                    <button
                        type="button"
                        className="botao botao-secundario"
                        onClick={limparFiltros}
                    >
                        Limpar filtros
                    </button>
                </Vazio>
            )}

            {filtrados.length > 0 && (
                <>
                    <p className="contagem" aria-live="polite">
                        {filtrados.length} {filtrados.length === 1 ? "lugar" : "lugares"}
                    </p>

                    <div className="grade-lugares">
                        {filtrados.map((lugar) => (
                            <LugarCard
                                key={lugar.id}
                                lugar={lugar}
                                favorito={!!favoritoDe(lugar.id)}
                                aoFavoritar={alternar}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Lugares;
