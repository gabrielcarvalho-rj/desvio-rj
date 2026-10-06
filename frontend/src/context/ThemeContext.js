import { createContext, useContext } from "react";

export const ThemeContext = createContext(null);

// const { tema, alternarTema } = useTheme();
// "tema" vale "claro" ou "escuro".
export function useTheme() {
    const contexto = useContext(ThemeContext);

    if (contexto === null) {
        throw new Error("useTheme precisa ser usado dentro de um ThemeProvider");
    }

    return contexto;
}
