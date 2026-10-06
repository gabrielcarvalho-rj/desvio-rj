import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";

// Layout compartilhado (Aula 05): a "moldura" fixa de todas as páginas.
// Navbar e Footer ficam aqui uma única vez; o <Outlet /> é o espaço
// reservado onde o React Router insere a página da rota filha atual.
function Layout() {
    const { pathname } = useLocation();

    // Ao trocar de página, volta ao topo.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="app">
            <a href="#conteudo" className="pular-conteudo">
                Pular para o conteúdo
            </a>

            <Navbar />

            {/* Único <main> da aplicação: as páginas renderizam apenas o seu conteúdo. */}
            <main id="conteudo" className="app-conteudo">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default Layout;
