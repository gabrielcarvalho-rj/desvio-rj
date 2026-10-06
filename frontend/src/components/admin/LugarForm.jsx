import { useReducer } from "react";

const DIFICULDADES = ["Fácil", "Moderada", "Difícil"];

function paraTexto(valor) {
    return valor === null || valor === undefined ? "" : String(valor);
}

// Monta o estado inicial a partir do lugar (edição) ou vazio (novo).
function criarEstadoInicial(lugar) {
    return {
        campos: {
            nome: paraTexto(lugar?.nome),
            descricao: paraTexto(lugar?.descricao),
            cidade: paraTexto(lugar?.cidade) || "Rio de Janeiro",
            bairro: paraTexto(lugar?.bairro),
            endereco: paraTexto(lugar?.endereco),
            latitude: paraTexto(lugar?.latitude),
            longitude: paraTexto(lugar?.longitude),
            fotoUrl: paraTexto(lugar?.fotoUrl),
            gratuito: lugar?.gratuito ?? false,
            precoInicial: lugar?.precoInicial ? String(lugar.precoInicial) : "",
            duracaoMinutos: lugar?.duracaoMinutos ? String(lugar.duracaoMinutos) : "",
            dificuldade: paraTexto(lugar?.dificuldade),
            siteExterno: paraTexto(lugar?.siteExterno),
            categoriaId: lugar?.categoria?.id ? String(lugar.categoria.id) : "",
        },
        erro: "",
    };
}

// Centraliza as atualizações do formulário em um reducer.
function lugarFormReducer(estado, acao) {
    switch (acao.tipo) {
        case "alterarCampo":
            return { ...estado, campos: { ...estado.campos, [acao.campo]: acao.valor } };
        case "mostrarErro":
            return { ...estado, erro: acao.mensagem };
        case "limparErro":
            return { ...estado, erro: "" };
        default:
            throw new Error(`Ação desconhecida: ${acao.tipo}`);
    }
}

// Formulário de lugar (cadastro e edição). Corpo JSON de POST/PUT /lugares:
// { nome, descricao, cidade, bairro, endereco, latitude, longitude, fotoUrl,
//   gratuito, precoInicial, duracaoMinutos, dificuldade, siteExterno, categoriaId }
function LugarForm({ lugar, categorias, aoSalvar, aoCancelar, salvando }) {
    const [estado, dispatch] = useReducer(lugarFormReducer, lugar, criarEstadoInicial);
    const { campos, erro } = estado;

    function mudar(campo) {
        return (e) => {
            const valor = e.target.type === "checkbox" ? e.target.checked : e.target.value;
            dispatch({ tipo: "alterarCampo", campo, valor });
        };
    }

    function enviar(e) {
        e.preventDefault();

        if (!campos.nome.trim()) {
            dispatch({ tipo: "mostrarErro", mensagem: "O nome do lugar é obrigatório." });
            return;
        }

        dispatch({ tipo: "limparErro" });

        const texto = (v) => v.trim() || null;

        aoSalvar({
            nome: campos.nome.trim(),
            descricao: texto(campos.descricao),
            cidade: texto(campos.cidade),
            bairro: texto(campos.bairro),
            endereco: texto(campos.endereco),
            latitude: texto(campos.latitude),
            longitude: texto(campos.longitude),
            fotoUrl: texto(campos.fotoUrl),
            gratuito: campos.gratuito,
            precoInicial: campos.gratuito
                ? 0
                : campos.precoInicial !== ""
                  ? Number(campos.precoInicial)
                  : null,
            duracaoMinutos: campos.duracaoMinutos !== "" ? parseInt(campos.duracaoMinutos, 10) : null,
            dificuldade: texto(campos.dificuldade),
            siteExterno: texto(campos.siteExterno),
            categoriaId: campos.categoriaId ? Number(campos.categoriaId) : null,
        });
    }

    // Mantém valores antigos de dificuldade que não estão na lista padrão.
    const opcoesDificuldade =
        campos.dificuldade && !DIFICULDADES.includes(campos.dificuldade)
            ? [...DIFICULDADES, campos.dificuldade]
            : DIFICULDADES;

    return (
        <form className="formulario admin-form-lugar" onSubmit={enviar}>
            <h2>{lugar ? "Editar lugar" : "Novo lugar"}</h2>

            <div className="grade-campos">
                <label className="campo campo-largo">
                    <span>Nome</span>
                    <input value={campos.nome} onChange={mudar("nome")} required />
                </label>

                <label className="campo">
                    <span>Categoria</span>
                    <select value={campos.categoriaId} onChange={mudar("categoriaId")}>
                        <option value="">Sem categoria</option>
                        {categorias.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="campo campo-largo">
                    <span>Descrição</span>
                    <textarea rows={4} value={campos.descricao} onChange={mudar("descricao")} />
                </label>

                <label className="campo">
                    <span>Bairro</span>
                    <input value={campos.bairro} onChange={mudar("bairro")} />
                </label>

                <label className="campo">
                    <span>Cidade</span>
                    <input value={campos.cidade} onChange={mudar("cidade")} />
                </label>

                <label className="campo campo-largo">
                    <span>Endereço</span>
                    <input value={campos.endereco} onChange={mudar("endereco")} />
                </label>

                <label className="campo">
                    <span>Latitude</span>
                    <input value={campos.latitude} onChange={mudar("latitude")} />
                </label>

                <label className="campo">
                    <span>Longitude</span>
                    <input value={campos.longitude} onChange={mudar("longitude")} />
                </label>

                <label className="campo campo-largo">
                    <span>Endereço da foto (URL)</span>
                    <input value={campos.fotoUrl} onChange={mudar("fotoUrl")} placeholder="https://..." />
                </label>

                <label className="campo-check">
                    <input type="checkbox" checked={campos.gratuito} onChange={mudar("gratuito")} />
                    <span>Entrada gratuita</span>
                </label>

                <label className="campo">
                    <span>Preço inicial (R$)</span>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={campos.gratuito ? "" : campos.precoInicial}
                        onChange={mudar("precoInicial")}
                        disabled={campos.gratuito}
                    />
                </label>

                <label className="campo">
                    <span>Duração (minutos)</span>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={campos.duracaoMinutos}
                        onChange={mudar("duracaoMinutos")}
                    />
                </label>

                <label className="campo">
                    <span>Dificuldade</span>
                    <select value={campos.dificuldade} onChange={mudar("dificuldade")}>
                        <option value="">Não se aplica</option>
                        {opcoesDificuldade.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="campo campo-largo">
                    <span>Mais informações (link)</span>
                    <input value={campos.siteExterno} onChange={mudar("siteExterno")} placeholder="https://..." />
                </label>
            </div>

            {erro && (
                <p className="aviso-erro" role="alert">
                    {erro}
                </p>
            )}

            <div className="formulario-acoes">
                <button type="button" className="botao botao-secundario" onClick={aoCancelar}>
                    Cancelar
                </button>
                <button className="botao botao-primario" disabled={salvando}>
                    {salvando ? "Salvando..." : lugar ? "Salvar alterações" : "Cadastrar lugar"}
                </button>
            </div>
        </form>
    );
}

export default LugarForm;
