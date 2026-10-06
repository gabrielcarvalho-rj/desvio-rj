import { useCallback, useEffect, useMemo, useState } from "react";

import { CHAVE_TOKEN, CHAVE_USUARIO, EVENTO_SESSAO_EXPIRADA } from "../api/api";
import { AuthContext } from "./AuthContext";

// Lê a sessão salva no navegador (se existir e estiver íntegra).
function lerSessao() {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE_USUARIO));
        const token = localStorage.getItem(CHAVE_TOKEN);

        if (salvo && salvo.id && token) {
            return salvo;
        }
    } catch {
        // JSON corrompido: ignora e começa deslogado
    }

    return null;
}

function limparSessao() {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(lerSessao);

    // Recebe a resposta de POST /auth/login: { token, id, nome, email, role }
    const login = useCallback((dados) => {
        localStorage.setItem(CHAVE_TOKEN, dados.token);
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados));
        setUsuario(dados);
    }, []);

    const logout = useCallback(() => {
        limparSessao();
        setUsuario(null);
    }, []);

    // O interceptador do Axios avisa quando o servidor recusa o token.
    useEffect(() => {
        window.addEventListener(EVENTO_SESSAO_EXPIRADA, logout);
        return () => window.removeEventListener(EVENTO_SESSAO_EXPIRADA, logout);
    }, [logout]);

    const valor = useMemo(
        () => ({
            usuario,
            login,
            logout,
            autenticado: !!usuario,
            isAdmin: usuario?.role === "ADMIN",
        }),
        [usuario, login, logout]
    );

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
