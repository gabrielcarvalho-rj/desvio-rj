import { useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/api";
import { mensagemErro } from "../../api/erros";
import { useToast } from "../../context/ToastContext";
import useApi from "../../hooks/useApi";
import Confirmacao from "../Confirmacao";
import { Carregando, Erro, Vazio } from "../Estados";
import Icone from "../Icone";
import LugarForm from "./LugarForm";

// GET /lugares | POST /lugares | PUT /lugares/{id} | DELETE /lugares/{id}
function AdminLugares() {
    const toast = useToast();
    const lugares = useApi("/lugares");
    const categorias = useApi("/categorias");

    // null = lista | "novo" = cadastrando | objeto = editando
    const [formulario, setFormulario] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(null);

    async function salvar(corpo) {
        setSalvando(true);

        try {
            if (formulario === "novo") {
                await api.post("/lugares", corpo);
                toast.sucesso("Lugar cadastrado.");
            } else {
                await api.put(`/lugares/${formulario.id}`, corpo);
                toast.sucesso("Lugar atualizado.");
            }

            setFormulario(null);
            lugares.recarregar();
        } catch (erro) {
            toast.erro(mensagemErro(erro, "Não foi possível salvar o lugar."));
        } finally {
            setSalvando(false);
        }
    }

    async function excluir() {
        const lugar = excluindo;
        setExcluindo(null);

        try {
            await api.delete(`/lugares/${lugar.id}`);
            toast.sucesso("Lugar excluído.");
            lugares.recarregar();
        } catch (erro) {
            toast.erro(mensagemErro(erro, "Não foi possível excluir o lugar."));
        }
    }

    if (formulario) {
        return (
            <LugarForm
                lugar={formulario === "novo" ? null : formulario}
                categorias={categorias.dados || []}
                salvando={salvando}
                aoSalvar={salvar}
                aoCancelar={() => setFormulario(null)}
            />
        );
    }

    return (
        <section className="admin-secao">
            <div className="admin-topo">
                <p className="texto-suave">
                    {lugares.dados ? `${lugares.dados.length} lugares cadastrados` : ""}
                </p>
                <button type="button" className="botao botao-primario" onClick={() => setFormulario("novo")}>
                    <Icone nome="mais" tamanho={18} />
                    Novo lugar
                </button>
            </div>

            {lugares.carregando && !lugares.dados && <Carregando />}
            {lugares.erro && <Erro mensagem={lugares.erro} aoTentarDeNovo={lugares.recarregar} />}
            {lugares.dados && lugares.dados.length === 0 && <Vazio titulo="Nenhum lugar cadastrado" />}

            {lugares.dados && lugares.dados.length > 0 && (
                <div className="tabela-rolagem">
                    <table className="tabela">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Bairro</th>
                                <th>Categoria</th>
                                <th>
                                    <span className="so-leitor">Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {lugares.dados.map((lugar) => (
                                <tr key={lugar.id}>
                                    <td>
                                        <Link to={`/lugares/${lugar.id}`}>{lugar.nome}</Link>
                                    </td>
                                    <td>{lugar.bairro || "-"}</td>
                                    <td>{lugar.categoria?.nome || "-"}</td>
                                    <td>
                                        <div className="admin-acoes">
                                            <button
                                                type="button"
                                                className="botao-icone"
                                                onClick={() => setFormulario(lugar)}
                                                aria-label={`Editar ${lugar.nome}`}
                                            >
                                                <Icone nome="editar" tamanho={18} />
                                            </button>
                                            <button
                                                type="button"
                                                className="botao-icone botao-icone-perigo"
                                                onClick={() => setExcluindo(lugar)}
                                                aria-label={`Excluir ${lugar.nome}`}
                                            >
                                                <Icone nome="lixo" tamanho={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {excluindo && (
                <Confirmacao
                    titulo="Excluir lugar?"
                    texto={`"${excluindo.nome}" será removido do catálogo. Essa ação não pode ser desfeita.`}
                    rotuloConfirmar="Excluir"
                    aoConfirmar={excluir}
                    aoCancelar={() => setExcluindo(null)}
                />
            )}
        </section>
    );
}

export default AdminLugares;
