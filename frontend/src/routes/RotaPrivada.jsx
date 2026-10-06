import { Link, Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

// PrivateRoute (Aula 07): decide se as rotas filhas aparecem ou não.
// Fica como rota "sem path" e devolve <Outlet /> quando a pessoa pode entrar.
//   <Route element={<RotaPrivada />}>             exige login
//   <Route element={<RotaPrivada somenteAdmin />}> exige login + role ADMIN
// Protege só a experiência do usuário: a segurança de verdade está no servidor (Spring Security).
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
