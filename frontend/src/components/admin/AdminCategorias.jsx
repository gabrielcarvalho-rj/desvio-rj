import { useState } from "react";

import api from "../../api/api";
import { mensagemErro } from "../../api/erros";
import { useToast } from "../../context/ToastContext";
import useApi from "../../hooks/useApi";
import Confirmacao from "../Confirmacao";
import { Carregando, Erro, Vazio } from "../Estados";
import Icone from "../Icone";

// GET /categorias | POST /categorias | PUT /categorias/{id} | DELETE /categorias/{id}
// Corpo JSON: { nome }
function AdminCategorias() {
    const toast = useToast();
    const { dados, carregando, erro, recarregar } = useApi("/categorias");

    const [novoNome, setNovoNome] = useState("");
    const [editandoId, setEditandoId] = useState(null);
    const [nomeEditado, setNomeEditado] = useState("");
    const [excluindo, setExcluindo] = useState(null);

    async function criar(e) {
        e.preventDefault();
        if (!novoNome.trim()) return;

        try {
            await api.post("/categorias", { nome: novoNome.trim() });
            toast.sucesso("Categoria criada.");
            setNovoNome("");
            recarregar();
        } catch (e2) {
            toast.erro(mensagemErro(e2, "Não foi possível criar a categoria."));
        }
    }

    async function salvar(id) {
        if (!nomeEditado.trim()) return;

        try {
            await api.put(`/categorias/${id}`, { nome: nomeEditado.trim() });
            toast.sucesso("Categoria atualizada.");
            setEditandoId(null);
            recarregar();
        } catch (e2) {
            toast.erro(mensagemErro(e2, "Não foi possível atualizar a categoria."));
        }
    }

    async function excluir() {
        const categoria = excluindo;
        setExcluindo(null);

        try {
            await api.delete(`/categorias/${categoria.id}`);
            toast.sucesso("Categoria excluída.");
            recarregar();
        } catch (e2) {
            toast.erro(mensagemErro(e2, "Não foi possível excluir a categoria."));
        }
    }

    return (
        <section className="admin-secao">
            <form className="admin-linha-form" onSubmit={criar}>
                <label className="campo">
                    <span>Nova categoria</span>
                    <input
                        value={novoNome}
                        onChange={(e) => setNovoNome(e.target.value)}
                        placeholder="Ex.: Trilhas"
                    />
                </label>
                <button className="botao botao-primario">
                    <Icone nome="mais" tamanho={18} />
                    Criar categoria
                </button>
            </form>

            {carregando && !dados && <Carregando />}
            {erro && <Erro mensagem={erro} aoTentarDeNovo={recarregar} />}
            {dados && dados.length === 0 && <Vazio titulo="Nenhuma categoria cadastrada" />}

            {dados && dados.length > 0 && (
                <ul className="admin-lista">
                    {dados.map((c) => (
                        <li key={c.id}>
                            {editandoId === c.id ? (
                                <>
                                    <input
                                        value={nomeEditado}
                                        onChange={(e) => setNomeEditado(e.target.value)}
                                        aria-label="Nome da categoria"
                                        autoFocus
                                    />
                                    <div className="admin-acoes">
                                        <button
                                            type="button"
                                            className="botao botao-primario botao-pequeno"
                                            onClick={() => salvar(c.id)}
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            type="button"
                                            className="botao botao-secundario botao-pequeno"
                                            onClick={() => setEditandoId(null)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span>{c.nome}</span>
                                    <div className="admin-acoes">
                                        <button
                                            type="button"
                                            className="botao-icone"
                                            onClick={() => {
                                                setEditandoId(c.id);
                                                setNomeEditado(c.nome);
                                            }}
                                            aria-label={`Editar ${c.nome}`}
                                        >
                                            <Icone nome="editar" tamanho={18} />
                                        </button>
                                        <button
                                            type="button"
                                            className="botao-icone botao-icone-perigo"
                                            onClick={() => setExcluindo(c)}
                                            aria-label={`Excluir ${c.nome}`}
                                        >
                                            <Icone nome="lixo" tamanho={18} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {excluindo && (
                <Confirmacao
                    titulo="Excluir categoria?"
                    texto={`A categoria "${excluindo.nome}" será removida. Se houver lugares usando essa categoria, o servidor pode recusar a exclusão.`}
                    rotuloConfirmar="Excluir"
                    aoConfirmar={excluir}
                    aoCancelar={() => setExcluindo(null)}
                />
            )}
        </section>
    );
}

export default AdminCategorias;
