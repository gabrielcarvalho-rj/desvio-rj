import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import api from "../api/api";
import { mensagemErro } from "../api/erros";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Cadastro() {
    const { login, autenticado } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [moradorRio, setMoradorRio] = useState(true);
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    if (autenticado && !enviando) {
        return <Navigate to="/" replace />;
    }

    async function cadastrar(e) {
        e.preventDefault();
        setErro("");

        if (senha.length < 6) {
            setErro("A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        setEnviando(true);

        try {
            // 1. cria a conta
            await api.post("/auth/register", {
                nome: nome.trim(),
                email: email.trim(),
                senha,
                moradorRio,
            });

            // 2. entra automaticamente
            const resposta = await api.post("/auth/login", { email: email.trim(), senha });

            login(resposta.data);
            toast.sucesso("Conta criada. Escolha seus interesses para receber recomendações.");
            navigate("/perfil", { replace: true });
        } catch (e2) {
            setErro(mensagemErro(e2, "Não foi possível criar a conta."));
            setEnviando(false);
        }
    }

    return (
        <div className="auth-pagina">
            <div className="auth-cartao">
                <h1>Criar conta</h1>
                <p className="texto-suave">Salve lugares, monte roteiros e publique dicas.</p>

                <form className="formulario" onSubmit={cadastrar}>
                    <label className="campo">
                        <span>Nome</span>
                        <input
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </label>

                    <label className="campo">
                        <span>E-mail</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </label>

                    <label className="campo">
                        <span>Senha</span>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                        <small>Mínimo de 6 caracteres.</small>
                    </label>

                    <label className="campo-check">
                        <input
                            type="checkbox"
                            checked={moradorRio}
                            onChange={(e) => setMoradorRio(e.target.checked)}
                        />
                        <span>Moro no Rio de Janeiro</span>
                    </label>

                    {erro && (
                        <p className="aviso-erro" role="alert">
                            {erro}
                        </p>
                    )}

                    <button className="botao botao-primario botao-bloco" disabled={enviando}>
                        {enviando ? "Criando conta..." : "Criar conta"}
                    </button>
                </form>

                <p className="auth-rodape">
                    Já tem conta? <Link to="/login">Entrar</Link>
                </p>
            </div>
        </div>
    );
}

export default Cadastro;
