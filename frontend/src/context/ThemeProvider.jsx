import { useCallback, useEffect, useMemo, useState } from "react";

import { ThemeContext } from "./ThemeContext";

const CHAVE_TEMA = "desvioRJ.tema";

// Ordem de decisão (Aula 07): 1) escolha salva no localStorage;
// 2) preferência do sistema (prefers-color-scheme); 3) tema claro.
// Passada ao useState como função, roda só uma vez, na criação do Provider.
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

    // Sincroniza com fora do React: grava a escolha e liga/desliga a classe no <body>.
    // No CSS, "body.tema-escuro" troca as variáveis de cor (styles/base.css).
    useEffect(() => {
        localStorage.setItem(CHAVE_TEMA, tema);
        document.body.classList.toggle("tema-escuro", tema === "escuro");
    }, [tema]);

    const alternarTema = useCallback(() => {
        setTema((atual) => (atual === "claro" ? "escuro" : "claro"));
    }, []);

    // useMemo: o objeto do contexto só muda quando "tema" muda.
    const valor = useMemo(() => ({ tema, alternarTema }), [tema, alternarTema]);

    return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}
