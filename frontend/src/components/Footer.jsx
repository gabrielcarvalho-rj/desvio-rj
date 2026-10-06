import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Footer() {
    const { autenticado } = useAuth();

    return (
        <footer className="rodape">
            <div className="container rodape-interno">
                <div className="rodape-sobre">
                    <Link to="/" className="rodape-marca">
                        <img src="/imagens/logo-desvio-rj.png" alt="Desvio RJ" width="2048" height="682" />
                    </Link>
                    <p>Lugares, roteiros e dicas para quem mora ou visita o Rio de Janeiro.</p>
                </div>

                <nav className="rodape-links" aria-label="Atalhos do rodapé">
                    <Link to="/">Início</Link>
                    <Link to="/lugares">Explorar lugares</Link>

                    {autenticado ? (
                        <>
                            <Link to="/favoritos">Favoritos</Link>
                            <Link to="/roteiros">Roteiros</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Entrar</Link>
                            <Link to="/cadastro">Criar conta</Link>
                        </>
                    )}
                </nav>
            </div>

            <div className="container rodape-base">
                <p className="rodape-nota">Projeto acadêmico.</p>
            </div>
        </footer>
    );
}

export default Footer;
