import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Icone from "./Icone";

function Marca() {
    return (
        <Link to="/" className="marca">
            <img src="/imagens/logo-desvio-rj.png" alt="Desvio RJ" width="2048" height="682" />
        </Link>
    );
}

function Navbar() {
    const { usuario, autenticado, isAdmin, logout } = useAuth();
    const { tema, alternarTema } = useTheme();
    const [aberto, setAberto] = useState(false);
    const navigate = useNavigate();

    const fechar = () => setAberto(false);

    function sair() {
        logout();
        fechar();
        navigate("/");
    }

    const escuro = tema === "escuro";
    const textoTema = escuro ? "Ativar tema claro" : "Ativar tema escuro";

    const classe = ({ isActive }) => (isActive ? "nav-link ativo" : "nav-link");

    return (
        <header className="navbar">
            <div className="navbar-interna container">
                <Marca />

                <button
                    type="button"
                    className="navbar-menu-botao"
                    onClick={() => setAberto(!aberto)}
                    aria-expanded={aberto}
                    aria-controls="navbar-painel"
                    aria-label={aberto ? "Fechar menu" : "Abrir menu"}
                >
                    <Icone nome={aberto ? "fechar" : "menu"} tamanho={24} />
                </button>

                <div id="navbar-painel" className={`navbar-painel ${aberto ? "aberto" : ""}`.trim()}>
                    <nav className="navbar-links" aria-label="Principal">
                        <NavLink to="/" end className={classe} onClick={fechar}>
                            Início
                        </NavLink>
                        <NavLink to="/lugares" className={classe} onClick={fechar}>
                            {autenticado ? "Lugares" : "Explorar lugares"}
                        </NavLink>

                        {autenticado && (
                            <>
                                <NavLink to="/favoritos" className={classe} onClick={fechar}>
                                    Favoritos
                                </NavLink>
                                <NavLink to="/roteiros" className={classe} onClick={fechar}>
                                    Roteiros
                                </NavLink>
                            </>
                        )}

                        {isAdmin && (
                            <NavLink to="/admin" className={classe} onClick={fechar}>
                                Administração
                            </NavLink>
                        )}
                    </nav>

                    <div className="navbar-conta">
                        <button
                            type="button"
                            className="botao-tema"
                            onClick={alternarTema}
                            aria-label={textoTema}
                            title={textoTema}
                        >
                            <Icone nome={escuro ? "sol" : "lua"} tamanho={20} />
                            <span className="botao-tema-texto">{escuro ? "Tema claro" : "Tema escuro"}</span>
                        </button>

                        {autenticado ? (
                            <>
                                <NavLink to="/perfil" className="navbar-usuario" onClick={fechar}>
                                    <Icone nome="usuario" tamanho={18} />
                                    {usuario.nome}
                                </NavLink>
                                <button type="button" className="botao botao-fantasma" onClick={sair}>
                                    <Icone nome="sair" tamanho={18} />
                                    Sair
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="botao botao-fantasma" onClick={fechar}>
                                    Entrar
                                </Link>
                                <Link to="/cadastro" className="botao botao-primario" onClick={fechar}>
                                    Criar conta
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
