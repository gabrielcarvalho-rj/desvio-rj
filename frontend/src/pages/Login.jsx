import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import api from "../api/api";
import { mensagemErro } from "../api/erros";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function Login() {
    const { login, autenticado } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    // useRef (Aula 07): guarda o acesso direto ao <input> de e-mail no DOM.
    // Mudar uma ref não provoca nova renderização (diferente de useState).
    const campoEmailRef = useRef(null);

    // O foco é um efeito colateral: só pode ser chamado depois que o campo já está na tela.
    useEffect(() => {
        campoEmailRef.current?.focus();
    }, []);

    // Quem já está logado não precisa ver o formulário.
    if (autenticado && !enviando) {
        return <Navigate to="/" replace />;
    }

    async function entrar(e) {
        e.preventDefault();
        setErro("");
        setEnviando(true);

        try {
            const resposta = await api.post("/auth/login", { email: email.trim(), senha });

            login(resposta.data);
            toast.sucesso(`Bem-vindo, ${resposta.data.nome}.`);
            navigate("/", { replace: true });
        } catch (e2) {
            setErro(mensagemErro(e2, "E-mail ou senha inválidos."));
            setEnviando(false);
        }
    }

    return (
        <div className="auth-pagina">
            <div className="auth-cartao">
                <h1>Entrar</h1>
                <p className="texto-suave">Acesse seus favoritos e roteiros.</p>

                <form className="formulario" onSubmit={entrar}>
                    <label className="campo">
                        <span>E-mail</span>
                        <input
                            ref={campoEmailRef}
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
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    {erro && (
                        <p className="aviso-erro" role="alert">
                            {erro}
                        </p>
                    )}

                    <button className="botao botao-primario botao-bloco" disabled={enviando}>
                        {enviando ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="auth-rodape">
                    Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
