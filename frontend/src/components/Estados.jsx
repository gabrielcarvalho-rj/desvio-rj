import Icone from "./Icone";

// Estados padrão de tela: carregando, erro e lista vazia.

export function Carregando({ texto = "Carregando..." }) {
    return (
        <div className="estado" role="status">
            <span className="spinner" aria-hidden="true" />
            <p>{texto}</p>
        </div>
    );
}

export function Erro({ mensagem, aoTentarDeNovo }) {
    return (
        <div className="estado estado-erro" role="alert">
            <Icone nome="alerta" tamanho={28} />
            <p>{mensagem}</p>
            {aoTentarDeNovo && (
                <button type="button" className="botao botao-secundario" onClick={aoTentarDeNovo}>
                    Tentar de novo
                </button>
            )}
        </div>
    );
}

export function Vazio({ titulo, children }) {
    return (
        <div className="estado estado-vazio">
            <h3>{titulo}</h3>
            {children && <div className="estado-acao">{children}</div>}
        </div>
    );
}
