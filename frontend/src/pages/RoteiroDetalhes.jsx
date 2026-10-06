import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../api/api";
import { mensagemErro } from "../api/erros";
import { Carregando, Erro, Vazio } from "../components/Estados";
import Icone from "../components/Icone";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useApi from "../hooks/useApi";
import { formatarData, formatarDuracao } from "../utils/formatar";

// GET  /roteiros/{id}
// GET  /roteiros/itens/{id}
// POST /roteiros/itens/{roteiroId}/{lugarId}?horario=...&observacao=...
function RoteiroDetalhes() {
    const { id } = useParams();
    const { usuario } = useAuth();
    const toast = useToast();

    const roteiro = useApi(`/roteiros/${id}`);
    const itens = useApi(`/roteiros/itens/${id}`);
    const lugares = useApi("/lugares");

    const [lugarId, setLugarId] = useState("");
    const [horario, setHorario] = useState("");
    const [observacao, setObservacao] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function adicionar(e) {
        e.preventDefault();

        if (!lugarId) {
            toast.erro("Escolha um lugar.");
            return;
        }

        const params = {};
        if (horario) params.horario = horario;
        if (observacao.trim()) params.observacao = observacao.trim();

        setEnviando(true);

        try {
            await api.post(`/roteiros/itens/${id}/${lugarId}`, null, { params });

            toast.sucesso("Lugar adicionado ao roteiro.");
            setLugarId("");
            setHorario("");
            setObservacao("");
            itens.recarregar();
        } catch (erro) {
            toast.erro(mensagemErro(erro, "Não foi possível adicionar o lugar."));
        } finally {
            setEnviando(false);
        }
    }

    if (roteiro.carregando && !roteiro.dados) {
        return (
            <div className="container pagina">
                <Carregando texto="Carregando roteiro..." />
            </div>
        );
    }

    if (roteiro.erro || !roteiro.dados) {
        return (
            <div className="container pagina">
                <Erro mensagem={roteiro.erro || "Roteiro não encontrado."} aoTentarDeNovo={roteiro.recarregar} />
                <p className="voltar">
                    <Link to="/roteiros">Voltar para os roteiros</Link>
                </p>
            </div>
        );
    }

    const dados = roteiro.dados;
    const donoDoRoteiro = dados.usuario?.id === usuario.id;

    return (
        <div className="container pagina">
            <nav aria-label="Você está em" className="trilha">
                <Link to="/roteiros">Roteiros</Link>
            </nav>

            <header className="pagina-cabecalho">
                <h1>{dados.titulo}</h1>
                {dados.descricao && <p>{dados.descricao}</p>}

                <p className="roteiro-meta">
                    <span>
                        <Icone nome={dados.publico ? "mundo" : "cadeado"} tamanho={16} />
                        {dados.publico ? "Público" : "Privado"}
                    </span>
                    {dados.criadoEm && <span>Criado em {formatarData(dados.criadoEm)}</span>}
                    {!donoDoRoteiro && dados.usuario && <span>Por {dados.usuario.nome}</span>}
                </p>
            </header>

            <div className="roteiro-layout">
                <section aria-labelledby="paradas-titulo">
                    <h2 id="paradas-titulo">Paradas</h2>

                    {itens.carregando && !itens.dados && <Carregando texto="Carregando paradas..." />}
                    {itens.erro && <Erro mensagem={itens.erro} aoTentarDeNovo={itens.recarregar} />}

                    {itens.dados && itens.dados.length === 0 && (
                        <Vazio titulo="Este roteiro ainda não tem paradas">
                            {donoDoRoteiro && <p>Use o formulário para adicionar o primeiro lugar.</p>}
                        </Vazio>
                    )}

                    {itens.dados && itens.dados.length > 0 && (
                        <ol className="paradas">
                            {itens.dados.map((item) => (
                                <li key={item.id} className="parada">
                                    <div className="parada-horario">
                                        {item.horario ? item.horario : "Sem horário"}
                                    </div>

                                    <div className="parada-corpo">
                                        <h3>
                                            <Link to={`/lugares/${item.lugar.id}`}>{item.lugar.nome}</Link>
                                        </h3>

                                        <p className="parada-info">
                                            {item.lugar.bairro && (
                                                <span>
                                                    <Icone nome="pin" tamanho={15} />
                                                    {item.lugar.bairro}
                                                </span>
                                            )}
                                            {formatarDuracao(item.lugar.duracaoMinutos) && (
                                                <span>
                                                    <Icone nome="relogio" tamanho={15} />
                                                    {formatarDuracao(item.lugar.duracaoMinutos)}
                                                </span>
                                            )}
                                        </p>

                                        {item.observacao && <p className="parada-obs">{item.observacao}</p>}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>

                {donoDoRoteiro && (
                    <form className="painel-roteiro formulario" onSubmit={adicionar}>
                        <h2>Adicionar lugar</h2>

                        <label className="campo">
                            <span>Lugar</span>
                            <select value={lugarId} onChange={(e) => setLugarId(e.target.value)}>
                                <option value="">Escolha um lugar</option>
                                {(lugares.dados || []).map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.nome}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="campo">
                            <span>Horário</span>
                            <input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />
                        </label>

                        <label className="campo">
                            <span>Observação</span>
                            <textarea
                                rows={3}
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                placeholder="Ex.: começar pela manhã"
                            />
                        </label>

                        <button className="botao botao-primario" disabled={enviando}>
                            {enviando ? "Adicionando..." : "Adicionar ao roteiro"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default RoteiroDetalhes;
