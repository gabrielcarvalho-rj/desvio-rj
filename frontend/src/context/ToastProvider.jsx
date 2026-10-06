import { useCallback, useMemo, useRef, useState } from "react";

import Icone from "../components/Icone";
import { ToastContext } from "./ToastContext";

// Mensagens curtas de feedback (sucesso / erro), no lugar do alert().
export function ToastProvider({ children }) {
    const [mensagens, setMensagens] = useState([]);
    const proximoId = useRef(1);

    const remover = useCallback((id) => {
        setMensagens((lista) => lista.filter((m) => m.id !== id));
    }, []);

    const mostrar = useCallback(
        (tipo, texto) => {
            const id = proximoId.current++;
            setMensagens((lista) => [...lista, { id, tipo, texto }]);
            setTimeout(() => remover(id), tipo === "erro" ? 6000 : 3500);
        },
        [remover]
    );

    const valor = useMemo(
        () => ({
            sucesso: (texto) => mostrar("sucesso", texto),
            erro: (texto) => mostrar("erro", texto),
        }),
        [mostrar]
    );

    return (
        <ToastContext.Provider value={valor}>
            {children}

            <div className="toasts" role="status" aria-live="polite">
                {mensagens.map((m) => (
                    <div key={m.id} className={`toast toast-${m.tipo}`}>
                        <Icone nome={m.tipo === "erro" ? "alerta" : "check"} tamanho={18} />
                        <span>{m.texto}</span>
                        <button
                            type="button"
                            className="toast-fechar"
                            onClick={() => remover(m.id)}
                            aria-label="Fechar mensagem"
                        >
                            <Icone nome="fechar" tamanho={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
