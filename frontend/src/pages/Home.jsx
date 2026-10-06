import { Link } from "react-router-dom";

import { Erro } from "../components/Estados";
import Icone from "../components/Icone";
import LugarCard from "../components/LugarCard";
import useApi from "../hooks/useApi";
import useFavoritos from "../hooks/useFavoritos";
import { IMAGEM_HERO } from "../utils/imagens";

function Home() {
    const lugares = useApi("/lugares");
    const categorias = useApi("/categorias");
    const { favoritoDe, alternar } = useFavoritos();

    const destaques = (lugares.dados || []).slice(0, 4);

    return (
        <>
            {/* Hero */}
            <section className="hero">
                <img className="hero-foto" src={IMAGEM_HERO} alt="" />
                <div className="hero-escurecer" />

                <div className="container hero-conteudo">
                    <h1>Desvie do cartão-postal e conheça o Rio de verdade</h1>
                    <p>
                        Trilhas, praias, museus e cantos de bairro, com informação prática para
                        decidir onde ir. Salve o que gostou e organize tudo em roteiros.
                    </p>

                    <div className="hero-acoes">
                        <Link to="/lugares" className="botao botao-destaque botao-grande">
                            Explorar lugares
                        </Link>
                        <Link to="/roteiros/criar" className="botao botao-contorno-claro botao-grande">
                            Criar um roteiro
                        </Link>
                    </div>
                </div>
            </section>

            {/* Lugares em destaque */}
            <section className="secao container">
                <div className="secao-cabecalho">
                    <h2>Para começar</h2>
                    <Link to="/lugares" className="link-seta">
                        Ver todos os lugares
                        <Icone nome="seta" tamanho={18} />
                    </Link>
                </div>

                {lugares.erro && <Erro mensagem={lugares.erro} aoTentarDeNovo={lugares.recarregar} />}

                {lugares.carregando && !lugares.dados && (
                    <div className="grade-destaques" aria-hidden="true">
                        {[0, 1, 2, 3].map((n) => (
                            <div key={n} className="esqueleto" />
                        ))}
                    </div>
                )}

                {lugares.dados && destaques.length === 0 && (
                    <p className="texto-suave">Ainda não há lugares cadastrados.</p>
                )}

                {destaques.length > 0 && (
                    <div className="grade-destaques">
                        {destaques.map((lugar, indice) => (
                            <LugarCard
                                key={lugar.id}
                                lugar={lugar}
                                destaque={indice === 0}
                                favorito={!!favoritoDe(lugar.id)}
                                aoFavoritar={alternar}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Categorias */}
            {categorias.dados && categorias.dados.length > 0 && (
                <section className="secao secao-areia">
                    <div className="container categorias-bloco">
                        <h2>Escolha pelo que você quer fazer</h2>

                        <ul className="categorias-lista">
                            {categorias.dados.map((c) => (
                                <li key={c.id}>
                                    <Link to="/lugares" state={{ categoriaId: String(c.id) }}>
                                        {c.nome}
                                        <Icone nome="seta" tamanho={18} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* O que dá para fazer */}
            <section className="secao container">
                <h2 className="secao-titulo-unico">O que você faz no Desvio RJ</h2>

                <div className="funcoes">
                    <article>
                        <Icone nome="busca" tamanho={26} />
                        <h3>Descubra</h3>
                        <p>
                            Veja bairro, preço, duração e dificuldade de cada lugar antes de sair de
                            casa.
                        </p>
                    </article>

                    <article>
                        <Icone nome="coracao" tamanho={26} />
                        <h3>Salve</h3>
                        <p>Guarde seus favoritos na conta e volte a eles quando for planejar.</p>
                    </article>

                    <article>
                        <Icone nome="lista" tamanho={26} />
                        <h3>Planeje</h3>
                        <p>
                            Monte roteiros com horário e observação em cada parada, e leia as dicas de
                            quem já foi.
                        </p>
                    </article>
                </div>
            </section>
        </>
    );
}

export default Home;
