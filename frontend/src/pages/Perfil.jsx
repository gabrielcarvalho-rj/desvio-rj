import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";
import { mensagemErro } from "../api/erros";
import { Carregando, Erro, Vazio } from "../components/Estados";
import Icone from "../components/Icone";
import LugarCard from "../components/LugarCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useApi from "../hooks/useApi";
import useFavoritos from "../hooks/useFavoritos";

// GET    /interesses
// GET    /usuarios/{usuarioId}/interesses
// POST   /usuarios/{usuarioId}/interesses/{interesseId}
// DELETE /usuarios/{usuarioId}/interesses/{interesseId}
// GET    /recomendacoes/{usuarioId}
//
// A fonte da verdade dos chips é o backend: depois de cada clique, os interesses do
// usuário e as recomendações são carregados de novo.
function Perfil() {
    const { usuario } = useAuth();
    const toast = useToast();
    const { favoritoDe, alternar } = useFavoritos();

    const interesses = useApi("/interesses");
    const recomendacoes = useApi(`/recomendacoes/${usuario.id}`);

    const interessesUsuario = useApi(`/usuarios/${usuario.id}/interesses`);

    const [salvando, setSalvando] = useState(null);

    // useMemo: Set com os ids escolhidos, refeito só quando a lista do usuário muda.
    const idsEscolhidos = useMemo(
        () => new Set((interessesUsuario.dados || []).map((i) => i.id)),
        [interessesUsuario.dados]
    );

    // Clicar em um chip não marcado adiciona o interesse; em um marcado, remove.
    async function alternarInteresse(interesse) {
        const marcado = idsEscolhidos.has(interesse.id);
        const caminho = `/usuarios/${usuario.id}/interesses/${interesse.id}`;

        setSalvando(interesse.id);

        try {
            if (marcado) {
                await api.delete(caminho);
                toast.sucesso(`Interesse removido: ${interesse.nome}.`);
            } else {
                await api.post(caminho);
                toast.sucesso(`Interesse adicionado: ${interesse.nome}.`);
            }

            interessesUsuario.recarregar();
            recomendacoes.recarregar();
        } catch (erro) {
            toast.erro(
                mensagemErro(
                    erro,
                    marcado
                        ? "Não foi possível remover o interesse."
                        : "Não foi possível adicionar o interesse."
                )
            );
        } finally {
            setSalvando(null);
        }
    }

    return (
        <div className="container pagina">
            <header className="pagina-cabecalho">
                <h1>{usuario.nome}</h1>
                <p>{usuario.email}</p>
            </header>

            <section className="perfil-secao" aria-labelledby="interesses-titulo">
                <h2 id="interesses-titulo">Seus interesses</h2>
                <p className="texto-suave">
                    Escolha o que você gosta de fazer no Rio. Mostramos lugares das categorias
                    correspondentes.
                </p>

                {interesses.carregando && !interesses.dados && <Carregando texto="Carregando interesses..." />}
                {interesses.erro && <Erro mensagem={interesses.erro} aoTentarDeNovo={interesses.recarregar} />}
                {interessesUsuario.erro && (
                    <Erro mensagem={interessesUsuario.erro} aoTentarDeNovo={interessesUsuario.recarregar} />
                )}

                {interesses.dados && interesses.dados.length === 0 && (
                    <Vazio titulo="Ainda não há interesses cadastrados">
                        <p>
                            Um administrador precisa cadastrar os interesses antes de você escolher
                            {usuario.role === "ADMIN" && (
                                <>
                                    {" "}
                                    (<Link to="/admin">abrir administração</Link>)
                                </>
                            )}
                            .
                        </p>
                    </Vazio>
                )}

                {interesses.dados && interesses.dados.length > 0 && (
                    <ul className="chips">
                        {interesses.dados.map((interesse) => {
                            const marcado = idsEscolhidos.has(interesse.id);

                            return (
                                <li key={interesse.id}>
                                    <button
                                        type="button"
                                        className={`chip ${marcado ? "chip-ativo" : ""}`.trim()}
                                        onClick={() => alternarInteresse(interesse)}
                                        disabled={salvando === interesse.id}
                                        aria-pressed={marcado}
                                    >
                                        {marcado && <Icone nome="check" tamanho={16} />}
                                        {interesse.nome}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <section className="perfil-secao" aria-labelledby="recomendados-titulo">
                <h2 id="recomendados-titulo">Recomendados para você</h2>

                {recomendacoes.carregando && !recomendacoes.dados && (
                    <Carregando texto="Buscando recomendações..." />
                )}
                {recomendacoes.erro && (
                    <Erro mensagem={recomendacoes.erro} aoTentarDeNovo={recomendacoes.recarregar} />
                )}

                {recomendacoes.dados && recomendacoes.dados.length === 0 && (
                    <Vazio titulo="Nenhuma recomendação por enquanto">
                        <p>
                            Escolha interesses acima. As recomendações aparecem quando existem lugares
                            nas categorias correspondentes.
                        </p>
                    </Vazio>
                )}

                {recomendacoes.dados && recomendacoes.dados.length > 0 && (
                    <div className="grade-lugares">
                        {recomendacoes.dados.map((lugar) => (
                            <LugarCard
                                key={lugar.id}
                                lugar={lugar}
                                favorito={!!favoritoDe(lugar.id)}
                                aoFavoritar={alternar}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Perfil;
