import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";
import { mensagemErro } from "../api/erros";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// POST /roteiros/{usuarioId}?titulo=...&descricao=...&publico=...
// (o backend recebe query parameters, não JSON)
function CriarRoteiro() {
    const { usuario } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [publico, setPublico] = useState(false);
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function criar(e) {
        e.preventDefault();
        setErro("");

        if (!titulo.trim()) {
            setErro("Dê um título ao roteiro.");
            return;
        }

        setEnviando(true);

        try {
            const resposta = await api.post(`/roteiros/${usuario.id}`, null, {
                params: { titulo: titulo.trim(), descricao: descricao.trim(), publico },
            });

            toast.sucesso("Roteiro criado. Agora adicione os lugares.");
            navigate(`/roteiros/${resposta.data.id}`);
        } catch (e2) {
            setErro(mensagemErro(e2, "Não foi possível criar o roteiro."));
            setEnviando(false);
        }
    }

    return (
        <div className="auth-pagina">
            <div className="auth-cartao auth-cartao-largo">
                <h1>Novo roteiro</h1>
                <p className="texto-suave">
                    Crie o roteiro e depois adicione lugares com horário e observações.
                </p>

                <form className="formulario" onSubmit={criar}>
                    <label className="campo">
                        <span>Título</span>
                        <input
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            maxLength={120}
                            placeholder="Ex.: Sábado de trilha e praia"
                            required
                        />
                    </label>

                    <label className="campo">
                        <span>Descrição</span>
                        <textarea
                            rows={4}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Opcional"
                        />
                    </label>

                    <label className="campo-check">
                        <input
                            type="checkbox"
                            checked={publico}
                            onChange={(e) => setPublico(e.target.checked)}
                        />
                        <span>Roteiro público</span>
                    </label>

                    {erro && (
                        <p className="aviso-erro" role="alert">
                            {erro}
                        </p>
                    )}

                    <div className="formulario-acoes">
                        <Link to="/roteiros" className="botao botao-secundario">
                            Cancelar
                        </Link>
                        <button className="botao botao-primario" disabled={enviando}>
                            {enviando ? "Criando..." : "Criar roteiro"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CriarRoteiro;
