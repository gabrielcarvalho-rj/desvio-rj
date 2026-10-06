import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";

// Layout compartilhado: Navbar e Footer ficam fixos, e o Outlet renderiza a rota filha.
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

            {/* Conteúdo da rota atual */}
            <main id="conteudo" className="app-conteudo">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default Layout;
