import { Link, Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

// Controla o acesso às rotas autenticadas e, quando necessário, às rotas de administrador.
// A validação de segurança também é feita no servidor.
function RotaPrivada({ somenteAdmin = false }) {
    const { autenticado, isAdmin } = useAuth();

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    if (somenteAdmin && !isAdmin) {
        return (
            <div className="container pagina pagina-centro">
                <h1>Acesso restrito</h1>
                <p>Esta área é exclusiva para administradores.</p>
                <Link to="/" className="botao botao-primario">
                    Voltar ao início
                </Link>
            </div>
        );
    }

    return <Outlet />;
}

export default RotaPrivada;
