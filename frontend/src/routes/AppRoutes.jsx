import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { Carregando } from "../components/Estados";
import Layout from "../components/Layout";
import Cadastro from "../pages/Cadastro";
import CriarRoteiro from "../pages/CriarRoteiro";
import Home from "../pages/Home";
import Login from "../pages/Login";
import LugarDetalhes from "../pages/LugarDetalhes";
import Lugares from "../pages/Lugares";
import NaoEncontrado from "../pages/NaoEncontrado";
import RoteiroDetalhes from "../pages/RoteiroDetalhes";
import Roteiros from "../pages/Roteiros";
import RotaPrivada from "./RotaPrivada";

// Páginas carregadas sob demanda quando precisam ser renderizadas.
const Favoritos = lazy(() => import("../pages/Favoritos"));
const Perfil = lazy(() => import("../pages/Perfil"));
const Admin = lazy(() => import("../pages/Admin"));

function AppRoutes() {
    return (
        <Routes>
            {/* Rota de layout: Navbar + <Outlet /> + Footer envolvem todas as filhas */}
            <Route path="/" element={<Layout />}>
                {/* Públicas */}
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="cadastro" element={<Cadastro />} />
                <Route path="lugares" element={<Lugares />} />
                <Route path="lugares/:id" element={<LugarDetalhes />} />

                {/* Exigem login */}
                <Route element={<RotaPrivada />}>
                    <Route
                        path="favoritos"
                        element={
                            <Suspense fallback={<Carregando texto="Carregando favoritos..." />}>
                                <Favoritos />
                            </Suspense>
                        }
                    />
                    <Route path="roteiros" element={<Roteiros />} />
                    <Route path="roteiros/criar" element={<CriarRoteiro />} />
                    <Route path="roteiros/:id" element={<RoteiroDetalhes />} />
                    <Route
                        path="perfil"
                        element={
                            <Suspense fallback={<Carregando texto="Carregando perfil..." />}>
                                <Perfil />
                            </Suspense>
                        }
                    />
                </Route>

                {/* Exige login + ADMIN */}
                <Route element={<RotaPrivada somenteAdmin />}>
                    <Route
                        path="admin"
                        element={
                            <Suspense fallback={<Carregando texto="Carregando administração..." />}>
                                <Admin />
                            </Suspense>
                        }
                    />
                </Route>

                {/* Rota coringa: qualquer endereço desconhecido (mantém Navbar e Footer) */}
                <Route path="*" element={<NaoEncontrado />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
