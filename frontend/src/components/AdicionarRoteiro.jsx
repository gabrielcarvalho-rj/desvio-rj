import { useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/api";
import { mensagemErro } from "../api/erros";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useApi from "../hooks/useApi";

// Painel "Adicionar a um roteiro" na página do lugar.
//   GET  /roteiros/usuario/{usuarioId}
//   POST /roteiros/itens/{roteiroId}/{lugarId}?horario=...&observacao=...
function AdicionarRoteiro({ lugarId }) {
    const { usuario, autenticado } = useAuth();
    const toast = useToast();

    const { dados: roteiros, carregando, erro } = useApi(
        autenticado ? `/roteiros/usuario/${usuario.id}` : null
    );

    const [roteiroId, setRoteiroId] = useState("");
    const [horario, setHorario] = useState("");
    const [observacao, setObservacao] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function adicionar(e) {
        e.preventDefault();

        if (!roteiroId) {
            toast.erro("Escolha um roteiro.");
            return;
        }

        // Só envia os parâmetros opcionais que foram preenchidos.
        const params = {};
        if (horario) params.horario = horario;
        if (observacao.trim()) params.observacao = observacao.trim();

        setEnviando(true);

        try {
            await api.post(`/roteiros/itens/${roteiroId}/${lugarId}`, null, { params });

            toast.sucesso("Lugar adicionado ao roteiro.");
            setHorario("");
            setObservacao("");
        } catch (erroApi) {
            toast.erro(mensagemErro(erroApi, "Não foi possível adicionar ao roteiro."));
        } finally {
            setEnviando(false);
        }
    }

    if (!autenticado) {
        return (
            <div className="painel-roteiro">
                <h2>Adicionar a um roteiro</h2>
                <p>
                    <Link to="/login">
                        Entre na sua conta
                    </Link>{" "}
                    para montar roteiros com este lugar.
                </p>
            </div>
        );
    }

    return (
        <form className="painel-roteiro formulario" onSubmit={adicionar}>
            <h2>Adicionar a um roteiro</h2>

            {carregando && <p>Carregando seus roteiros...</p>}
            {erro && <p className="texto-erro">{erro}</p>}

            {roteiros && roteiros.length === 0 && (
                <p>
                    Você ainda não tem roteiros. <Link to="/roteiros/criar">Crie o primeiro</Link>.
                </p>
            )}

            {roteiros && roteiros.length > 0 && (
                <>
                    <label className="campo">
                        <span>Roteiro</span>
                        <select value={roteiroId} onChange={(e) => setRoteiroId(e.target.value)}>
                            <option value="">Escolha um roteiro</option>
                            {roteiros.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.titulo}
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
                            placeholder="Ex.: levar protetor solar"
                        />
                    </label>

                    <button className="botao botao-primario" disabled={enviando}>
                        {enviando ? "Adicionando..." : "Adicionar ao roteiro"}
                    </button>
                </>
            )}
        </form>
    );
}

export default AdicionarRoteiro;
