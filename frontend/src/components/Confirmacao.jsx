import { useEffect } from "react";

// Janela de confirmação (substitui window.confirm).
function Confirmacao({ titulo, texto, rotuloConfirmar = "Confirmar", aoConfirmar, aoCancelar }) {
    useEffect(() => {
        function aoTeclar(e) {
            if (e.key === "Escape") aoCancelar();
        }

        document.addEventListener("keydown", aoTeclar);
        return () => document.removeEventListener("keydown", aoTeclar);
    }, [aoCancelar]);

    return (
        <div className="modal-fundo" onClick={aoCancelar}>
            <div
                className="modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="modal-titulo"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="modal-titulo">{titulo}</h2>
                <p>{texto}</p>

                <div className="modal-acoes">
                    <button type="button" className="botao botao-secundario" onClick={aoCancelar}>
                        Cancelar
                    </button>
                    <button type="button" className="botao botao-perigo" onClick={aoConfirmar} autoFocus>
                        {rotuloConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Confirmacao;
