import { useState } from "react";

import api from "../../api/api";
import { mensagemErro } from "../../api/erros";
import { useToast } from "../../context/ToastContext";
import useApi from "../../hooks/useApi";
import Confirmacao from "../Confirmacao";
import { Carregando, Erro, Vazio } from "../Estados";
import Icone from "../Icone";

// GET /interesses | POST /interesses (corpo JSON: { nome }) | DELETE /interesses/{id}
// O backend não tem edição de interesses. Ao excluir, ele também remove o interesse
// dos usuários que o escolheram.
function AdminInteresses() {
    const toast = useToast();
    const interesses = useApi("/interesses");
    const categorias = useApi("/categorias");

    const [nome, setNome] = useState("");
    const [excluindo, setExcluindo] = useState(null);

    async function criar(valor) {
        const texto = valor.trim();
        if (!texto) return;

        try {
            await api.post("/interesses", { nome: texto });
            toast.sucesso(`Interesse criado: ${texto}.`);
            setNome("");
            interesses.recarregar();
        } catch (e) {
            toast.erro(mensagemErro(e, "Não foi possível criar o interesse."));
        }
    }

    async function excluir() {
        const interesse = excluindo;
        setExcluindo(null);

        try {
            await api.delete(`/interesses/${interesse.id}`);
            toast.sucesso(`Interesse excluído: ${interesse.nome}.`);
            interesses.recarregar();
        } catch (e) {
            toast.erro(mensagemErro(e, "Não foi possível excluir o interesse."));
        }
    }

    function aoEnviar(e) {
        e.preventDefault();
        criar(nome);
    }

    const nomesExistentes = (interesses.dados || []).map((i) => i.nome.trim().toLowerCase());
    const categoriasSemInteresse = (categorias.dados || []).filter(
        (c) => !nomesExistentes.includes(c.nome.trim().toLowerCase())
    );

    return (
        <section className="admin-secao">
            <p className="texto-suave admin-ajuda">
                As recomendações funcionam quando o nome do interesse é igual ao nome de uma categoria
                (por exemplo, o interesse "Praias" recomenda lugares da categoria "Praias").
            </p>

            <form className="admin-linha-form" onSubmit={aoEnviar}>
                <label className="campo">
                    <span>Novo interesse</span>
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex.: Trilhas"
                    />
                </label>
                <button className="botao botao-primario">
                    <Icone nome="mais" tamanho={18} />
                    Criar interesse
                </button>
            </form>

            {categoriasSemInteresse.length > 0 && interesses.dados && (
                <div className="admin-sugestoes">
                    <p>Criar a partir das categorias existentes:</p>
                    <ul className="chips">
                        {categoriasSemInteresse.map((c) => (
                            <li key={c.id}>
                                <button type="button" className="chip" onClick={() => criar(c.nome)}>
                                    <Icone nome="mais" tamanho={16} />
                                    {c.nome}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {interesses.carregando && !interesses.dados && <Carregando />}
            {interesses.erro && <Erro mensagem={interesses.erro} aoTentarDeNovo={interesses.recarregar} />}
            {interesses.dados && interesses.dados.length === 0 && (
                <Vazio titulo="Nenhum interesse cadastrado" />
            )}

            {interesses.dados && interesses.dados.length > 0 && (
                <ul className="admin-lista">
                    {interesses.dados.map((i) => (
                        <li key={i.id}>
                            <span>{i.nome}</span>
                            <div className="admin-acoes">
                                <button
                                    type="button"
                                    className="botao-icone botao-icone-perigo"
                                    onClick={() => setExcluindo(i)}
                                    aria-label={`Excluir ${i.nome}`}
                                >
                                    <Icone nome="lixo" tamanho={18} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {excluindo && (
                <Confirmacao
                    titulo={`Excluir o interesse "${excluindo.nome}"?`}
                    texto="Ele também será removido dos usuários que o selecionaram."
                    rotuloConfirmar="Excluir"
                    aoConfirmar={excluir}
                    aoCancelar={() => setExcluindo(null)}
                />
            )}
        </section>
    );
}

export default AdminInteresses;
