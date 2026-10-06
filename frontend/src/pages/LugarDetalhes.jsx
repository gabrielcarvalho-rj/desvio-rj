import { Link, useParams } from "react-router-dom";

import AdicionarRoteiro from "../components/AdicionarRoteiro";
import DicasLugar from "../components/DicasLugar";
import { Carregando, Erro } from "../components/Estados";
import Icone from "../components/Icone";
import ImagemLugar from "../components/ImagemLugar";
import useApi from "../hooks/useApi";
import useFavoritos from "../hooks/useFavoritos";
import { formatarDuracao, formatarPreco } from "../utils/formatar";

function LugarDetalhes() {
    const { id } = useParams();
    const { dados: lugar, carregando, erro, recarregar } = useApi(`/lugares/${id}`);
    const { favoritoDe, alternar } = useFavoritos();

    if (carregando && !lugar) {
        return (
            <div className="container pagina">
                <Carregando texto="Carregando lugar..." />
            </div>
        );
    }

    if (erro || !lugar) {
        return (
            <div className="container pagina">
                <Erro
                    mensagem={erro || "Lugar não encontrado."}
                    aoTentarDeNovo={recarregar}
                />
                <p className="voltar">
                    <Link to="/lugares">Voltar para os lugares</Link>
                </p>
            </div>
        );
    }

    const favorito = !!favoritoDe(lugar.id);
    const duracao = formatarDuracao(lugar.duracaoMinutos);
    const localizacao = [lugar.bairro, lugar.cidade].filter(Boolean).join(", ");

    return (
        <div>
            <div className="detalhe-foto">
                <ImagemLugar lugar={lugar} />
            </div>

            <div className="container detalhe">
                <div className="detalhe-principal">
                    <nav aria-label="Você está em" className="trilha">
                        <Link to="/lugares">Lugares</Link>
                        {lugar.categoria && (
                            <>
                                <span aria-hidden="true">/</span>
                                <Link
                                    to="/lugares"
                                    state={{ categoriaId: String(lugar.categoria.id) }}
                                >
                                    {lugar.categoria.nome}
                                </Link>
                            </>
                        )}
                    </nav>

                    <h1>{lugar.nome}</h1>

                    {localizacao && (
                        <p className="detalhe-local">
                            <Icone nome="pin" tamanho={18} />
                            {localizacao}
                        </p>
                    )}

                    {lugar.descricao && <p className="detalhe-descricao">{lugar.descricao}</p>}

                    <DicasLugar lugarId={lugar.id} />
                </div>

                <aside className="detalhe-lateral">
                    <div className="ficha">
                        <button
                            type="button"
                            className={`botao botao-bloco ${favorito ? "botao-secundario" : "botao-primario"}`}
                            onClick={() => alternar(lugar.id)}
                            aria-pressed={favorito}
                        >
                            <Icone nome="coracao" tamanho={18} preenchido={favorito} />
                            {favorito ? "Remover dos favoritos" : "Salvar nos favoritos"}
                        </button>

                        <dl>
                            <div>
                                <dt>Entrada</dt>
                                <dd>{formatarPreco(lugar)}</dd>
                            </div>

                            {duracao && (
                                <div>
                                    <dt>Duração</dt>
                                    <dd>{duracao}</dd>
                                </div>
                            )}

                            {lugar.dificuldade && (
                                <div>
                                    <dt>Dificuldade</dt>
                                    <dd>{lugar.dificuldade}</dd>
                                </div>
                            )}

                            {lugar.categoria && (
                                <div>
                                    <dt>Categoria</dt>
                                    <dd>{lugar.categoria.nome}</dd>
                                </div>
                            )}

                            {lugar.endereco && (
                                <div>
                                    <dt>Endereço</dt>
                                    <dd>{lugar.endereco}</dd>
                                </div>
                            )}
                        </dl>

                        {lugar.siteExterno && (
                            <a
                                className="link-seta"
                                href={lugar.siteExterno}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icone nome="link" tamanho={18} />
                                Mais informações
                            </a>
                        )}
                    </div>

                    <AdicionarRoteiro lugarId={lugar.id} />
                </aside>
            </div>
        </div>
    );
}

export default LugarDetalhes;
