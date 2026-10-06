import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";
import { mensagemErro } from "../api/erros";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useApi from "../hooks/useApi";
import { formatarData } from "../utils/formatar";
import { Carregando, Erro } from "./Estados";
import Icone from "./Icone";

const NOTAS = [1, 2, 3, 4, 5];

// Cinco estrelas somente para exibir a nota de uma dica (1 a 5, sem meia estrela).
function Estrelas({ nota }) {
    return (
        <span className="estrelas" role="img" aria-label={`Avaliação: ${nota} de 5 estrelas`}>
            {NOTAS.map((n) => (
                <Icone key={n} nome="estrela" tamanho={16} preenchido={n <= nota} />
            ))}
        </span>
    );
}

// Dicas de um lugar, cada uma com uma nota de 1 a 5 estrelas.
//   GET  /dicas?lugarId={id}
//   POST /dicas/{usuarioId}/{lugarId}?nota=...&titulo=...&texto=...
function DicasLugar({ lugarId }) {
    const { usuario, autenticado } = useAuth();
    const toast = useToast();

    const { dados, carregando, erro, recarregar } = useApi(`/dicas?lugarId=${lugarId}`);

    const [nota, setNota] = useState(0);
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [filtroNota, setFiltroNota] = useState("todas");

    // useMemo: o filtro é feito aqui, sobre as dicas que já vieram do GET /dicas.
    const dicasFiltradas = useMemo(() => {
        if (filtroNota === "todas") return dados || [];

        return (dados || []).filter((dica) => dica.nota === Number(filtroNota));
    }, [dados, filtroNota]);

    async function enviar(e) {
        e.preventDefault();

        if (nota < 1 || nota > 5) {
            toast.erro("Escolha uma nota de 1 a 5 estrelas.");
            return;
        }

        if (!titulo.trim() || !texto.trim()) {
            toast.erro("Preencha o título e o texto da dica.");
            return;
        }

        setEnviando(true);

        try {
            await api.post(`/dicas/${usuario.id}/${lugarId}`, null, {
                params: { nota, titulo: titulo.trim(), texto: texto.trim() },
            });

            setNota(0);
            setTitulo("");
            setTexto("");
            setFiltroNota("todas");
            toast.sucesso("Dica publicada.");
            recarregar();
        } catch (erroApi) {
            toast.erro(mensagemErro(erroApi, "Não foi possível publicar a dica."));
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section className="dicas" aria-labelledby="dicas-titulo">
            <h2 id="dicas-titulo">Dicas de quem já foi</h2>

            {carregando && !dados && <Carregando texto="Carregando dicas..." />}
            {erro && <Erro mensagem={erro} aoTentarDeNovo={recarregar} />}

            {dados && dados.length === 0 && (
                <p className="dicas-vazio">
                    Ninguém publicou dicas sobre este lugar ainda.
                    {autenticado ? " Seja a primeira pessoa." : ""}
                </p>
            )}

            {dados && dados.length > 0 && (
                <label className="dicas-filtro">
                    <span>Filtrar por avaliação</span>
                    <select value={filtroNota} onChange={(e) => setFiltroNota(e.target.value)}>
                        <option value="todas">Todas</option>
                        {NOTAS.map((n) => (
                            <option key={n} value={n}>
                                {n} {n === 1 ? "estrela" : "estrelas"}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            {dados && dados.length > 0 && dicasFiltradas.length === 0 && (
                <p className="dicas-vazio">Nenhuma dica com esta avaliação.</p>
            )}

            {dicasFiltradas.length > 0 && (
                <ul className="dicas-lista">
                    {dicasFiltradas.map((dica) => (
                        <li key={dica.id} className="dica">
                            <Estrelas nota={dica.nota} />
                            <h3>{dica.titulo}</h3>
                            <p>{dica.texto}</p>
                            <p className="dica-autor">
                                {dica.usuario?.nome || "Usuário"}
                                {dica.criadoEm && ` em ${formatarData(dica.criadoEm)}`}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            {autenticado ? (
                <form className="formulario dicas-form" onSubmit={enviar}>
                    <h3>Escreva uma dica</h3>

                    <div className="avaliacao" role="group" aria-labelledby="avaliacao-rotulo">
                        <span id="avaliacao-rotulo" className="avaliacao-rotulo">
                            Sua avaliação
                        </span>

                        <div className="avaliacao-estrelas">
                            {NOTAS.map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    className={`avaliacao-estrela ${n <= nota ? "avaliacao-estrela-ativa" : ""}`.trim()}
                                    onClick={() => setNota(n)}
                                    aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
                                    aria-pressed={n === nota}
                                >
                                    <Icone nome="estrela" tamanho={28} preenchido={n <= nota} />
                                </button>
                            ))}

                            <span className="avaliacao-valor" aria-live="polite">
                                {nota > 0 ? `${nota} de 5` : "Escolha uma nota"}
                            </span>
                        </div>
                    </div>

                    <label className="campo">
                        <span>Título</span>
                        <input
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            maxLength={120}
                            placeholder="Ex.: Chegue antes das 9h"
                        />
                    </label>

                    <label className="campo">
                        <span>Dica</span>
                        <textarea
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            maxLength={1000}
                            rows={4}
                            placeholder="O que você gostaria de ter sabido antes de ir?"
                        />
                    </label>

                    <button className="botao botao-primario" disabled={enviando}>
                        {enviando ? "Publicando..." : "Publicar dica"}
                    </button>
                </form>
            ) : (
                <p className="dicas-login">
                    <Link to="/login">
                        Entre na sua conta
                    </Link>{" "}
                    para publicar uma dica.
                </p>
            )}
        </section>
    );
}

export default DicasLugar;
