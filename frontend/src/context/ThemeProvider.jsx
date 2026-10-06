import { useCallback, useEffect, useMemo, useState } from "react";

import { ThemeContext } from "./ThemeContext";

const CHAVE_TEMA = "desvioRJ.tema";

// Prioridade do tema inicial: escolha salva, preferência do sistema e, por fim, tema claro.
function lerTemaInicial() {
    const salvo = localStorage.getItem(CHAVE_TEMA);

    if (salvo === "claro" || salvo === "escuro") {
        return salvo;
    }

    const prefereEscuro =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefereEscuro ? "escuro" : "claro";
}

export function ThemeProvider({ children }) {
    const [tema, setTema] = useState(lerTemaInicial);

    // Grava a escolha e aplica a classe do tema no <body>.
    // No CSS, "body.tema-escuro" troca as variáveis de cor (styles/base.css).
    useEffect(() => {
        localStorage.setItem(CHAVE_TEMA, tema);
        document.body.classList.toggle("tema-escuro", tema === "escuro");
    }, [tema]);

    const alternarTema = useCallback(() => {
        setTema((atual) => (atual === "claro" ? "escuro" : "claro"));
    }, []);

    const valor = useMemo(() => ({ tema, alternarTema }), [tema, alternarTema]);

    return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}
